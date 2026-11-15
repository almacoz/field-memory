"""Construcción del objeto 'vista' en lenguaje de campo (es / en) para la interfaz web.

La interfaz no calcula ni redacta: pinta este objeto. Un problema tiene UN solo nivel por
rotación (comparador.riesgo), y es el mismo en tarjetas, líneas de cada opción y tabla.
"""

import json
from pathlib import Path

_RAIZ = Path(__file__).resolve().parent.parent
_PIE_FOTO = {"es": "Foto: {autor} · {lic}", "en": "Photo: {autor} · {lic}"}


def _foto(clave: str, idioma: str) -> dict | None:
    """Referencia visual: miniatura local si está disponible y enlace/licencia siempre."""
    try:
        cfg = json.loads((_RAIZ / "data" / "fotos.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    f = cfg.get(clave)
    if not f:
        return None
    lic = f["licencia"][idioma] if isinstance(f["licencia"], dict) else f["licencia"]
    local = (_RAIZ / cfg["_meta"]["carpeta"] / f["archivo"]).is_file()
    return {"src": f"img/{f['archivo']}" if local else None,
            "alt": f["alt"][idioma], "url": f["url"],
            "credito": ((f["pie"][idioma] + " · ") if f.get("pie") else "")
            + _PIE_FOTO[idioma].format(autor=f["autor"], lic=lic)}


def _cultivo(clave: str, idioma: str, cultivos_cfg: dict) -> dict:
    """Nombre del cultivo y su ilustración (solo si el archivo existe en web/img/cultivos/)."""
    c = cultivos_cfg["cultivos"][clave]
    carpeta = _RAIZ / "web" / "img" / "cultivos"
    # WebP pesa ~5 veces menos que el PNG original (misma imagen y misma marca de agua).
    ext = next((e for e in ("webp", "png") if (carpeta / f"{clave}.{e}").is_file()), None)
    nombre = c["nombre_en"].capitalize() if idioma == "en" else c["nombre"]
    return {"clave": clave, "nombre": nombre, "img": f"img/cultivos/{clave}.{ext}" if ext else None}


PESO_RIESGO = {"nulo_en_el_lote": 0, "baja": 1, "media": 2, "alta": 3}


def _reducen(problema: str, resultado: dict, rotaciones_cfg: dict, actual: str, idioma: str) -> list[dict]:
    """Rotaciones que dejan este problema en un nivel más bajo que lo que se hace hoy
    (solo las de nivel mínimo). Sale del mismo cálculo que la tabla: no es una recomendación."""
    rots = resultado["rotaciones"]
    hoy = PESO_RIESGO.get(rots[actual]["problemas"][problema]["riesgo"])
    if hoy is None:
        return []
    cand = {k: PESO_RIESGO[r["problemas"][problema]["riesgo"]] for k, r in rots.items()
            if k != actual and r["problemas"][problema]["riesgo"] in PESO_RIESGO}
    cand = {k: v for k, v in cand.items() if v < hoy}
    if not cand:
        return []
    minimo = min(cand.values())
    return [{"clave": k, "nombre": rotaciones_cfg["rotaciones"][k]["agricultor"][idioma]["nombre"]}
            for k in rotaciones_cfg["rotaciones"] if cand.get(k) == minimo]


def _destacado(tarjetas: list[dict], agua: dict | None, cultivo: dict, etq: dict) -> dict | None:
    """Frase principal de la pantalla, derivada de los datos (nunca redactada a mano).
    Se elige el problema de mayor nivel; entre iguales, el que tiene dato de clima."""
    if not tarjetas:
        # Cultivo sin reglas sanitarias cargadas (p. ej. trigo continuo): se dice tal cual.
        return {
            "problema": None, "nivel": None,
            "titulo": etq["dest_sin_reglas"].format(cultivo=cultivo["nombre"].lower()),
            "texto": etq["dest_sin_reglas_texto"], "que_lo_frena": None,
            "cultivo": cultivo,
            "cultivo_texto": etq["dest_cultivo"].format(cultivo=cultivo["nombre"].lower()),
            "agua": ({"texto": agua["texto_tanque"], "estado": agua["texto_estado"],
                      "fraccion_llena": agua["fraccion_llena"]} if agua else None),
        }
    mejor = tarjetas[0]["nivel"]["clave"]
    del_nivel = [c for c in tarjetas if c["nivel"]["clave"] == mejor]
    p = next((c for c in del_nivel if c["este_anio_dato"]), del_nivel[0])
    d = p["este_anio_dato"]
    if d and d["dias"] > 0 and d["anios_peores"] == 0:
        titulo = etq["dest_peor"].format(p=p["nombre"], anio=d["anio"], n=d["anios_medidos"])
    elif d and d["dias"] > 0 and d["anios_peores"] <= d["anios_medidos"] // 3:
        titulo = etq["dest_alto"].format(p=p["nombre"], anio=d["anio"], n=d["anios_medidos"])
    else:
        titulo = etq["dest_pesa"].format(p=p["nombre"])
    return {
        "problema": p["clave"],
        "nivel": p["nivel"],
        "titulo": titulo,
        "texto": " ".join(p["por_que"]),
        "que_lo_frena": p["que_lo_frena"],
        "cultivo": cultivo,
        "cultivo_texto": etq["dest_cultivo"].format(cultivo=cultivo["nombre"].lower()),
        "agua": ({"texto": agua["texto_tanque"], "estado": agua["texto_estado"],
                  "fraccion_llena": agua["fraccion_llena"]} if agua else None),
    }


SIMBOLOS = {
    "alta": "▲",
    "media": "●",
    "baja": "▼",
    "no_evaluable": "?",
    "no_depende_de_la_rotacion": "→",
    "sin_hospedante": "–",
}

ORDEN_TARJETAS = {"alta": 0, "media": 1, "no_evaluable": 2, "no_depende_de_la_rotacion": 3, "baja": 4}
PESO_SANIDAD = {"alta": 3, "media": 2, "no_evaluable": 2, "baja": 1}
NIVELES = ("alta", "media", "baja")


def _parsear_vio(vio: str | dict | None) -> dict[str, bool]:
    """'gusano_raiz_maiz:si,moho_blanco_soya:no' -> {clave: True|False}."""
    if not vio:
        return {}
    if isinstance(vio, dict):
        return {k: (v is True or v == "si") for k, v in vio.items() if v in (True, False, "si", "no")}
    res = {}
    for par in str(vio).split(","):
        if ":" in par:
            k, v = (x.strip() for x in par.split(":", 1))
            if v in ("si", "no"):
                res[k] = v == "si"
    return res


def _extraer_fuentes_y_supuestos(regla: dict) -> tuple[list[str], list[str]]:
    fuentes, supuestos = [], []

    def revisar(campo_obj, nombre_supuesto: str):
        if not isinstance(campo_obj, dict):
            return
        if campo_obj.get("tipo") == "citado" and campo_obj.get("fuente"):
            if campo_obj["fuente"] not in fuentes:
                fuentes.append(campo_obj["fuente"])
        elif campo_obj.get("tipo") == "supuesto" and nombre_supuesto not in supuestos:
            supuestos.append(nombre_supuesto)

    revisar(regla.get("medio_supervivencia"), "medio de supervivencia")
    revisar(regla.get("persistencia_inoculo_anios"), "persistencia del inoculo")
    revisar(regla.get("rotacion_min_anios"), "rotacion minima")
    revisar(regla.get("eficacia_rotacion"), "eficacia de rotacion")
    if regla.get("ventana"):
        revisar(regla["ventana"], "ventana susceptible")
    if regla.get("clima"):
        revisar(regla["clima"].get("temp"), "rango termico")
        revisar(regla["clima"].get("horas_mojado_min"), "horas de mojado")
    return sorted(fuentes), supuestos


def _nivel_obj(clave: str, etq: dict) -> dict:
    return {"clave": clave, "etiqueta": etq[clave], "simbolo": SIMBOLOS[clave]}


def _miles(n: int, idioma: str) -> str:
    s = f"{n:,}"
    return s if idioma == "en" else s.replace(",", ".")


def _textos_ajuste(ajustes: list[dict], etq: dict) -> list[str]:
    claves = {("clima", 1): "aj_clima_mas", ("clima", -1): "aj_clima_menos",
              ("observacion", 1): "aj_vio_si", ("observacion", -1): "aj_vio_no"}
    return [etq[claves[(a["origen"], a["delta"])]] for a in ajustes]


def _calculo(p: dict, etq: dict) -> dict | None:
    """Desglose del nivel: base por la rotación y ajustes de ±1 (clima del sitio, lo que vio)."""
    base = p.get("presion_inoculo")
    if base not in NIVELES:
        return None
    sin_clima = p.get("clima_nivel") in (None, "no_evaluado")
    pasos = {"clima": etq["calc_clima_sin_regla"] if sin_clima else etq["calc_clima_no"],
             "observacion": etq["calc_no_vio"]}
    nivel = NIVELES.index(base)  # NIVELES = ("alta", "media", "baja"): índice menor = más alto
    for a in p.get("ajustes", []):
        nuevo = min(max(nivel - a["delta"], 0), len(NIVELES) - 1)
        txt = etq["calc_sube"] if a["delta"] > 0 else etq["calc_baja"]
        if nuevo == nivel:
            txt += " " + (etq["calc_tope_max"] if a["delta"] > 0 else etq["calc_tope_min"])
        nivel = nuevo
        pasos[a["origen"]] = txt
    respondio = any(a["origen"] == "observacion" for a in p.get("ajustes", []))
    return {
        "base": _nivel_obj(base, etq),
        # "Lo que usted vio" solo aparece si respondió; si no, la interfaz invita a responder.
        "pasos": [{"titulo": etq["calc_clima"], "texto": pasos["clima"], "origen": "clima"}]
                 + ([{"titulo": etq["calc_vio"], "texto": pasos["observacion"], "origen": "observacion"}]
                    if respondio else []),
        "final": _nivel_obj(p["riesgo"], etq),
        "titulos": {"base": etq["calc_base"], "final": etq["calc_final"]},
    }


def _mayus(frases: list[str]) -> list[str]:
    return [f[:1].upper() + f[1:] for f in frases]


def _texto_base_rotacion(presion: str, regla: dict, brecha: int | None, etq: dict) -> str:
    """Frase que explica la presión que deja la rotación, antes de cualquier ajuste."""
    if presion == "no_evaluable":
        return etq["linea_no_evaluable"]
    if presion == "alta":
        medio = regla["medio_supervivencia"]["clave"]
        if medio == "residuo_superficie":
            return etq["linea_alta_residuo"]
        if medio == "suelo_un_cultivo":
            return etq["linea_alta_suelo_un_cultivo"]
        return etq["linea_alta_suelo_anios"]
    if presion == "media":
        n = regla["persistencia_inoculo_anios"]["max"]
        return etq["linea_media"].format(pers=etq["pers_1"] if n == 1 else etq["pers_n"].format(n=n))
    b = brecha or 0
    return etq["linea_baja_1" if b == 1 else "linea_baja_n"].format(b=b)


def _este_anio(c_pat: dict, etq: dict, anio_provisional: int | None) -> tuple[str, dict | None, str | None]:
    if not c_pat.get("clima_evaluado"):
        return etq["este_anio_sin"], None, None
    serie = c_pat["por_umbral_hr"][c_pat["umbral_referencia"]]["dias_favorables_por_anio"]
    anios = sorted(serie)
    if not anios:
        return etq["este_anio_sin"], None, None
    ult, n = anios[-1], len(anios)
    d = serie[ult]
    peores = sum(1 for v in serie.values() if v > d)
    if d == 0:
        txt = etq["este_anio_cero"].format(anio=ult)
    elif peores == 0:
        txt = etq["este_anio_peor"].format(d=d, anio=ult, n=n)
    else:
        txt = etq["este_anio_con"].format(d=d, anio=ult, n=n, k=peores)
    if ult == anio_provisional:
        txt += etq["provisional"]
    tend = c_pat.get("tendencia") or {}
    tend_txt = None
    if tend.get("evaluable"):
        clave = {"sube": "tend_sube", "baja": "tend_baja"}.get(tend["clave"], "tend_sin")
        tend_txt = etq[clave].format(n=tend["anios"])
    dato = {"anio": ult, "dias": d, "anios_medidos": n, "anios_peores": peores,
            "serie": {str(a): int(serie[a]) for a in anios},
            "tendencia": tend.get("clave") if tend.get("evaluable") else None}
    return txt, dato, tend_txt


def _suelo_texto(suelo: dict, etq: dict) -> str:
    leg = etq["s_leg"] if suelo["anios_con_leguminosa"] else etq["s_noleg"]
    cub = (etq["s_cub"].format(a=suelo["inviernos_cubiertos"], b=suelo["anios"])
           if suelo["inviernos_cubiertos"] else etq["s_nocub"])
    return f"{leg}; {cub}"


def construir_vista(
    resultado: dict,
    reglas_cfg: dict,
    rotaciones_cfg: dict,
    cultivos_cfg: dict,
    textos_cfg: dict,
    idioma: str = "es",
    vio: str | dict | None = None,
    sintetico: bool = False,
    provisional: bool = False,
) -> dict:
    idioma = "en" if idioma == "en" else "es"
    en = idioma == "en"
    etq = textos_cfg["etiquetas"][idioma]
    prob_txt = textos_cfg["problemas"]
    kn, kc = ("name", "short") if en else ("nombre", "corto")

    reglas_pat = reglas_cfg["patogenos"]
    actual = resultado.get("actual") or rotaciones_cfg["actual"]
    rot_actual = resultado["rotaciones"][actual]
    clima_res = resultado["clima"]
    agua_res = resultado.get("agua")
    datos = resultado.get("datos") or {}
    anio_prov = datos.get("anio_provisional")

    # 1. Agua
    agua_vista = None
    if agua_res:
        tex = dict(agua_res["textura"])
        tex["nombre_mostrar"] = tex["nombre_en"].capitalize() if en else tex["nombre"]
        c_actual = rot_actual["secuencia"][0]
        dc = agua_res["por_cultivo"][c_actual]
        nombre_c = (cultivos_cfg["cultivos"][c_actual]["nombre_en"] if en
                    else cultivos_cfg["cultivos"][c_actual]["nombre"].lower())
        deficit, cap = dc["deficit_final_mm"], dc["capacidad_mm"]
        agua_vista = {
            "deficit_mm": deficit,
            "capacidad_mm": cap,
            "fraccion_llena": dc["fraccion_llena_final"],
            "texto_tanque": etq["agua_tanque"].format(hay=cap - deficit, cap=cap),
            "texto_estado": (etq["agua_estado_lleno"].format(fecha=agua_res["fecha_fin"]) if deficit == 0
                             else etq["agua_estado"].format(mm=deficit, fecha=agua_res["fecha_fin"])),
            "texto_anio": etq["agua_anio"].format(anio=dc["ultimo_anio"], d=dc["dias_estres_ultimo_anio"],
                                                  cultivo=nombre_c, m=round(dc["dias_estres_media"])),
            "serie": {str(a): v for a, v in dc["dias_estres_por_anio"].items()},
            "anio": dc["ultimo_anio"],
            "textura": tex,
            "limites": etq["agua_limites"],
            "texto_metodo": etq["agua_metodo"],
        }
        sens = agua_res.get("sensibilidad")
        if sens and c_actual in sens.get("min", {}):
            lo, hi = sens["awc_mm_m"]
            d_lo, d_hi = sens["max"][c_actual]["dias_estres_ultimo_anio"], sens["min"][c_actual]["dias_estres_ultimo_anio"]
            agua_vista["rango_dias"] = [min(d_lo, d_hi), max(d_lo, d_hi)]
            agua_vista["texto_rango"] = etq["agua_rango"].format(
                lo=lo, hi=hi, tex=tex["nombre_mostrar"].lower(), anio=dc["ultimo_anio"],
                a=min(d_lo, d_hi), b=max(d_lo, d_hi))

    # 2. Tarjetas: problemas de lo que se siembra hoy
    tarjetas = []
    for pat_clave, p in rot_actual["problemas"].items():
        if p["riesgo"] == "nulo_en_el_lote":
            continue
        regla = reglas_pat[pat_clave]
        tp = prob_txt[pat_clave][idioma]
        este_txt, este_dato, tend_txt = _este_anio(clima_res[pat_clave], etq, anio_prov)
        fuentes, supuestos = _extraer_fuentes_y_supuestos(regla)
        if any(a["origen"] == "clima" for a in p.get("ajustes", [])):
            supuestos.append(etq["sup_clima"])
        tarjetas.append({
            "clave": pat_clave,
            "nombre": tp[kn],
            "nombre_corto": tp[kc],
            "nivel": _nivel_obj(p["riesgo"], etq),
            "foto": _foto(pat_clave, idioma),
            "donde_pasa_el_invierno": tp["winter" if en else "invierno"],
            "este_anio": este_txt,
            "este_anio_dato": este_dato,
            "tendencia": tend_txt,
            "que_lo_frena": tp["stops" if en else "frena"],
            "por_que": _mayus(
                ([_texto_base_rotacion(p["presion_inoculo"], regla, p["brecha_sin_hospedante"], etq)]
                 if p["presion_inoculo"] in NIVELES + ("no_evaluable",) else [])
                + _textos_ajuste(p.get("ajustes", []), etq)),
            "calculo": _calculo(p, etq),
            "pregunta": tp["question" if en else "pregunta"],
            "tecnico": tp["advisor" if en else "tecnico"],
            "fuentes": fuentes,
            "supuestos": supuestos,
            "lagunas": regla["lagunas"],
        })
    tarjetas.sort(key=lambda c: ORDEN_TARJETAS.get(c["nivel"]["clave"], 99))

    # 3. Opciones y tabla resumen
    tx_linea = ""
    if agua_res:
        tx_linea = agua_res["textura"]["nombre_en"] if en else agua_res["textura"]["nombre"].lower()
    columnas = [k for k in reglas_pat
                if any(r["problemas"][k]["riesgo"] not in ("nulo_en_el_lote", "no_depende_de_la_rotacion")
                       for r in resultado["rotaciones"].values())]
    opciones, filas = [], []
    for rot_clave, rot_info in rotaciones_cfg["rotaciones"].items():
        r = resultado["rotaciones"][rot_clave]
        ag = rot_info["agricultor"][idioma]
        lineas, puntaje, celdas = [], 0, []
        cuenta = {"alta": 0, "media": 0}
        for pat_clave in columnas:
            p = r["problemas"][pat_clave]
            if p["riesgo"] == "nulo_en_el_lote":
                celdas.append({"problema": pat_clave, "nivel": _nivel_obj("sin_hospedante", etq)})
                continue
            regla = reglas_pat[pat_clave]
            nivel = _nivel_obj(p["riesgo"], etq)
            puntaje += PESO_SANIDAD.get(p["riesgo"], 0)
            if p["riesgo"] in ("alta", "media"):
                cuenta[p["riesgo"]] += 1
            partes = [_texto_base_rotacion(p["presion_inoculo"], regla, p["brecha_sin_hospedante"], etq)]
            partes += _textos_ajuste(p.get("ajustes", []), etq)
            lineas.append({"problema": pat_clave, "titulo": prob_txt[pat_clave][idioma][kn],
                           "nivel": nivel, "texto": " ".join(partes)})
            celdas.append({"problema": pat_clave, "nivel": nivel})

        dias_agua = round(r["agua"]["dias_estres_media"]) if r.get("agua") else None
        if dias_agua is not None:
            lineas.append({"problema": None, "titulo": etq["agua"], "nivel": None,
                           "texto": etq["agua_linea"].format(d=dias_agua, tx=tx_linea)})
        suelo_txt = _suelo_texto(r["suelo"], etq)
        lineas.append({"problema": None, "titulo": etq["m_suelo"], "nivel": None,
                       "texto": suelo_txt[0].upper() + suelo_txt[1:] + "."})
        secuencia = [_cultivo(c, idioma, cultivos_cfg) for c in rot_info["secuencia"]]
        opciones.append({
            "clave": rot_clave,
            "nombre": ag["nombre"],
            "secuencia": secuencia,
            "es_actual": bool(r["es_actual"]),
            "lineas": lineas,
            "lo_bueno": ag["lo_bueno"],
            "el_costo": ag["el_costo"],
            "tecnico": ag["tecnico"],
            "trade_offs_tecnicos": r["trade_offs"],
            # Cada orden usa UN dato visible en la tarjeta (criterios); no hay puntaje total.
            # Sanidad: menos problemas en atención alta; a igualdad, menos en media.
            "orden": {"sanidad": cuenta["alta"] * 100 + cuenta["media"],
                      "agua": dias_agua or 0,
                      # Suelo (cualitativo): más inviernos cubiertos, luego más años con leguminosa.
                      "suelo": -(round(100 * r["suelo"]["inviernos_cubiertos"] / r["suelo"]["anios"])
                                 + round(100 * r["suelo"]["anios_con_leguminosa"] / r["suelo"]["anios"]) / 1000)},
            "criterios": {
                "sanidad": etq["crit_sanidad"].format(a=cuenta["alta"], m=cuenta["media"]),
                "agua": etq["crit_agua"].format(d=dias_agua) if dias_agua is not None else None,
                "suelo": suelo_txt[0].upper() + suelo_txt[1:],
            },
        })
        filas.append({"clave": rot_clave, "nombre": ag["nombre"], "es_actual": bool(r["es_actual"]),
                      "secuencia": secuencia,
                      "celdas": celdas, "agua_dias": dias_agua, "suelo": suelo_txt})

    matriz = {
        "titulo_opcion": etq["m_opcion"],
        "columnas": [{"clave": k, "titulo": prob_txt[k][idioma][kc]} for k in columnas],
        "titulo_agua": etq["m_agua"] if agua_res else None,
        "titulo_suelo": etq["m_suelo"],
        "filas": filas,
    }

    cultivo_hoy = _cultivo(rotaciones_cfg["rotaciones"][actual]["secuencia"][0], idioma, cultivos_cfg)
    destacado = _destacado(tarjetas, agua_vista, cultivo_hoy, etq)
    if destacado and destacado["problema"]:
        reducen = _reducen(destacado["problema"], resultado, rotaciones_cfg, actual, idioma)
        destacado["reducen"] = reducen
        destacado["texto_reducen"] = (etq["dest_reducen"].format(lista="; ".join(r["nombre"] for r in reducen))
                                      if reducen else etq["dest_ninguna"])

    nasa = None
    if datos:
        nasa = {
            "titulo": etq["nasa_titulo"],
            "texto": etq["nasa_texto"],
            "detalle": etq["nasa_detalle"].format(
                horas=_miles(datos["horas"], idioma), h0=datos["horario_desde"], h1=datos["horario_hasta"],
                dias=_miles(datos["dias"], idioma), d0=datos["diario_desde"], d1=datos["diario_hasta"]),
            "provisional": etq["nasa_prov"].format(anio=anio_prov) if anio_prov else None,
            "fuente": datos["fuente"],
        }

    return {
        "idioma": idioma,
        "sitio": resultado.get("sitio", {}),
        "datos_sinteticos": bool(sintetico),
        "cabecera": {"pregunta": etq["cab_pregunta"], "sub": etq["cab_sub"]},
        "nasa": nasa,
        "destacado": destacado,
        "anio_datos": datos.get("horario_hasta"),
        "ia_nota": etq["ia_nota"],
        "actual": actual,
        "catalogo": [{
            "clave": k,
            "nombre": prob_txt[k][idioma][kn],
            "foto": _foto(k, idioma),
            "donde_pasa_el_invierno": prob_txt[k][idioma]["winter" if en else "invierno"],
            "que_lo_frena": prob_txt[k][idioma]["stops" if en else "frena"],
            "cultivos": [_cultivo(c, idioma, cultivos_cfg)["nombre"] for c in reglas_pat[k].get("hospedantes", [])
                         if c in cultivos_cfg["cultivos"]],
        } for k in reglas_pat],
        "rotaciones_disponibles": [{"clave": k, "nombre": v["agricultor"][idioma]["nombre"]}
                                   for k, v in rotaciones_cfg["rotaciones"].items()],
        "textos": {"aviso": etq["aviso"], "leyenda": etq["leyenda"], "celda": etq["celda"]},
        "lote_hoy": {"agua": agua_vista, "tarjetas": tarjetas},
        "matriz": matriz,
        "opciones": opciones,
    }
