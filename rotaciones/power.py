"""Cliente y parseo de datos horarios y diarios de NASA POWER."""
from __future__ import annotations

import gzip
import json
import os
from datetime import date, timedelta
from pathlib import Path
import urllib.request

import numpy as np
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
CACHE_DIR = Path(os.environ.get("ROTACIONES_CACHE_DIR", RAIZ / "cache"))
POWER_TIMEOUT = float(os.environ.get("NASA_POWER_TIMEOUT", "60"))

CENTINELA = -990.0
URL_HORARIA = (
    "https://power.larc.nasa.gov/api/temporal/hourly/point"
    "?parameters=T2M,RH2M,PRECTOTCORR&community=AG"
    "&longitude={lon}&latitude={lat}&start={ini}&end={fin}&format=JSON&time-standard=LST"
)
URL_DIARIA = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
    "?parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,GWETROOT&community=AG"
    "&longitude={lon}&latitude={lat}&start={ini}&end={fin}&format=JSON"
)


def a_dataframe(datos: dict, fmt: str) -> pd.DataFrame:
    if not isinstance(datos, dict) or "properties" not in datos or "parameter" not in datos.get("properties", {}):
        raise ValueError("Respuesta de NASA POWER sin properties.parameter")
    param = datos["properties"]["parameter"]
    if not param:
        raise ValueError("Respuesta de NASA POWER sin parametros")
    fill_value = float(datos.get("header", {}).get("fill_value", -999.0))
    primera = next(iter(param.values()))
    claves = sorted(primera.keys())
    idx = pd.to_datetime(claves, format=fmt)
    cols = {}
    for k_param, serie in param.items():
        vals = []
        for k in claves:
            v = serie.get(k)
            if v is None or float(v) <= CENTINELA or float(v) == fill_value:
                vals.append(np.nan)
            else:
                vals.append(float(v))
        cols[k_param] = vals
    return pd.DataFrame(cols, index=idx)


# En Vercel el disco del proyecto es de solo lectura: lo nuevo se guarda en /tmp.
CACHE_TMP = Path(os.environ.get("ROTACIONES_CACHE_TMP", "/tmp/rotaciones-cache"))


# Los años cerrados no cambian: se guardan para siempre. El año en curso (provisional) se vuelve a
# pedir cuando la copia guardada tiene más de DIAS_FRESCO días de atraso.
DIAS_FRESCO = int(os.environ.get("ROTACIONES_DIAS_FRESCO", "3"))


def _dias_de_atraso(nombre_guardado: str, nombre_pedido: str) -> int:
    import re
    f = [re.search(r"_(\d{8})\.json(\.gz)?$", n) for n in (nombre_guardado, nombre_pedido)]
    if not all(f):
        return 0
    a, b = (date(int(m.group(1)[:4]), int(m.group(1)[4:6]), int(m.group(1)[6:])) for m in f)
    return (b - a).days


def _gz(archivo: Path) -> Path:
    """La caché se guarda comprimida: los JSON de POWER bajan ~6 veces de tamaño."""
    return archivo.with_name(archivo.name + ".gz")


def _leer(archivo: Path) -> dict:
    if archivo.name.endswith(".gz"):
        with gzip.open(archivo, "rt", encoding="utf-8") as f:
            return json.load(f)
    return json.loads(archivo.read_text(encoding="utf-8"))


def _guardar(archivo: Path, texto: str) -> None:
    for destino in (_gz(archivo), CACHE_TMP / _gz(archivo).name):
        try:
            destino.parent.mkdir(parents=True, exist_ok=True)
            with gzip.open(destino, "wt", encoding="utf-8", compresslevel=9) as f:
                f.write(texto)
            return
        except OSError:
            continue


def _leer_o_pedir(url: str, archivo: Path, patron_alternativo: str | None = None) -> dict:
    for carpeta in (archivo.parent, CACHE_TMP):
        for nombre in (_gz(archivo).name, archivo.name):  # comprimido o, por compatibilidad, plano
            cand = carpeta / nombre
            if cand.exists():
                return _leer(cand)
    viejo = None
    if patron_alternativo:
        # Año en curso: archivos con la fecha de corte en el nombre (..._AAAAMMDD.json[.gz]).
        pats = (patron_alternativo, patron_alternativo + ".gz")
        candidatos = sorted({c for carpeta in (archivo.parent, CACHE_TMP) for pt in pats for c in carpeta.glob(pt)},
                            key=lambda x: x.name.removesuffix(".gz"))
        if candidatos:
            viejo = candidatos[-1]
            if _dias_de_atraso(viejo.name, archivo.name) <= DIAS_FRESCO:
                return _leer(viejo)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "nasa-cultivos/0.4"})
        with urllib.request.urlopen(req, timeout=POWER_TIMEOUT) as resp:
            datos = json.loads(resp.read().decode("utf-8"))
    except Exception:
        if viejo is not None:  # sin red o POWER caído: mejor el dato de hace unos días que nada
            return _leer(viejo)
        raise
    _guardar(archivo, json.dumps(datos, separators=(",", ":")))
    return datos


def horario(
    lat: float,
    lon: float,
    inicio: int = 2001,
    fin: int = 2025,
    incluir_actual: bool = True,
    cache_dir: Path = CACHE_DIR,
) -> pd.DataFrame:
    from concurrent.futures import ThreadPoolExecutor

    def un_anio(anio: int) -> pd.DataFrame:
        archivo = cache_dir / f"h_{lat:.2f}_{lon:.2f}_{anio}.json"
        url = URL_HORARIA.format(lat=lat, lon=lon, ini=f"{anio}0101", fin=f"{anio}1231")
        return a_dataframe(_leer_o_pedir(url, archivo), "%Y%m%d%H")

    # Años que faltan se piden de a 4 en paralelo (un sitio nuevo pasa de minutos a segundos).
    with ThreadPoolExecutor(max_workers=4) as ex:
        partes = list(ex.map(un_anio, range(inicio, fin + 1)))

    hoy_corte = date.today() - timedelta(days=4)
    if incluir_actual and hoy_corte.year > fin:
        anio_act = hoy_corte.year
        corte = hoy_corte.strftime("%Y%m%d")
        archivo_act = cache_dir / f"h_{lat:.2f}_{lon:.2f}_{anio_act}_{corte}.json"
        patron = f"h_{lat:.2f}_{lon:.2f}_{anio_act}_*.json"
        url_act = URL_HORARIA.format(lat=lat, lon=lon, ini=f"{anio_act}0101", fin=corte)
        try:
            df_act = a_dataframe(_leer_o_pedir(url_act, archivo_act, patron), "%Y%m%d%H")
            if not df_act.empty:
                df_act.attrs["anio_provisional"] = anio_act
                partes.append(df_act)
        except Exception:
            pass

    out = pd.concat(partes)
    if partes and "anio_provisional" in partes[-1].attrs:
        out.attrs["anio_provisional"] = partes[-1].attrs["anio_provisional"]
    return out


def diario(
    lat: float,
    lon: float,
    inicio: int = 1981,
    fin: int = 2025,
    incluir_actual: bool = True,
    cache_dir: Path = CACHE_DIR,
) -> pd.DataFrame:
    hoy_corte = date.today() - timedelta(days=4)
    if incluir_actual and hoy_corte.year > fin:
        corte = hoy_corte.strftime("%Y%m%d")
        archivo = cache_dir / f"d_{lat:.2f}_{lon:.2f}_{inicio}_{corte}.json"
        patron = f"d_{lat:.2f}_{lon:.2f}_{inicio}_{hoy_corte.year}*.json"
        url = URL_DIARIA.format(lat=lat, lon=lon, ini=f"{inicio}0101", fin=corte)
        try:
            df = a_dataframe(_leer_o_pedir(url, archivo, patron), "%Y%m%d")
            if int(df.index.year.max()) >= hoy_corte.year:
                df.attrs["anio_provisional"] = int(df.index.year.max())
            return df
        except Exception:
            pass

    corte_fin = f"{fin}1231"
    archivo_fin = cache_dir / f"d_{lat:.2f}_{lon:.2f}_{inicio}_{corte_fin}.json"
    url_fin = URL_DIARIA.format(lat=lat, lon=lon, ini=f"{inicio}0101", fin=corte_fin)
    return a_dataframe(_leer_o_pedir(url_fin, archivo_fin), "%Y%m%d")
