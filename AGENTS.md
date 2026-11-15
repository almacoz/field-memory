# AGENTS.md — guía para agentes (y personas) que trabajan en este repo

Leé esto completo antes de tocar código. Si algo de aquí contradice a `HANDOFF_*.md` o
`GEMINI_UX.md`, gana este archivo.

## 1. Qué es, en una frase

Webapp para agricultores del Medio Oeste de EE. UU.: con clima de **NASA POWER** (2001–hoy
horario, 1981–hoy diario) y reglas de extensión agrícola, compara cómo cada rotación de cultivos
cambia los hongos/plagas que quedan en el lote y el agua disponible. **Compara; no recomienda.**

Entrega: NASA Space Apps Challenge 2026 (14–15 nov). Proyecto y demo deben entregarse en inglés.

## 2. Mapa del repo

```
rotaciones/            # backend Python (FastAPI)
  power.py             # cliente NASA POWER + caché en cache/ (h_*.json horario, d_*.json diario)
  motor.py             # días favorables por clima, ventana susceptible, tendencia Theil-Sen
  comparador.py        # presión de inóculo por rotación, ajustes ±1, nivel final, para_actual()
  agua.py              # balance hídrico FAO-56 (Hargreaves), días con sed por cultivo
  ssurgo.py            # suelo USDA (SDA): consultar() en un punto, mapa() polígonos 2x2 km; caché cache/ssurgo_*.json
  vista.py             # construye el contrato `vista` que pinta la web (es/en)
  cli.py               # ejecutar() = motor + agua + comparador; main() por consola
  api.py               # /api/evaluar, /api/suelo, /api/suelo/mapa, /api/reglas, /, /{x}.json, /img/
data/
  reglas.json          # 5 problemas; cada valor con fuente (URL) o marcado como supuesto
  rotaciones.json      # rotaciones; `solo_como_actual` = no se ofrece como alternativa
  cultivos.json        # rasgos y Kc — MAYORMENTE SUPUESTOS (dicho en _meta)
  suelos.json          # agua útil por textura (NC State Extension)
  textos.json          # TODO texto que genera el servidor, en `etiquetas.es` / `etiquetas.en`
  fotos.json           # foto por problema: archivo, autor, licencia, url, verificado
web/
  index.html           # HTML + CSS de la UI (con CSP en <meta>); sin build ni dependencias
  app.js               # toda la lógica de la UI (antes iba dentro del HTML; separado por la CSP)
  ejemplo_es.json / ejemplo_en.json   # respuesta sintética de respaldo sin red
  img/                 # fotos con licencia, cultivos IA en WebP (con marca de agua), marca/ (logo, iconos)
  favicon.ico, manifest.json
tests/test_motor.py    # 46 pruebas con series sintéticas (no necesitan red)
tools/generar_ejemplo.py
cache/                 # datos descargados; solo ssurgo_*.json se versiona
```

## 3. Cómo correr y verificar

```bash
source .venv/bin/activate              # o: python3 -m venv .venv && pip install -r requirements-dev.txt
python -m pytest -q                    # debe dar 46 passed (o más, si agregaste)
uvicorn rotaciones.api:app --reload --host 127.0.0.1 --port 8000
```

Al terminar un cambio, como mínimo:
1. `python -m pytest -q` en verde.
2. Si tocaste la web: `node --check web/app.js` **y**
   abrir la página y recorrer Inicio → 1 → 2 → 3 → 4 en español y con `?idioma=en`.
3. Si cambiaste el contrato `vista` o textos: `PYTHONPATH=. python tools/generar_ejemplo.py`.
4. Anotar el cambio en `CHANGELOG.md` (fecha, qué y por qué; sin repetir el código).

## 4. Flujo de datos

`GET /api/evaluar?lat&lon&actual&textura&labranza&idioma&vio`
→ `power.horario/diario` (caché) → `cli.ejecutar` (motor → agua → `comparador.comparar_rotaciones`)
→ `vista.construir_vista` → JSON `{..., "vista": {...}}`. La web solo pinta `vista`.

Nivel por problema y rotación (uno solo, repetido en tarjeta, líneas y tabla):
base = presión de inóculo por brecha sin hospedante vs. rotación mínima/persistencia;
± 1 por clima del año (tercio alto/bajo del propio sitio, **supuesto declarado**);
± 1 por lo que el agricultor vio (`vio`). Especiales: `nulo_en_el_lote`,
`no_depende_de_la_rotacion` (llega por viento), `no_evaluable`.

## 5. Contrato `vista` (claves principales)

```
idioma, sitio, datos_sinteticos, anio_datos, ia_nota, actual, rotaciones_disponibles[{clave,nombre}]
catalogo[{clave,nombre,foto,donde_pasa_el_invierno,que_lo_frena,cultivos[]}]   # los 5 problemas, siembre lo que siembre
cabecera, nasa{titulo,texto,detalle,provisional,fuente}, textos{...}
destacado{problema|null, nivel|null, titulo, texto, que_lo_frena, cultivo{nombre,img},
          cultivo_texto, agua, reducen[{clave,nombre}], texto_reducen}
lote_hoy{agua{texto_tanque, texto_estado, texto_anio, texto_metodo, texto_rango, rango_dias[a,b], serie,
               fraccion_llena, textura{nombre_mostrar}, limites[]},
         tarjetas[{clave,nombre,nivel{clave,etiqueta,simbolo},por_que[],donde_pasa_el_invierno,
                   este_anio_dato, que_lo_frena, foto{src|null,alt,url,credito}, fuentes[], supuestos[], lagunas[],
                   calculo{base, pasos[{titulo,texto,origen}], final, titulos} | null}]}
matriz{columnas[{clave,titulo}], filas[{clave, celdas[{nivel}], agua_dias, suelo, secuencia}]}
opciones[{clave,nombre,secuencia,es_actual,lineas[],lo_bueno,el_costo,tecnico,
          orden{sanidad,agua,suelo}, criterios{sanidad,agua,suelo}}]
```
`destacado.problema == null` significa "no hay reglas para este cultivo" (p. ej. trigo continuo):
la UI no inventa un diagnóstico. Si agregás claves, agregá prueba y regenerá los ejemplos.

## 6. Web (`web/index.html` + `web/app.js`)

- Estado global `S` (`idioma, paso 0–4, vista, form, vio, orden, elegida, demo…`); `render()` repinta todo.
- Pantallas: `pInicio`, `pLote`, `pDiag`, `pElegir` (+ `detalleRotacion`), `pResumen`.
- Panel lateral: `abrirLateral(titulo, ...nodos)`; usos: `abrirProblema`, `abrirAgua`,
  `abrirGuiaSuelo`, `abrirComo`, `abrirMenu`.
- Textos de la interfaz (botones, títulos) en el objeto `UI.es` / `UI.en` de `app.js`.
- CSP sin `'unsafe-inline'` en scripts: nada de `<script>` dentro del HTML ni `onclick="…"`; los eventos con
  `addEventListener` (o `on…` en `el()`). Si cambiás la política, cambiala igual en el `<meta>` y en `vercel.json`.
  Textos que dependen de los datos vienen del servidor (`data/textos.json`). **Siempre los dos idiomas.**
- Demo guiada: arreglo `DEMO`, `?demo=1`. Crear DOM con `el(tag, attrs, ...hijos)`; nunca `innerHTML`
  con datos (salvo SVG fijos).
- Estilo: neutros + un acento verde (`--acento`), sin degradados, un solo bloque `<style>`.
  Mínimo 44 px por botón, contraste 4.5:1, nada que dependa solo del color (usar símbolos ▲ ● ▼ ? →).

## 7. Reglas que no se negocian

1. **No inventar números ni umbrales.** Todo valor en `data/*.json` lleva fuente (URL) o
   se marca supuesto. Si no hay fuente, se dice en pantalla.
2. **No presentar niveles como probabilidad** ni dar "la" recomendación. Se comparan opciones.
3. **Sin LLM en el producto.** Los textos salen de plantillas + datos.
4. **Imágenes**: fotos solo con licencia verificada y crédito en `data/fotos.json` + `CREDITS.md`.
   Imágenes generadas con IA solo con marca de agua visible y rótulo en pantalla (regla del hackathon).
   No usar fotos de personas reales ni material con derechos (portadas, logos, personajes).
5. **Voz**: español de "usted", frases cortas, sin jerga; el inglés es traducción equivalente.
6. **No reabrir decisiones cerradas** sin motivo nuevo: ver "Decisiones tomadas" en `README.md`.
7. Todo dato en pantalla lleva su origen visible (NASA POWER, USDA SSURGO, regla con fuente, lo que vio el
   agricultor, supuesto). El agua es una estimación con rango, no una medición.
8. Datos del agricultor no salen del navegador salvo coordenadas hacia NASA POWER y USDA SDA.

## 8. Tareas comunes

- **Nueva rotación**: entrada en `data/rotaciones.json` (con `agricultor.es/en`) + clave en `ROTS`
  de `index.html`. Si es monocultivo, `solo_como_actual: true`.
- **Nuevo problema**: regla con fuentes en `reglas.json`, textos en `textos.json > problemas`,
  foto opcional en `fotos.json`; pruebas de nivel coherente.
- **Nuevo texto de UI**: `UI.es` y `UI.en`. Nuevo texto del servidor: `textos.json` en ambos idiomas.
- **Nuevo sitio de demo**: `SITIOS` en `index.html`, precargar POWER (`python -m rotaciones.cli`)
  y SSURGO (`python -m rotaciones.ssurgo LAT LON`).

## 9. Trampas conocidas

- POWER: el año en curso es provisional (MERRA-2/GEOS-IT) y con 2–3 días de retraso; no entra en tendencias.
- La primera consulta de un sitio nuevo baja ~26 años horarios: tarda minutos.
- SSURGO: la textura está en `chtexture` (vía `chtexturegrp`), **no** en `chorizon`.
- Los sitios de demo son **puntos de referencia**, no el lote del agricultor: todo texto debe decirlo
  ("en el punto de referencia…"), nunca "el suelo de su lote". El mapa de 2 × 2 km deja que la
  persona toque dónde está su lote; eso cambia solo el suelo, no el clima (celda POWER ~50 km).
- El punto de "Centro de Iowa" (42.03, −93.63) cae en Ames, junto a un cauce: hay zona urbana y agua en el cuadro.
- Las pruebas que tocan cachés deben redirigir `CACHE` a `tmp_path` (si no, ensucian la demo).
- Sin red, la web usa los ejemplos sintéticos y muestra un aviso: no quitar ese aviso.
- Si trabajás desde un entorno con la carpeta montada sin permiso de borrado, `git` puede dejar
  `.git/*.lock`; hacé los commits desde la máquina del dueño.

## 10. Caché de APIs externas

| Fuente | Qué se guarda | Cuánto dura |
|---|---|---|
| NASA POWER, años cerrados | `cache/h_*.json.gz` (horario por año, gzip) | Para siempre (no cambian) |
| NASA POWER, año en curso | `..._AAAAMMDD.json.gz` (fecha de corte) | Se vuelve a pedir si tiene > `ROTACIONES_DIAS_FRESCO` días (3); si POWER falla, se usa el último |
| USDA SSURGO (punto y mapa) | `cache/ssurgo_*` | Para siempre (el USDA actualiza SSURGO una vez al año) |
| Cálculo completo | memoria (`api._evaluar_cache`), clave incluye el día | Hasta el día siguiente o reinicio |
| Respuesta HTTP | CDN de Vercel (`s-maxage`) | 6 h `/api/evaluar`; 7 días suelos |

En Vercel, lo nuevo se escribe en `/tmp` (efímero, por instancia).

## 11. Despliegue (Vercel)

`app.py` reexporta `rotaciones.api:app`. Cabeceras en `vercel.json`. No agregar middleware de nivel
superior en FastAPI: haría que Vercel deje de servir `/img` desde la CDN. El disco del proyecto es de solo
lectura: toda escritura nueva va a `/tmp` (ver `power._guardar`, `ssurgo._escribir_cache`). Las cachés en
memoria (`api._series`, `api._evaluar_cache`) se limpian en los tests con `.cache_clear()`.

## 12. Seguridad

Ver `SECURITY.md`. Resumen: servidor pensado para correr en local (`127.0.0.1`), sin autenticación,
sin secretos. No exponer a internet sin las medidas de esa guía. Nunca commitear `.env`.
