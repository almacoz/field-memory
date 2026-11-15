"""Servidor HTTP FastAPI para la herramienta de rotaciones."""
from __future__ import annotations

import logging
import os
from datetime import date
from functools import lru_cache
from pathlib import Path
import pandas as pd

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from . import agua, cli, comparador, motor, power, ssurgo, vista

RAIZ = Path(__file__).resolve().parent.parent
WEB_DIR = RAIZ / "web"

log = logging.getLogger("rotaciones")

# /docs y /openapi.json solo si se piden (en local: ROTACIONES_DOCS=1).
_DOCS = os.environ.get("ROTACIONES_DOCS") == "1"
app = FastAPI(title="Rotaciones Agrícolas — NASA Space Apps 2026", version="0.4.0",
              docs_url="/docs" if _DOCS else None, redoc_url=None,
              openapi_url="/openapi.json" if _DOCS else None)

# Piloto: Medio Oeste de EE. UU. Limita también el abuso (cada punto nuevo baja ~27 años de POWER).
# ROTACIONES_REGION=libre lo desactiva.
REGION = {"lat": (36.0, 49.5), "lon": (-104.5, -80.0)}
_REGION_LIBRE = os.environ.get("ROTACIONES_REGION") == "libre"

CACHE_EVALUAR = "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400"
CACHE_SUELO = "public, max-age=86400, s-maxage=604800"


def _en_region(lat: float, lon: float) -> None:
    if _REGION_LIBRE:
        return
    (a, b), (c, d) = REGION["lat"], REGION["lon"]
    if not (a <= lat <= b and c <= lon <= d):
        raise HTTPException(status_code=422, detail="fuera_de_region")


@lru_cache(maxsize=16)
def _series(lat: float, lon: float, inicio: int, fin: int, dia: str):
    """Clima de un sitio en memoria (leerlo del disco cuesta ~0,7 s). `dia` en la clave hace que se
    vuelva a leer una vez por día, para tomar el año en curso actualizado."""
    return power.horario(lat, lon, inicio, fin), power.diario(lat, lon, 1981, fin)


@lru_cache(maxsize=128)
def _evaluar_cache(lat, lon, inicio, fin, textura, labranza, mo_alta, riego, idioma, vio, actual, dia) -> dict:
    dfh, dfd = _series(lat, lon, inicio, fin, dia)
    return evaluar_sitio(dfh, dfd, lat=lat, lon=lon, textura=textura, labranza=labranza, mo_alta=mo_alta,
                         riego=riego, idioma=idioma, vio=vio, actual=actual, sintetico=False)

if (WEB_DIR / "img").is_dir():
    app.mount("/img", StaticFiles(directory=str(WEB_DIR / "img")), name="img")


def evaluar_sitio(
    df_horario: pd.DataFrame,
    df_diario: pd.DataFrame | None = None,
    lat: float = 42.03,
    lon: float = -93.63,
    textura: str | None = None,
    labranza: str = "siembra_directa",
    mo_alta: bool = False,
    riego: bool = False,
    idioma: str = "es",
    vio: str | dict | None = None,
    actual: str | None = None,
    sintetico: bool = False,
) -> dict:
    res = cli.ejecutar(
        df_horario,
        df_diario=df_diario,
        lat=lat,
        lon=lon,
        textura=textura,
        labranza=labranza,
        mo_alta=mo_alta,
        riego=riego,
        actual=actual,
        vio=vio,
    )
    res["vista"] = vista.construir_vista(
        res,
        cli.cargar("reglas"),
        comparador.para_actual(cli.cargar("rotaciones"), actual),
        cli.cargar("cultivos"),
        cli.cargar("textos"),
        idioma=idioma,
        vio=vio,
        sintetico=sintetico,
        provisional=bool(res["datos"].get("anio_provisional")),
    )
    return res


@app.get("/api/evaluar")
def api_evaluar(
    response: Response,
    lat: float = Query(42.03, ge=-90.0, le=90.0),
    lon: float = Query(-93.63, ge=-180.0, le=180.0),
    inicio: int = Query(2001, ge=1981, le=2026),
    fin: int = Query(2025, ge=1981, le=2026),
    textura: str | None = Query(None, max_length=40),
    labranza: str = Query("siembra_directa", max_length=20),
    mo_alta: bool = Query(False),
    riego: bool = Query(False),
    idioma: str = Query("es", max_length=5),
    actual: str | None = Query(None, max_length=40),
    vio: str | None = Query(None, max_length=300),
) -> dict:
    suelos = agua.cargar_suelos()["texturas"]
    if textura is not None and textura not in suelos:
        raise HTTPException(status_code=400, detail="Textura desconocida")
    if labranza not in ("siembra_directa", "convencional"):
        raise HTTPException(status_code=400, detail="Labranza desconocida")
    rots = comparador.cargar_rotaciones()["rotaciones"]
    if actual is not None and actual not in rots:
        raise HTTPException(status_code=400, detail="Rotacion desconocida")
    if inicio > fin:
        raise HTTPException(status_code=400, detail="inicio debe ser menor o igual que fin")
    _en_region(lat, lon)
    lat, lon = round(lat, 2), round(lon, 2)  # misma celda de caché para coordenadas casi iguales
    vio_norm = ",".join(sorted(f"{k}:{'si' if v else 'no'}" for k, v in vista._parsear_vio(vio).items())) or None

    try:
        res = _evaluar_cache(lat, lon, inicio, fin, textura, labranza, mo_alta, riego,
                             "en" if idioma == "en" else "es", vio_norm, actual, date.today().isoformat())
    except HTTPException:
        raise
    except Exception:
        log.exception("Fallo /api/evaluar lat=%s lon=%s", lat, lon)
        raise HTTPException(status_code=502, detail="No se pudieron obtener los datos de NASA POWER")
    response.headers["Cache-Control"] = CACHE_EVALUAR
    return res


@app.get("/api/suelo")
def api_suelo(
    response: Response,
    lat: float = Query(42.03, ge=-90.0, le=90.0),
    lon: float = Query(-93.63, ge=-180.0, le=180.0),
) -> dict:
    _en_region(lat, lon)
    try:
        res = ssurgo.consultar_suelo(lat, lon)
    except Exception:
        log.exception("Fallo /api/suelo lat=%s lon=%s", lat, lon)
        raise HTTPException(status_code=502, detail="No se pudo consultar el mapa de suelos del USDA")
    if res is None:
        raise HTTPException(status_code=404, detail="Sin datos de suelo SSURGO para esta ubicacion")
    response.headers["Cache-Control"] = CACHE_SUELO
    return res


@app.get("/api/suelo/mapa")
def api_suelo_mapa(
    response: Response,
    lat: float = Query(42.03, ge=-90.0, le=90.0),
    lon: float = Query(-93.63, ge=-180.0, le=180.0),
) -> dict:
    """Polígonos SSURGO del cuadro de ~2 x 2 km alrededor del punto, con textura por unidad."""
    _en_region(lat, lon)
    try:
        res = ssurgo.mapa(lat, lon)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception:
        log.exception("Fallo /api/suelo/mapa lat=%s lon=%s", lat, lon)
        raise HTTPException(status_code=502, detail="No se pudo consultar el mapa de suelos del USDA")
    response.headers["Cache-Control"] = CACHE_SUELO
    return res


@app.get("/api/reglas")
def api_reglas(response: Response) -> dict:
    response.headers["Cache-Control"] = "public, max-age=3600, s-maxage=86400"
    return {
        "reglas": motor.cargar_reglas(),
        "cultivos": comparador.cargar_cultivos(),
        "rotaciones": comparador.cargar_rotaciones(),
        "suelos": agua.cargar_suelos(),
    }


def _version_js() -> str:
    """Huella de app.js para romper la caché del navegador cuando cambia."""
    import hashlib
    return hashlib.sha256((WEB_DIR / "app.js").read_bytes()).hexdigest()[:10]


@app.get("/", response_class=HTMLResponse)
def index() -> HTMLResponse:
    html = (WEB_DIR / "index.html").read_text(encoding="utf-8")
    html = html.replace('src="app.js"', f'src="app.js?v={_version_js()}"')
    return HTMLResponse(html, headers={"Cache-Control": "public, max-age=0, s-maxage=300"})


@app.get("/favicon.ico", include_in_schema=False)
def favicon() -> FileResponse:
    return FileResponse(WEB_DIR / "favicon.ico", media_type="image/x-icon",
                        headers={"Cache-Control": "public, max-age=604800"})


@app.get("/app.js", include_in_schema=False)
def app_js() -> FileResponse:
    # Con ?v=<huella> en la URL, el archivo puede quedar en caché un año.
    return FileResponse(WEB_DIR / "app.js", media_type="text/javascript; charset=utf-8",
                        headers={"Cache-Control": "public, max-age=31536000, immutable"})


@app.get("/{archivo}.json")
def json_estatico(archivo: str) -> FileResponse:
    ruta = (WEB_DIR / f"{archivo}.json").resolve()
    if ruta.parent != WEB_DIR.resolve() or not ruta.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(ruta, media_type="application/json")
