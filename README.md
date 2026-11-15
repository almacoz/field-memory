# Memoria del lote — comparador de rotaciones (NASA Space Apps 2026)

Reto: "Cambio de rumbo: Adaptando las granjas con datos de la NASA".

Un agricultor del Medio Oeste de EE. UU. indica dónde está su lote y qué siembra. La
herramienta usa 25 años de clima de **NASA POWER** y reglas de los servicios de extensión
para mostrar qué hongos y plagas deja la temporada en el lote, cuánta agua le faltó al
cultivo, y cómo cambia eso con cada rotación. No da una receta: compara.

| Documento | Para qué |
|---|---|
| `README.md` | Qué es, cómo correrlo, cómo calcula, límites |
| `AGENTS.md` | **Leer primero si sos un agente**: mapa del código, contratos, reglas, checklist |
| `CHANGELOG.md` | Historial de cambios y decisiones, por fecha |
| `SECURITY.md` | Modelo de amenazas, qué está expuesto y qué hacer antes de publicar |
| `CREDITS.md` | Fuentes de datos, fotos con licencia e imágenes generadas con IA |
| `HANDOFF_spaceapps_rotaciones.md`, `GEMINI_UX.md` | Históricos (propuesta inicial y encargo de diseño); pueden estar desactualizados |

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

## Estado (15-nov-2026)

| Pieza | Estado |
|---|---|
| Motor climático (`motor.py`) y comparador (`comparador.py`) | Hecho, con pruebas, verificado con datos reales de POWER |
| Agua en el suelo (`agua.py`, FAO-56 + Hargreaves) | Hecho; 2012 y 1988 salen como años secos en Iowa |
| Cliente NASA POWER (`power.py`) con caché | Hecho, probado contra la API real |
| Mapa de suelos USDA (`ssurgo.py`): punto + mapa de 2 × 2 km | Hecho, probado contra Soil Data Access; 4 sitios precargados |
| Contrato `vista` (`vista.py`) es/en | Hecho, con pruebas |
| API (`api.py`) | Hecho |
| Webapp por pasos (`web/index.html`) con demo guiada | Hecho, revisada en navegador |
| Fotos de referencia con licencia | 4 de 4 verificadas (ver `CREDITS.md`) |
| Pruebas | `pytest`: 46 pasan |
| Video/diapositivas y página del proyecto en inglés | **Pendiente** |

## Inicio rápido

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
python -m pytest -q                                   # 46 pruebas, sin red
uvicorn rotaciones.api:app --reload --host 127.0.0.1 --port 8000
```

- El idioma sale del navegador (español → es; cualquier otro → inglés). Forzar: `?idioma=es` o `?idioma=en`. Demo guiada: `?demo=1`
- Sin red, la página cae a `web/ejemplo_es.json` / `ejemplo_en.json` (datos sintéticos) y lo avisa en pantalla.
- No hace falta `.env`: NASA POWER y SSURGO no piden clave. Variables opcionales en `.env.example`.

### Antes de una demo sin red confiable

La primera consulta de cada sitio descarga ~26 años horarios de POWER (tarda). Precargar:

```bash
for c in "42.03 -93.63" "43.30 -89.38" "41.45 -86.93" "41.15 -96.50"; do
  set -- $c; python -m rotaciones.cli --lat $1 --lon $2 --fin 2025
done
python -m rotaciones.ssurgo          # comprueba el mapa de suelos de los 4 sitios
```

### Otros comandos

```bash
python -m rotaciones.cli --lat 42.03 --lon -93.63 --textura franco_limoso   # salida en salida/resultado.json
PYTHONPATH=. python tools/generar_ejemplo.py                                # regenera web/ejemplo_*.json
```

## Publicar en Vercel

Ya está preparado: `app.py` (entrada que Vercel detecta), `vercel.json` (cabeceras de seguridad y caché
de imágenes), `.vercelignore` y `requirements.txt` solo con lo de producción.

1. **Antes de publicar**, refrescar y precargar los 4 sitios en local (ver "Antes de una demo sin red
   confiable"). Los datos de `cache/` (≈14 MB, comprimidos con gzip) viajan con el despliegue: Vercel no puede escribir en el disco del
   proyecto, así que lo que no esté ahí se descarga en vivo (≈30 s por sitio nuevo).
2. Confirmar que `cache/` está en git (`git status cache/`); `cache/_viejo/` queda fuera.
3. `vercel` (vista previa) y `vercel --prod`. No hace falta configurar variables.
4. En el panel de Vercel → Firewall, agregar un límite de peticiones a `/api/*` (ver `SECURITY.md`).

Caché de las APIs: los años cerrados de NASA POWER y los suelos del USDA se guardan para siempre; el
año en curso se vuelve a pedir cuando la copia tiene más de 3 días (si POWER falla, se usa la última).
Detalle en `AGENTS.md`, sección "Caché de APIs externas".

Rendimiento medido en local: `/api/evaluar` ≈ 0,8 s la primera vez por sitio y ≈ 5–20 ms después
(caché en memoria); además la respuesta lleva `s-maxage=6 h` para que la CDN de Vercel la reutilice.
Página ≈ 140 KB sin comprimir; ilustraciones de cultivos en WebP (≈ 30 KB cada una, antes ≈ 250 KB).

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

- Piloto en el Medio Oeste: centro de Iowa, sur de Wisconsin, norte de Indiana, este de Nebraska, u otras coordenadas.
- Rotaciones: maíz continuo, maíz–soya, maíz–soya–trigo, maíz–trigo. Soya o trigo continuos solo como punto de partida, no como alternativa.
- Humedad foliar: `RH2M ≥ umbral` con barrido; `--ajuste-dosel` como supuesto del usuario.
- Sin ML ni LLM en el producto; los textos salen del motor.
- Cinco problemas: moho blanco (soya); mancha gris, mancha de alquitrán, gusano de la raíz y roya del sur (maíz). No añadir más sin reglas con fuente.

## Año en curso

El cliente pide datos hasta hace 4 días. Los últimos meses vienen de un modelo provisional
que POWER reemplaza después: la interfaz marca el año en curso como provisional. Para
refrescar, borrar de `cache/` los archivos del año en curso.

## Límites declarados

- POWER es reanálisis en celdas de ~50 km: no ve el lote ni el dosel. Los niveles son
  comparación relativa y tendencia, no probabilidad.
- SSURGO describe unidades cartográficas y componentes dominantes; la clase devuelta puede no representar el campo concreto. El mapeo de su clase USDA a las seis texturas del modelo es aproximado.
- Materia orgánica: ningún dato la mide a escala de lote. Entra como índice cualitativo de
  residuo y como ajuste de sensibilidad (+10 % de agua útil, sin fuente).
- Balance hídrico: sin escorrentía, cada cultivo evaluado como si se sembrara todos los años,
  Kc mensual supuesto, parámetros de soya sin verificar.
- Gusano de la raíz: las variantes (diapausa extendida, variante de soya) pueden anular la
  rotación corta; el código refleja la primera y declara la segunda como laguna.
- Horas de mojado del moho blanco y meses de las ventanas susceptibles: supuestos.

## Pendiente, en orden

1. Video de 30 s con subtítulos en inglés (o hasta 7 diapositivas) y página del proyecto en inglés.
2. Declarar el uso de IA en el formulario de envío (código asistido e ilustraciones con marca de agua).
3. Decidir el año de referencia: 2026 provisional (actual) o 2025, el último completo.
4. Sustituir supuestos de `data/cultivos.json` por valores con fuente, o mostrarlos como tales.

## No hacer

No presentar niveles como probabilidad de infección. No rellenar umbrales sin fuente. No
afirmar que la humedad satelital mide la salud del suelo de un lote. No añadir un LLM que
redacte recomendaciones. No dar una recomendación única.

## License

Code: [MIT](LICENSE). Photos, AI-generated illustrations and data keep their own terms: see
[CREDITS.md](CREDITS.md). Live app: https://field-memory.vercel.app/?idioma=en
