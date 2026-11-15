"""Punto de entrada por línea de comandos y orquestación del motor."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd

from . import agua, comparador, motor, power, vista

RAIZ = Path(__file__).resolve().parent.parent


def cargar(nombre: str | None = None):
    if nombre is not None:
        return json.loads((RAIZ / "data" / f"{nombre}.json").read_text(encoding="utf-8"))
    return (
        motor.cargar_reglas(),
        comparador.cargar_cultivos(),
        comparador.cargar_rotaciones(),
    )


def ejecutar(
    df_horario: pd.DataFrame,
    df_diario: pd.DataFrame | None = None,
    lat: float = 42.03,
    lon: float = -93.63,
    textura: str | None = None,
    labranza: str = "siembra_directa",
    mo_alta: bool = False,
    riego: bool = False,
    ajuste_dosel: float = 0.0,
    campo: dict | None = None,
    actual: str | None = None,
    vio: str | dict | None = None,
) -> dict:
    reglas = cargar("reglas")
    cultivos = cargar("cultivos")
    rots = comparador.para_actual(cargar("rotaciones"), actual)
    suelos = cargar("suelos")

    if campo:
        labranza = campo.get("labranza", labranza)
        riego = bool(campo.get("riego", riego))

    anio_prov = df_horario.attrs.get("anio_provisional")
    if anio_prov is None and df_diario is not None:
        anio_prov = df_diario.attrs.get("anio_provisional")

    res_clima = motor.evaluar_todos(
        df_horario,
        reglas=reglas,
        ajuste_dosel=ajuste_dosel,
        anio_excluir=anio_prov,
    )
    bal_agua = (
        agua.balance_por_cultivo(
            df_diario,
            lat=lat,
            cultivos_cfg=cultivos,
            suelos_cfg=suelos,
            textura=textura,
            mo_alta=mo_alta,
        )
        if df_diario is not None
        else None
    )

    if bal_agua is not None and len(bal_agua.get("rango_awc_mm_m") or []) == 2:
        # Sensibilidad: mismo clima y cultivo, con el agua útil mínima y máxima de la textura.
        extremos = {}
        for etq, awc in zip(("min", "max"), bal_agua["rango_awc_mm_m"]):
            b = agua.balance_por_cultivo(df_diario, lat=lat, cultivos_cfg=cultivos, suelos_cfg=suelos,
                                         textura=textura, awc_mm_m=awc)
            extremos[etq] = {c: {"dias_estres_ultimo_anio": d["dias_estres_ultimo_anio"],
                                 "dias_estres_media": d["dias_estres_media"]} for c, d in b["por_cultivo"].items()}
        bal_agua["sensibilidad"] = {"awc_mm_m": bal_agua["rango_awc_mm_m"], **extremos}

    vio_dict = vista._parsear_vio(vio)
    comp = comparador.comparar_rotaciones(
        res_clima,
        reglas=reglas,
        rotaciones_cfg=rots,
        cultivos_cfg=cultivos,
        balance_hidrico=bal_agua,
        labranza=labranza,
        riego=riego,
        actual=actual,
        vio=vio_dict,
    )

    h_anios = sorted(int(a) for a in df_horario.index.year.unique())
    datos = {
        "fuente": "NASA POWER (MERRA-2 / GEOS-IT), celda de ~0.5 x 0.625 grados",
        "horas": len(df_horario),
        "horario_desde": h_anios[0] if h_anios else None,
        "horario_hasta": h_anios[-1] if h_anios else None,
        "dias": len(df_diario) if df_diario is not None else 0,
        "diario_desde": int(df_diario.index.year.min()) if df_diario is not None and not df_diario.empty else None,
        "diario_hasta": int(df_diario.index.year.max()) if df_diario is not None and not df_diario.empty else None,
        "anio_provisional": anio_prov,
    }

    fecha_hasta = pd.Timestamp(df_horario.index.max()).strftime("%Y-%m-%d")
    return {
        "sitio": {"lat": lat, "lon": lon, "datos_hasta": fecha_hasta},
        "ubicacion": {"lat": lat, "lon": lon},
        "actual": comp["actual"],
        "datos": datos,
        "clima": res_clima,
        "agua": bal_agua,
        "rotaciones": comp["rotaciones"],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Motor climático y comparador de rotaciones")
    parser.add_argument("--lat", type=float, default=42.03)
    parser.add_argument("--lon", type=float, default=-93.63)
    parser.add_argument("--inicio", type=int, default=2001)
    parser.add_argument("--fin", type=int, default=2025)
    parser.add_argument("--textura", type=str, default=None)
    parser.add_argument("--labranza", type=str, default="siembra_directa")
    parser.add_argument("--mo-alta", action="store_true")
    parser.add_argument("--riego", action="store_true")
    parser.add_argument("--actual", type=str, default=None)
    parser.add_argument("--idioma", type=str, default="es", choices=["es", "en"])
    parser.add_argument("--salida", type=Path, default=RAIZ / "salida" / "resultado.json")
    args = parser.parse_args()

    from .api import evaluar_sitio

    dfh = power.horario(args.lat, args.lon, args.inicio, args.fin)
    dfd = power.diario(args.lat, args.lon, 1981, args.fin)
    res = evaluar_sitio(
        dfh,
        dfd,
        lat=args.lat,
        lon=args.lon,
        textura=args.textura,
        labranza=args.labranza,
        mo_alta=args.mo_alta,
        riego=args.riego,
        idioma=args.idioma,
        actual=args.actual,
    )
    args.salida.parent.mkdir(parents=True, exist_ok=True)
    args.salida.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Resultado guardado en {args.salida}")


if __name__ == "__main__":
    main()
