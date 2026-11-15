"""Comparador de opciones de rotación cruzando memoria biológica, agua y suelo."""
from __future__ import annotations

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

NIVELES_ORDEN = ("baja", "media", "alta")


def para_actual(rots_cfg: dict, actual: str | None) -> dict:
    """Quita las rotaciones marcadas "solo_como_actual" salvo la que el agricultor hace hoy.

    Soya o trigo continuos se pueden declarar como punto de partida, pero no se
    ofrecen como alternativa a quien ya rota.
    """
    actual = actual or rots_cfg.get("actual")
    filtradas = {k: v for k, v in rots_cfg["rotaciones"].items()
                 if not v.get("solo_como_actual") or k == actual}
    return {**rots_cfg, "rotaciones": filtradas}


def cargar_rotaciones(ruta: Path | None = None) -> dict:
    p = ruta or (RAIZ / "data" / "rotaciones.json")
    return json.loads(p.read_text(encoding="utf-8"))


def cargar_cultivos(ruta: Path | None = None) -> dict:
    p = ruta or (RAIZ / "data" / "cultivos.json")
    return json.loads(p.read_text(encoding="utf-8"))


def brecha_sin_hospedante(secuencia: list[str], hospedantes: list[str] | set[str]) -> int | None:
    hosp_set = set(hospedantes)
    n = len(secuencia)
    idxs = [i for i, c in enumerate(secuencia) if c in hosp_set]
    if not idxs:
        return None
    if len(idxs) == n:
        return 0
    doble = secuencia + secuencia
    pos = [i for i, c in enumerate(doble) if c in hosp_set]
    brechas = [pos[j + 1] - pos[j] - 1 for j in range(len(idxs))]
    return min(brechas)


def posicion_ultimo_anio(clima_pat: dict | None) -> str | None:
    if not clima_pat or not clima_pat.get("clima_evaluado", True):
        return None
    u_ref = clima_pat.get("umbral_referencia")
    if u_ref is None:
        return None
    por_hr = clima_pat["por_umbral_hr"].get(str(u_ref)) or clima_pat["por_umbral_hr"].get(u_ref)
    if not por_hr:
        return None
    serie = {int(k): int(v) for k, v in por_hr["dias_favorables_por_anio"].items()}
    if not serie:
        return None
    vals = list(serie.values())
    if min(vals) == max(vals):
        return "medio"
    ult = max(serie)
    d = serie[ult]
    n = len(vals)
    peores = sum(1 for v in vals if v > d)
    mejores = sum(1 for v in vals if v < d)
    if d > 0 and peores < n / 3:
        return "alto"
    if mejores < n / 3:
        return "bajo"
    return "medio"


def _ajustes(
    regla: dict,
    clima_pat: dict | None,
    cultivo_actual: str | list[str] | None,
    vio_val: bool | str | None,
) -> list[dict]:
    hospedantes = set(regla["hospedantes"])
    if isinstance(cultivo_actual, str):
        tiene_hosp = cultivo_actual in hospedantes
    elif cultivo_actual:
        tiene_hosp = any(c in hospedantes for c in cultivo_actual)
    else:
        tiene_hosp = False

    ajustes = []
    if tiene_hosp and regla["eficacia_rotacion"]["valor"] not in ("incierta", "nula"):
        pos = posicion_ultimo_anio(clima_pat)
        if pos == "alto":
            ajustes.append({"origen": "clima", "delta": 1})
        elif pos == "bajo":
            ajustes.append({"origen": "clima", "delta": -1})

    if vio_val is True or vio_val == "si":
        ajustes.append({"origen": "observacion", "delta": 1})
    elif vio_val is False or vio_val == "no":
        ajustes.append({"origen": "observacion", "delta": -1})
    return ajustes


def _nivel_final(presion_base: str, ajustes: list[dict]) -> str:
    if presion_base not in NIVELES_ORDEN:
        return presion_base
    idx = NIVELES_ORDEN.index(presion_base) + sum(int(a["delta"]) for a in ajustes)
    idx = max(0, min(len(NIVELES_ORDEN) - 1, idx))
    return NIVELES_ORDEN[idx]


def evaluar_patogeno_en_rotacion(
    regla: dict,
    secuencia: list[str],
    labranza: str = "siembra_directa",
) -> dict:
    hospedantes = set(regla["hospedantes"])
    presentes = [c for c in secuencia if c in hospedantes]
    brecha = brecha_sin_hospedante(secuencia, hospedantes)
    medio = regla["medio_supervivencia"]["clave"]
    eficacia = regla["eficacia_rotacion"]["valor"]

    if not presentes:
        presion = "nulo_en_el_lote"
    elif medio == "no_sobrevive_viento" or eficacia == "nula":
        presion = "no_depende_de_la_rotacion"
    elif eficacia == "incierta":
        presion = "no_evaluable"
    else:
        rot_min = regla["rotacion_min_anios"]["min"] or 1
        pers_max = regla["persistencia_inoculo_anios"]["max"] or rot_min
        if brecha == 0 or brecha < rot_min:
            presion = "alta"
        elif brecha < pers_max:
            presion = "media"
        else:
            presion = "baja"
        if labranza == "convencional" and medio == "residuo_superficie" and presion == "alta":
            presion = "media"

    return {
        "cultivos_hospedantes_en_rotacion": sorted(set(presentes)),
        "brecha_sin_hospedante": brecha,
        "anios_sin_hospedante_entre_siembras": brecha,
        "medio_supervivencia": medio,
        "presion_inoculo": presion,
        "eficacia_rotacion": eficacia,
    }


def _construir_trade_offs(
    secuencia: list[str],
    por_patogeno: dict,
    labranza: str,
    riego: bool,
) -> list[str]:
    notas = []
    residuo_probs = [
        k for k, ev in por_patogeno.items()
        if ev["medio_supervivencia"] == "residuo_superficie" and ev["cultivos_hospedantes_en_rotacion"]
    ]
    if labranza == "siembra_directa":
        if residuo_probs:
            alta_res = [k for k in residuo_probs if por_patogeno[k]["presion_inoculo"] == "alta"]
            if alta_res:
                notas.append(
                    "Conflicto sin resolver: el residuo en superficie protege el suelo y retiene agua, "
                    "pero ahi invernan mancha gris, mancha de alquitran, y esta rotacion no da descanso suficiente."
                )
            else:
                notas.append(
                    "La rotacion permite conservar el residuo en superficie (proteccion del suelo, retencion de agua) "
                    "sin acumular inoculo de mancha gris. No se puede afirmar lo mismo de mancha de alquitran: "
                    "eficacia de rotacion incierta."
                )
    else:
        if residuo_probs:
            notas.append(
                "La labranza convencional entierra residuo de maiz y reduce el inoculo de mancha gris, "
                "a costa de menor cobertura y mayor riesgo de erosion."
            )

    if por_patogeno.get("moho_blanco_soya", {}).get("cultivos_hospedantes_en_rotacion"):
        notas.append(
            "Esta rotacion incluye un hospedante de moho blanco, que vive en el suelo por anios: "
            "la labranza ayuda poco y solo lo reduce una rotacion larga."
        )

    if riego and por_patogeno.get("mancha_alquitran_maiz", {}).get("cultivos_hospedantes_en_rotacion"):
        notas.append(
            "Con riego por aspersion, la humedad foliar prolongada aumenta el riesgo de mancha de alquitran."
        )

    if por_patogeno.get("roya_sur_maiz", {}).get("cultivos_hospedantes_en_rotacion"):
        notas.append("Roya del sur: llega por viento cada anio; ninguna rotacion cambia este riesgo.")

    return notas


def comparar_rotaciones(
    resultados_clima: dict,
    reglas: dict | None = None,
    rotaciones_cfg: dict | None = None,
    cultivos_cfg: dict | None = None,
    balance_hidrico: dict | None = None,
    labranza: str = "siembra_directa",
    riego: bool = False,
    actual: str | None = None,
    vio: dict | None = None,
) -> dict:
    from .motor import cargar_reglas

    reglas_d = reglas or cargar_reglas()
    rots_d = rotaciones_cfg or cargar_rotaciones()
    cults_d = cultivos_cfg or cargar_cultivos()
    cultivos_info = cults_d["cultivos"]
    patogenos = reglas_d["patogenos"]

    actual_clave = actual if (actual and actual in rots_d["rotaciones"]) else rots_d.get("actual", "maiz_continuo")
    cultivo_hoy = rots_d["rotaciones"][actual_clave]["secuencia"][0]

    salida_rots = {}
    for rot_clave, rot_info in rots_d["rotaciones"].items():
        sec = rot_info["secuencia"]
        por_pat = {}
        resumen = {
            "baja": 0,
            "media": 0,
            "alta": 0,
            "no_evaluable": 0,
            "no_depende_de_la_rotacion": 0,
            "nulo_en_el_lote": 0,
        }

        for pat_clave, regla in patogenos.items():
            ev = evaluar_patogeno_en_rotacion(regla, sec, labranza=labranza)
            clima_pat = resultados_clima.get(pat_clave)
            if clima_pat and clima_pat.get("clima_evaluado"):
                clima_nivel = clima_pat["nivel"]
            else:
                clima_nivel = "no_evaluado"

            vio_val = (vio or {}).get(pat_clave)
            ajustes = (
                _ajustes(regla, clima_pat, cultivo_hoy, vio_val)
                if ev["presion_inoculo"] in NIVELES_ORDEN
                else []
            )
            riesgo = _nivel_final(ev["presion_inoculo"], ajustes)

            ev["clima_nivel"] = clima_nivel
            ev["ajustes"] = ajustes
            ev["riesgo"] = riesgo
            resumen[riesgo] = resumen.get(riesgo, 0) + 1
            por_pat[pat_clave] = ev

        n = len(sec)
        leg_count = sum(1 for c in sec if cultivos_info[c]["leguminosa"])
        inv_count = sum(1 for c in sec if cultivos_info[c]["cobertura_invernal"])
        dem_media = round(sum(float(cultivos_info[c]["demanda_hidrica"]) for c in sec) / n, 2)
        res_medio = round(sum(float(cultivos_info[c]["aporte_residuo"]) for c in sec) / n, 2)

        rasgos = {
            "tiene_leguminosa": leg_count > 0,
            "proporcion_leguminosa": round(leg_count / n, 2),
            "demanda_hidrica_media": dem_media,
            "aporte_residuo_medio": res_medio,
            "fraccion_inviernos_cubiertos": round(inv_count / n, 2),
            "tipo": "supuesto",
        }
        suelo = {
            "anios": n,
            "anios_con_leguminosa": leg_count,
            "inviernos_cubiertos": inv_count,
        }

        agua_rot = None
        if balance_hidrico is not None:
            por_c = balance_hidrico["por_cultivo"]
            dias_por_c = {c: por_c[c]["dias_estres_media"] for c in dict.fromkeys(sec)}
            media_rot = round(sum(por_c[c]["dias_estres_media"] for c in sec) / n, 1)
            agua_rot = {
                "dias_estres_media": media_rot,
                "dias_estres_medio_anual": media_rot,
                "por_cultivo": dias_por_c,
                "textura": balance_hidrico["textura"]["clave"],
            }

        salida_rots[rot_clave] = {
            "nombre": rot_info["nombre"],
            "secuencia": sec,
            "es_actual": rot_clave == actual_clave,
            "nota": rot_info.get("nota"),
            "problemas": por_pat,
            "por_patogeno": por_pat,
            "resumen_riesgo": resumen,
            "rasgos": rasgos,
            "suelo": suelo,
            "agua": agua_rot,
            "trade_offs": _construir_trade_offs(sec, por_pat, labranza, riego),
        }

    return {
        "actual": actual_clave,
        "contexto_campo": {"labranza": labranza, "riego": bool(riego)},
        "rotaciones": salida_rots,
    }
