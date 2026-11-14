# Handoff: herramienta de rotación de cultivos — NASA Space Apps 2026

Documento para un agente que retoma el trabajo sin haber visto la conversación original.
Resume lo que se propuso, marca qué está realmente hecho, lista los errores detectados en la
propuesta y deja una especificación corregida y un alcance para 48 horas.

> **Actualización (14-nov-2026, 03:00):** las correcciones de este documento ya están
> aplicadas en código. `README.md` describe el estado vigente y `data/reglas.json` sustituye a
> la tabla de la sección 4 (tres valores cambiaron al verificar fuentes). Las decisiones de la
> sección 9 están tomadas; ver README. Las secciones 3 y 7 quedan como registro histórico.

**Etiquetas de estado usadas abajo**

- `HECHO`: existe como código o dato en la conversación original.
- `PROPUESTO`: se describió, no existe. No asumas que funciona.
- `CORREGIR`: existe pero tiene un error identificado.
- `DESCARTAR`: no hacerlo en este hackathon.
- `ABIERTO`: decisión que le toca a Alex (el dueño del proyecto).

---

## 1. Contexto

- **Evento:** NASA Space Apps Challenge 2026, 14–15 de noviembre de 2026 (48 h). El envío se
  hace en la plataforma oficial de Space Apps.
- **Reto:** "Cambio de rumbo: Adaptando las granjas con datos de la NASA".
- **Qué pide el reto (resumen fiel):** una herramienta de apoyo a la decisión que combine
  observaciones de la Tierra de la NASA con suelo local, características de cultivos y
  prioridades del agricultor, para explorar rotaciones que **mejoren la salud del suelo y la
  resiliencia ante cambios climáticos e hídricos**. Sugiere comparar **al menos tres
  estrategias de rotación, incluida la actual**, y para cada una explicar: por qué se sugiere,
  qué evidencia la respalda, beneficios, lagunas de información y riesgos que requieren
  revisión local. No debe sustituir el criterio del agricultor.
- **Criterios de evaluación reales:** Impact, Creativity, Validity, Relevance, Presentation.
  La conversación original llamó "rúbrica" a la lista de "Consideraciones potenciales" del
  reto; esa lista es opcional y no es la rúbrica. Leer la Judging & Awards Guide y la Project
  Submission Guide de 2026 antes de decidir el formato del demo.
- **Dueño:** Alex, desarrollador, trabaja solo como arquitecto y operador. Prefiere
  respuestas directas y evaluaciones honestas.

## 2. La idea en una frase

Un motor de reglas determinista y explicable que, para una coordenada, calcula con el
histórico horario de NASA POWER qué tan favorable es el clima para tres enfermedades
(moho blanco en soya, mancha gris y mancha de alquitrán en maíz) y usa eso, junto con
hospedantes y persistencia del inóculo, para comparar tres rotaciones mostrando
trade-offs, incertidumbre y lagunas.

El trade-off que le da sentido: salir de maíz continuo hacia soya reduce la mancha gris pero
expone al moho blanco, cuyo inóculo dura años.

## 3. Estado real

| Pieza | Estado | Nota |
|---|---|---|
| Reglas de 3 patógenos en JSON | `CORREGIR` | Hay dos versiones que no coinciden (ver 5.1) |
| Función `simular_microclima_dosel` | `DESCARTAR` | Parámetros inventados y signo dudoso (ver 5.2) |
| `MotorRiesgoAgricola.procesar_mes` | `CORREGIR` | Solo corrió con datos sintéticos; ignora ventana susceptible |
| Z-score de humedad del suelo | `CORREGIR` | Solo datos sintéticos; umbrales incoherentes (ver 5.6) |
| Llamada real a NASA POWER | `PROPUESTO` | Nunca se hizo ninguna |
| Comparador de 3 rotaciones | `PROPUESTO` | **Es el entregable central y no está diseñado** |
| Dimensiones de suelo y agua | `PROPUESTO` | Sin modelo alguno |
| SMAP, SSURGO, CDL, AMS | `PROPUESTO` | Solo mencionados |
| RAG con Llama 3.2 + ChromaDB | `DESCARTAR` | Ver 5.8 |
| API FastAPI, frontend, mapa | `PROPUESTO` | Nada escrito |

Conclusión: hoy hay un prototipo de "horas favorables" sobre datos falsos. No hay todavía
nada que compare rotaciones.

## 4. Reglas de patógenos (valores de la conversación original)

Provienen de publicaciones de extensión universitaria de EE. UU. Las citas quedaron truncadas
en el texto original (aparecen como "unl", "osu", "ndsu", "purdue", "corteva"), así que
**ningún valor tiene URL verificable todavía**. Tarea: adjuntar una fuente a cada umbral.

| Campo | Moho blanco (soya) | Mancha gris (maíz) | Mancha de alquitrán (maíz) |
|---|---|---|---|
| Patógeno | *Sclerotinia sclerotiorum* | *Cercospora zeae-maydis* | *Phyllachora maydis* |
| Hospedantes | >400 spp.: soya, girasol, canola, alfalfa, frijol | solo maíz | maíz |
| No hospedantes | maíz, trigo, cereales | resto | resto |
| Temperatura | favorable ~24 °C, límite ~29 °C | 21–32 °C (otra fuente 21–29) | 16–20 °C |
| Humedad | agua libre sobre la planta; sin umbral numérico en las fuentes | ≥12 h de mojado (otra: 11–13 h), HR ≥90 % (otra: >95 %) | HR >75 % (otra: 85 %), ≥7 h de rocío nocturno, días nublados |
| Ventana susceptible | **solo floración** | ciclo | ciclo |
| Persistencia del inóculo | 5–7 años (hasta 10) en suelo | ~1 año en residuo superficial; no en residuo enterrado | invierna en residuo; años desconocidos |
| Eficacia de rotación | parcial (≥3 años sin hospedante, y aun así limitada) | alta (1 año; 2 en alto riesgo) | incierta (evidencia dividida) |
| Riesgo externo | — | esporas por viento desde vecinos | esporas hasta ~240 m según una observación |
| Modificadores | riego, densidad de dosel, historial | maíz continuo, labranza mínima, riego | fecha de siembra, riego |

Notas de uso:
- Los umbrales de temperatura de la mancha de alquitrán describen condiciones medias, no
  horas individuales. Aplicarlos como filtro horario estricto es una reinterpretación; hay
  que declararlo o usar la media diaria.
- Humedad es condición necesaria, no suficiente: también hacen falta inóculo y hospedante
  susceptible.

## 5. Inconsistencias detectadas en la propuesta original

### 5.1 Dos JSON distintos, y el del script inventa datos
El primer JSON dejaba en `null` los umbrales de moho blanco porque las fuentes no dan número.
El JSON embebido en el script les puso `t_min_c: 15`, `humedad_requerida_horas: 10`,
`hr_minima_rango: [85, 90]` sin fuente. Además el script eliminó `hospedantes`,
`no_hospedantes`, `persistencia_inoculo_anios` y `ventana_susceptible`, que son justo los
campos necesarios para la lógica de trade-offs que se anunció como ya resuelta. También
conviven `hr_minima` y `hr_minima_rango` como nombres de campo.
**Corrección:** un solo archivo `reglas.json`, un solo nombre de campo, cada umbral con
`fuente` y `tipo: "citado" | "supuesto"`.

### 5.2 La función de microclima no es defendible
- `delta_max = 14`, `k = 0.3`, `t_inflexion = 18`, `bono_riego = 6` no salen de ninguna
  fuente. El docstring dice "modelo empírico de primer principio"; no es ninguna de las dos
  cosas.
- La sigmoide suma más humedad cuanto más calor hace, es decir, de día. El mojado foliar
  ocurre sobre todo de noche y madrugada, con rocío. El ajuste empuja en el momento
  equivocado.
- Solo puede subir el riesgo. Con parámetros libres se puede alcanzar cualquier umbral, así
  que el resultado deja de ser falsable. Un juez de fitopatología lo detecta enseguida.
- Se prometió derivar la densidad de dosel del NDVI; en el código es una constante que pasa
  el usuario, y se aplica igual a los tres patógenos aunque dos son de maíz.
**Corrección:** ver 6.2.

### 5.3 El clima favorable no depende de la rotación
El motor calcula días favorables por clima. Ese número es idéntico para maíz continuo,
maíz–soya o cualquier otra rotación en la misma coordenada. Lo que cambia entre rotaciones es
la presencia de hospedante y la acumulación de inóculo, y eso no está modelado.
**Corrección:** ver 6.3.

### 5.4 La rotación 3 se contradice con las reglas
Se presentó "Maíz–Trigo–Soya" como "refugio para romper el ciclo del moho blanco". Esa
rotación tiene soya cada 3 años: deja 2 años sin hospedante, menos que los ≥3 recomendados y
mucho menos que los 5–10 años de persistencia. Antes, el mismo texto decía que el refugio era
una rotación larga de maíz y trigo, sin soya.
**Corrección:** describirla como "reduce, no rompe"; o agregar una cuarta opción sin soya.

### 5.5 Horizonte temporal incoherente
Se dijo "5 años", luego "10 años", y a la vez "porcentaje de años favorables y su tendencia".
Con 5 años no hay tendencia, y el reto trata de condiciones cambiantes.
**Corrección:** usar todo el horario de POWER (desde 2001) para clima.

### 5.6 Z-score de humedad del suelo
- El código clasifica con ±1 y ±2; la UI propuesta usa ±1.5 y deja 1.0–1.5 sin definir.
- SMAP empieza en 2015: unas 10 muestras por día del año. La desviación estándar es ruidosa
  y etiquetas como "Saturación severa" no son fiables.
- La humedad del suelo está acotada y no es normal; percentiles son más honestos que Z.
- Se llamó "ML no supervisado" a un Z-score. No lo es.
- Texto de UI: "el agricultor asume que la humedad revertirá a la media". Contradice la
  premisa del reto (condiciones que cambian). Quitar.

### 5.7 "Suelo saturado garantiza la infección"
Se propuso que Z > 2 en SMAP active alerta roja de moho blanco porque "garantiza la
infección". Falso y contradice el propio punto de partida (humedad necesaria, no suficiente).
SMAP mide los primeros centímetros del suelo en celdas de decenas de km; no mide agua libre
sobre la planta. La relación real es más débil: suelo húmedo y fresco favorece la germinación
de esclerocios.
**Corrección:** a lo sumo un factor contribuyente, etiquetado como tal.

### 5.8 ML y LLM: se dijo "no hace falta" y se propusieron tres capas
- **Downscaling con Random Forest:** no hay sensores dentro del dosel para entrenar. Sin
  verdad de terreno no hay modelo. Kriging tampoco es ML.
- **RAG con Llama 3.2 3B local:** los ejemplos de salida propuestos ("en 2019 la extensión
  recomendó rotar a sorgo", "el trigo tiene fuerte demanda local este mes") son afirmaciones
  agronómicas y de mercado que un modelo de 3B generaría sin respaldo. Eso destruye la
  trazabilidad, que es el argumento central del proyecto. Además un modelo local complica que
  los jueces prueben el demo.
**Corrección:** sin ML en el MVP. Texto explicativo con plantillas a partir del JSON del
motor. Si sobra tiempo, un LLM solo para reformular ese JSON, sin añadir hechos ni cifras.

### 5.9 El "killer feature" de CDL no aporta información
CDL dice qué sembraron los vecinos, no si hay esporas. En el Corn Belt casi siempre hay maíz
a menos de 240 m, así que la alerta se dispararía siempre. CDL del año se publica al año
siguiente. La cifra de 240 m viene de una sola observación.
**Corrección:** mostrarlo como contexto ("X % de maíz en el entorno"), no como detección.

### 5.10 La "fusión de resoluciones" no existe
POWER (~50 km), SMAP (9–36 km), CDL (30 m) y entradas del agricultor se consultan en el mismo
punto. Eso es co-localización. No hay remuestreo ni armonización.
**Corrección:** decirlo así y mostrar la resolución de cada dato en la UI. Es una laguna que
el reto pide declarar, y declararla suma.

### 5.11 Alcance frente al reto
El reto es sobre salud del suelo y resiliencia hídrica y climática. La interrupción de ciclos
de plagas es una consideración entre muchas. La propuesta se quedó en tres enfermedades
foliares; el "beneficio de suelo" del comparador no tiene ni un dato detrás. Riesgo directo
en el criterio Relevance.
**Corrección:** añadir como mínimo una dimensión de agua y una de suelo, aunque sean
cualitativas (ver 6.4).

### 5.12 Stack y diseño
- Empieza como "aplicación web + FastAPI" y termina como "Tauri". Elegir uno: web.
- Glassmorphism sobre mapas satelitales tiene mal contraste y choca con "agricultores con
  poca experiencia técnica". Priorizar legibilidad.
- "Evitar bucles for destruiría el rendimiento": irrelevante; 25 años horarios son ~220 000
  filas.

### 5.13 Detalles del script
- No filtra por `ventana_susceptible`: evalúa moho blanco todo julio aunque solo infecta en
  floración.
- "Días de riesgo" no está definido: una racha que cruza medianoche cuenta distinto según
  dónde alcance el umbral. Contar **eventos** (rachas que cumplen la duración).
- `procesar_mes` muta el DataFrame de entrada.
- El generador sintético pone el máximo de HR a las 08:00 y el mínimo a las 20:00; no sirve
  ni como prueba de humo realista.

### 5.14 Afirmaciones sin base en la conversación original
"Ya resolviste el 40 % del criterio", "valida nuestra estrategia al 100 %", "mapa del tesoro
de los jueces", "la mayoría de equipos presentará cajas negras". Ignorarlas.

## 6. Especificación corregida

### 6.1 Esquema de reglas

```json
{
  "mancha_gris_maiz": {
    "patogeno": "Cercospora zeae-maydis",
    "hospedantes": ["maiz"],
    "persistencia_inoculo_anios": {"min": 1, "max": 1, "fuente": "URL"},
    "eficacia_rotacion": {"valor": "alta", "fuente": "URL"},
    "ventana_susceptible": {"cultivo": "maiz", "etapa": "V10-R3", "meses_aprox": [7, 8]},
    "clima": {
      "t_min_c": {"valor": 21, "tipo": "citado", "fuente": "URL"},
      "t_max_c": {"valor": 32, "tipo": "citado", "fuente": "URL"},
      "horas_mojado_min": {"valor": 12, "tipo": "citado", "fuente": "URL"},
      "hr_umbral_barrido": [85, 90, 95]
    },
    "riesgos_externos": ["esporas por viento desde campos vecinos"],
    "modificadores": ["labranza", "riego", "maiz_continuo"]
  }
}
```

Reglas: `null` cuando la fuente no da número; nunca rellenar. Para moho blanco, donde no hay
umbral de HR ni de horas, usar un proxy declarado como `"tipo": "supuesto"` y mostrarlo así.
Las etapas y meses de la ventana susceptible del ejemplo son ilustrativos: verificarlos.

### 6.2 Humedad: proxy simple y barrido de umbrales, sin "microclima"

- Hora favorable = temperatura en rango **y** `RH2M ≥ umbral`.
- Correr siempre el barrido de umbrales y mostrar el rango de resultados, no un número.
- Declarar en la UI: POWER es reanálisis en celdas de ~0.5° × 0.625°, a 2 m, fuera del
  dosel; probablemente subestima el mojado dentro del cultivo. Por eso el resultado se
  presenta como **ranking relativo y tendencia**, no como probabilidad de enfermedad.
- Si se quiere conservar la idea del dosel: un control deslizante "ajuste por dosel
  (supuesto, 0–10 puntos de HR)" que el usuario mueve y ve cómo cambia el resultado. Eso es
  análisis de sensibilidad honesto y cubre el punto del reto sobre satélite frente a terreno.

### 6.3 Comparador de rotaciones (lo que falta)

Para cada rotación (secuencia de cultivos de N años) y cada patógeno:

1. **Favorabilidad climática** del sitio: fracción de temporadas 2001–2025 con al menos un
   evento favorable dentro de la ventana susceptible, más su tendencia. Igual para todas las
   rotaciones.
2. **Exposición:** fracción de años de la rotación con hospedante.
3. **Presión de inóculo:** años consecutivos sin hospedante comparados con la persistencia.
   Ordinal: baja / media / alta. Si `eficacia_rotacion = incierta`, devolver "no evaluable"
   y explicarlo; no inventar un valor.
4. **Salida por rotación:** nivel ordinal por patógeno, la evidencia usada, las lagunas y los
   puntos que requieren revisión local. Sin puntaje único agregado: los trade-offs se
   muestran, no se promedian.

Rotaciones del MVP: (a) maíz continuo, como "actual"; (b) maíz–soya; (c) maíz–soya–trigo,
descrita como reducción parcial del moho blanco.

### 6.4 Suelo y agua (mínimo para ser relevante al reto)

- Tabla estática `cultivos.json` con rasgos cualitativos por cultivo: leguminosa fijadora
  (sí/no), demanda hídrica relativa, aporte de residuo, meses de suelo desnudo. Cada valor
  con fuente o marcado como supuesto.
- Agua: humedad del suelo en zona radicular y precipitación de la temporada, como percentil
  histórico y tendencia.
- Prioridades del agricultor: 2–3 controles (agua, suelo, enfermedad) que **reordenan** la
  presentación; no generan un puntaje oculto.

### 6.5 Datos

| Dato | Uso | Nota |
|---|---|---|
| NASA POWER horario (`T2M`, `RH2M`, `T2MDEW`) | horas favorables | Desde 2001. Verificar nombres de parámetros en el endpoint de parámetros. Pedir por año y cachear. Fijar `time-standard`. Tratar el valor de dato faltante. |
| NASA POWER diario (`GWETROOT`, `GWETTOP`, precipitación) | agua y suelo | Desde 1981, misma API, sin login. Es modelo (MERRA-2), no observación: decirlo. |
| SMAP | validación o capa visual | Requiere Earthdata Login y manejo de gránulos. Solo si sobra tiempo; si no, citarlo como trabajo futuro y explicar por qué. |
| SSURGO / Web Soil Survey | textura y drenaje | Solo EE. UU. Opcional: entrada manual del agricultor como alternativa. |
| CDL | contexto de vecinos | Solo EE. UU. Opcional (ver 5.9). |

Endpoint base de POWER horario:
`https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=T2M,RH2M,T2MDEW&community=AG&longitude=LON&latitude=LAT&start=YYYYMMDD&end=YYYYMMDD&format=JSON`

### 6.6 Stack

Web: frontend estático + backend FastAPI (o todo en frontend si POWER permite la llamada
directa desde navegador; comprobar). Respuestas de POWER cacheadas en disco para que el demo
no dependa de la red. Sin Tauri, sin modelo local.

## 7. Alcance para 48 horas, en orden

1. Cliente de POWER horario real para una coordenada piloto, con caché.
2. `reglas.json` único, con fuentes, y motor de eventos favorables con ventana susceptible y
   barrido de umbrales. Pruebas con un año conocido.
3. Comparador de 3 rotaciones (6.3).
4. Agua y suelo mínimos (6.4) con POWER diario.
5. UI: una pantalla. Coordenada, rotación actual, prioridades; tres tarjetas comparables con
   evidencia, lagunas y "revisar localmente". Resolución y origen de cada dato visibles.
6. Demo y página del proyecto según la guía de envío de 2026.
7. Solo si sobra tiempo: mapa con capa NDVI pre-renderizada; SMAP; CDL como contexto.

Regla de corte: si el paso 3 no está listo al final del día 1, no empezar nada del paso 7.

## 8. No hacer

- No rellenar umbrales sin fuente ni presentarlos como citados.
- No presentar el resultado como probabilidad de infección ni como predicción.
- No usar la palabra "garantiza" para ningún riesgo.
- No afirmar "fusión de resoluciones" ni "ML" si no los hay.
- No generar recomendaciones agronómicas o de mercado con un LLM.
- No dar una recomendación única: la herramienta compara y explica.

## 9. Decisiones abiertas para Alex

1. **Geografía** `ABIERTO`: las reglas y varios datos (SSURGO, CDL) son de EE. UU. Opción A:
   piloto en el Medio Oeste, con núcleo POWER global. Opción B: sitio en Colombia, lo que
   exige reglas de patógenos y cultivos distintas. Lo construido hasta ahora solo sirve
   para A.
2. **Coordenada piloto** `ABIERTO`.
3. **¿Cuarta rotación sin soya?** `ABIERTO` (ver 5.4).
4. **¿LLM para reformular el texto?** `ABIERTO`; por defecto no.
5. **Formato del demo** `ABIERTO`: depende de la guía de envío de 2026.

## 10. Fuentes verificadas para este documento

- Criterios de evaluación: https://www.spaceappschallenge.org/resources/project-submission-guide/
  y https://www.spaceappschallenge.org/resources/judging-awards-guide
- Fechas 2026: https://astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-space-apps-challenge/
- POWER horario (API, estándar de tiempo): https://power.larc.nasa.gov/docs/services/api/temporal/hourly/
- POWER: resolución y cobertura horaria desde 2001:
  https://ntrs.nasa.gov/api/citations/20230015396/downloads/ASA_CSSA_SSSA_Mikovitz.pdf
- `GWETROOT` es la capa 0–100 cm de MERRA-2: https://forum.earthdata.nasa.gov/viewtopic.php?p=24357
- SMAP L3 en grilla de 36 km: https://www.earthdata.nasa.gov/data/catalog/nsidc-cprd-spl3smp-001-1

Los valores agronómicos de la sección 4 **no** fueron verificados aquí; vienen de la
conversación original con citas truncadas.
