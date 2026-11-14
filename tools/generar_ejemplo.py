"""Genera web/ejemplo_es.json y web/ejemplo_en.json con una serie SINTETICA.

Sirve para que la capa visual se pueda trabajar sin red. Las cifras no son reales
y la interfaz lo avisa (datos_sinteticos = true).   Uso:  python tools/generar_ejemplo.py
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd

from rotaciones.api import evaluar_sitio


def series(semilla=1):
    rng = np.random.default_rng(semilla)
    idx = pd.date_range("2001-01-01", "2025-12-31 23:00", freq="h")
    doy, h = idx.dayofyear.to_numpy(), idx.hour.to_numpy()
    est = -np.cos(2 * np.pi * (doy - 15) / 365)
    fr = np.repeat(rng.normal(0, 1, len(idx) // 24), 24)
    anual = np.repeat(rng.normal(0, 4, 25), [8784 if a % 4 == 0 else 8760 for a in range(2001, 2026)])
    dfh = pd.DataFrame({"T2M": 12 + 13 * est + 4 * np.cos(2 * np.pi * (h - 15) / 24) + 2.5 * fr,
                        "RH2M": np.clip(80 + anual - 15 * np.cos(2 * np.pi * (h - 15) / 24) - 5 * fr
                                        + rng.normal(0, 2, len(idx)), 20, 100)}, index=idx)
    d = pd.date_range("1981-01-01", "2025-12-31", freq="D")
    e = -np.cos(2 * np.pi * (d.dayofyear - 15) / 365)
    dfd = pd.DataFrame({"PRECTOTCORR": rng.gamma(.35, 7, len(d)) * (1 + .5 * e), "GWETROOT": .6,
                        "T2M_MAX": 15 + 14 * e + rng.normal(0, 3, len(d)),
                        "T2M_MIN": 3 + 14 * e + rng.normal(0, 3, len(d))}, index=d)
    return dfh, dfd


if __name__ == "__main__":
    dfh, dfd = series()
    web = Path(__file__).resolve().parent.parent / "web"
    for idioma in ("es", "en"):
        r = evaluar_sitio(dfh, dfd, 42.03, -93.63, "franco_limoso", "siembra_directa", False, False,
                          idioma, None, sintetico=True)
        (web / f"ejemplo_{idioma}.json").write_text(json.dumps(r["vista"], indent=1, ensure_ascii=False))
        print("escrito", f"web/ejemplo_{idioma}.json")
