"""Consulta puntual de textura superficial SSURGO mediante USDA NRCS Soil Data Access."""
from __future__ import annotations

import json
from pathlib import Path

import httpx

ENDPOINT = "https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest"
FUENTE = "USDA NRCS Soil Data Access (SSURGO)"

# Conversión aproximada de clases USDA a las clases texturales que usa el modelo.
# Se conserva siempre la clase SSURGO original para que la conversión sea auditable.
TEXTURA_MODELO = {
    "sand": "arena", "coarse sand": "arena", "fine sand": "arena", "very fine sand": "arena",
    "loamy sand": "franco_arenoso", "loamy coarse sand": "franco_arenoso",
    "loamy fine sand": "franco_arenoso", "loamy very fine sand": "franco_arenoso",
    "sandy loam": "franco_arenoso", "coarse sandy loam": "franco_arenoso",
    "fine sandy loam": "franco_arenoso", "very fine sandy loam": "franco_arenoso",
    "loam": "franco",
    "silt loam": "franco_limoso", "silt": "franco_limoso",
    "sandy clay loam": "franco_arcillo_limoso",
    "clay loam": "franco_arcillo_limoso", "silty clay loam": "franco_arcillo_limoso",
    "sandy clay": "arcilla", "silty clay": "arcilla", "clay": "arcilla",
}

CACHE = Path(__file__).resolve().parent.parent / "cache"
CACHE_TMP = Path("/tmp/rotaciones-cache")


def _leer_cache(nombre: str) -> dict | None:
    for carpeta in (CACHE, CACHE_TMP):
        if (carpeta / nombre).is_file():
            return json.loads((carpeta / nombre).read_text(encoding="utf-8"))
    return None


def _escribir_cache(nombre: str, datos: dict) -> None:
    for carpeta in (CACHE, CACHE_TMP):
        try:
            carpeta.mkdir(parents=True, exist_ok=True)
            (carpeta / nombre).write_text(json.dumps(datos, ensure_ascii=False), encoding="utf-8")
            return
        except OSError:
            continue

# La clase textural está en chtexture (vía chtexturegrp), NO en chorizon.
# Se toma el grupo representativo (rvindicator) del horizonte superficial del
# componente mayoritario.
CONSULTA = """
SELECT TOP 1 mu.mukey, mu.musym, mu.muname, c.compname, c.comppct_r,
       cht.texcl, chtg.texdesc, ch.hzdept_r, ch.hzdepb_r
FROM SDA_Get_Mukey_from_intersection_with_WktWgs84('{wkt}') x
INNER JOIN mapunit mu ON mu.mukey = x.mukey
INNER JOIN component c ON c.mukey = mu.mukey AND c.majcompflag = 'Yes'
INNER JOIN chorizon ch ON ch.cokey = c.cokey AND ch.hzdept_r = 0
INNER JOIN chtexturegrp chtg ON chtg.chkey = ch.chkey AND chtg.rvindicator = 'Yes'
INNER JOIN chtexture cht ON cht.chtgkey = chtg.chtgkey
WHERE cht.texcl IS NOT NULL
ORDER BY c.comppct_r DESC
"""


def _archivo_cache(lat: float, lon: float) -> Path:
    return CACHE / f"ssurgo_{lat:.4f}_{lon:.4f}.json"


def _pedir(query: str, timeout: float) -> dict:
    """SDA documenta un cuerpo JSON; si el servidor lo rechaza se reintenta como formulario."""
    cuerpo = {"query": query, "format": "JSON+COLUMNNAME"}
    errores = []
    for intento in ("json", "form"):
        try:
            if intento == "json":
                r = httpx.post(ENDPOINT, json=cuerpo, timeout=timeout)
            else:
                r = httpx.post(ENDPOINT, data=cuerpo, timeout=timeout)
            if r.status_code >= 400:
                errores.append(f"{intento}: HTTP {r.status_code} {r.text[:200].strip()}")
                continue
            return r.json() if r.content.strip() else {}
        except httpx.HTTPError as exc:
            errores.append(f"{intento}: {type(exc).__name__} {exc}")
    raise RuntimeError("; ".join(errores))


def consultar(lat: float, lon: float, timeout: float = 20.0, usar_cache: bool = True) -> dict:
    """Devuelve la clase dominante del horizonte superficial para el punto consultado.

    Las respuestas buenas se guardan en cache/ para que la demo funcione sin red.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ValueError("Coordenadas fuera de rango")
    arch = _archivo_cache(lat, lon)
    if usar_cache and (previo := _leer_cache(arch.name)) is not None:
        return previo
    payload = _pedir(CONSULTA.format(wkt=f"POINT({lon:.6f} {lat:.6f})"), timeout)
    rows = payload.get("Table") or []
    # Con "JSON+COLUMNNAME" la primera fila trae los nombres de columna.
    if len(rows) < 2:
        raise LookupError("SSURGO no devolvió una unidad de suelo para este punto")
    headers = [str(h).lower() for h in rows[0]]
    row = dict(zip(headers, rows[1]))
    original = str(row.get("texcl") or "").strip()
    textura = TEXTURA_MODELO.get(original.lower())
    if not textura:
        raise LookupError(f"Clase de textura SSURGO no mapeada: {original or 'sin dato'}")
    res = {
        "fuente": FUENTE,
        "url": "https://sdmdataaccess.nrcs.usda.gov/",
        "lat": lat,
        "lon": lon,
        "mukey": str(row.get("mukey", "")),
        "simbolo_mapa": row.get("musym"),
        "unidad_mapa": row.get("muname"),
        "componente_dominante": row.get("compname"),
        "porcentaje_componente": row.get("comppct_r"),
        "horizonte_superficial": {"textura_original": original,
                                  "descripcion": row.get("texdesc"),
                                  "profundidad_cm": [row.get("hzdept_r"), row.get("hzdepb_r")]},
        "textura_modelo_aproximada": textura,
        "advertencia": "Dato cartográfico de la unidad de suelo; no es una medición ni una descripción confirmada del lote.",
    }
    _escribir_cache(arch.name, res)
    return res


def consultar_suelo(lat: float, lon: float, timeout: float = 20.0) -> dict | None:
    """Nombre que usa api.py: devuelve None si SSURGO no tiene suelo para el punto (404)."""
    try:
        return consultar(lat, lon, timeout)
    except LookupError:
        return None


if __name__ == "__main__":
    # Prueba manual y precarga para la demo:
    #   python -m rotaciones.ssurgo            (los 4 sitios de la demo)
    #   python -m rotaciones.ssurgo 42.03 -93.63
    import sys
    puntos = ([(float(sys.argv[1]), float(sys.argv[2]))] if len(sys.argv) == 3 else
              [(42.03, -93.63), (43.30, -89.38), (41.45, -86.93), (41.15, -96.50)])
    for la, lo in puntos:
        try:
            r = consultar(la, lo, usar_cache=False)
            print(f"OK  {la},{lo}: {r['unidad_mapa']} -> {r['horizonte_superficial']['textura_original']} -> {r['textura_modelo_aproximada']}")
        except Exception as exc:  # noqa: BLE001
            print(f"ERR {la},{lo}: {exc}")


# ---------------------------------------------------------------------------
# Mapa de suelos alrededor de un punto (polígonos SSURGO recortados a un cuadro)
# ---------------------------------------------------------------------------

MEDIO_LADO_KM = 1.0  # el cuadro mide ~2 x 2 km

CONSULTA_MAPA = """
SELECT mp.mukey,
       mp.mupolygongeo.STIntersection(geometry::STGeomFromText('{aoi}', 4326)).MakeValid().Reduce(0.00002).STAsText() AS wkt
FROM mupolygon mp
WHERE mp.mupolygonkey IN (SELECT * FROM SDA_Get_Mupolygonkey_from_intersection_with_WktWgs84('{aoi}'));
SELECT mu.mukey, mu.muname, c.compname, c.comppct_r, cht.texcl
FROM mapunit mu
LEFT JOIN component c ON c.mukey = mu.mukey AND c.majcompflag = 'Yes'
LEFT JOIN chorizon ch ON ch.cokey = c.cokey AND ch.hzdept_r = 0
LEFT JOIN chtexturegrp g ON g.chkey = ch.chkey AND g.rvindicator = 'Yes'
LEFT JOIN chtexture cht ON cht.chtgkey = g.chtgkey
WHERE mu.mukey IN (SELECT DISTINCT mukey FROM SDA_Get_Mukey_from_intersection_with_WktWgs84('{aoi}'))
ORDER BY mu.mukey, c.comppct_r DESC, cht.texcl DESC
"""


def _cuadro(lat: float, lon: float) -> tuple[float, float, float, float]:
    import math
    dy = MEDIO_LADO_KM / 111.32
    dx = MEDIO_LADO_KM / (111.32 * max(0.2, math.cos(math.radians(lat))))
    return lon - dx, lat - dy, lon + dx, lat + dy


def _anillos_wkt(wkt: str) -> list[list[list[list[float]]]]:
    """Polígonos de un WKT (POLYGON, MULTIPOLYGON o GEOMETRYCOLLECTION) como
    [[anillo_exterior, huecos...], ...] con puntos [lon, lat]. Ignora líneas y puntos."""
    import re
    tokens = re.findall(r"[A-Z]+|\(|\)|,|[-+0-9.eE]+", wkt.upper())
    pos = 0

    def lista():  # lee "( ... )" y devuelve listas anidadas; las hojas son [x, y]
        nonlocal pos
        assert tokens[pos] == "("
        pos += 1
        if tokens[pos] != "(":  # lista de coordenadas
            pts, actual = [], []
            while tokens[pos] != ")":
                t = tokens[pos]
                if t == ",":
                    pts.append(actual); actual = []
                else:
                    actual.append(float(t))
                pos += 1
            pts.append(actual)
            pos += 1
            return [[round(c[0], 6), round(c[1], 6)] for c in pts if len(c) >= 2]
        partes = []
        while tokens[pos] != ")":
            if tokens[pos] == ",":
                pos += 1
                continue
            partes.append(lista())
        pos += 1
        return partes

    salida = []

    def geometria():
        nonlocal pos
        tipo = tokens[pos]; pos += 1
        if tokens[pos] == "EMPTY":
            pos += 1
            return
        if tipo == "GEOMETRYCOLLECTION":
            pos += 1  # "("
            while tokens[pos] != ")":
                if tokens[pos] == ",":
                    pos += 1
                    continue
                geometria()
            pos += 1
        elif tipo == "POLYGON":
            salida.append([a for a in lista() if len(a) >= 4])
        elif tipo == "MULTIPOLYGON":
            salida.extend([[a for a in pol if len(a) >= 4] for pol in lista()])
        else:  # punto o línea: se lee y se descarta
            lista()

    try:
        while pos < len(tokens):
            geometria()
    except (IndexError, AssertionError, ValueError):
        pass
    return [p for p in salida if p]


def _area(anillo: list[list[float]], lat0: float) -> float:
    import math
    k = math.cos(math.radians(lat0))
    s = 0.0
    for (x1, y1), (x2, y2) in zip(anillo, anillo[1:] + anillo[:1]):
        s += (x1 * k) * y2 - (x2 * k) * y1
    return abs(s) / 2


def mapa(lat: float, lon: float, timeout: float = 30.0, usar_cache: bool = True) -> dict:
    """Unidades de suelo del cuadro de ~2 x 2 km centrado en el punto, con su textura.

    Todo sale de SSURGO: no hay mapa base (calles, ríos) ni datos inventados.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ValueError("Coordenadas fuera de rango")
    arch = CACHE / f"ssurgo_mapa_{lat:.4f}_{lon:.4f}.json"
    if usar_cache and (previo := _leer_cache(arch.name)) is not None:
        return previo
    x0, y0, x1, y1 = _cuadro(lat, lon)
    aoi = f"POLYGON(({x0:.6f} {y0:.6f}, {x1:.6f} {y0:.6f}, {x1:.6f} {y1:.6f}, {x0:.6f} {y1:.6f}, {x0:.6f} {y0:.6f}))"
    payload = _pedir(CONSULTA_MAPA.format(aoi=aoi), timeout)
    geo, atr = payload.get("Table") or [], payload.get("Table1") or []
    if len(geo) < 2:
        raise LookupError("SSURGO no tiene polígonos de suelo en este cuadro")

    unidades: dict[str, dict] = {}
    if len(atr) >= 2:
        h = [str(c).lower() for c in atr[0]]
        for fila in atr[1:]:
            r = dict(zip(h, fila))
            mk = str(r["mukey"])
            if mk in unidades and unidades[mk]["textura_original"]:
                continue  # ya está el componente mayoritario con textura
            original = str(r.get("texcl") or "").strip()
            unidades[mk] = {"mukey": mk, "nombre": r.get("muname"), "serie": r.get("compname"),
                            "textura_original": original,
                            "textura": TEXTURA_MODELO.get(original.lower())}

    poligonos, area_tex = [], {}
    hg = [str(c).lower() for c in geo[0]]
    for fila in geo[1:]:
        r = dict(zip(hg, fila))
        mk = str(r["mukey"])
        for anillos in _anillos_wkt(str(r.get("wkt") or "")):
            poligonos.append({"mukey": mk, "anillos": anillos})
            tex = (unidades.get(mk) or {}).get("textura") or "sin_dato"
            area_tex[tex] = area_tex.get(tex, 0.0) + _area(anillos[0], lat) - sum(_area(a, lat) for a in anillos[1:])
    total = sum(area_tex.values()) or 1.0
    try:
        punto = consultar(lat, lon, usar_cache=usar_cache)
        punto_mukey = punto["mukey"]
    except Exception:  # noqa: BLE001
        punto_mukey = None
    res = {
        "fuente": FUENTE,
        "centro": [lon, lat],
        "cuadro": [x0, y0, x1, y1],
        "lado_km": 2 * MEDIO_LADO_KM,
        "punto_mukey": punto_mukey,
        "unidades": list(unidades.values()),
        "poligonos": poligonos,
        "proporcion": {k: round(v / total, 3) for k, v in sorted(area_tex.items(), key=lambda kv: -kv[1])},
        "advertencia": "Unidades cartográficas SSURGO: cada polígono indica el suelo dominante, no una medición del lote.",
    }
    _escribir_cache(arch.name, res)
    return res
