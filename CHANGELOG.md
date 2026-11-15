# Historial de cambios

Del más antiguo al más reciente. Las secciones anteriores al 15-nov pueden describir cosas que
después cambiaron; la referencia vigente es `README.md` + `AGENTS.md`.

## 14-nov: primera corrida real (lista de revisión)

Son 25 peticiones horarias y una diaria (1981 en adelante); quedan en `cache/`. Si el parser
falla, ajustar `power.a_dataframe`. Si POWER rechaza un año por petición, partir por semestre.

Revisar tras la primera corrida real:
1. `anios_descartados_por_datos` vacío o casi.
2. Que los niveles climáticos no salgan todos iguales. Los cortes (10 % y 30 % de días
   favorables) son arbitrarios y se ajustan con datos reales.
3. Mancha de alquitrán con HR ≥ 75 % durante 7 h: probablemente se cumple casi todas las
   noches y solo discrimina la media térmica de 30 días. Si es así, declararlo.
4. Días de estrés hídrico: comparar un año seco conocido (2012 en el Medio Oeste) con el resto.
5. Validación: correr una coordenada del norte de Indiana o sur de Wisconsin y ver si 2018 y
   2021 destacan para mancha de alquitrán.

## Cambios del 14-nov (tarde): revisión como jurado y de UX

**Un solo nivel por problema y rotación.** Antes la tarjeta y las opciones podían contradecirse.
Ahora `comparador` calcula un nivel único (`riesgo`) y la vista lo repite en tarjeta, líneas y tabla:

1. Base: presión de inóculo que deja la rotación (reglas citadas).
2. Ajuste por clima, ±1 nivel: si este año hubo hospedante en el lote y sus días favorables
   quedaron en el tercio alto (o bajo) de la historia **del mismo sitio**. Es un **supuesto**
   declarado; reemplaza los cortes absolutos de 10 % y 30 %, que con datos reales no discriminaban.
3. Ajuste por lo que el agricultor vio, ±1 nivel.

Cada ajuste aparece escrito en la interfaz. `clima_nivel` sigue en la salida técnica pero ya
no decide el nivel.

**Datos reales verificados** (centro de Iowa, caché de NASA POWER 1981–2025): julio de 2012 sale
como el más caluroso y seco de la serie y 1988, 2012 y 2023 como los años con más días de
estrés hídrico para maíz, que coinciden con sequías conocidas. Mancha gris: 2025 es el peor de
25 años. Mancha de alquitrán: 2018 y 2021 no destacan en este sitio.

**Otros cambios**
- `power`: pide el año en curso (hasta hace 4 días), lo guarda por fecha de corte y, si falla,
  sigue con los años completos. El año en curso se marca provisional y no entra en tendencias.
- `motor`: tendencia por problema (Theil-Sen y Kendall).
- `api`: parámetro `actual` (qué siembra hoy); `vio` pasa al comparador.
- `vista`: nuevas claves `cabecera`, `nasa`, `actual`, `rotaciones_disponibles`, `matriz`;
  en tarjetas `por_que`, `tendencia`, `nombre_corto`; en agua `texto_tanque`, `serie`.
- `web`: pregunta como título, franja NASA, selector de lugar y de cultivo actual, dos pestañas
  (opciones primero), tabla resumen, tarjetas plegables, aviso visible al cambiar un nivel.
  `?pestana=lote` y `?idioma=en` en la URL.
- No se agregó mapa con imágenes satelitales: no se pudo verificar la capa de teselas desde
  el entorno de trabajo. Los sitios de ejemplo de Wisconsin, Indiana y Nebraska no se han
  consultado todavía: la primera consulta de cada uno tarda.

`pytest`: 34 pruebas.

## Fotos de referencia

`data/fotos.json` lista una foto por problema con autor, licencia y enlace. La tarjeta la
muestra solo si el archivo está en `web/img/` con el nombre indicado; sin archivo no cambia
nada. Licencias comprobadas en origen: moho blanco (CC BY 4.0) y mancha de alquitrán
(CC BY 4.0, figura de artículo). Sin comprobar todavía: mancha gris y gusano de la raíz
(Wikimedia Commons). La foto del gusano muestra el escarabajo adulto, no el daño en la raíz.
No usar imágenes generadas por IA sin marca de agua visible (regla del hackathon).

## Línea gráfica v2 (14-nov, noche)

Se adoptó el estilo visual de la propuesta de Gemini (fondo crema, tarjetas blancas con sombra
suave, tarjeta principal con degradado) **sin su contenido**: sus cifras, satélites (MODIS,
SMAP, ECOSTRESS) y estados ("cultivo saludable") no salen de este motor y no se usan.

- `vista.destacado`: frase principal calculada a partir de los datos (problema de mayor nivel;
  si su año fue el peor o del tercio más favorable, se dice). Nunca se redacta a mano.
- `opciones[].secuencia` y `matriz.filas[].secuencia`: cultivos de cada rotación con su ilustración.
- `web/img/cultivos/{maiz,soya,trigo}.png`: ilustraciones **generadas con IA (Gemini)**, con la
  marca visible «IA · AI» grabada en la imagen, como exige el reglamento. `vista.ia_nota` lo
  declara en el pie. En el formulario de envío hay que declararlo también.
- `api.py` ahora publica `/img/` (antes las imágenes y las fotos de referencia daban 404).


## Rediseño del 15-nov (madrugada)

- **Página reescrita** (`web/index.html`, ~840 líneas en vez de ~1.900): un solo bloque de CSS con
  la línea gráfica crema de Gemini, sin las capas que se pisaban.
- **Relato lineal en cuatro capítulos**, sin pestañas: Su lote → Lo que dejó el año → Qué rotación
  lo reduce → Cómo lo sabemos.
- **Tarjeta principal con puente a la decisión**: `vista.destacado.reducen` lista las rotaciones que
  dejan el problema principal en un nivel más bajo que lo que se hace hoy. Sale del mismo cálculo
  que la tabla; no es una recomendación.
- **Menú**: capítulos, idioma (sale del formulario) y fuentes.
- **Voz**: "usted" en todos los textos en español.
- **SSURGO**: se pedía la respuesta sin nombres de columna (`format=JSON`) y se leía la primera
  fila como encabezado, así que se perdía el resultado. Ahora `JSON+COLUMNNAME`, con prueba.

`pytest`: 38 pruebas.

## Orden de las opciones (15-nov, mañana)

En Iowa el orden por "Sanidad" y por "Agua" salía idéntico, así que el botón parecía roto.
Ahora cada prioridad ordena por **un dato visible** en la tarjeta, con su puesto (1º, 2º…):
- Sanidad: problemas en atención alta; a igualdad, en media (antes era un puntaje sumado oculto).
- Agua: días con sed por temporada.
- Suelo (cualitativo): inviernos con suelo cubierto, luego años con leguminosa.

Al cambiar de prioridad, las tarjetas que se movieron se resaltan y un mensaje dice cuál quedó
primera, o que el orden no cambió. `api.py` llamaba a `ssurgo.consultar_suelo`, que no existía:
se agregó. `pytest`: 40 pruebas.


## Webapp por pasos (15-nov, mediodía)

`web/index.html` reescrito como webapp de una sola página, sin scroll largo:
Inicio → 1 Su lote → 2 Diagnóstico → 3 Rotación → 4 Resumen. Barra de pasos arriba, Atrás/Siguiente
abajo, y el botón Atrás del navegador funciona.

- **Rotación como protagonista**: el paso 3 muestra las cuatro opciones a la izquierda (seleccionables,
  con su ciclo de cultivos) y a la derecha qué cambia frente a lo que se hace hoy, problema por
  problema, en agua y en suelo. La rotación elegida queda fija en la barra inferior.
- **Resumen** para el técnico: qué gana, qué paga, preguntas; se puede imprimir o guardar en PDF.
- **Detalle de cada problema, agua, "Cómo lo sabemos", fuentes, idioma**: en un panel lateral.
- **Demo guiada** ("Ver demo", o `?demo=1` en la URL para grabar): seis pasos con texto que sale
  de los datos, avance automático cada 8 s, pausa y salida.
- **Estilo**: blanco y grises neutros, un solo acento verde, sin degradados ni franjas de color.
- **Imágenes**: ilustraciones de maíz, soya, trigo y el ciclo de rotación entregadas por Alex,
  generadas con IA y con marca de agua "generated by AI" en la imagen; además se rotulan
  "Ilustración generada con IA" en pantalla.

## Cambios 15-nov (tarde)

- **Monocultivos**: el agricultor puede declarar "Soya otra vez" o "Trigo otra vez" como rotación actual (`solo_como_actual` en `data/rotaciones.json`; filtro `comparador.para_actual`). No se ofrecen como alternativa a quien ya rota. Para trigo continuo las reglas no tienen enfermedades del trigo: la pantalla lo dice tal cual en vez de inventar un diagnóstico.
- **Guía de suelo**: enlace "¿Cómo sé cuál es mi suelo?" bajo el selector; abre la prueba al tacto (USDA NRCS, Thien 1979) con las 6 clases y un botón "Es este" por clase.
- **Mapa de suelos USDA arreglado**: la consulta pedía `texcl` a `chorizon`, donde no existe (SDA respondía 400). Ahora se lee de `chtexture` vía `chtexturegrp` (grupo representativo). Cuerpo JSON con reintento como formulario; respuestas guardadas en `cache/ssurgo_*.json` (los 4 sitios de la demo ya están precargados). Prueba manual: `python -m rotaciones.ssurgo`.

## Fotos con licencia verificada (15-nov, tarde)

Reemplaza lo dicho en "Fotos de referencia" más arriba. Las cuatro fotos están en `web/img/`
con autor, licencia y enlace en `data/fotos.json`; detalle en `CREDITS.md`.
- Mancha gris: Daren Mueller, Iowa State University, Bugwood.org — CC BY 3.0 US.
- Moho blanco: Jymm, Wikimedia Commons — dominio público. Es sobre frijol (mismo hongo); el pie lo dice.
- Mancha de alquitrán: Kiersten Wise, Bugwood.org (5605027) — CC BY 3.0 US.
- Gusano de la raíz: Tom Hlavaty, USDA-ARS — dominio público (adulto occidental sobre pelos de maíz).
  Se descartó Bugwood 5361235 (CC BY-NC).

## Mapa de suelos y tabla de comparación más claros (15-nov, tarde)

- El resultado del mapa del USDA ahora se lee en español: "Según el mapa del USDA, el suelo de su
  zona es **Franco arenoso**. Ya lo elegimos…", con la serie y la pendiente aparte.
- Tabla "Frente a lo que hace hoy": título grande, leyenda Hoy/Con esta con los nombres, resumen
  "Mejora: N · Empeora: N", columna "Con esta" sombreada y píldoras ↑/↓.
- "hasta 1 años" → "1 año" (`pers_1` / `pers_n` en `textos.json`).

## Documentación y seguridad (15-nov, tarde)

- `README.md` reorganizado; historial movido aquí. Nuevos `AGENTS.md`, `SECURITY.md`, `CREDITS.md`.
- `.gitignore` completo; `cache/ssurgo_*.json` sí se versiona (demo sin red).
- `.env.example` lista las variables que el código lee de verdad.
- `web/ejemplo_*.json` regenerados con el contrato actual.

## Mapa de suelos alrededor del punto (15-nov, tarde)

La frase "el suelo de su zona es…" afirmaba algo que no sabemos: el agricultor no dio la ubicación
de su lote, solo eligió una zona. Ahora:
- Se dice de dónde sale el punto: "No sabemos dónde está exactamente su lote. Para «Centro de Iowa»
  usamos un punto de referencia (42.03, −93.63)." o "las coordenadas que usted escribió".
- **Mapa de suelos de 2 × 2 km** dibujado solo con datos de SSURGO (`ssurgo.mapa`, `GET /api/suelo/mapa`):
  polígonos de cada unidad recortados al cuadro, color por textura, % de superficie, escala de 500 m,
  norte, punto de referencia. Sin mapa base (calles, ríos): se dice en pantalla.
- La persona toca dónde está su lote (o elige en la leyenda) y ese suelo pasa a "Tipo de suelo".
  Agua, zona urbana y turba no se pueden elegir. El clima no cambia (celda POWER ~50 km).
- Hallazgo: en Iowa el punto de referencia cae en una franja de cauce (franco arenoso, 12 % del
  cuadro); lo dominante alrededor es franco (54 %). En Wisconsin el cuadro es 99,5 % franco limoso.
- Cachés de los 4 sitios guardadas en `cache/ssurgo_mapa_*.json`. `pytest`: 44.

## Inicio con ilustración SVG y mapa explicado (15-nov, tarde)

- Inicio: el ciclo de rotación ahora es un SVG en la página (`svgInicio`), basado en el que propuso
  Gemini, con textos en es/en. Se quitaron las cifras que no salen del motor ("Fungal Risk −64 %",
  "Moisture +18 % Z", "SMAP live", "Rotation engine v2.6") y se reemplazaron por descripciones
  ciertas (hongos que pasan el invierno; días con sed desde 1981). Orden: maíz → soya → trigo.
  Sin degradados; la órbita gira despacio y se detiene con "reducir movimiento". Marca "generated by AI".
- Mapa de suelos: guía en tres renglones (Dónde / Qué ve / Qué hacer). "Dónde" nombra el pueblo
  cercano a cada punto de referencia (Ames; ~4 km de Arlington, WI; ~3 km de Wanatah, IN; ~9 km de
  Mead, NE) y enlaza a OpenStreetMap para ver calles. Distancias aproximadas, calculadas a mano.

## Inicio con SVG ilustrado y diagrama por rotación en el resumen (15-nov, tarde)

- Inicio: se reemplazó la ilustración por el segundo SVG de Gemini (medallones con paisaje), con
  textos en es/en, ids y clases con prefijo `ini-` y contenedor `.hero-visual-container`
  (max 620 px, `overflow: visible` para que no se corten el trigo ni la marca en móvil).
  Mantiene la marca "generated by AI".
- Resumen: el diagrama circular anterior pasó a `svgRotacion(o, fo, fh)` y se dibuja **según la
  rotación elegida**: 1, 2 o 3 cultivos, con flechas en el orden real. Las tarjetas muestran datos
  de la matriz: problemas en atención alta/media (con los de hoy al lado) y días con sed por
  temporada (con los de hoy). En monocultivo dice "Mismo cultivo cada año: el ciclo no se corta".

## Respuesta a la revisión externa (15-nov, tarde)

1. **Lenguaje de niveles**: la leyenda "los niveles comparan cuánto deja cada rotación, ajustado por
   el clima histórico del sitio; no son la probabilidad de infección" aparece en la lista de problemas
   y en el panel de cada problema. Se quitó "riesgo" de los textos que podían sonar a probabilidad.
2. **Cálculo separado**: `tarjetas[].calculo` (vista) y bloque "Cómo se llegó a este nivel":
   nivel por la rotación (regla con fuente) → ajuste por el clima del sitio (NASA POWER) → ajuste por lo
   que vio el agricultor → nivel mostrado. Dice cuando un ajuste no cambia nada por estar en el tope y
   cuando un problema no tiene regla de clima.
3. **Agua como estimación**: texto de método y rango de sensibilidad con el agua útil mínima y máxima
   de la textura (`suelos.json > rango`), calculado en `cli.ejecutar` (`agua.sensibilidad`). Raíz y Kc
   quedan fijos y se declaran como supuestos. Los límites pasan a `textos.json` en es/en (antes iban
   solo en español y sin tildes).
4. **Respaldo visible**: etiquetas de origen (NASA POWER, USDA SSURGO, regla con fuente, lo que vio,
   supuesto) en el panel de cada problema y en el de agua; fuentes, supuestos y lagunas con su cantidad.
   La demo tiene un paso nuevo que abre ese panel.
5. **Año seco y año típico** del sitio en el panel de agua: barras con días con sed, qué cambia (solo
   lluvia y calor) y qué no; aclara que no es pronóstico. Excluye el año provisional.
6. **Alcance** en la portada: "Piloto · maíz, soya y trigo · Medio Oeste de EE. UU." y la nota de que
   las reglas no se trasladan solas a otras regiones.

## Inicio animado y explicación de "día con sed" (15-nov, tarde)

- Inicio: SVG animado de Gemini (los tres cultivos cambian de lugar alrededor del lote), versión
  es/en con los textos en `UI`. Con "reducir movimiento" activado se quitan las animaciones.
- "Día con sed" explicado donde aparece: nota al pie en la tabla del paso 3 (fila marcada con *),
  en el panel de agua, bajo el diagrama del resumen y como desplegable en el diagnóstico. Definición:
  día de la temporada del cultivo en que el suelo ya entregó cerca de la mitad del agua aprovechable
  (umbral p de FAO-56: 0,55 maíz y trigo, 0,5 soya) y la planta empieza a sufrir estrés hídrico.

## Seguridad y rendimiento para Vercel (15-nov, tarde)

- Rendimiento: balance hídrico 1,4 s → 0,4 s (bucle sin numpy por elemento, mismo resultado);
  clima de cada sitio y resultados en caché de memoria (segunda consulta en milisegundos);
  `Cache-Control` con `s-maxage` en la API para la CDN; descargas de POWER de a 4 en paralelo;
  ilustraciones a WebP (~250 KB → ~30 KB, misma marca de agua). Nebraska precargado (faltaba).
- Seguridad: zona piloto obligatoria (422 fuera del Medio Oeste, la página lo explica), errores sin
  detalles internos, `/docs` apagado, límites de largo en parámetros, cabeceras CSP y afines en
  `vercel.json`, escritura en `/tmp` cuando el disco es de solo lectura, `requirements-dev.txt`,
  `pip-audit` sin hallazgos. `pytest`: 45.
- Despliegue: `app.py`, `vercel.json`, `.vercelignore`; `cache/` de los sitios de demo pasa a git.

## CSP estricta y caché del año en curso (15-nov, tarde)

- El script salió del HTML a `web/app.js` (servido con huella `?v=` y caché de un año). La CSP ya no
  permite scripts en línea (`script-src 'self'`), en `vercel.json` y en un `<meta>` del HTML. Recorrido
  completo probado con la CSP activa, sin violaciones.
- NASA POWER: el año en curso quedaba congelado en la primera copia guardada. Ahora se vuelve a pedir
  si tiene más de 3 días de atraso (`ROTACIONES_DIAS_FRESCO`) y, si la NASA no responde, se usa la
  última copia. La caché en memoria se renueva una vez por día. `pytest`: 46.

## Hongos y plagas fáciles de encontrar (15-nov, tarde)

- Antes solo se llegaba desde la lista del paso 2, abajo y sin fotos, y solo a los problemas del
  cultivo actual (con maíz continuo, el moho blanco no aparecía nunca).
- Nuevo `vista.catalogo` (los 5 problemas con foto, cultivo afectado, dónde pasa el invierno y qué lo
  frena) y panel "Hongos y plagas que evaluamos", accesible desde: la portada, el menú, el encabezado de
  la lista del paso 2 ("Ver los 5 con fotos") y los nombres de la tabla del paso 3. Funciona antes de
  analizar (usa `ejemplo_*.json`). Si el problema no está en el lote hoy, la ficha lo dice.
- Miniatura de la foto en cada fila del diagnóstico; el nivel pasa debajo del nombre.
- Corregido: `web/img/gusano_raiz.jpg` seguía siendo la foto de Bugwood (CC BY-NC) aunque el crédito
  decía USDA-ARS; ahora es la de Tom Hlavaty (dominio público).

- Foto de la roya del sur: Travis Faske, University of Arkansas, Bugwood 5605029 (CC BY-NC 3.0 US). Con esto los 5 problemas tienen foto.

## Marca, íconos y limpieza (15-nov, tarde)

- Logo en la barra superior, favicon, ícono para iPhone/Android y `manifest.json` (nombre, color
  #1F5135). Logos con lema (es/en) en `web/img/marca/` para diapositivas y README.
- Caché de NASA POWER comprimida con gzip: 61,5 MB → 13,2 MB, resultados idénticos (verificado con
  huella SHA-256 de los 4 sitios). `power.py` lee `.json.gz` y también los `.json` viejos.
- Borrado: copias viejas del año en curso, `cache/_viejo/`, punto de prueba de SSURGO, `ciclo.png`
  (sin uso), PNG de cultivos (quedan WebP), `mancha_gris.png` → JPG (160 KB → 24 KB), `salida/`,
  `logo.png` suelto en la raíz, `__pycache__`, `.DS_Store`. Proyecto sin `.git`/`.venv`: ~70 MB → 15 MB.
