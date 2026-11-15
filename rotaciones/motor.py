"""Motor climático de favorabilidad por patógeno y tendencia multianual."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import kendalltau, theilslopes

RAIZ = Path(__file__).resolve().parent.parent


def cargar_reglas(ruta: Path | None = None) -> dict:
    p = ruta or (RAIZ / "data" / "reglas.json")
    return json.loads(p.read_text(encoding="utf-8"))


def _rachas_alcanzadas(cond: np.ndarray, min_horas: int) -> np.ndarray:
    out = np.zeros(len(cond), dtype=bool)
    racha = 0
    for i, val in enumerate(cond):
        if val:
            racha += 1
            if racha >= min_horas:
                out[i] = True
        else:
            racha = 0
    return out


def _mascara_temperatura(df: pd.DataFrame, fechas: pd.Series, temp_cfg: dict) -> pd.Series:
    crit = temp_cfg["criterio"]
    t_min = temp_cfg.get("min")
    t_max = temp_cfg.get("max")

    if crit == "horaria":
        s = df["T2M"]
    elif crit == "max_diaria":
        s = df["T2M"].groupby(fechas).transform("max")
    elif crit == "media_movil_30d":
        media_d = df["T2M"].groupby(fechas).mean()
        mm30 = media_d.rolling(window=30, min_periods=1).mean()
        s = fechas.map(mm30)
    else:
        raise ValueError(f"Criterio térmico desconocido: {crit}")

    mask = s.notna()
    if t_min is not None:
        mask = mask & (s >= float(t_min))
    if t_max is not None:
        mask = mask & (s <= float(t_max))
    return mask


def _nivel_climatico(fraccion: float, baja_max: float, media_max: float) -> str:
    if fraccion < baja_max:
        return "baja"
    if fraccion < media_max:
        return "media"
    return "alta"


def tendencia(serie_dict: dict[int, int], anio_excluir: int | None = None) -> dict:
    pares = sorted((int(a), int(d)) for a, d in serie_dict.items() if int(a) != anio_excluir)
    n = len(pares)
    if n < 5:
        return {"evaluable": False, "anios": n, "clave": None}
    xs = [a for a, _ in pares]
    ys = [d for _, d in pares]
    if len(set(ys)) <= 1:
        return {"evaluable": False, "anios": n, "clave": None}
    ts = theilslopes(ys, xs)
    tau, p = kendalltau(xs, ys)
    if np.isnan(p):
        return {"evaluable": False, "anios": n, "clave": None}
    pend = float(ts.slope)
    if p < 0.05 and pend > 0:
        clave = "sube"
    elif p < 0.05 and pend < 0:
        clave = "baja"
    else:
        clave = "sin_tendencia"
    return {
        "evaluable": True,
        "anios": n,
        "clave": clave,
        "pendiente_dias_anio": round(pend, 3),
        "p_kendall": round(float(p), 4),
    }


def favorabilidad(
    df: pd.DataFrame,
    regla: dict,
    ajuste_dosel: float = 0.0,
    baja_max: float = 0.1,
    media_max: float = 0.3,
    anio_excluir: int | None = None,
) -> dict:
    if regla.get("clima") is None or regla.get("ventana") is None:
        return {"clima_evaluado": False, "nivel": "no_evaluado"}

    clima = regla["clima"]
    meses = set(regla["ventana"]["meses"])
    min_h = int(clima["horas_mojado_min"]["valor"])

    idx_mes = pd.Series(df.index.month, index=df.index)
    idx_anio = pd.Series(df.index.year, index=df.index)
    idx_fecha = pd.Series(df.index.date, index=df.index)

    en_ventana = idx_mes.isin(meses)
    todos_anios = sorted(int(a) for a in idx_anio.unique())
    anios_evaluados = []
    anios_descartados = []
    for a in todos_anios:
        sub = df.loc[en_ventana & (idx_anio == a), ["T2M", "RH2M"]]
        if len(sub) == 0 or sub.notna().all(axis=1).mean() < 0.9:
            anios_descartados.append(a)
        else:
            anios_evaluados.append(a)

    temp_ok = _mascara_temperatura(df, idx_fecha, clima["temp"])
    rh_efectiva = df["RH2M"] + float(ajuste_dosel)

    fechas_vent = idx_fecha[en_ventana & idx_anio.isin(anios_evaluados)]
    anios_vent = idx_anio[en_ventana & idx_anio.isin(anios_evaluados)]
    dias_vent_por_anio = fechas_vent.groupby(anios_vent).nunique().to_dict()
    dias_vent_medio = float(np.mean(list(dias_vent_por_anio.values()))) if dias_vent_por_anio else 1.0

    por_umbral = {}
    for u in clima["hr_umbrales"]:
        cond = (en_ventana & temp_ok & rh_efectiva.notna() & (rh_efectiva >= float(u))).to_numpy(dtype=bool)
        alcanzada = _rachas_alcanzadas(cond, min_h)
        fechas_fav = idx_fecha[alcanzada]
        anios_fav = idx_anio[alcanzada]
        conteo = fechas_fav.groupby(anios_fav).nunique().to_dict()
        dias_por_anio = {int(a): int(conteo.get(a, 0)) for a in anios_evaluados}
        media_anual = float(np.mean(list(dias_por_anio.values()))) if dias_por_anio else 0.0
        frac = media_anual / max(1.0, dias_vent_medio)
        peor = max(dias_por_anio, key=lambda k: dias_por_anio[k]) if dias_por_anio else None
        por_umbral[str(u)] = {
            "dias_favorables_por_anio": dias_por_anio,
            "media_anual_dias": round(media_anual, 2),
            "fraccion_ventana": round(frac, 4),
            "peor_anio": peor,
            "nivel": _nivel_climatico(frac, baja_max, media_max),
        }

    u_ref = str(clima["hr_referencia"])
    return {
        "clima_evaluado": True,
        "anios_evaluados": anios_evaluados,
        "anios_descartados_por_datos": anios_descartados,
        "ventana_meses": list(regla["ventana"]["meses"]),
        "dias_ventana_por_anio": round(dias_vent_medio, 1),
        "horas_mojado_min": min_h,
        "umbral_referencia": u_ref,
        "ajuste_dosel_hr": float(ajuste_dosel),
        "por_umbral_hr": por_umbral,
        "nivel": por_umbral[u_ref]["nivel"],
        "tendencia": tendencia(por_umbral[u_ref]["dias_favorables_por_anio"], anio_excluir=anio_excluir),
    }


def evaluar_todos(
    df: pd.DataFrame,
    reglas: dict | None = None,
    ajuste_dosel: float = 0.0,
    anio_excluir: int | None = None,
) -> dict:
    cfg = reglas or cargar_reglas()
    cortes = cfg["_meta"]["niveles_clima"]
    baja_max = float(cortes["baja_max"])
    media_max = float(cortes["media_max"])
    out = {}
    for clave, regla in cfg["patogenos"].items():
        out[clave] = favorabilidad(
            df,
            regla,
            ajuste_dosel=ajuste_dosel,
            baja_max=baja_max,
            media_max=media_max,
            anio_excluir=anio_excluir,
        )
    return out
