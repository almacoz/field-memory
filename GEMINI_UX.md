> **Documento histórico** (encargo de diseño para Gemini). Puede estar desactualizado: la referencia vigente es `README.md` y `AGENTS.md`.

# Encargo para el agente de diseño (Gemini): capa visual y UX

## Qué es esto
Herramienta para el NASA Space Apps Challenge 2026. Un agricultor ingresa su ubicación y ve
(1) lo que su lote "guarda" para el próximo año y (2) opciones de rotación comparadas.
La lógica y los textos ya están hechos y probados. **Tu trabajo es solo la capa visual.**

## Qué puedes tocar
- `web/index.html` completo: HTML, CSS, animaciones, transiciones, iconos, disposición.
- Puedes añadir archivos bajo `web/` (css, js, svg).
- Para trabajar sin red: abre la página servida por `uvicorn rotaciones.api:app`; si la NASA
  no responde, carga sola `web/ejemplo_es.json` / `ejemplo_en.json` (datos sintéticos).

## Qué NO puedes tocar
- Nada bajo `rotaciones/`, `data/`, `tests/`.
- No calcules, no redondees distinto, no inventes cifras ni textos. Pinta el objeto `vista`.
- No cambies el significado de un nivel ni lo ocultes.

## El contrato: objeto `vista` (respuesta de `GET /api/evaluar`, clave `vista`)
```
vista.idioma                      "es" | "en"
vista.datos_sinteticos            true => mostrar SIEMPRE el aviso de datos de ejemplo
vista.textos.{aviso,leyenda,celda}
vista.lote_hoy.agua               {deficit_mm, capacidad_mm, fraccion_llena (0-1),
                                   texto_estado, texto_anio, textura.nombre_mostrar, limites[]}
vista.lote_hoy.tarjetas[]         {clave, nombre, nivel{clave,etiqueta,simbolo},
                                   donde_pasa_el_invierno, este_anio, este_anio_dato{anio,dias,
                                   anios_medidos,anios_peores,serie{anio:dias}} | null,
                                   que_lo_frena, pregunta | null, tecnico,
                                   fuentes[], supuestos[], lagunas[]}
vista.opciones[]                  {clave, nombre, es_actual, lineas[{titulo, nivel|null, texto}],
                                   lo_bueno, el_costo, tecnico, orden{sanidad,agua,suelo}}
```
`nivel.clave` ∈ `alta | media | baja | no_evaluable | no_depende_de_la_rotacion`.
`orden.*`: número menor = mejor para esa prioridad; los botones reordenan las opciones.
`este_anio_dato.serie` permite dibujar un gráfico pequeño de días por año (opcional).

## Reglas de diseño que no se negocian
1. **Público: agricultor con poca experiencia técnica, en teléfono, a pleno sol.** Texto grande,
   contraste alto (mínimo 4.5:1), botones de 44 px o más.
2. **El nivel nunca depende solo del color.** Siempre símbolo + palabra (`nivel.simbolo`,
   `nivel.etiqueta`). Evita rojo/verde como única distinción.
3. **Las tres líneas de cada tarjeta se mantienen y en ese orden:** dónde pasa el invierno,
   este año, qué lo frena. Es la idea central del proyecto.
4. **No hay una recomendación ganadora.** No destaques una opción como "la mejor"; el orden lo
   decide la prioridad que elige el agricultor.
5. **Fuentes, supuestos y "lo que no sabemos" siempre accesibles** (pueden ir plegados).
6. **El aviso final y el de la celda de 50 km siempre visibles.**
7. **Mapa:** si agregas uno, solo para ubicar el lote y mostrar el tamaño de la celda de datos.
   No pintes un "mapa de clima": hay un solo valor por sitio.
8. Las animaciones respetan `prefers-reduced-motion` y no retrasan la lectura.
9. Sin logos ni elementos de marca de la NASA en contenido generado.
10. La entrega final del hackathon va en inglés: verifica que nada se rompa con `idioma=en`.

## Ideas donde sí aporta el diseño
- La barra de agua como un perfil de suelo que se llena.
- "Este año" con un gráfico mínimo de los 25 años y el actual resaltado.
- Transición al reordenar opciones cuando cambia la prioridad.
- Estado de carga claro: la primera consulta a la NASA tarda.
- Referencia visual previa: lienzo "Pantalla del agricultor — comparador de rotaciones".

## Cómo comprobar que no rompiste nada
```
python -m pytest -q          # deben pasar 34
uvicorn rotaciones.api:app   # abrir http://127.0.0.1:8000 en es y en en
```


## Actualización del contrato (14-nov, tarde)

Claves nuevas de `vista` que la página ya pinta; no las quites:
```
vista.cabecera.{pregunta,sub}        título y subtítulo
vista.nasa.{titulo,texto,provisional}  franja NASA: qué dato se usa y para qué
vista.actual, vista.rotaciones_disponibles[]   selector "qué siembra hoy"
vista.matriz.{columnas[],filas[],titulo_agua}  tabla resumen (símbolo por celda + leyenda)
tarjetas[].por_que[], .tendencia, .nombre_corto
agua.texto_tanque, agua.serie, agua.anio
lineas[].problema
```
Reglas añadidas:
11. La tabla resumen va antes que las tarjetas de opciones y cada símbolo tiene su leyenda debajo.
12. La pestaña de opciones es la primera; la de "por qué" la segunda.
13. Cuando una respuesta cambia un nivel, se nota en pantalla (clase `cambio` + nota).
14. Un mismo problema muestra el mismo nivel en tarjeta, línea y tabla: no lo recalcules.
15. `tarjetas[].foto` (`src`, `alt`, `credito`, `url`) puede ser `null`. Si existe, el crédito va
    siempre visible junto a la imagen. No agregues fotos, ilustraciones ni cifras que no vengan
    en `vista`.
16. `vista.destacado` va arriba de las pestañas: nivel, título, texto, qué lo frena, agua e
    ilustración del cultivo actual. No cambies su texto.
17. Las ilustraciones de `web/img/cultivos/` llevan grabada la marca «IA · AI»: no la recortes ni
    la tapes. Cualquier imagen nueva generada con IA necesita la misma marca visible.
18. `vista.ia_nota` siempre visible en el pie.


## Rediseño del 15-nov (madrugada): relato lineal

La página ya no usa pestañas. Es un relato en cuatro capítulos, en este orden, y así se queda:
1. **Su lote**: pregunta + bajada (`vista.cabecera`) y formulario (lugar, qué siembra hoy; el resto en "Más ajustes").
2. **Lo que dejó {año}** (`vista.anio_datos`): tarjeta principal (`vista.destacado`, que ahora trae
   `reducen[]` y `texto_reducen`), agua y tarjetas de problema plegadas.
3. **Qué rotación lo reduce**: tabla resumen, leyenda, orden por prioridad y tarjetas de opción.
4. **Cómo lo sabemos**: NASA POWER (`vista.nasa`), cómo se calcula, lo que no sabemos, fuentes y uso de IA.

Menú (botón "Menú"): los cuatro capítulos, el cambio de idioma y "Fuentes, fotos y uso de IA".
No agregar al menú pasos que no existan como sección.

Reglas añadidas:
19. Voz única: "usted" en español. No mezclar "tú".
20. CSS en un solo bloque con variables; no apilar capas de estilos que se pisen. Si se cambia
    el estilo, se reemplaza, no se agrega otra capa con `!important`.
21. La tarjeta principal siempre termina en `texto_reducen` y en el botón que lleva al capítulo 3:
    es el puente entre lo que pasó y la decisión.


## Webapp por pasos (15-nov, mediodía) — reemplaza el relato lineal

Pantallas: Inicio, 1 Su lote, 2 Diagnóstico, 3 Rotación, 4 Resumen. Panel lateral para detalle,
"Cómo lo sabemos", fuentes, idioma. Demo guiada (`?demo=1`).
22. No volver a una página larga con todo apilado.
23. El paso 3 (rotación) es el centro: lista de opciones + comparación frente a hoy, siempre visibles juntas en escritorio.
24. Paleta: neutros + un acento (#1F5135). Nada de degradados, crema, franjas de color ni sombras grandes.
25. Las ilustraciones conservan su marca de agua "generated by AI" y el rótulo en pantalla.
