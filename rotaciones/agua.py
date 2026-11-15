"""Balance hídrico de una capa (FAO-56 simplificado + Hargreaves)."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent


def cargar_suelos(ruta: Path | None = None) -> dict:
    p = ruta or (RAIZ / "data" / "suelos.json")
    return json.loads(p.read_text(encoding="utf-8"))


def cargar_cultivos(ruta: Path | None = None) -> dict:
    p = ruta or (RAIZ / "data" / "cultivos.json")
    return json.loads(p.read_text(encoding="utf-8"))


def et0_hargreaves(
    tmax: np.ndarray,
    tmin: np.ndarray,
    lat_deg: float,
    doy: np.ndarray,
) -> np.ndarray:
    tmean = 0.5 * (tmax + tmin)
    td = np.maximum(0.0, tmax - tmin)
    phi = np.deg2rad(lat_deg)
    dr = 1.0 + 0.033 * np.cos(2.0 * np.pi / 365.0 * doy)
    delta = 0.409 * np.sin(2.0 * np.pi / 365.0 * doy - 1.39)
    arg = np.clip(-np.tan(phi) * np.tan(delta), -1.0, 1.0)
    ws = np.arccos(arg)
    ra_mj = (
        (24.0 * 60.0 / np.pi)
        * 0.0820
        * dr
        * (ws * np.sin(phi) * np.sin(delta) + np.cos(phi) * np.cos(delta) * np.sin(ws))
    )
    ra_mm = np.maximum(0.0, ra_mj * 0.408)
    eto = 0.0023 * (tmean + 17.8) * np.sqrt(td) * ra_mm
    return np.maximum(0.0, np.nan_to_num(eto, nan=0.0))


def _balance_un_cultivo(
    df_diario: pd.DataFrame,
    cultivo_cfg: dict,
    awc_mm_m: float,
    lat: float,
    kc_fuera: float = 0.3,
) -> dict:
    ag = cultivo_cfg["agua"]
    zr = float(ag["zr_m"])
    p_base = float(ag["p"])
    kc_map = {int(k): float(v) for k, v in ag["kc_mensual"].items()}
    meses_activos = set(kc_map.keys())

    taw = awc_mm_m * zr
    raw = p_base * taw
    doy = df_diario.index.day_of_year.to_numpy(dtype=float)
    meses = df_diario.index.month.to_numpy(dtype=int)
    anios = df_diario.index.year.to_numpy(dtype=int)

    eto = et0_hargreaves(
        df_diario["T2M_MAX"].to_numpy(dtype=float),
        df_diario["T2M_MIN"].to_numpy(dtype=float),
        lat,
        doy,
    )
    prec = np.nan_to_num(df_diario["PRECTOTCORR"].to_numpy(dtype=float), nan=0.0)
    kc = np.array([kc_map.get(int(m), kc_fuera) for m in meses], dtype=float)
    etc = eto * kc

    dr = 0.0
    estres_por_anio: dict[int, int] = {int(a): 0 for a in sorted(set(anios))}
    # Bucle en floats de Python (no numpy por elemento): ~5 veces más rápido, mismo resultado.
    den = max(1e-6, taw - raw)
    for etc_i, prec_i, mes_i, anio_i in zip(etc.tolist(), prec.tolist(), meses.tolist(), anios.tolist()):
        ks = max(0.0, (taw - dr) / den) if dr > raw else 1.0
        dr = dr - prec_i + etc_i * ks
        dr = 0.0 if dr < 0.0 else (taw if dr > taw else dr)
        if mes_i in meses_activos and dr > raw:
            estres_por_anio[anio_i] += 1

    vals = list(estres_por_anio.values())
    ult_anio = max(estres_por_anio)
    cap_int = round(taw)
    def_int = round(dr)
    return {
        "capacidad_mm": cap_int,
        "umbral_estres_mm": round(raw),
        "deficit_final_mm": def_int,
        "fraccion_llena_final": round(max(0.0, min(1.0, (taw - dr) / max(1e-6, taw))), 2),
        "ultimo_anio": ult_anio,
        "dias_estres_ultimo_anio": estres_por_anio[ult_anio],
        "dias_estres_media": round(float(np.mean(vals)) if vals else 0.0, 1),
        "dias_estres_por_anio": estres_por_anio,
        "peor_anio": max(estres_por_anio, key=lambda k: estres_por_anio[k]) if estres_por_anio else None,
        "tipo_zr_p": ag.get("tipo_zr_p", "supuesto"),
        "tipo_kc": "supuesto",
    }


def balance_por_cultivo(
    df_diario: pd.DataFrame,
    lat: float = 42.03,
    cultivos_cfg: dict | None = None,
    suelos_cfg: dict | None = None,
    textura: str | None = None,
    mo_alta: bool = False,
    awc_mm_m: float | None = None,
) -> dict:
    """awc_mm_m: si se da, reemplaza el agua útil de la textura (para la sensibilidad)."""
    suelos = suelos_cfg or cargar_suelos()
    cultivos = cultivos_cfg or cargar_cultivos()
    tex_clave = textura or suelos["_meta"]["por_defecto"]
    tex_info = suelos["texturas"][tex_clave]

    factor_mo = float(suelos["_meta"]["ajuste_mo_alta"]["factor"]) if mo_alta else 1.0
    awc = float(awc_mm_m) if awc_mm_m is not None else float(tex_info["awc_mm_m"]) * factor_mo
    kc_fuera = float(cultivos["_meta"].get("agua", {}).get("kc_fuera_de_temporada", 0.3))

    por_cultivo = {}
    for c_clave, c_info in cultivos["cultivos"].items():
        por_cultivo[c_clave] = _balance_un_cultivo(df_diario, c_info, awc, lat, kc_fuera=kc_fuera)

    fecha_final = pd.Timestamp(df_diario.index.max()).strftime("%Y-%m-%d")
    return {
        "fecha_fin": fecha_final,
        "textura": {
            "clave": tex_clave,
            "nombre": tex_info["nombre"],
            "nombre_en": tex_info.get("nombre_en", tex_info["nombre"]),
            "agua_util_mm_m": round(awc, 1) if mo_alta else int(tex_info["awc_mm_m"]),
            "materia_organica_alta": bool(mo_alta),
        },
        "por_cultivo": por_cultivo,
        "rango_awc_mm_m": list(tex_info.get("rango", [])),
        "limites": [
            "Lluvia y temperatura de una celda de ~50 km; no es el lote.",
            "Toda la lluvia infiltra (sin escorrentia): subestima el estres tras lluvias intensas.",
            "Cada cultivo se evalua como si se sembrara todos los anios; sin arrastre entre cultivos.",
            "Curvas Kc mensuales y profundidad de raiz fija: supuestos.",
            "El ajuste por materia organica es un supuesto de sensibilidad, no una medicion.",
        ],
    }
