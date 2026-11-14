# Comparador de rotaciones — NASA Space Apps 2026

Reto: "Cambio de rumbo: Adaptando las granjas con datos de la NASA".
Punto de entrada para un agente nuevo: este archivo. El historial de decisiones está en
`HANDOFF_spaceapps_rotaciones.md`.

## El marco (idea central del proyecto)

Cada problema sanitario se describe con tres campos: **dónde sobrevive, qué lo favorece y qué
lo interrumpe**. El medio de supervivencia decide qué puede hacer la rotación.

| Medio de supervivencia | Problemas incluidos | Qué lo interrumpe |
|---|---|---|
| Suelo, por años | Moho blanco (soya) | Solo rotación larga; la labranza ayuda poco |
| Residuo en superficie | Mancha gris, mancha de alquitrán (maíz) | Rotación corta, o enterrar el residuo |
| Suelo, ligado a un solo cultivo | Gusano de la raíz del maíz | Uno o más años sin maíz |
| No sobrevive en el lote, llega por viento | Roya del sur (maíz) | Nada dentro del lote |

De ahí sale el argumento que une enfermedad, suelo y agua: el residuo en superficie protege
el suelo y retiene agua, pero es donde invernan dos de los hongos; la rotación permite
conservarlo sin acumular inóculo. El código genera ese texto por rotación (`trade_offs`).

## Estado

| Pieza | Estado |
|---|---|
| `data/reglas.json` — 5 problemas; cada valor marcado citado (con URL) o supuesto | hecho |
| `rotaciones/motor.py` — días favorables por clima, ventana susceptible, barrido de HR | hecho, con pruebas |
| `rotaciones/comparador.py` — presión de inóculo por medio, riesgo ordinal, trade-offs | hecho, con pruebas |
| `rotaciones/agua.py` — balance hídrico diario por cultivo y textura; contexto del sitio | hecho, con pruebas |
| `rotaciones/power.py` — cliente POWER horario/diario con caché | **escrito, sin probar contra la API real** |
| `data/cultivos.json` — rasgos de suelo y curvas Kc mensuales | **mayormente supuestos** |
| `rotaciones/vista.py` — contrato para la interfaz, textos de campo en es/en | hecho, con pruebas |
| `rotaciones/api.py` — FastAPI: `/api/evaluar` y la página | hecho; probado con POWER simulado |
| `web/index.html` — página funcional sobria (formulario, tarjetas, opciones) | hecho; **JS sin probar en navegador** |
| Capa visual y animaciones | pendiente: encargo en `GEMINI_UX.md` |
| Demo y página del proyecto | no empezado |

`pytest` pasa 26 pruebas sobre series sintéticas: verifican la lógica, no el clima.
**Ningún resultado real existe todavía.** El entorno donde se escribió no tenía salida a
`power.larc.nasa.gov`.

## Primer paso obligatorio

```bash
pip install pandas numpy scipy pytest fastapi uvicorn httpx
python -m pytest -q
python -m rotaciones.cli --lat 42.03 --lon -93.63 --inicio 2001 --fin 2025 \
    --textura franco_limoso --labranza siembra_directa
```

Para la interfaz: `uvicorn rotaciones.api:app` y abrir http://127.0.0.1:8000. Si la NASA no
responde, la página carga `web/ejemplo_*.json` (sintético) y lo avisa en pantalla.
Regenerar ejemplos: `PYTHONPATH=. python tools/generar_ejemplo.py`.

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

## Cómo se calcula

**Clima (igual para todas las rotaciones del sitio).** Hora favorable: HR sobre el umbral,
temperatura dentro del criterio, mes dentro de la ventana susceptible. Día favorable: una
racha de horas favorables alcanza la duración mínima. Nivel: fracción media de días
favorables, con el rango que da el barrido de umbrales. Problemas sin regla climática con
fuente (gusano de la raíz, roya) salen como `no_evaluado`.

**Presión de inóculo (cambia con la rotación).** Años sin hospedante entre dos cultivos
hospedantes, comparados con el mínimo de rotación recomendado y con la persistencia en su
medio. Casos especiales: `no_evaluable` si la eficacia de la rotación es incierta; `externa`
si no sobrevive en el lote.

**Riesgo por problema.** El menor entre clima e inóculo, porque ambos son necesarios. Sin
hospedante: `nulo_en_el_lote`. Llega por viento: `no_depende_de_la_rotacion`.

**Agua.** Balance diario tipo FAO-56: ET de referencia por Hargreaves, Kc mensual por cultivo,
agua útil = agua útil de la textura × profundidad de raíz. Resultado: días de estrés hídrico
por temporada, por cultivo y por rotación. `--textura` y `--mo-alta` lo modifican.

**Sin puntaje global.** Cada rotación muestra sus riesgos, su agua y sus trade-offs.

## Decisiones tomadas

- Piloto en el Medio Oeste (por defecto 42.03, −93.63, centro de Iowa).
- Cuatro rotaciones: maíz continuo (actual), maíz–soya, maíz–soya–trigo, maíz–trigo.
- Humedad foliar: `RH2M ≥ umbral` con barrido; `--ajuste-dosel` como supuesto del usuario.
- Sin ML ni LLM; los textos salen del motor.
- Una sola plaga (gusano de la raíz) y una roya como contraste. No añadir más.
- Stack web.

## Año en curso

El cliente pide datos hasta hace 4 días. Los últimos meses vienen de un modelo provisional
que POWER reemplaza después: la interfaz marca el año en curso como provisional. Para
refrescar, borrar de `cache/` los archivos del año en curso.

## Límites declarados

- POWER es reanálisis en celdas de ~50 km: no ve el lote ni el dosel. Los niveles son
  comparación relativa y tendencia, no probabilidad.
- Materia orgánica: ningún dato la mide a escala de lote. Entra como índice cualitativo de
  residuo y como ajuste de sensibilidad (+10 % de agua útil, sin fuente).
- Balance hídrico: sin escorrentía, cada cultivo evaluado como si se sembrara todos los años,
  Kc mensual supuesto, parámetros de soya sin verificar.
- Gusano de la raíz: las variantes (diapausa extendida, variante de soya) pueden anular la
  rotación corta; el código refleja la primera y declara la segunda como laguna.
- Horas de mojado del moho blanco y meses de las ventanas susceptibles: supuestos.

## Pendiente, en orden

1. Corrida real y los cinco puntos de revisión.
2. Abrir la página en un navegador y corregir lo que falle (el JS solo pasó revisión de sintaxis).
   Luego pasar `GEMINI_UX.md` al agente de diseño.
3. Demo (video de 30 s con subtítulos en inglés o 7 diapositivas) y página del proyecto en
   inglés, con declaración de uso de IA.
4. Sustituir supuestos de `cultivos.json` por valores con fuente, o mostrarlos como tales.

## No hacer

No presentar niveles como probabilidad de infección. No rellenar umbrales sin fuente. No
afirmar que la humedad satelital mide la salud del suelo de un lote. No añadir un LLM que
redacte recomendaciones. No dar una recomendación única.
