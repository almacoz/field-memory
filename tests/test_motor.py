"""Pruebas con series SINTETICAS. Solo verifican la logica; no dicen nada del clima real."""
import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from rotaciones import agua, comparador, motor, power
from rotaciones.cli import cargar, ejecutar

REGLAS = cargar("reglas")
GLS = REGLAS["patogenos"]["mancha_gris_maiz"]


def serie(anios=(2020,), t=25.0, rh=50.0):
    idx = pd.date_range(f"{anios[0]}-01-01", f"{anios[-1]}-12-31 23:00", freq="h")
    return pd.DataFrame({"T2M": t, "RH2M": rh}, index=idx)


def dias(df, regla=GLS, umbral="90", **kw):
    r = motor.favorabilidad(df, regla, **kw)["por_umbral_hr"][umbral]
    return sum(r["dias_favorables_por_anio"].values())


def test_sin_humedad_no_hay_dias():
    assert dias(serie()) == 0


def test_racha_exacta_de_12_horas_cuenta_y_11_no():
    df = serie()
    df.loc["2020-07-10 00:00":"2020-07-10 10:00", "RH2M"] = 95  # 11 h
    assert dias(df) == 0
    df.loc["2020-07-10 11:00", "RH2M"] = 95  # 12 h
    assert dias(df) == 1


def test_fuera_de_ventana_no_cuenta():
    df = serie()
    df.loc["2020-05-10":"2020-05-12", "RH2M"] = 99
    assert dias(df) == 0


def test_temperatura_fuera_de_rango_no_cuenta():
    df = serie(t=15.0)
    df.loc["2020-07-10":"2020-07-12", "RH2M"] = 99
    assert dias(df) == 0


def test_dato_faltante_corta_la_racha():
    df = serie()
    df.loc["2020-07-10 00:00":"2020-07-10 13:00", "RH2M"] = 95
    df.loc["2020-07-10 06:00", "RH2M"] = np.nan
    assert dias(df) == 0


def test_barrido_es_monotono_y_ajuste_dosel_sube():
    df = serie()
    df.loc["2020-07-10":"2020-07-12", "RH2M"] = 88
    assert dias(df, umbral="85") == 3 and dias(df, umbral="90") == 0
    assert dias(df, umbral="90", ajuste_dosel=3) == 3


def test_anio_con_huecos_se_descarta():
    df = serie((2020, 2021))
    df.loc["2021-07-01":"2021-07-20", "RH2M"] = np.nan
    r = motor.favorabilidad(df, GLS)
    assert r["anios_evaluados"] == [2020] and r["anios_descartados_por_datos"] == [2021]


def test_criterio_max_diaria_moho_blanco():
    mb = REGLAS["patogenos"]["moho_blanco_soya"]
    df = serie(t=22.0, rh=95.0)
    antes = dias(df, mb)
    df.loc["2020-07-15 15:00", "T2M"] = 33.0  # un pico de calor invalida ese dia
    assert antes == 31 and dias(df, mb) == 30


@pytest.mark.parametrize("sec,hosp,esperado", [
    (["maiz"], ["maiz"], 0), (["maiz", "soya"], ["maiz"], 1),
    (["maiz", "soya", "trigo"], ["soya"], 2), (["maiz", "maiz", "trigo"], ["maiz"], 0),
    (["maiz", "trigo"], ["soya"], None)])
def test_brecha(sec, hosp, esperado):
    assert comparador.brecha_sin_hospedante(sec, hosp) == esperado


def test_comparador_trade_off():
    df = serie((2010, 2021), t=22.0, rh=95.0)  # clima favorable para todo
    rot = ejecutar(df)["rotaciones"]
    p = lambda r, k: rot[r]["problemas"][k]
    assert p("maiz_continuo", "mancha_gris_maiz")["riesgo"] == "alta"
    assert p("maiz_continuo", "moho_blanco_soya")["riesgo"] == "nulo_en_el_lote"
    assert p("maiz_soya", "mancha_gris_maiz")["presion_inoculo"] == "baja"
    assert p("maiz_soya", "moho_blanco_soya")["presion_inoculo"] == "alta"
    assert p("maiz_soya_trigo", "moho_blanco_soya")["presion_inoculo"] == "media"
    assert p("maiz_trigo", "moho_blanco_soya")["riesgo"] == "nulo_en_el_lote"
    assert all(rot[r]["problemas"]["mancha_alquitran_maiz"]["riesgo"] == "no_evaluable" for r in rot)


def test_parser_power_trata_relleno():
    datos = {"header": {"fill_value": -999.0}, "properties": {"parameter": {
        "T2M": {"2024070100": 20.5, "2024070101": -999.0},
        "RH2M": {"2024070100": 91.0, "2024070101": 88.0}}}}
    df = power.a_dataframe(datos, "%Y%m%d%H")
    assert df.index[1] == pd.Timestamp("2024-07-01 01:00") and np.isnan(df["T2M"].iloc[1])
    with pytest.raises(ValueError):
        power.a_dataframe({"error": "x"}, "%Y%m%d%H")


def test_cada_umbral_declara_tipo_y_los_citados_tienen_fuente():
    for regla in REGLAS["patogenos"].values():
        campos = [regla["medio_supervivencia"], regla["persistencia_inoculo_anios"],
                  regla["rotacion_min_anios"], regla["eficacia_rotacion"]]
        if regla["clima"]:
            campos += [regla["ventana"], regla["clima"]["temp"], regla["clima"]["horas_mojado_min"]]
        for campo in campos:
            assert campo["tipo"] in ("citado", "supuesto")
            if campo["tipo"] == "citado":
                assert campo["fuente"].startswith("https://")


# ---------- marco: medio de supervivencia ----------

def _rot(campo=None):
    return ejecutar(serie((2010, 2021), t=22.0, rh=95.0), campo=campo)["rotaciones"]


def test_todo_problema_declara_medio_valido():
    medios = REGLAS["_meta"]["medios"]
    assert {r["medio_supervivencia"]["clave"] for r in REGLAS["patogenos"].values()} == set(medios)


def test_roya_no_depende_de_la_rotacion():
    rot = _rot()
    for r in ("maiz_continuo", "maiz_soya", "maiz_soya_trigo"):
        assert rot[r]["problemas"]["roya_sur_maiz"]["riesgo"] == "no_depende_de_la_rotacion"


def test_gusano_raiz_sigue_logica_de_rotacion_sin_clima():
    rot = _rot()
    g = lambda r: rot[r]["problemas"]["gusano_raiz_maiz"]
    assert g("maiz_continuo")["riesgo"] == "alta" and g("maiz_continuo")["clima_nivel"] == "no_evaluado"
    assert g("maiz_soya")["riesgo"] == "media"        # diapausa extendida: un anio no basta
    assert g("maiz_soya_trigo")["riesgo"] == "baja"


def test_trade_off_residuo_segun_rotacion_y_labranza():
    sd = _rot({"labranza": "siembra_directa"})
    assert any("Conflicto sin resolver" in t for t in sd["maiz_continuo"]["trade_offs"])
    assert any("permite conservar el residuo" in t for t in sd["maiz_soya"]["trade_offs"])
    assert any("vive en el suelo" in t for t in sd["maiz_soya"]["trade_offs"])
    conv = _rot({"labranza": "convencional"})
    assert any("erosion" in t for t in conv["maiz_continuo"]["trade_offs"])
    assert conv["maiz_continuo"]["problemas"]["mancha_gris_maiz"]["presion_inoculo"] == "media"


# ---------- agua ----------

def diario(lluvia_mm, anios=(2000, 2011)):
    idx = pd.date_range(f"{anios[0]}-01-01", f"{anios[1]}-12-31", freq="D")
    return pd.DataFrame({"PRECTOTCORR": lluvia_mm, "GWETROOT": 0.6, "T2M_MAX": 28.0, "T2M_MIN": 16.0}, index=idx)


def test_et0_hargreaves_orden_de_magnitud():
    v = agua.et0_hargreaves(np.array([29.0]), np.array([17.0]), 42.0, np.array([196]))[0]
    assert 4.0 < v < 7.5   # pleno verano a 42 N


def test_balance_lluvia_abundante_sin_estres_y_sequia_con_estres():
    c, s = cargar("cultivos"), cargar("suelos")
    humedo = agua.balance_por_cultivo(diario(10.0), 42.0, c, s)
    seco = agua.balance_por_cultivo(diario(0.5), 42.0, c, s)
    assert humedo["por_cultivo"]["maiz"]["dias_estres_media"] == 0
    assert seco["por_cultivo"]["maiz"]["dias_estres_media"] > 100


def test_suelo_arenoso_sufre_mas_y_materia_organica_ayuda():
    c, s = cargar("cultivos"), cargar("suelos")
    d = diario(2.2)
    f = lambda **k: agua.balance_por_cultivo(d, 42.0, c, s, **k)["por_cultivo"]["maiz"]["dias_estres_media"]
    assert f(textura="arena") > f(textura="franco_limoso") >= f(textura="franco_limoso", mo_alta=True)


# ---------- vista del agricultor y API ----------

def _vista(idioma="es", vio=None):
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
    from generar_ejemplo import series
    from rotaciones.api import evaluar_sitio
    dfh, dfd = series()
    return evaluar_sitio(dfh, dfd, 42.03, -93.63, None, "siembra_directa", False, False, idioma, vio,
                         sintetico=True)["vista"]


def test_vista_contrato_y_dos_idiomas():
    es, en = _vista("es"), _vista("en")
    assert es["datos_sinteticos"] is True
    for v in (es, en):
        assert {"agua", "tarjetas"} <= set(v["lote_hoy"]) and len(v["opciones"]) == 4
        for c in v["lote_hoy"]["tarjetas"]:
            assert c["nivel"]["simbolo"] and c["nivel"]["etiqueta"] and c["fuentes"]
            assert c["donde_pasa_el_invierno"] and c["que_lo_frena"] and c["este_anio"]
        assert sum(o["es_actual"] for o in v["opciones"]) == 1
    assert es["lote_hoy"]["tarjetas"][0]["nombre"] != en["lote_hoy"]["tarjetas"][0]["nombre"]
    assert 0 <= es["lote_hoy"]["agua"]["fraccion_llena"] <= 1


def test_respuesta_del_agricultor_cambia_el_nivel():
    antes = {c["clave"]: c["nivel"]["clave"] for c in _vista()["lote_hoy"]["tarjetas"]}
    desp = {c["clave"]: c["nivel"]["clave"] for c in _vista(vio="gusano_raiz_maiz:no")["lote_hoy"]["tarjetas"]}
    assert antes["gusano_raiz_maiz"] == "alta" and desp["gusano_raiz_maiz"] == "media"


def test_api_con_power_simulado(monkeypatch):
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
    from fastapi.testclient import TestClient
    from generar_ejemplo import series
    from rotaciones import api
    dfh, dfd = series()
    monkeypatch.setattr(api.power, "horario", lambda *a: dfh)
    monkeypatch.setattr(api.power, "diario", lambda *a: dfd)
    api._series.cache_clear(); api._evaluar_cache.cache_clear()
    c = TestClient(api.app)
    r = c.get("/api/evaluar", params={"idioma": "en", "textura": "arena"})
    assert r.status_code == 200 and r.json()["vista"]["idioma"] == "en"
    assert c.get("/").status_code == 200
    assert c.get("/img/cultivos/maiz.webp").status_code == 200
    assert c.get("/favicon.ico").status_code == 200 and c.get("/manifest.json").status_code == 200
    assert "s-maxage" in r.headers["cache-control"]
    monkeypatch.setattr(api.power, "horario", lambda *a: (_ for _ in ()).throw(RuntimeError("sin red")))
    api._series.cache_clear(); api._evaluar_cache.cache_clear()
    r = c.get("/api/evaluar")
    assert r.status_code == 502 and "sin red" not in r.text  # sin detalles internos
    api._series.cache_clear(); api._evaluar_cache.cache_clear()


# ---------- coherencia de niveles, tabla resumen y selector de cultivo ----------

def _sitio(idioma="es", vio=None, actual=None):
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
    from generar_ejemplo import series
    from rotaciones.api import evaluar_sitio
    dfh, dfd = series()
    return evaluar_sitio(dfh, dfd, idioma=idioma, vio=vio, actual=actual, sintetico=True)["vista"]


@pytest.mark.parametrize("vio", [None, "mancha_gris_maiz:si", "gusano_raiz_maiz:no,mancha_gris_maiz:no"])
def test_un_solo_nivel_en_tarjeta_linea_y_tabla(vio):
    v = _sitio(vio=vio)
    tarjeta = {c["clave"]: c["nivel"]["clave"] for c in v["lote_hoy"]["tarjetas"]}
    op = next(o for o in v["opciones"] if o["es_actual"])
    fila = next(f for f in v["matriz"]["filas"] if f["es_actual"])
    for l in op["lineas"]:
        if l["problema"] in tarjeta:
            assert l["nivel"]["clave"] == tarjeta[l["problema"]]
    for c in fila["celdas"]:
        if c["problema"] in tarjeta:
            assert c["nivel"]["clave"] == tarjeta[c["problema"]]


def test_observacion_sube_o_baja_un_nivel_y_se_explica():
    base = {l["problema"]: l for o in _sitio()["opciones"] if o["clave"] == "maiz_soya_trigo" for l in o["lineas"]}
    si = {l["problema"]: l for o in _sitio(vio="gusano_raiz_maiz:si")["opciones"]
          if o["clave"] == "maiz_soya_trigo" for l in o["lineas"]}
    assert base["gusano_raiz_maiz"]["nivel"]["clave"] == "baja"
    assert si["gusano_raiz_maiz"]["nivel"]["clave"] == "media"
    assert "Usted lo vio" in si["gusano_raiz_maiz"]["texto"]
    assert "hasta 1 " not in si["gusano_raiz_maiz"]["texto"]


def test_selector_de_cultivo_actual_y_tabla():
    v = _sitio(actual="maiz_soya")
    assert v["actual"] == "maiz_soya" and len(v["rotaciones_disponibles"]) == 4
    assert [o["clave"] for o in v["opciones"] if o["es_actual"]] == ["maiz_soya"]
    m = v["matriz"]
    assert len(m["filas"]) == 4 and all(len(f["celdas"]) == len(m["columnas"]) for f in m["filas"])
    assert "roya_sur_maiz" not in [c["clave"] for c in m["columnas"]]
    sin = [c for f in m["filas"] if f["clave"] == "maiz_continuo" for c in f["celdas"]
           if c["problema"] == "moho_blanco_soya"]
    assert sin[0]["nivel"]["clave"] == "sin_hospedante"


def test_textos_sin_plurales_rotos_ni_decimales():
    for idioma in ("es", "en"):
        v = _sitio(idioma)
        blob = " ".join(l["texto"] for o in v["opciones"] for l in o["lineas"])
        blob += " ".join(c["este_anio"] for c in v["lote_hoy"]["tarjetas"]) + v["lote_hoy"]["agua"]["texto_anio"]
        assert "1 years" not in blob and "1 años" not in blob and "year(s)" not in blob and "año(s)" not in blob
        import re
        assert not re.search(r"\d\.\d (días|days|thirsty)", blob)
        assert v["cabecera"]["pregunta"] and v["nasa"]["texto"]


def test_ajuste_por_clima_es_relativo_al_sitio():
    from rotaciones import comparador as c
    regla = REGLAS["patogenos"]["mancha_gris_maiz"]
    def clima(ultimo):
        serie = {a: (a % 5) for a in range(2001, 2025)}; serie[2025] = ultimo
        return {"clima_evaluado": True, "umbral_referencia": "90",
                "por_umbral_hr": {"90": {"dias_favorables_por_anio": serie}}}
    assert c.posicion_ultimo_anio(clima(20)) == "alto" and c.posicion_ultimo_anio(clima(0)) == "bajo"
    assert c._ajustes(regla, clima(20), "maiz", None) == [{"origen": "clima", "delta": 1}]
    assert c._ajustes(regla, clima(20), "soya", None) == []      # sin hospedante este año: no carga
    assert c._nivel_final("baja", [{"origen": "clima", "delta": 1}, {"origen": "observacion", "delta": 1}]) == "alta"


def test_tendencia():
    sube = motor.tendencia({a: a - 2000 for a in range(2001, 2026)})
    assert sube["clave"] == "sube" and motor.tendencia({a: 3 for a in range(2001, 2026)})["evaluable"] is False


def test_fotos_con_credito_y_solo_si_existe_el_archivo(tmp_path, monkeypatch):
    from rotaciones import vista
    fotos = cargar("fotos")
    for k, f in fotos.items():
        if k != "_meta":
            assert k in REGLAS["patogenos"] and f["autor"] and f["licencia"] and f["url"].startswith("https://")
    monkeypatch.setattr(vista, "_RAIZ", tmp_path)
    (tmp_path / "data").mkdir(); (tmp_path / "web" / "img").mkdir(parents=True)
    (tmp_path / "data" / "fotos.json").write_text(json.dumps(fotos), encoding="utf-8")
    sin = vista._foto("mancha_gris_maiz", "es")          # sin archivo: enlace y crédito, sin imagen
    assert sin["src"] is None and sin["url"].startswith("https://") and "Daren Mueller" in sin["credito"]
    (tmp_path / "web" / "img" / "mancha_gris.jpg").write_bytes(b"x")
    f = vista._foto("mancha_gris_maiz", "en")
    assert f["src"] == "img/mancha_gris.jpg" and "Daren Mueller" in f["credito"] and "CC BY 3.0" in f["credito"]


def test_destacado_sale_de_los_datos_y_secuencia_ilustrada():
    for idioma in ("es", "en"):
        v = _sitio(idioma)
        d = v["destacado"]
        top = v["lote_hoy"]["tarjetas"][0]
        assert d["nivel"]["clave"] == top["nivel"]["clave"]
        nombre = next(c["nombre"] for c in v["lote_hoy"]["tarjetas"] if c["clave"] == d["problema"])
        assert d["titulo"].startswith(nombre) and d["agua"]["texto"]
        assert v["ia_nota"]
        for o in v["opciones"]:
            assert [c["clave"] for c in o["secuencia"]] == cargar("rotaciones")["rotaciones"][o["clave"]]["secuencia"]
            assert all(c["img"] in (None, f"img/cultivos/{c['clave']}.png", f"img/cultivos/{c['clave']}.webp") for c in o["secuencia"])


def test_destacado_dice_que_rotaciones_reducen_el_problema():
    v = _sitio("es")
    d = v["destacado"]
    nivel_hoy = {"alta": 3, "media": 2, "baja": 1}[d["nivel"]["clave"]]
    for r in d["reducen"]:
        op = next(o for o in v["opciones"] if o["clave"] == r["clave"])
        l = next((l for l in op["lineas"] if l["problema"] == d["problema"]), None)
        assert l is None or {"alta": 3, "media": 2, "baja": 1}[l["nivel"]["clave"]] < nivel_hoy
    assert d["texto_reducen"] and v["anio_datos"]


def test_ssurgo_lee_nombres_de_columna(monkeypatch, tmp_path):
    from rotaciones import ssurgo
    monkeypatch.setattr(ssurgo, "CACHE", tmp_path)
    class R:
        def raise_for_status(self): pass
        def json(self): return {"Table": [["mukey", "musym", "muname", "compname", "comppct_r", "texcl", "hzdept_r", "hzdepb_r"],
                                          ["123", "L107", "Webster clay loam", "Webster", "90", "Clay loam", "0", "20"]]}
    R.status_code = 200; R.content = b"x"; R.text = ""
    enviado = {}
    def post(url, json=None, data=None, timeout=None): enviado.update(json or data); return R()
    monkeypatch.setattr(ssurgo.httpx, "post", post)
    r = ssurgo.consultar(42.03, -93.63, usar_cache=False)
    assert enviado["format"] == "JSON+COLUMNNAME" and r["textura_modelo_aproximada"] == "franco_arcillo_limoso"
    # La textura se pide a chtexture (en chorizon no existe esa columna).
    assert "chtexture" in enviado["query"] and "rvindicator" in enviado["query"]


def test_cada_prioridad_ordena_por_un_dato_visible():
    v = _sitio("es")
    for o in v["opciones"]:
        assert set(o["orden"]) == {"sanidad", "agua", "suelo"}
        assert all(o["criterios"][k] for k in ("sanidad", "agua", "suelo"))
        a = sum(1 for l in o["lineas"] if l["nivel"] and l["nivel"]["clave"] == "alta")
        m = sum(1 for l in o["lineas"] if l["nivel"] and l["nivel"]["clave"] == "media")
        assert o["orden"]["sanidad"] == a * 100 + m and f": {a} " in o["criterios"]["sanidad"]


def test_api_suelo_usa_la_funcion_que_existe(monkeypatch):
    from fastapi.testclient import TestClient
    from rotaciones import api, ssurgo
    monkeypatch.setattr(ssurgo, "consultar", lambda lat, lon, timeout=12.0: {"unidad_mapa": "x"})
    assert TestClient(api.app).get("/api/suelo").json() == {"unidad_mapa": "x"}
    def sin(lat, lon, timeout=12.0): raise LookupError("nada")
    monkeypatch.setattr(ssurgo, "consultar", sin)
    assert TestClient(api.app).get("/api/suelo").status_code == 404


def test_monocultivos_solo_aparecen_si_son_los_actuales():
    claves = [o["clave"] for o in _sitio()["opciones"]]
    assert "soya_continua" not in claves and "trigo_continuo" not in claves
    v = _sitio(actual="soya_continua")
    assert [o["clave"] for o in v["opciones"] if o["es_actual"]] == ["soya_continua"]
    assert "trigo_continuo" not in [o["clave"] for o in v["opciones"]]


def test_trigo_continuo_dice_que_no_hay_reglas():
    d = _sitio(actual="trigo_continuo")["destacado"]
    assert d["problema"] is None and d["nivel"] is None and "trigo" in d["titulo"]
    assert "texto_reducen" not in d


def test_wkt_lee_poligonos_huecos_y_colecciones():
    from rotaciones import ssurgo
    w = ("GEOMETRYCOLLECTION (POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0)), LINESTRING (0 0, 1 1), "
         "MULTIPOLYGON (((2 2, 3 2, 3 3, 2 2)), ((4 4, 5 4, 5 5, 4 4), (4.2 4.1, 4.3 4.1, 4.3 4.2, 4.2 4.1))))")
    assert [len(p) for p in ssurgo._anillos_wkt(w)] == [1, 1, 2]
    assert ssurgo._anillos_wkt("GEOMETRYCOLLECTION EMPTY") == []


def test_mapa_de_suelos_une_poligonos_y_texturas(monkeypatch, tmp_path):
    from rotaciones import ssurgo
    monkeypatch.setattr(ssurgo, "CACHE", tmp_path)
    enviado = {}
    def pedir(q, timeout):
        enviado["q"] = q
        return {"Table": [["mukey", "wkt"], ["1", "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))"], ["2", "POLYGON ((1 0, 2 0, 2 1, 1 1, 1 0))"]],
                "Table1": [["mukey", "muname", "compname", "comppct_r", "texcl"],
                           ["1", "Clarion loam", "Clarion", "90", "Loam"], ["2", "Water", None, None, None]]}
    monkeypatch.setattr(ssurgo, "_pedir", pedir)
    monkeypatch.setattr(ssurgo, "consultar", lambda lat, lon, usar_cache=True: {"mukey": "1"})
    m = ssurgo.mapa(42.03, -93.63, usar_cache=False)
    assert m["proporcion"] == {"franco": 0.5, "sin_dato": 0.5} and m["punto_mukey"] == "1"
    assert "chtexture" in enviado["q"] and "mupolygon" in enviado["q"]
    assert (tmp_path / "ssurgo_mapa_42.0300_-93.6300.json").is_file()


def test_api_limita_region_y_oculta_docs():
    from fastapi.testclient import TestClient
    from rotaciones import api
    c = TestClient(api.app)
    assert c.get("/api/evaluar", params={"lat": 4.6, "lon": -74.1}).status_code == 422   # Bogotá
    assert c.get("/api/suelo/mapa", params={"lat": 4.6, "lon": -74.1}).status_code == 422
    assert c.get("/api/evaluar", params={"vio": "x" * 400}).status_code == 422
    assert c.get("/docs").status_code == 404 and c.get("/openapi.json").status_code == 404
    assert c.get("/..%2Frotaciones%2Fapi.json").status_code == 404


def test_power_refresca_el_anio_en_curso_y_usa_lo_viejo_si_falla(tmp_path, monkeypatch):
    import json as _json
    from rotaciones import power
    monkeypatch.setattr(power, "CACHE_TMP", tmp_path / "tmp")
    viejo = tmp_path / "d_1_2_1981_20261101.json"
    viejo.write_text(_json.dumps({"v": "viejo"}))
    pedido = tmp_path / "d_1_2_1981_20261111.json"
    llamadas = []
    class R:
        def __enter__(self): return self
        def __exit__(self, *a): pass
        def read(self): return _json.dumps({"v": "nuevo"}).encode()
    def abrir(req, timeout): llamadas.append(1); return R()
    monkeypatch.setattr(power.urllib.request, "urlopen", abrir)
    assert power._leer_o_pedir("https://power.example/x", pedido, "d_1_2_1981_2026*.json") == {"v": "nuevo"}   # 10 días: refresca
    assert power._leer_o_pedir("https://power.example/x", pedido, "d_1_2_1981_2026*.json") == {"v": "nuevo"} and len(llamadas) == 1
    pedido2 = tmp_path / "d_1_2_1981_20261120.json"
    monkeypatch.setattr(power.urllib.request, "urlopen", lambda *a, **k: (_ for _ in ()).throw(OSError("sin red")))
    assert power._leer_o_pedir("https://power.example/x", pedido2, "d_1_2_1981_2026*.json") == {"v": "nuevo"}  # sin red: el último guardado
