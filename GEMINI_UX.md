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
python -m pytest -q          # deben pasar 26
uvicorn rotaciones.api:app   # abrir http://127.0.0.1:8000 en es y en en
```
