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
    assert antes["gusano_raiz_maiz"] == "alta" and desp["gusano_raiz_maiz"] == "baja"


def test_api_con_power_simulado(monkeypatch):
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
    from fastapi.testclient import TestClient
    from generar_ejemplo import series
    from rotaciones import api
    dfh, dfd = series()
    monkeypatch.setattr(api.power, "horario", lambda *a: dfh)
    monkeypatch.setattr(api.power, "diario", lambda *a: dfd)
    c = TestClient(api.app)
    r = c.get("/api/evaluar", params={"idioma": "en", "textura": "arena"})
    assert r.status_code == 200 and r.json()["vista"]["idioma"] == "en"
    assert c.get("/").status_code == 200
    monkeypatch.setattr(api.power, "horario", lambda *a: (_ for _ in ()).throw(RuntimeError("sin red")))
    assert c.get("/api/evaluar").status_code == 502
