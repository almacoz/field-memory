/* Memoria del lote — lógica de la interfaz. Se sirve aparte para que la CSP no necesite 'unsafe-inline' en scripts. */
/* =================== Textos de interfaz =================== */
const UI = {
  es: {
    marca: "Memoria del lote", menu: "Menú", verDemo: "Ver demo", cerrar: "Cerrar",
    pasos: ["Su lote", "Diagnóstico", "Rotación", "Resumen"],
    paso: "Paso {n} de 4",
    inicioEyebrow: "NASA Space Apps 2026",
    alcance: "Piloto · maíz, soya y trigo · Medio Oeste de EE. UU.",
    alcanceNota: "Las reglas y los ejemplos son de esta región. No se trasladan solos a otras zonas ni a otros cultivos.",
    origNasa: "Dato: NASA POWER", origUsda: "Dato: USDA SSURGO", origRegla: "Regla agronómica con fuente", origVio: "Lo que usted vio",
    origSupuesto: "Supuesto", origUsted: "Suelo elegido por usted",
    calcTit: "Cómo se llegó a este nivel", respaldoTit: "Respaldo de lo que se dice",
    conFuente: "Con fuente", supuestosN: "Supuestos", lagunasN: "Lagunas (lo que no se sabe)",
    nivelesQueSon: "Los niveles comparan cuánto deja cada rotación, ajustado por el clima histórico del sitio. No son la probabilidad de infección.",
    aguaEstim: "Estimación: entre {a} y {b} días según el suelo.",
    aniosTit: "Un año seco y uno típico en este sitio", anioSeco: "Año con más sed", anioTipico: "Año típico (mediana)",
    aniosCambia: "Qué cambia: solo la lluvia y el calor de ese año (NASA POWER).",
    aniosIgual: "Qué no cambia: el suelo, el cultivo y sus parámetros. Describe años pasados; no es un pronóstico.",
    diasSed: "{n} días con sed",
    iaMarca: "IA",
    calcResponder: "¿Lo vio en su lote? Responda abajo y el nivel se ajusta",
    catTit: "Hongos y plagas que evaluamos", catMenu: "Hongos y plagas (con fotos)", catVer: "Ver los 5 con fotos",
    catAyuda: "Toque uno para ver la foto, dónde pasa el invierno y qué lo frena.",
    catNoHoy: "Hoy no siembra {cultivos}: este problema aparece en su lote solo si la rotación incluye ese cultivo.",
    catCultivo: "Afecta a: {cultivos}", catSinFoto: "Sin foto con licencia libre", inicioCat: "Ver los hongos y plagas que evaluamos",
    fueraRegion: "Esas coordenadas están fuera de la zona piloto (Medio Oeste de EE. UU.). Las reglas de esta herramienta no se aplican allí.",
    sedQue: "¿Qué es un «día con sed»?",
    sedDef: "Es un día de la temporada del cultivo (mayo a septiembre para maíz y soya; marzo a julio para trigo) en que el suelo ya entregó cerca de la mitad del agua que la raíz puede sacar. Desde ese punto la planta no consigue toda el agua que necesita y crece menos: es estrés hídrico, calculado con el método FAO-56. Más días con sed = más tiempo pasando falta de agua.",
    inicioTitulo: "¿Qué siembro el año que viene?",
    iniSvgAlt: "Ilustración generada con IA: el maíz, la soya y el trigo cambian de lugar alrededor del lote, como en una rotación", iniSvgFuente: "NASA POWER · CLIMA DIARIO",
    iniSvgAnios: "25 AÑOS DE CLIMA", iniSvgLote: "SU LOTE", iniSvgMaiz: "Maíz", iniSvgSoya: "Soya", iniSvgTrigo: "Trigo",
    iniSvgHongosA: "HONGOS Y PLAGAS", iniSvgHongosB: "Pasan el invierno", iniSvgHongosC: "en el rastrojo o en el suelo",
    iniSvgAguaA: "AGUA EN EL SUELO", iniSvgAguaB: "Días con sed", iniSvgAguaC: "calculados desde 1981",
    iniSvgPie: "Cada cultivo corta el ciclo de un problema distinto",
    rsAlt: "Diagrama de la rotación {nombre} con sus problemas en atención y días con sed", rsNiveles: "Alta: {alta} · Media: {media}",
    rsHoyNiveles: "hoy: alta {alta} · media {media}", rsEsHoy: "es lo que hace hoy", rsAgua: "{n} días con sed",
    rsAguaHoy: "por temporada · hoy {n}", rsPorTemporada: "por temporada", rsPieMono: "Mismo cultivo cada año: el ciclo no se corta",
    inicioBajada: "Una temporada no termina con la cosecha. En el suelo quedan menos agua y hongos o plagas que pasan el invierno. Con 25 años de clima de la NASA le mostramos qué dejó este año en su zona y qué rotación lo reduce.",
    inicioPuntos: [["Su lote", "dónde está y qué siembra hoy."], ["Diagnóstico", "lo que dejó el año en su zona."], ["Rotación", "compare opciones lado a lado."], ["Resumen", "llévelo a su técnico."]],
    empezar: "Empezar", ilusIA: "Ilustración generada con IA",
    loteTitulo: "Cuéntenos sobre su lote", loteBajada: "Con esto ubicamos el clima de su zona y la rotación que hace hoy.",
    lugar: "Dónde está el lote", lugarAyuda: "Zonas maiceras del Medio Oeste de EE. UU.", otro: "Otras coordenadas…",
    actual: "Qué siembra hoy", actualAyuda: "Su rotación actual: contra ella comparamos.",
    mas: "Más ajustes (opcional)", suelo: "Tipo de suelo", labranza: "Labranza", sd: "Siembra directa", conv: "Convencional (arado)",
    ssurgo: "Traer el suelo del mapa del USDA", ssurgoAyuda: "El USDA tiene mapeado el suelo de todo EE. UU. Tomamos el que marca para la ubicación de su lote.",
    ssurgoCargando: "Consultando el mapa de suelos del USDA…",
    ssurgoError: "No se pudo consultar el mapa de suelos. Elija el tipo de suelo a mano.",
    ssPuntoRef: "No sabemos dónde está exactamente su lote. Para «{sitio}» usamos un punto de referencia ({coords}).",
    ssPuntoPropio: "Usamos las coordenadas que usted escribió ({coords}).",
    mapaTit: "Mapa de suelos: cuadro de {km} × {km} km alrededor del punto",
    mapaDonde: "Dónde", mapaCentro: "centrado en {coords}.", mapaCalles: "Ver este lugar en vista satelital ↗",
    mapaQue: "Qué ve", mapaQueTxt: "El terreno visto desde arriba. Cada mancha de color es el suelo que domina en esa parte, según el mapa oficial del USDA. El círculo negro es el punto de referencia. No muestra calles ni ríos.",
    mapaHacer: "Qué hacer", mapaHacerTxt: "Si su lote está dentro del cuadro, tóquelo y usamos ese suelo. Si no, elija el tipo en la lista o use «¿Cómo sé cuál es mi suelo?».",
    mapaAyuda: "Toque la parte del mapa donde está su lote para usar ese suelo.",
    mapaLeyAyuda: "También puede elegir un tipo de suelo en esta lista.",
    mapaOtro: "Otro (agua, zona urbana, turba)", mapaRef: "Punto de referencia", mapaLote: "Su lote (donde tocó)",
    mapaSinTex: "En esa parte el mapa no marca suelo agrícola (agua, zona urbana o turba). Elija otra.",
    mapaUsando: "Tipo de suelo que usaremos:",
    mapaNota: "Es lo que marca el mapa, no una medición de su lote.",
    mapaClima: "El clima no cambia: la NASA lo mide en celdas de unos 50 km.",
    ssurgoOkTit: "En ese punto, el mapa del USDA marca suelo", ssurgoOkListo: "Ya lo elegimos en «Tipo de suelo». Si su lote es distinto, cámbielo.",
    ssurgoSerie: "Serie de suelo en el mapa: {serie}", ssurgoPend: "pendiente de {a} a {b} %", ssurgoNota: "Es lo que marca el mapa, no una medición de su lote.",
    sinProblemas: "Para este cultivo todavía no tenemos reglas de hongos ni plagas.",
    comoSuelo: "¿Cómo sé cuál es mi suelo?",
    sgTit: "Cómo saber su tipo de suelo",
    sgIntro: "Con un puñado de tierra y dos minutos. Es la prueba al tacto que enseñan los servicios de extensión.",
    sgPasos: ["Tome tierra de los primeros 15 cm, sin piedras ni raíces.", "Mójela poco a poco y amásela hasta que quede como masilla.", "Apriétela en el puño: ¿forma una bola o se deshace?", "Empuje la tierra con el pulgar sobre el índice para hacer una cinta, y mida cuánto se alarga antes de quebrarse."],
    sgClases: {
      arena: "No forma bola, o se deshace al abrir la mano. Se siente áspera y no mancha los dedos.",
      franco_arenoso: "Forma una bola frágil. No hace cinta, o es de menos de 2,5 cm. Se sienten los granos de arena.",
      franco: "Bola firme. Cinta de menos de 2,5 cm. Ni muy áspera ni muy suave: una mezcla pareja.",
      franco_limoso: "Se siente suave, como harina o talco. Cinta corta, de menos de 2,5 cm, que se quiebra.",
      franco_arcillo_limoso: "Suave y algo pegajosa. Hace una cinta de 2,5 a 5 cm.",
      arcilla: "Muy pegajosa y plástica. Hace una cinta de más de 5 cm y brilla al frotarla."
    },
    sgElegir: "Es este",
    sgNoSeguro: "Si no está seguro, use el botón del mapa del USDA o deje Franco limoso, que es el valor por defecto.",
    sgFuente: "Basado en la guía de textura al tacto del USDA NRCS (Thien, 1979). Las clases están simplificadas a las seis que usa la herramienta.",
    lat: "Latitud", lon: "Longitud", analizar: "Analizar mi lote",
    cargando: "Consultando 25 años de datos de la NASA… la primera vez puede tardar un minuto.",
    sintetico: "Datos de ejemplo sintéticos: no se pudo consultar la NASA. Las cifras no son reales.",
    diagEyebrow: "Lo que dejó {anio}", diagTitulo: "Lo que su lote guarda para la próxima siembra",
    compararBtn: "Comparar rotaciones", aguaT: "Agua en el suelo", verDetalle: "Ver detalle",
    problemas: "Hongos y plagas", problemasAyuda: "Toque uno para ver por qué.",
    invierno: "Dónde pasa el invierno", esteAnio: "Este año", frena: "Qué lo frena",
    capFav: "Días con clima a su favor, por año", capSed: "Días con sed, por año",
    tecnico: "Pregunte a su técnico", si: "Sí", no: "No", nose: "No sé", actualizado: "Nivel actualizado con su respuesta.",
    fuentes: "De dónde sale esto", supuestos: "Supuestos", lagunas: "Lo que no sabemos", fotoVer: "Ver foto de referencia",
    limites: "Límites de este cálculo",
    elegirTitulo: "Elija una rotación para compararla", elegirBajada: "Toque una opción y vea qué cambia frente a lo que hace hoy.",
    ordenar: "Ordenar por", ord: { sanidad: "Sanidad", agua: "Agua", suelo: "Suelo" },
    critTit: { sanidad: "Sanidad", agua: "Agua", suelo: "Suelo (cualitativo)" },
    ordenIgual: "Con esta prioridad el orden no cambia.", ordenNuevo: "Ordenado por {prio}: primera {nombre}.",
    hoy: "Hoy", loQueHace: "Lo que hace hoy",
    frenteHoy: "Frente a lo que hace hoy", colProblema: "Problema", colHoy: "Hoy", colCon: "Con esta",
    mejora: "Mejora", empeora: "Empeora", igual: "Igual", sinDato: "Sin dato",
    agua: "Días con sed", sueloFila: "Suelo", bueno: "Lo bueno", costo: "El costo", hable: "Hable con su técnico sobre",
    detalleNiveles: "Ver por qué cambia cada nivel",
    royaNota: "{nombre}: llega con el viento; ninguna rotación cambia cuánto llega.",
    esLaActual: "Es lo que hace hoy: compárela con otra opción.",
    elegida: "Rotación elegida:", verResumen: "Ver resumen", siguiente: "Siguiente", atras: "Atrás",
    resumenTitulo: "Resumen para conversar con su técnico", resumenBajada: "No es una receta: es lo que muestran los datos para su zona.",
    gana: "Qué gana frente a hoy", paga: "Qué paga o arriesga", preguntas: "Preguntas para su técnico",
    sinCambios: "Sin cambios importantes frente a lo que hace hoy.",
    aguaMenos: "{d} días menos con sed por temporada.", aguaMas: "{d} días más con sed por temporada.",
    nivelPasa: "{p}: pasa de «{a}» a «{b}».",
    nivelAparece: "{p}: aparece con «{b}», porque esta rotación incluye un cultivo que lo hospeda.",
    nivelDesaparece: "{p}: desaparece del lote, porque esta rotación no incluye el cultivo que lo hospeda.",
    imprimir: "Imprimir o guardar PDF", cambiar: "Cambiar de rotación",
    menuIdioma: "Idioma", como: "Cómo lo sabemos", fuentesIA: "Fuentes, fotos y uso de IA", reiniciar: "Empezar de nuevo",
    pasosTitulo: "Cómo se calcula",
    paso1: "Contamos, año por año desde 2001, los días en que la temperatura y la humedad favorecieron a cada hongo.",
    paso2: "Vemos dónde pasa el invierno cada problema: en el rastrojo, en el suelo o si llega con el viento. De eso depende si cambiar de cultivo lo frena.",
    paso3: "Con la lluvia y la temperatura diarias desde 1981 calculamos cuántos días le faltó agua a cada cultivo en su tipo de suelo.",
    noSabemos: "Lo que no sabemos",
    noSabe: ["No vemos su lote: el dato cubre una zona de unos 50 km.", "No confirmamos enfermedades: contamos días de clima favorable.", "Cuánto más hongo deja un año favorable es un supuesto nuestro (un nivel de ajuste)."],
    fuentesTexto: "Cada problema enlaza las publicaciones de extensión agrícola de donde salen sus reglas. Las fotos muestran su autor y licencia.",
    demo: "Demo", demoPausa: "Pausar", demoSeguir: "Seguir", demoSalir: "Salir", demoSig: "Siguiente", demoFin: "Terminar",
    g: [
      "Esta herramienta responde una sola pregunta: qué sembrar el próximo año. Usa 25 años de clima de la NASA para el lugar del lote.",
      "Primero, el lote: un campo en el centro de Iowa que hoy siembra maíz sobre maíz.",
      "Diagnóstico: {titulo} Los datos de la NASA dicen qué dejó el año; las reglas de extensión agrícola, dónde pasa el invierno cada problema.",
      "Cada nivel muestra de dónde sale: la regla de rotación con su fuente, el clima del sitio según NASA POWER y lo que vio el agricultor. Los supuestos y lagunas quedan a la vista.",
      "Ahora se comparan rotaciones. Elegimos «{nombre}». A la derecha se ve qué cambia frente a maíz sobre maíz.",
      "Si al agricultor le importa más el agua, el orden cambia: primera «{nombre}». Cada orden usa un dato visible, sin puntajes ocultos.",
      "El resumen queda listo para hablarlo con su técnico. La decisión sigue siendo del agricultor."
    ]
  },
  en: {
    marca: "Field Memory", menu: "Menu", verDemo: "Watch demo", cerrar: "Close",
    pasos: ["Your field", "Diagnosis", "Rotation", "Summary"],
    paso: "Step {n} of 4",
    inicioEyebrow: "NASA Space Apps 2026",
    alcance: "Pilot · corn, soybean and wheat · US Midwest",
    alcanceNota: "Rules and examples are from this region. They do not carry over by themselves to other regions or crops.",
    origNasa: "Data: NASA POWER", origUsda: "Data: USDA SSURGO", origRegla: "Agronomic rule with source", origVio: "What you saw",
    origSupuesto: "Assumption", origUsted: "Soil chosen by you",
    calcTit: "How this level was reached", respaldoTit: "What backs each statement",
    conFuente: "With a source", supuestosN: "Assumptions", lagunasN: "Gaps (what is not known)",
    nivelesQueSon: "Levels compare how much each rotation leaves behind, adjusted by the site's climate history. They are not the probability of infection.",
    aguaEstim: "Estimate: between {a} and {b} days depending on the soil.",
    aniosTit: "A dry year and a typical year at this site", anioSeco: "Thirstiest year", anioTipico: "Typical year (median)",
    aniosCambia: "What changes: only that year's rain and heat (NASA POWER).",
    aniosIgual: "What stays the same: the soil, the crop and its parameters. It describes past years; it is not a forecast.",
    diasSed: "{n} thirsty days",
    iaMarca: "AI",
    calcResponder: "Did you see it in your field? Answer below and the level adjusts",
    catTit: "Fungi and pests we assess", catMenu: "Fungi and pests (with photos)", catVer: "See all 5 with photos",
    catAyuda: "Tap one to see the photo, where it spends the winter and what stops it.",
    catNoHoy: "You don't grow {cultivos} today: this problem shows up in your field only if the rotation includes that crop.",
    catCultivo: "Affects: {cultivos}", catSinFoto: "No freely licensed photo", inicioCat: "See the fungi and pests we assess",
    fueraRegion: "Those coordinates are outside the pilot area (US Midwest). This tool's rules do not apply there.",
    sedQue: "What is a “thirsty day”?",
    sedDef: "A day in the crop's season (May to September for corn and soybean; March to July for wheat) when the soil has already given up about half of the water the roots can reach. From then on the plant cannot get all the water it needs and grows less: this is water stress, calculated with the FAO-56 method. More thirsty days = more time short of water.",
    inicioTitulo: "What should I plant next year?",
    iniSvgAlt: "AI-generated illustration: corn, soybean and wheat swap places around the field, as in a rotation", iniSvgFuente: "NASA POWER · DAILY CLIMATE",
    iniSvgAnios: "25 YEARS OF CLIMATE", iniSvgLote: "YOUR FIELD", iniSvgMaiz: "Corn", iniSvgSoya: "Soybean", iniSvgTrigo: "Wheat",
    iniSvgHongosA: "FUNGI AND PESTS", iniSvgHongosB: "Survive the winter", iniSvgHongosC: "in crop residue or in the soil",
    iniSvgAguaA: "SOIL WATER", iniSvgAguaB: "Thirsty days", iniSvgAguaC: "calculated since 1981",
    iniSvgPie: "Each crop breaks the cycle of a different problem",
    rsAlt: "Diagram of the {nombre} rotation with its flagged problems and thirsty days", rsNiveles: "High: {alta} · Medium: {media}",
    rsHoyNiveles: "today: high {alta} · medium {media}", rsEsHoy: "this is what you do today", rsAgua: "{n} thirsty days",
    rsAguaHoy: "per season · today {n}", rsPorTemporada: "per season", rsPieMono: "Same crop every year: the cycle is not broken",
    inicioBajada: "A season does not end at harvest. The soil keeps less water, and fungi and pests that overwinter. With 25 years of NASA climate data we show what this year left behind in your area and which rotation reduces it.",
    inicioPuntos: [["Your field", "where it is and what you grow today."], ["Diagnosis", "what the year left in your area."], ["Rotation", "compare options side by side."], ["Summary", "take it to your advisor."]],
    empezar: "Get started", ilusIA: "AI-generated illustration",
    loteTitulo: "Tell us about your field", loteBajada: "We use this to locate your area's climate and your current rotation.",
    lugar: "Where the field is", lugarAyuda: "Corn areas of the US Midwest.", otro: "Other coordinates…",
    actual: "What you grow today", actualAyuda: "Your current rotation: we compare against it.",
    mas: "More settings (optional)", suelo: "Soil type", labranza: "Tillage", sd: "No-till", conv: "Conventional (plowed)",
    ssurgo: "Get the soil from the USDA map", ssurgoAyuda: "USDA has mapped the soil across the US. We take the one it shows for your field's location.",
    ssurgoCargando: "Looking up the USDA soil map…",
    ssurgoError: "The soil map could not be reached. Choose your soil type manually.",
    ssPuntoRef: "We don't know exactly where your field is. For “{sitio}” we use a reference point ({coords}).",
    ssPuntoPropio: "We use the coordinates you entered ({coords}).",
    mapaTit: "Soil map: {km} × {km} km square around the point",
    mapaDonde: "Where", mapaCentro: "centered on {coords}.", mapaCalles: "See this place on satellite view ↗",
    mapaQue: "What you see", mapaQueTxt: "The land seen from above. Each colored patch is the dominant soil in that part, according to the official USDA map. The black circle is the reference point. Roads and rivers are not shown.",
    mapaHacer: "What to do", mapaHacerTxt: "If your field is inside the square, tap it and we use that soil. If not, pick the type from the list or use “How do I know my soil type?”.",
    mapaAyuda: "Tap the part of the map where your field is to use that soil.",
    mapaLeyAyuda: "You can also pick a soil type from this list.",
    mapaOtro: "Other (water, urban, peat)", mapaRef: "Reference point", mapaLote: "Your field (where you tapped)",
    mapaSinTex: "The map shows no farm soil there (water, urban land or peat). Pick another spot.",
    mapaUsando: "Soil type we will use:",
    mapaNota: "This is what the map shows, not a measurement of your field.",
    mapaClima: "Climate does not change: NASA measures it in cells of about 50 km.",
    ssurgoOkTit: "At that point, the USDA map shows", ssurgoOkListo: "We already set it in “Soil type”. If your field is different, change it.",
    ssurgoSerie: "Soil series on the map: {serie}", ssurgoPend: "{a} to {b}% slope", ssurgoNota: "This is what the map shows, not a measurement of your field.",
    sinProblemas: "We don't have fungus or pest rules for this crop yet.",
    comoSuelo: "How do I know my soil type?",
    sgTit: "How to find your soil type",
    sgIntro: "All it takes is a handful of soil and two minutes. This is the texture-by-feel test taught by extension services.",
    sgPasos: ["Take soil from the top 6 inches, without stones or roots.", "Wet it little by little and knead it until it feels like putty.", "Squeeze it in your fist: does it form a ball or fall apart?", "Push the soil between thumb and forefinger to make a ribbon, and see how long it gets before it breaks."],
    sgClases: {
      arena: "Doesn't form a ball, or falls apart when you open your hand. Feels gritty and doesn't stain your fingers.",
      franco_arenoso: "Forms a weak ball. No ribbon, or shorter than 1 inch. You can feel sand grains.",
      franco: "Firm ball. Ribbon shorter than 1 inch. Neither very gritty nor very smooth: an even mix.",
      franco_limoso: "Feels smooth, like flour or talc. Short ribbon, under 1 inch, that breaks.",
      franco_arcillo_limoso: "Smooth and somewhat sticky. Makes a ribbon of 1 to 2 inches.",
      arcilla: "Very sticky and plastic. Makes a ribbon longer than 2 inches and shines when rubbed."
    },
    sgElegir: "This one",
    sgNoSeguro: "If you're not sure, use the USDA map button or keep Silt loam, the default.",
    sgFuente: "Based on the USDA NRCS texture-by-feel guide (Thien, 1979), simplified to the six classes this tool uses.",
    lat: "Latitude", lon: "Longitude", analizar: "Analyze my field",
    cargando: "Fetching 25 years of NASA data… the first time can take a minute.",
    sintetico: "Synthetic sample data: NASA could not be reached. These figures are not real.",
    diagEyebrow: "What {anio} left behind", diagTitulo: "What your field carries into the next season",
    compararBtn: "Compare rotations", aguaT: "Water in the soil", verDetalle: "See detail",
    problemas: "Fungi and pests", problemasAyuda: "Tap one to see why.",
    invierno: "Where it spends the winter", esteAnio: "This year", frena: "What holds it back",
    capFav: "Days of favorable weather, per year", capSed: "Thirsty days, per year",
    tecnico: "Ask your advisor", si: "Yes", no: "No", nose: "Not sure", actualizado: "Level updated with your answer.",
    fuentes: "Where this comes from", supuestos: "Assumptions", lagunas: "What we do not know", fotoVer: "See reference photo",
    limites: "Limits of this calculation",
    elegirTitulo: "Pick a rotation to compare it", elegirBajada: "Tap an option to see what changes compared with what you do today.",
    ordenar: "Sort by", ord: { sanidad: "Crop health", agua: "Water", suelo: "Soil" },
    critTit: { sanidad: "Crop health", agua: "Water", suelo: "Soil (qualitative)" },
    ordenIgual: "With this priority the order stays the same.", ordenNuevo: "Sorted by {prio}: first is {nombre}.",
    hoy: "Today", loQueHace: "What you do today",
    frenteHoy: "Compared with today", colProblema: "Problem", colHoy: "Today", colCon: "With this",
    mejora: "Better", empeora: "Worse", igual: "Same", sinDato: "No data",
    agua: "Thirsty days", sueloFila: "Soil", bueno: "The upside", costo: "The cost", hable: "Talk to your advisor about",
    detalleNiveles: "See why each level changes",
    royaNota: "{nombre}: blows in on the wind; no rotation changes how much arrives.",
    esLaActual: "This is what you do today: compare it with another option.",
    elegida: "Chosen rotation:", verResumen: "See summary", siguiente: "Next", atras: "Back",
    resumenTitulo: "Summary to discuss with your advisor", resumenBajada: "It is not a prescription: it is what the data shows for your area.",
    gana: "What you gain versus today", paga: "What you pay or risk", preguntas: "Questions for your advisor",
    sinCambios: "No major changes compared with today.",
    aguaMenos: "{d} fewer thirsty days per season.", aguaMas: "{d} more thirsty days per season.",
    nivelPasa: "{p}: goes from “{a}” to “{b}”.",
    nivelAparece: "{p}: appears at “{b}”, because this rotation includes a crop that hosts it.",
    nivelDesaparece: "{p}: leaves the field, because this rotation does not include the crop that hosts it.",
    imprimir: "Print or save as PDF", cambiar: "Change rotation",
    menuIdioma: "Language", como: "How we know", fuentesIA: "Sources, photos and AI use", reiniciar: "Start over",
    pasosTitulo: "How it is calculated",
    paso1: "Year by year since 2001, we count the days when temperature and humidity favored each fungus.",
    paso2: "We look at where each problem spends the winter: in crop residue, in the soil, or blowing in on the wind. That decides whether changing crops holds it back.",
    paso3: "With daily rainfall and temperature since 1981 we calculate how many days each crop ran short of water in your soil type.",
    noSabemos: "What we do not know",
    noSabe: ["We do not see your field: the data covers an area about 50 km wide.", "We do not confirm disease: we count days of favorable weather.", "How much extra fungus a favorable year leaves is our assumption (a one-level adjustment)."],
    fuentesTexto: "Each problem links the agricultural extension publications its rules come from. Photos show their author and license.",
    demo: "Demo", demoPausa: "Pause", demoSeguir: "Resume", demoSalir: "Exit", demoSig: "Next", demoFin: "Finish",
    g: [
      "This tool answers one question: what to plant next year. It uses 25 years of NASA climate data for the field's location.",
      "First, the field: a farm in central Iowa that grows corn after corn today.",
      "Diagnosis: {titulo} NASA data tells what the year left behind; extension rules tell where each problem spends the winter.",
      "Each level shows where it comes from: the rotation rule with its source, the site's climate from NASA POWER, and what the farmer saw. Assumptions and gaps stay visible.",
      "Now we compare rotations. We pick “{nombre}”. On the right you see what changes versus corn after corn.",
      "If the farmer cares more about water, the order changes: first is “{nombre}”. Each order uses one visible figure, with no hidden scores.",
      "The summary is ready to discuss with an advisor. The decision stays with the farmer."
    ]
  }
};

const SITIOS = [
  { clave: "iowa", lat: 42.03, lon: -93.63, es: "Centro de Iowa", en: "Central Iowa", cerca: ["en Ames, Iowa (borde de la ciudad)", "in Ames, Iowa (edge of town)"] },
  { clave: "wisconsin", lat: 43.30, lon: -89.38, es: "Sur de Wisconsin", en: "Southern Wisconsin", cerca: ["a unos 4 km de Arlington, Wisconsin", "about 4 km from Arlington, Wisconsin"] },
  { clave: "indiana", lat: 41.45, lon: -86.93, es: "Norte de Indiana", en: "Northern Indiana", cerca: ["a unos 3 km de Wanatah, Indiana", "about 3 km from Wanatah, Indiana"] },
  { clave: "nebraska", lat: 41.15, lon: -96.50, es: "Este de Nebraska", en: "Eastern Nebraska", cerca: ["a unos 9 km de Mead, Nebraska", "about 9 km from Mead, Nebraska"] }
];
const ROTS = {
  maiz_continuo: ["Maíz otra vez", "Corn again"], soya_continua: ["Soya otra vez", "Soybean again"], trigo_continuo: ["Trigo otra vez", "Wheat again"],
  maiz_soya: ["Maíz y soya", "Corn and soybean"],
  maiz_soya_trigo: ["Maíz, soya y trigo", "Corn, soybean and wheat"], maiz_trigo: ["Maíz y trigo", "Corn and wheat"]
};
const TEX = {
  arena: ["Arena", "Sand"], franco_arenoso: ["Franco arenoso", "Sandy loam"], franco: ["Franco", "Loam"],
  franco_limoso: ["Franco limoso", "Silt loam"], franco_arcillo_limoso: ["Franco arcillo-limoso", "Silty clay loam"],
  arcilla: ["Arcilla", "Clay"]
};
const PESO = { sin_hospedante: 0, baja: 1, media: 2, alta: 3 };

/* =================== Utilidades =================== */
const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, ...hijos) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") e.className = v; else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v);
  }
  hijos.flat().filter(h => h !== null && h !== undefined && h !== false).forEach(h => e.append(h));
  return e;
};
const svg = d => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", "2"); s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("aria-hidden", "true"); s.innerHTML = d; return s; };
const ICO = {
  der: '<path d="M9 6l6 6-6 6"/>', izq: '<path d="M15 6l-6 6 6 6"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  libro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>', play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>', mundo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  print: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/>'
};
const nivel = (n, solo = false) => el("span", { class: "nivel" + (solo ? " solo" : ""), "data-nivel": n.clave,
  title: n.etiqueta, "aria-label": solo ? n.etiqueta : null, role: solo ? "img" : null }, solo ? n.simbolo : `${n.simbolo} ${n.etiqueta}`);
const lista = items => el("ul", {}, items.map(i => el("li", {}, /^https?:/.test(i) ? el("a", { href: i, target: "_blank", rel: "noopener", text: i }) : i)));
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? "");

/* =================== Estado =================== */
const S = {
  idioma: "es", paso: 0, vista: null, cargando: false, error: null,
  form: { sitio: "iowa", lat: 42.03, lon: -93.63, actual: "maiz_continuo", textura: "franco_limoso", labranza: "siembra_directa" },
  vio: {}, orden: "sanidad", ordenPrevio: null, ordenMsg: "", elegida: null, nivelesPrevios: null,
  demo: null
};
const T = () => UI[S.idioma];

function graficoSerie25(dato, etiquetaAria) {
  if (!dato || !dato.serie) return null;
  const entradas = Object.entries(dato.serie);
  if (!entradas.length) return null;

  const ns = "http://www.w3.org/2000/svg";
  const W = 250, H = 48, base = 42;
  const vals = entradas.map(([, v]) => Number(v) || 0);
  const maxV = Math.max(...vals, 1);
  const paso = W / entradas.length;
  const anchoBarra = Math.max(4, paso - 2.5);

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "serie-svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", etiquetaAria);

  const lineaBase = document.createElementNS(ns, "line");
  lineaBase.setAttribute("x1", "0");
  lineaBase.setAttribute("y1", String(base));
  lineaBase.setAttribute("x2", String(W));
  lineaBase.setAttribute("y2", String(base));
  lineaBase.setAttribute("stroke", "#D1D5DB");
  lineaBase.setAttribute("stroke-width", "1.5");
  svg.append(lineaBase);

  entradas.forEach(([anio, valor], idx) => {
    const v = Number(valor) || 0;
    const esActual = String(anio) === String(dato.anio);
    const hBarra = v === 0 ? 3 : Math.max(5, Math.round((v / maxV) * (base - 10)));
    const x = idx * paso + 1;
    const y = base - hBarra;

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", x.toFixed(1));
    rect.setAttribute("y", y.toFixed(1));
    rect.setAttribute("width", anchoBarra.toFixed(1));
    rect.setAttribute("height", hBarra.toFixed(1));
    rect.setAttribute("rx", "2");
    rect.setAttribute("fill", esActual ? "#1F5135" : (v === 0 ? "#E5E7EB" : "#9CA3AF"));
    if (esActual) {
      rect.setAttribute("stroke", "#1F5135");
      rect.setAttribute("stroke-width", "1.5");
    }
    svg.append(rect);

    if (esActual) {
      const marca = document.createElementNS(ns, "circle");
      marca.setAttribute("cx", (x + anchoBarra / 2).toFixed(1));
      marca.setAttribute("cy", Math.max(4, y - 5).toFixed(1));
      marca.setAttribute("r", "3");
      marca.setAttribute("fill", "#1F5135");
      svg.append(marca);
    }
  });

  const primerAnio = entradas[0][0];
  const ultimoAnio = entradas[entradas.length - 1][0];

  return el("div", { class: "serie-25" },
    svg,
    el("div", { class: "serie-pie" },
      el("span", { text: primerAnio }),
      el("span", { class: "serie-actual-tag", text: `${dato.anio}: ${dato.dias}` }),
      el("span", { text: ultimoAnio })
    )
  );
}

/* =================== Datos =================== */
async function consultar() {
  S.cargando = true; S.error = null; render();
  const f = S.form;
  const q = new URLSearchParams({ lat: f.lat, lon: f.lon, actual: f.actual, textura: f.textura, labranza: f.labranza, idioma: S.idioma });
  const v = Object.entries(S.vio).filter(([, r]) => r !== "nose").map(([k, r]) => `${k}:${r}`).join(",");
  if (v) q.set("vio", v);
  if (S.vista) S.nivelesPrevios = Object.fromEntries(S.vista.lote_hoy.tarjetas.map(c => [c.clave, c.nivel.clave]));
  try {
    const r = await fetch("/api/evaluar?" + q);
    if (r.status === 422) { S.cargando = false; S.vista = null; S.error = T().fueraRegion; render(); return; }
    if (!r.ok) throw new Error(r.status);
    S.vista = (await r.json()).vista;
  } catch (e) {
    try { S.vista = await (await fetch(`ejemplo_${S.idioma}.json`)).json(); } catch (_) { S.error = true; }
  }
  S.cargando = false;
  if (S.vista && (!S.elegida || !S.vista.opciones.some(o => o.clave === S.elegida))) S.elegida = primeraNoActual("sanidad");
  S.ordenPrevio = null; S.ordenMsg = "";
  render();
}

function ordenadas(k = S.orden) { return [...S.vista.opciones].sort((a, b) => (a.orden[k] ?? 0) - (b.orden[k] ?? 0)); }
function primeraNoActual(k) { const o = ordenadas(k); return (o.find(x => !x.es_actual) || o[0]).clave; }
function fila(clave) { return S.vista.matriz.filas.find(f => f.clave === clave); }
function nombreRot(clave) { return (S.vista && S.vista.rotaciones_disponibles.find(r => r.clave === clave) || {}).nombre || ROTS[clave][S.idioma === "en" ? 1 : 0]; }

/* =================== Navegación =================== */
function ir(paso, empujar = true) {
  if (paso >= 2 && !S.vista) paso = 1;
  S.paso = paso;
  if (empujar) history.pushState({ paso }, "", paso ? `#paso-${paso}` : "#");
  render();
  window.scrollTo(0, 0);
  $("#vista").focus({ preventScroll: true });
}
window.addEventListener("popstate", e => ir((e.state && e.state.paso) || 0, false));

/* =================== Render general =================== */
function render() {
  const t = T();
  document.documentElement.lang = S.idioma;
  document.title = `${t.marca} — ${t.inicioTitulo}`;
  document.querySelectorAll("[data-t]").forEach(n => { if (typeof t[n.dataset.t] === "string") n.textContent = t[n.dataset.t]; });
  $("#lat-cerrar").setAttribute("aria-label", t.cerrar);
  renderPasos();
  const pantallas = [pInicio, pLote, pDiag, pElegir, pResumen];
  $("#vista").replaceChildren(pantallas[S.paso]());
  renderPie();
}

function renderPasos() {
  const t = T(), ol = $("#pasos");
  ol.replaceChildren(...t.pasos.flatMap((nom, i) => {
    const n = i + 1, disponible = n === 1 || !!S.vista;
    const b = el("button", { type: "button", disabled: !disponible, "aria-current": S.paso === n ? "step" : null,
      class: S.paso > n ? "hecho" : null, onclick: () => ir(n) },
      el("span", { class: "n", text: S.paso > n ? "✓" : String(n) }), el("span", { class: "txt", text: nom }));
    const li = el("li", {}, b);
    return i ? [el("li", { class: "sep", "aria-hidden": "true" }), li] : [li];
  }));
}

function renderPie() {
  const t = T(), pie = $("#pie-nav");
  pie.hidden = S.paso === 0;
  if (pie.hidden) return;
  const atras = $("#btn-atras"), sig = $("#btn-sig"), res = $("#resumen-sel");
  atras.replaceChildren(svg(ICO.izq), el("span", { text: t.atras }));
  atras.onclick = () => ir(S.paso - 1);
  res.replaceChildren();
  sig.hidden = false;
  if (S.paso === 1) {
    sig.replaceChildren(el("span", { text: t.analizar }), svg(ICO.der));
    sig.disabled = S.cargando;
    sig.onclick = analizar;
  } else if (S.paso === 2) {
    sig.replaceChildren(el("span", { text: t.compararBtn }), svg(ICO.der));
    sig.disabled = false; sig.onclick = () => ir(3);
  } else if (S.paso === 3) {
    res.append(el("span", { text: t.elegida }), el("strong", { text: nombreRot(S.elegida) }));
    sig.replaceChildren(el("span", { text: t.verResumen }), svg(ICO.der));
    sig.disabled = false; sig.onclick = () => ir(4);
  } else {
    sig.hidden = true;
    res.append(el("span", { text: t.elegida }), el("strong", { text: nombreRot(S.elegida) }));
  }
}

function cabeza(eyebrow, titulo, bajada) {
  return el("div", { class: "cabeza-pantalla" }, el("p", { class: "eyebrow", text: eyebrow }),
    el("h2", { text: titulo }), bajada ? el("p", { class: "suave", text: bajada }) : null);
}

/* =================== Pantalla 0: inicio =================== */
/* Ilustración de inicio animada (los cultivos cambian de lugar): SVG generado con IA (Gemini), entregado por Alex; textos en UI.es / UI.en.
   Conserva la marca "generated by AI". Ids y clases con prefijo "ini-" para no chocar con la página. */
function svgInicio() {
  const t = T(), x = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 460" class="svg-inicio" role="img" aria-label="${x(t.iniSvgAlt)}" fill="none" xmlns:c2pa="http://c2pa.org/manifest">
  <defs>
    <filter id="ini-card-shadow" x="-4%" y="-4%" width="108%" height="110%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#0F291E" flood-opacity="0.06"></feDropShadow>
      <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#0F291E" flood-opacity="0.04"></feDropShadow>
    </filter>
    <filter id="ini-medallion-shadow" x="-12%" y="-12%" width="124%" height="128%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#143322" flood-opacity="0.12"></feDropShadow>
    </filter>
    <linearGradient id="ini-bg-card" x1="0" y1="0" x2="640" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"></stop>
      <stop offset="100%" stop-color="#F7FAF8"></stop>
    </linearGradient>
    <linearGradient id="ini-sky-scene" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#BCE2E8"></stop>
      <stop offset="65%" stop-color="#E4F4F1"></stop>
      <stop offset="100%" stop-color="#F2F9E6"></stop>
    </linearGradient>
    <linearGradient id="ini-hill-light" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A8E05F"></stop>
      <stop offset="100%" stop-color="#58A83E"></stop>
    </linearGradient>
    <linearGradient id="ini-hill-dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#489638"></stop>
      <stop offset="100%" stop-color="#1B5628"></stop>
    </linearGradient>
    <linearGradient id="ini-leaf-bright" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#BBE84B"></stop>
      <stop offset="55%" stop-color="#68B82E"></stop>
      <stop offset="100%" stop-color="#2E7021"></stop>
    </linearGradient>
    <linearGradient id="ini-leaf-deep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#52A130"></stop>
      <stop offset="100%" stop-color="#184D22"></stop>
    </linearGradient>
    <linearGradient id="ini-corn-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFF056"></stop>
      <stop offset="45%" stop-color="#FDB813"></stop>
      <stop offset="100%" stop-color="#DF7800"></stop>
    </linearGradient>
    <linearGradient id="ini-soy-pod" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EAF26B"></stop>
      <stop offset="55%" stop-color="#B5D140"></stop>
      <stop offset="100%" stop-color="#689425"></stop>
    </linearGradient>
    <linearGradient id="ini-wheat-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE66D"></stop>
      <stop offset="50%" stop-color="#F7A81B"></stop>
      <stop offset="100%" stop-color="#C46006"></stop>
    </linearGradient>
    <linearGradient id="ini-core-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#214E34"></stop>
      <stop offset="100%" stop-color="#123020"></stop>
    </linearGradient>
    <pattern id="ini-subtle-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1E4631" stroke-width="0.6" stroke-opacity="0.045"></path>
    </pattern>
    <clipPath id="ini-clip-corn"><circle cx="62" cy="62" r="54"></circle></clipPath>
    <clipPath id="ini-clip-soy"><circle cx="62" cy="62" r="54"></circle></clipPath>
    <clipPath id="ini-clip-wheat"><circle cx="62" cy="62" r="54"></circle></clipPath>
    <style>
      .ini-sans { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; }
      .ini-mono { font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace; }
    </style>
  </defs>
  <g filter="url(#ini-card-shadow)">
    <rect x="16" y="12" width="608" height="436" rx="24" fill="url(#ini-bg-card)" stroke="#E2E8E4" stroke-width="1.5"></rect>
    <rect x="16" y="12" width="608" height="436" rx="24" fill="url(#ini-subtle-grid)"></rect>
  </g>
  <g transform="translate(36, 30)">
    <rect x="0" y="0" width="206" height="30" rx="15" fill="#EEF7F1" stroke="#C6E6D0" stroke-width="1"></rect>
    <circle cx="15" cy="15" r="4" fill="#1E6B3B"></circle>
    <text x="26" y="19" class="ini-mono" font-size="10.5" font-weight="700" fill="#1B4D2E" letter-spacing="0.4">${x(t.iniSvgFuente)}</text>
    <rect x="436" y="0" width="132" height="30" rx="10" fill="#F4F6F5" stroke="#DFE5E1" stroke-width="1"></rect>
    <text x="502" y="19" text-anchor="middle" class="ini-mono" font-size="10.5" font-weight="600" fill="#475569">${x(t.iniSvgAnios)}</text>
  </g>
  <circle cx="320" cy="215" r="126" fill="#FFFFFF" fill-opacity="0.65" stroke="#E2E8E4" stroke-width="1"></circle>
  <circle cx="320" cy="215" r="100" fill="none" stroke="#CBD5CE" stroke-width="1.5" stroke-dasharray="6 6">
    <animateTransform attributeName="transform" type="rotate" values="0 320 215; 120 320 215; -60 320 215; 0 320 215" keyTimes="0; 0.33; 0.66; 1" dur="9s" repeatCount="indefinite" />
  </circle>
  <path d="M 262 104 A 125 125 0 0 1 378 104" fill="none" stroke="#C88A14" stroke-width="4" stroke-linecap="round"></path>
  <polygon points="384,109 371,106 379,96" fill="#C88A14"></polygon>
  <polygon points="256,109 269,106 261,96" fill="#C88A14"></polygon>
  <path d="M 442 215 A 125 125 0 0 1 382 322" fill="none" stroke="#1E7E3A" stroke-width="4" stroke-linecap="round"></path>
  <polygon points="376,325 388,319 385,331" fill="#1E7E3A"></polygon>
  <polygon points="442,209 436,221 448,220" fill="#1E7E3A"></polygon>
  <path d="M 258 322 A 125 125 0 0 1 198 215" fill="none" stroke="#257345" stroke-width="4" stroke-linecap="round"></path>
  <polygon points="198,209 192,221 204,220" fill="#257345"></polygon>
  <polygon points="264,325 252,319 255,331" fill="#257345"></polygon>
  <g>
    <circle cx="320" cy="215" r="42" fill="url(#ini-core-grad)" filter="url(#ini-medallion-shadow)"></circle>
    <path d="M 304 203 Q 320 197 336 203" stroke="#86EFAC" stroke-width="2" stroke-linecap="round"></path>
    <path d="M 301 210 Q 320 204 339 210" stroke="#BBF7D0" stroke-width="1.8" stroke-linecap="round"></path>
    <text x="320" y="227" text-anchor="middle" class="ini-sans" font-size="11.5" font-weight="700" fill="#FFFFFF" letter-spacing="0.8">${x(t.iniSvgLote)}</text>
  </g>
  <g filter="url(#ini-medallion-shadow)">
    <animateTransform attributeName="transform" type="translate" values="
        136 72; 136 72;
        258 28; 392 72; 380 72; 380 72;
        258 118; 124 72; 136 72; 136 72;
        136 60; 136 76; 136 72" keyTimes="
        0; 0.20;
        0.26; 0.31; 0.34; 0.53;
        0.59; 0.64; 0.67; 0.86;
        0.92; 0.97; 1" calcMode="spline" keySplines="
        0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1" dur="9s" repeatCount="indefinite" />
    <circle cx="62" cy="62" r="56" fill="#FFFFFF" stroke="#FDE047" stroke-width="3"></circle>
    <g clip-path="url(#ini-clip-corn)">
      <rect x="0" y="0" width="124" height="124" fill="url(#ini-sky-scene)"></rect>
      <path d="M 16 48 H 48 C 52 48, 54 43, 50 40 C 46 37, 42 39, 40 34 C 36 28, 26 28, 23 35 C 18 35, 14 40, 16 48 Z" fill="#FFFFFF" opacity="0.9"></path>
      <path d="M 0 76 Q 38 64 80 78 T 124 74 L 124 124 L 0 124 Z" fill="url(#ini-hill-light)"></path>
      <path d="M 0 84 Q 36 74 72 86 L 64 92 Q 32 80 0 90 Z" fill="#D9F99D" opacity="0.6"></path>
      <path d="M 0 96 Q 62 82 124 96 L 124 124 L 0 124 Z" fill="url(#ini-hill-dark)"></path>
      <g transform="translate(66, 62) rotate(16) translate(-66, -62)">
        <path d="M 48 102 C 45 55, 53 16, 66 14 C 79 16, 87 55, 84 102 Z" fill="url(#ini-corn-gold)"></path>
        <g fill="#FEF08A" opacity="0.92">
          <rect x="58" y="24" width="7" height="6" rx="2.5"></rect>
          <rect x="67" y="24" width="7" height="6" rx="2.5"></rect>
          <rect x="54" y="33" width="8" height="6.5" rx="2.5"></rect>
          <rect x="64" y="33" width="8" height="6.5" rx="2.5"></rect>
          <rect x="74" y="34" width="6" height="6" rx="2.5"></rect>
          <rect x="52" y="42" width="8.5" height="7" rx="2.5"></rect>
          <rect x="63" y="42" width="8.5" height="7" rx="2.5"></rect>
          <rect x="73" y="43" width="7" height="6.5" rx="2.5"></rect>
          <rect x="51" y="52" width="8.5" height="7" rx="2.5"></rect>
          <rect x="62" y="52" width="8.5" height="7" rx="2.5"></rect>
          <rect x="72" y="53" width="7.5" height="6.5" rx="2.5"></rect>
          <rect x="52" y="62" width="8.5" height="7" rx="2.5"></rect>
          <rect x="63" y="62" width="8.5" height="7" rx="2.5"></rect>
          <rect x="73" y="63" width="7" height="6.5" rx="2.5"></rect>
        </g>
      </g>
      <path d="M 60 120 C 42 92, 22 65, 6 70 C 26 82, 38 102, 48 122 Z" fill="url(#ini-leaf-bright)"></path>
      <path d="M 64 122 C 80 90, 102 68, 118 76 C 98 86, 84 104, 72 122 Z" fill="url(#ini-leaf-bright)"></path>
      <path d="M 56 124 C 48 96, 48 68, 62 48 C 62 76, 66 102, 72 124 Z" fill="#84CC16"></path>
    </g>
    <path d="M 18 74 C 8 68, 2 72, 0 78 C 8 76, 14 78, 20 82 Z" fill="#68B82E"></path>
    <rect x="18" y="104" width="88" height="24" rx="12" fill="#854D0E"></rect>
    <text x="62" y="120" text-anchor="middle" class="ini-sans" font-size="11.5" font-weight="700" fill="#FFFFFF">${x(t.iniSvgMaiz)}</text>
  </g>
  <g filter="url(#ini-medallion-shadow)">
    <animateTransform attributeName="transform" type="translate" values="
        380 72; 380 72;
        258 118; 124 72; 136 72; 136 72;
        175 185; 266 284; 258 272; 258 272;
        345 185; 388 60; 380 72" keyTimes="
        0; 0.20;
        0.26; 0.31; 0.34; 0.53;
        0.59; 0.64; 0.67; 0.86;
        0.92; 0.97; 1" calcMode="spline" keySplines="
        0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1" dur="9s" repeatCount="indefinite" />
    <circle cx="62" cy="62" r="56" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="3"></circle>
    <g clip-path="url(#ini-clip-soy)">
      <rect x="0" y="0" width="124" height="124" fill="url(#ini-sky-scene)"></rect>
      <path d="M 0 72 Q 62 56 124 74 L 124 124 L 0 124 Z" fill="url(#ini-hill-light)"></path>
      <path d="M 0 84 Q 55 68 124 88 L 124 96 Q 55 78 0 94 Z" fill="#D9F99D" opacity="0.55"></path>
      <path d="M 0 94 Q 62 78 124 94 L 124 124 L 0 124 Z" fill="url(#ini-hill-dark)"></path>
      <path d="M 52 115 C 20 112, 6 84, 18 56 C 42 64, 54 88, 52 115 Z" fill="url(#ini-leaf-bright)"></path>
      <path d="M 50 110 L 24 68" stroke="#D9F99D" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M 72 115 C 104 112, 118 84, 106 56 C 82 64, 70 88, 72 115 Z" fill="url(#ini-leaf-bright)"></path>
      <path d="M 74 110 L 100 68" stroke="#D9F99D" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M 58 26 C 38 40, 28 66, 34 90 C 52 84, 64 60, 62 30 Z" fill="url(#ini-soy-pod)" stroke="#4D7C0F" stroke-width="1.2"></path>
      <ellipse cx="51" cy="48" rx="5.5" ry="7.5" transform="rotate(20 51 48)" fill="#ECFCCB"></ellipse>
      <ellipse cx="45" cy="64" rx="5.5" ry="7.5" transform="rotate(20 45 64)" fill="#ECFCCB"></ellipse>
      <ellipse cx="40" cy="79" rx="5" ry="6.5" transform="rotate(20 40 79)" fill="#ECFCCB"></ellipse>
      <path d="M 66 28 C 86 42, 96 68, 90 92 C 72 86, 60 62, 62 30 Z" fill="url(#ini-soy-pod)" stroke="#4D7C0F" stroke-width="1.2"></path>
      <ellipse cx="73" cy="50" rx="5.5" ry="7.5" transform="rotate(-20 73 50)" fill="#ECFCCB"></ellipse>
      <ellipse cx="79" cy="66" rx="5.5" ry="7.5" transform="rotate(-20 79 66)" fill="#ECFCCB"></ellipse>
      <ellipse cx="84" cy="81" rx="5" ry="6.5" transform="rotate(-20 84 81)" fill="#ECFCCB"></ellipse>
      <path d="M 62 32 C 52 54, 52 82, 62 104 C 72 82, 72 54, 62 32 Z" fill="url(#ini-soy-pod)" stroke="#3F6212" stroke-width="1.2"></path>
      <ellipse cx="62" cy="55" rx="5.5" ry="7.5" fill="#F7FEE7"></ellipse>
      <ellipse cx="62" cy="72" rx="5.5" ry="7.5" fill="#F7FEE7"></ellipse>
      <ellipse cx="62" cy="88" rx="4.5" ry="6.5" fill="#F7FEE7"></ellipse>
    </g>
    <path d="M 74 16 C 82 2, 98 -2, 106 8 C 98 20, 84 22, 74 16 Z" fill="url(#ini-leaf-bright)"></path>
    <path d="M 76 15 L 98 8" stroke="#D9F99D" stroke-width="1.2" stroke-linecap="round"></path>
    <rect x="18" y="104" width="88" height="24" rx="12" fill="#1B4D2E"></rect>
    <text x="62" y="120" text-anchor="middle" class="ini-sans" font-size="11.5" font-weight="700" fill="#FFFFFF">${x(t.iniSvgSoya)}</text>
  </g>
  <g filter="url(#ini-medallion-shadow)">
    <animateTransform attributeName="transform" type="translate" values="
        258 272; 258 272;
        258 260; 258 276; 258 272; 258 272;
        345 185; 388 60; 380 72; 380 72;
        295 165; 250 284; 258 272" keyTimes="
        0; 0.20;
        0.26; 0.31; 0.34; 0.53;
        0.59; 0.64; 0.67; 0.86;
        0.92; 0.97; 1" calcMode="spline" keySplines="
        0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1; 0 0 1 1;
        0.3 0 0.6 1; 0.2 0.8 0.4 1; 0.4 0 0.6 1" dur="9s" repeatCount="indefinite" />
    <circle cx="62" cy="62" r="56" fill="#FFFFFF" stroke="#FDE68A" stroke-width="3"></circle>
    <g clip-path="url(#ini-clip-wheat)">
      <rect x="0" y="0" width="124" height="124" fill="url(#ini-sky-scene)"></rect>
      <path d="M 14 44 H 44 C 48 44, 50 39, 46 36 C 42 33, 38 35, 36 30 C 32 24, 22 24, 19 31 C 14 31, 12 36, 14 44 Z" fill="#FFFFFF" opacity="0.9"></path>
      <path d="M 0 74 Q 62 58 124 74 L 124 124 L 0 124 Z" fill="url(#ini-hill-light)"></path>
      <path d="M 0 86 Q 62 72 124 88 L 124 124 L 0 124 Z" fill="url(#ini-hill-dark)"></path>
      <path d="M 48 118 Q 44 75 34 32" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"></path>
      <path d="M 62 120 L 62 18" stroke="#D97706" stroke-width="3" stroke-linecap="round"></path>
      <path d="M 76 118 Q 80 75 90 32" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"></path>
      <g transform="translate(38, 52) rotate(-14)" fill="url(#ini-wheat-gold)">
        <ellipse cx="-4" cy="-12" rx="4" ry="7.5" transform="rotate(-25 -4 -12)"></ellipse>
        <ellipse cx="4" cy="-12" rx="4" ry="7.5" transform="rotate(25 4 -12)"></ellipse>
        <ellipse cx="-4" cy="-2" rx="4.5" ry="8" transform="rotate(-25 -4 -2)"></ellipse>
        <ellipse cx="4" cy="-2" rx="4.5" ry="8" transform="rotate(25 4 -2)"></ellipse>
        <ellipse cx="-4" cy="8" rx="4" ry="7.5" transform="rotate(-25 -4 8)"></ellipse>
        <ellipse cx="4" cy="8" rx="4" ry="7.5" transform="rotate(25 4 8)"></ellipse>
        <ellipse cx="0" cy="-20" rx="3.5" ry="7"></ellipse>
      </g>
      <g transform="translate(62, 44)" fill="url(#ini-wheat-gold)">
        <ellipse cx="-5" cy="-16" rx="5" ry="9" transform="rotate(-25 -5 -16)"></ellipse>
        <ellipse cx="5" cy="-16" rx="5" ry="9" transform="rotate(25 5 -16)"></ellipse>
        <ellipse cx="-5" cy="-4" rx="5.5" ry="9.5" transform="rotate(-25 -5 -4)"></ellipse>
        <ellipse cx="5" cy="-4" rx="5.5" ry="9.5" transform="rotate(25 5 -4)"></ellipse>
        <ellipse cx="-5" cy="8" rx="5.5" ry="9.5" transform="rotate(-25 -5 8)"></ellipse>
        <ellipse cx="5" cy="8" rx="5.5" ry="9.5" transform="rotate(25 5 8)"></ellipse>
        <ellipse cx="-4" cy="20" rx="4.5" ry="8.5" transform="rotate(-25 -4 20)"></ellipse>
        <ellipse cx="4" cy="20" rx="4.5" ry="8.5" transform="rotate(25 4 20)"></ellipse>
        <ellipse cx="0" cy="-26" rx="4.5" ry="8.5" fill="#FDE047"></ellipse>
      </g>
      <g transform="translate(86, 52) rotate(14)" fill="url(#ini-wheat-gold)">
        <ellipse cx="-4" cy="-12" rx="4" ry="7.5" transform="rotate(-25 -4 -12)"></ellipse>
        <ellipse cx="4" cy="-12" rx="4" ry="7.5" transform="rotate(25 4 -12)"></ellipse>
        <ellipse cx="-4" cy="-2" rx="4.5" ry="8" transform="rotate(-25 -4 -2)"></ellipse>
        <ellipse cx="4" cy="-2" rx="4.5" ry="8" transform="rotate(25 4 -2)"></ellipse>
        <ellipse cx="-4" cy="8" rx="4" ry="7.5" transform="rotate(-25 -4 8)"></ellipse>
        <ellipse cx="4" cy="8" rx="4" ry="7.5" transform="rotate(25 4 8)"></ellipse>
        <ellipse cx="0" cy="-20" rx="3.5" ry="7"></ellipse>
      </g>
      <path d="M 62 120 C 42 112, 22 92, 8 96 C 28 84, 48 96, 62 116 Z" fill="url(#ini-leaf-bright)"></path>
      <path d="M 62 120 C 82 112, 102 92, 116 96 C 96 84, 76 96, 62 116 Z" fill="url(#ini-leaf-bright)"></path>
    </g>
    <rect x="18" y="104" width="88" height="24" rx="12" fill="#92400E"></rect>
    <text x="62" y="120" text-anchor="middle" class="ini-sans" font-size="11.5" font-weight="700" fill="#FFFFFF">${x(t.iniSvgTrigo)}</text>
  </g>
  <g transform="translate(32, 236)" filter="url(#ini-medallion-shadow)">
    <rect x="0" y="0" width="184" height="72" rx="14" fill="#FFFFFF" fill-opacity="0.95" stroke="#E2E8E4" stroke-width="1.2"></rect>
    <rect x="12" y="14" width="5" height="44" rx="2.5" fill="#D97706"></rect>
    <text x="25" y="25" class="ini-mono" font-size="9.5" font-weight="700" fill="#64748B" letter-spacing="0.4">${x(t.iniSvgHongosA)}</text>
    <text x="25" y="43" class="ini-sans" font-size="13" font-weight="700" fill="#0F172A">${x(t.iniSvgHongosB)}</text>
    <text x="25" y="57" class="ini-sans" font-size="10.5" font-weight="600" fill="#B45309">${x(t.iniSvgHongosC)}</text>
  </g>
  <g transform="translate(424, 236)" filter="url(#ini-medallion-shadow)">
    <rect x="0" y="0" width="184" height="72" rx="14" fill="#FFFFFF" fill-opacity="0.95" stroke="#E2E8E4" stroke-width="1.2"></rect>
    <rect x="12" y="14" width="5" height="44" rx="2.5" fill="#0284C7"></rect>
    <text x="25" y="25" class="ini-mono" font-size="9.5" font-weight="700" fill="#64748B" letter-spacing="0.4">${x(t.iniSvgAguaA)}</text>
    <text x="25" y="43" class="ini-sans" font-size="13" font-weight="700" fill="#0F172A">${x(t.iniSvgAguaB)}</text>
    <text x="25" y="57" class="ini-sans" font-size="10.5" font-weight="600" fill="#0369A1">${x(t.iniSvgAguaC)}</text>
  </g>
  <g transform="translate(36, 424)">
    <circle cx="6" cy="-4" r="4.5" fill="#D97706"></circle>
    <circle cx="18" cy="-4" r="4.5" fill="#1E7E3A"></circle>
    <circle cx="30" cy="-4" r="4.5" fill="#0284C7"></circle>
    <text x="42" y="0" class="ini-sans" font-size="11.5" font-weight="600" fill="#475569">${x(t.iniSvgPie)}</text>
    <g transform="translate(442, -19)">
      <rect x="0" y="0" width="126" height="26" rx="8" fill="#E6EFE9" stroke="#B8D4C2" stroke-width="1.2"></rect>
      <text x="63" y="17" text-anchor="middle" class="ini-sans" font-size="12.5" font-weight="700" fill="#143D25">generated by AI</text>
    </g>
  </g>
<metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYToxNjA4ZjgzNS1hZGUxLTQ5NWYtYTMyNy0yZTJmNDExMTcyNjcAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaKq3YMxukBhEBLomDi88xYEAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDo2M2JmYjc3NS1iMGIzLTRjNjQtYmE3Yy0wYTg4ZDU4ODhjOThscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNo7YNGbwiCcvzlb8wAqWh51QAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFgguBYr/ZlvWnYnRhmLCRuSXwKiToG1GP6oS8bZ2RSe+/ykZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaLt+SETJJ5MRREfv2RUnW3cAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRMAAAAAAAAAAAAAAAAZGhhc2hYIE4Ev1pLtB3MX+qZTNDjFaxiTcJBtwF6gDcCcbTDacY1ZG5hbWVuanVtYmYgbWFuaWZlc3RqZXhjbHVzaW9uc4GiZXN0YXJ0GUnYZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOjE2MDhmODM1LWFkZTEtNDk1Zi1hMzI3LTJlMmY0MTExNzI2Ny9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOjA2MjdmMGY5LTY3OGMtNDAxZi1iYmMyLWNjZWUwNzA4M2VkZXJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCC4Fiv9mW9adidGGYsJG5JfAqJOgbUY/qhLxtnZFJ77/KJjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFggfiE7hUJnh/iAMN1YpCCufgCRCr9Sa5olNDRLu6PULUiiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFggt7rhk/Bnb+pwpY1R0CEumzA3PvT0Gvg2H9CuPB1N5Lx0Y2xhaW1fZ2VuZXJhdG9yX2luZm+jZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g/oGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd/3cyjxFA3Qo5S46fX0/ihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB/wQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj+OPEz5o+nMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn/aArXyTwFAZfKrPzxF2vPoJNf1+UCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9+1rdDwSPLMOPOjKuiXjoU/pUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQEcoTgYdCMhLdV6MBhbZpKfjmZAsEq1WZ37Jm+7t0VvkndLvZauGvkUe4JP1RA/z49hV/CwKeAb0z5jSrwdZvIA=</c2pa:manifest></metadata></svg>`;
}

/* Diagrama de la rotación elegida (resumen). Dibujos de cultivos simplificados del SVG de Gemini;
   las cifras de las tarjetas salen de la matriz (niveles por problema y días con sed). */
const DIBUJO_CULTIVO = {
  maiz: `<g transform="translate(35,22)"><rect x="20" y="12" width="20" height="42" rx="10" fill="#E3A008"/>
      <g fill="#FEF08A"><rect x="23" y="17" width="5" height="4" rx="1.5"/><rect x="31" y="17" width="5" height="4" rx="1.5"/><rect x="23" y="24" width="5" height="4" rx="1.5"/><rect x="31" y="24" width="5" height="4" rx="1.5"/><rect x="23" y="31" width="5" height="4" rx="1.5"/><rect x="31" y="31" width="5" height="4" rx="1.5"/><rect x="23" y="38" width="5" height="4" rx="1.5"/><rect x="31" y="38" width="5" height="4" rx="1.5"/></g>
      <path d="M30 58 C12 56 6 36 14 20 C18 34 22 46 30 58 Z" fill="#16A34A"/><path d="M30 58 C48 56 54 36 46 20 C42 34 38 46 30 58 Z" fill="#22C55E"/>
      <path d="M30 60 L30 42" stroke="#15803D" stroke-width="3" stroke-linecap="round"/></g>`,
  soya: `<g transform="translate(33,28)"><path d="M32 55 C10 55 5 35 15 20 C25 30 32 40 32 55 Z" fill="#4ADE80"/><path d="M32 55 C54 55 59 35 49 20 C39 30 32 40 32 55 Z" fill="#22C55E"/>
      <path d="M26 12 C18 24 20 44 30 56 C38 46 42 26 30 12 Z" fill="#65A30D"/><circle cx="29" cy="24" r="4.5" fill="#ECFCCB"/><circle cx="28" cy="35" r="4.5" fill="#ECFCCB"/><circle cx="30" cy="45" r="4" fill="#ECFCCB"/>
      <path d="M36 18 C46 26 48 42 38 52 C32 42 32 28 36 18 Z" fill="#4D7C0F"/><circle cx="40" cy="30" r="3.5" fill="#D9F99D"/><circle cx="39" cy="40" r="3.5" fill="#D9F99D"/></g>`,
  trigo: `<g transform="translate(35,20)"><path d="M30 62 L30 14" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
      <g fill="#E3A008"><ellipse cx="25" cy="22" rx="4" ry="7" transform="rotate(-25 25 22)"/><ellipse cx="35" cy="22" rx="4" ry="7" transform="rotate(25 35 22)"/><ellipse cx="25" cy="32" rx="4" ry="7" transform="rotate(-25 25 32)"/><ellipse cx="35" cy="32" rx="4" ry="7" transform="rotate(25 35 32)"/><ellipse cx="25" cy="42" rx="4" ry="7" transform="rotate(-25 25 42)"/><ellipse cx="35" cy="42" rx="4" ry="7" transform="rotate(25 35 42)"/><ellipse cx="30" cy="14" rx="3.5" ry="6"/></g>
      <path d="M30 62 C16 58 12 44 18 34 C22 46 26 54 30 62 Z" fill="#16A34A"/><path d="M30 62 C44 58 48 44 42 34 C38 46 34 54 30 62 Z" fill="#22C55E"/></g>`
};
const ESTILO_CULTIVO = {
  maiz: { borde: "#FEF08A", fondo: "#FEFCE8", etq: "#854D0E", arco: "#CA8A04" },
  soya: { borde: "#DCFCE7", fondo: "#F0FDF4", etq: "#1F5135", arco: "#16A34A" },
  trigo: { borde: "#FDE68A", fondo: "#FFFBEB", etq: "#92400E", arco: "#B45309" }
};

function svgRotacion(o, fo, fh) {
  const t = T(), x = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cx = 320, cy = 250, R = 135, sec = o.secuencia, n = sec.length;
  const ang = { 1: [-90], 2: [-135, -45], 3: [-135, -45, 90] }[Math.min(n, 3)] || sec.map((_, k) => -90 + 360 * k / n);
  const rad = a => a * Math.PI / 180, pt = a => [cx + R * Math.cos(rad(a)), cy + R * Math.sin(rad(a))];
  const gap = 31;
  let arcos = "";
  sec.forEach((c, k) => {
    const a0 = ang[k] + gap, a1 = (n === 1 ? ang[0] + 360 : (k + 1 < n ? ang[k + 1] : ang[0] + 360)) - gap;
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1), grande = (a1 - a0) > 180 ? 1 : 0, col = (ESTILO_CULTIVO[c.clave] || ESTILO_CULTIVO.maiz).arco;
    const dx = -Math.sin(rad(a1)), dy = Math.cos(rad(a1)), px = -dy, py = dx;
    const p1 = [x1 + dx * 9, y1 + dy * 9], p2 = [x1 - dx * 3 + px * 6, y1 - dy * 3 + py * 6], p3 = [x1 - dx * 3 - px * 6, y1 - dy * 3 - py * 6];
    arcos += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${grande} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>
      <polygon points="${[p1, p2, p3].map(q => q.map(v => v.toFixed(1)).join(",")).join(" ")}" fill="${col}"/>`;
  });
  const nodos = sec.map((c, k) => {
    const [nx, ny] = pt(ang[k]), e = ESTILO_CULTIVO[c.clave] || ESTILO_CULTIVO.maiz;
    const etq = (n > 1 ? (k + 1) + ". " : "") + c.nombre, an = Math.max(110, Math.round(etq.length * 7 + 26));
    return `<g transform="translate(${(nx - 65).toFixed(1)},${(ny - 65).toFixed(1)})">
      <circle cx="65" cy="65" r="56" fill="#fff" stroke="${e.borde}" stroke-width="3"/><circle cx="65" cy="65" r="48" fill="${e.fondo}"/>
      ${DIBUJO_CULTIVO[c.clave] || ""}
      <rect x="${65 - an / 2}" y="106" width="${an}" height="24" rx="12" fill="${e.etq}"/>
      <text x="65" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="#fff">${x(etq)}</text></g>`;
  }).join("");
  const cuenta = f => { const r = { alta: 0, media: 0 }; f.celdas.forEach(c => { if (c.nivel.clave in r) r[c.nivel.clave]++; }); return r; };
  const co = cuenta(fo), ch = cuenta(fh);
  const tarjeta = (tx, color, a, b, c) => `<g transform="translate(${tx},292)">
    <rect width="182" height="72" rx="14" fill="#fff" stroke="#E5E7EB"/><rect x="12" y="14" width="6" height="44" rx="3" fill="${color}"/>
    <text x="28" y="27" font-size="9.5" font-weight="600" fill="#6B7280" letter-spacing=".6">${x(a)}</text>
    <text x="28" y="45" font-size="13.5" font-weight="700" fill="#111827">${x(b)}</text>
    <text x="28" y="60" font-size="10.5" fill="#4B5563">${x(c)}</text></g>`;
  const izq = tarjeta(36, "#B45309", t.iniSvgHongosA, fmt(t.rsNiveles, co), o.es_actual ? t.rsEsHoy : fmt(t.rsHoyNiveles, ch));
  const der = fo.agua_dias != null ? tarjeta(422, "#1E40AF", t.iniSvgAguaA, fmt(t.rsAgua, { n: fo.agua_dias }),
    o.es_actual || fh.agua_dias == null ? t.rsPorTemporada : fmt(t.rsAguaHoy, { n: fh.agua_dias })) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 500" class="svg-rotacion" role="img"
    aria-label="${x(fmt(t.rsAlt, { nombre: o.nombre }))}" font-family="-apple-system, BlinkMacSystemFont, Inter, 'Segoe UI', Roboto, sans-serif">
    <rect x="16" y="10" width="608" height="480" rx="24" fill="#fff" stroke="#E5E7EB" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 12}" fill="#fff" stroke="#E5E7EB"/>
    <circle cx="${cx}" cy="${cy}" r="${R - 20}" fill="none" stroke="#D1D5DB" stroke-dasharray="4 6"/>
    ${arcos}
    <circle cx="${cx}" cy="${cy}" r="44" fill="#1F5135"/>
    <path d="M304 ${cy - 15} Q320 ${cy - 21} 336 ${cy - 15}" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M300 ${cy - 7} Q320 ${cy - 13} 340 ${cy - 7}" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" fill="none"/>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" letter-spacing=".5">${x(t.iniSvgLote)}</text>
    ${nodos}${izq}${der}
    <g transform="translate(40,468)">
      <text x="0" y="0" font-size="11" font-weight="500" fill="#4B5563">${x(n === 1 ? t.rsPieMono : t.iniSvgPie)}</text>
      <rect x="444" y="-14" width="112" height="20" rx="6" fill="#1F5135" fill-opacity=".08"/>
      <text x="500" y="0" text-anchor="middle" font-size="10" font-weight="600" fill="#1F5135" fill-opacity=".75">generated by AI</text>
    </g></svg>`;
}

function pInicio() {
  const t = T();
  return el("section", { class: "pantalla inicio" },
    el("div", { class: "inicio-txt" },
      el("p", { class: "eyebrow", text: t.inicioEyebrow }),
      el("h1", { text: t.inicioTitulo }),
      el("p", { class: "alcance" }, el("span", { class: "pill", text: t.alcance }), el("span", { class: "tenue", text: t.alcanceNota })),
      el("p", { class: "bajada", text: t.inicioBajada }),
      el("ol", { class: "puntos" }, t.inicioPuntos.map(([a, b], i) =>
        el("li", {}, el("span", { class: "n", text: String(i + 1) }), el("span", {}, el("b", { text: a + ": " }), b)))),
      el("div", { class: "inicio-acc" },
        el("button", { type: "button", class: "btn prim", onclick: () => ir(1) }, el("span", { text: t.empezar }), svg(ICO.der)),
        el("button", { type: "button", class: "btn", onclick: iniciarDemo }, svg(ICO.play), el("span", { text: t.verDemo }))),
      el("button", { type: "button", class: "btn fantasma enlace-cat", onclick: abrirCatalogo }, el("span", { text: t.inicioCat }), svg(ICO.der))),
    (() => { const fig = el("figure", { class: "inicio-img hero-visual-container", style: "margin:0", "data-tooltip": t.ilusIA, title: t.ilusIA });
      fig.innerHTML = svgInicio();
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) fig.querySelectorAll("animateTransform").forEach(a => a.remove());
      return fig; })());
}

/* =================== Pantalla 1: su lote =================== */
const COLTEX = { arena: "#F2E3B3", franco_arenoso: "#E0BD78", franco: "#A9C08C", franco_limoso: "#D8C3A0",
  franco_arcillo_limoso: "#B08D6B", arcilla: "#8A6F60", sin_dato: "#E5E7EB" };

function tarjetaSuelo(ss, f, onPick) {
  const t = T(), i = S.idioma === "en" ? 1 : 0, p = ss.punto, m = ss.mapa;
  const nomTex = k => k && TEX[k] ? TEX[k][i] : t.mapaOtro;
  const sit = SITIOS.find(x => x.clave === f.sitio);
  const coords = `${Number(f.lat).toFixed(2)}, ${Number(f.lon).toFixed(2)}`;
  const pend = /(\d+) to (\d+) percent slopes/.exec(p.unidad_mapa || "");
  const serie = [p.componente_dominante, pend ? fmt(t.ssurgoPend, { a: pend[1], b: pend[2] }) : ""].filter(Boolean).join(", ");
  const usado = ss.elegido ? ss.elegido.tex : p.textura_modelo_aproximada;
  const hijos = [
    el("p", { class: "suave", text: sit ? fmt(t.ssPuntoRef, { sitio: sit[S.idioma], coords }) : fmt(t.ssPuntoPropio, { coords }) }),
    el("p", {}, el("span", { text: t.ssurgoOkTit + " " }), el("strong", { text: nomTex(p.textura_modelo_aproximada) }),
      serie ? el("span", { class: "tenue", text: ` (${serie})` }) : null)];
  if (m) {
    hijos.push(el("div", { class: "mapa-suelo" },
      el("div", { class: "ms-cab" },
        el("h4", { text: fmt(t.mapaTit, { km: m.lado_km }) }),
        el("dl", { class: "ms-guia" },
          el("dt", { text: t.mapaDonde }),
          el("dd", {}, el("span", { text: (sit ? sit.cerca[i] + " · " : "") + fmt(t.mapaCentro, { coords }) + " " }),
            el("a", { href: `https://www.google.com/maps/place/${f.lat},${f.lon}/@${f.lat},${f.lon},2200m/data=!3m1!1e3`, target: "_blank", rel: "noopener noreferrer", text: t.mapaCalles })),
          el("dt", { text: t.mapaQue }), el("dd", { text: t.mapaQueTxt }),
          el("dt", { text: t.mapaHacer }), el("dd", { text: t.mapaHacerTxt }))),
      el("div", { class: "ms-cuerpo" }, svgMapaSuelo(m, ss.elegido, onPick),
        el("div", { class: "ms-ley" }, Object.entries(m.proporcion).map(([k, v]) => {
          const pct = Math.max(1, Math.round(v * 100)) + " %";
          return k === "sin_dato"
            ? el("div", { class: "ms-item quieto" }, el("span", { class: "sw", style: `background:${COLTEX.sin_dato}` }), el("span", { text: t.mapaOtro }), el("span", { class: "tenue", text: pct }))
            : el("button", { type: "button", class: "ms-item" + (usado === k ? " sel" : ""), "aria-pressed": String(usado === k),
                onclick: () => onPick({ tex: k }) },
                el("span", { class: "sw", style: `background:${COLTEX[k]}` }), el("span", { text: nomTex(k) }), el("span", { class: "tenue", text: pct }));
        }),
        el("p", { class: "tenue", style: "font-size:.82rem", text: t.mapaLeyAyuda }),
        el("p", { class: "ms-marcas" }, el("span", { class: "mk ref" }), el("span", { text: t.mapaRef }),
          el("span", { class: "mk lote" }), el("span", { text: t.mapaLote }))))));
  }
  if (ss.aviso) hijos.push(el("p", { class: "ms-aviso", text: ss.aviso }));
  hijos.push(el("p", { class: "ms-usando" }, el("span", { text: t.mapaUsando + " " }), el("strong", { text: nomTex(usado) }),
    el("span", { text: ss.elegido && ss.elegido.serie ? ` (${ss.elegido.serie})` : "" })));
  hijos.push(el("p", { class: "tenue", style: "font-size:.85rem", text: (m ? t.mapaNota + " " : "") + t.mapaClima }));
  return el("div", { class: "ss-res" }, hijos);
}

function svgMapaSuelo(m, elegido, onPick) {
  const t = T(), i = S.idioma === "en" ? 1 : 0, ns = "http://www.w3.org/2000/svg", W = 320, H = 320;
  const [x0, y0, x1, y1] = m.cuadro;
  const px = lon => (lon - x0) / (x1 - x0) * W, py = lat => (y1 - lat) / (y1 - y0) * H;
  const uni = Object.fromEntries(m.unidades.map(u => [u.mukey, u]));
  const n = (tag, at = {}, ...h) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(at)) e.setAttribute(k, v); h.forEach(x => x && e.append(x)); return e; };
  const s = n("svg", { viewBox: `0 0 ${W} ${H}`, class: "ms-svg", role: "img", "aria-label": fmt(t.mapaTit, { km: m.lado_km }) });
  const aCoord = ev => { const pt = s.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const q = pt.matrixTransform(s.getScreenCTM().inverse()); return [x0 + q.x / W * (x1 - x0), y1 - q.y / H * (y1 - y0)]; };
  m.poligonos.forEach(pg => {
    const u = uni[pg.mukey] || {}, tex = u.textura || null;
    const d = pg.anillos.map(a => "M" + a.map(([x, y]) => px(x).toFixed(1) + " " + py(y).toFixed(1)).join("L") + "Z").join("");
    const path = n("path", { d, fill: COLTEX[tex || "sin_dato"], "fill-rule": "evenodd",
      class: "ms-pol" + (elegido && elegido.mukey === pg.mukey ? " sel" : "") });
    path.append(n("title", {}, document.createTextNode(`${tex && TEX[tex] ? TEX[tex][i] : t.mapaOtro} · ${u.nombre || ""}`)));
    path.addEventListener("click", ev => { const [lon, lat] = aCoord(ev); onPick({ tex, mukey: pg.mukey, lon, lat, serie: u.serie || u.nombre }); });
    s.append(path);
  });
  // Punto de referencia (centro) y lote elegido
  const cx = px(m.centro[0]), cy = py(m.centro[1]);
  s.append(n("circle", { cx, cy, r: 7, fill: "#fff", stroke: "#111827", "stroke-width": 2.5, "pointer-events": "none" }),
    n("circle", { cx, cy, r: 2.5, fill: "#111827", "pointer-events": "none" }));
  if (elegido && elegido.lon != null) {
    const ex = px(elegido.lon), ey = py(elegido.lat);
    s.append(n("path", { d: `M${ex} ${ey}l-7 -14a8 8 0 1 1 14 0z`, fill: "#1F5135", stroke: "#fff", "stroke-width": 1.5, "pointer-events": "none" }),
      n("circle", { cx: ex, cy: ey - 17, r: 3, fill: "#fff", "pointer-events": "none" }));
  }
  // Escala (500 m) y norte
  const k500 = W / (m.lado_km * 2);
  s.append(n("g", { "pointer-events": "none" },
    n("rect", { x: 8, y: H - 30, width: k500 + 46, height: 22, rx: 4, fill: "rgba(255,255,255,.9)" }),
    n("path", { d: `M16 ${H - 14}h${k500}`, stroke: "#111827", "stroke-width": 2 }),
    n("path", { d: `M16 ${H - 18}v8M${16 + k500} ${H - 18}v8`, stroke: "#111827", "stroke-width": 2 }),
    n("text", { x: 22 + k500, y: H - 14, "font-size": 11, "dominant-baseline": "middle", fill: "#111827" }, document.createTextNode("500 m")),
    n("rect", { x: W - 30, y: 8, width: 22, height: 30, rx: 4, fill: "rgba(255,255,255,.9)" }),
    n("path", { d: `M${W - 19} 14l5 10h-10z`, fill: "#111827" }),
    n("text", { x: W - 19, y: 33, "font-size": 10, "text-anchor": "middle", fill: "#111827" }, document.createTextNode("N"))));
  return s;
}

function pLote() {
  const t = T(), f = S.form, i = S.idioma === "en" ? 1 : 0;
  const sel = (id, opciones, valor, onchange) => {
    const s = el("select", { id }, opciones.map(([v, txt]) => el("option", { value: v, text: txt })));
    s.value = valor; s.onchange = onchange; return s;
  };
  const sitio = sel("in-sitio", [...SITIOS.map(s => [s.clave, s[S.idioma]]), ["otro", t.otro]], f.sitio, e => {
    f.sitio = e.target.value; const s = SITIOS.find(x => x.clave === f.sitio);
    if (s) { f.lat = s.lat; f.lon = s.lon; } render(); });
  const rotOpts = Object.keys(ROTS).map(k => [k, nombreRot(k)]);
  const actual = sel("in-actual", rotOpts, f.actual, e => { f.actual = e.target.value; });
  const suelo = sel("in-suelo", Object.entries(TEX).map(([k, n]) => [k, n[i]]), f.textura, e => { f.textura = e.target.value;
    if (S.suelo && S.suelo.punto) { S.suelo.elegido = { tex: f.textura }; S.suelo.aviso = ""; pintarSuelo(); } });
  const lab = sel("in-lab", [["siembra_directa", t.sd], ["convencional", t.conv]], f.labranza, e => { f.labranza = e.target.value; });
  const num = (id, k) => { const n = el("input", { id, type: "number", step: "0.01", value: f[k] }); n.oninput = e => { f[k] = Number(e.target.value); }; return n; };
  const ssCont = el("div", { class: "ss-estado", role: "status", "aria-live": "polite" });
  const claveCoord = `${Number(f.lat).toFixed(4)},${Number(f.lon).toFixed(4)}`;
  const pintarSuelo = () => {
    const ss = S.suelo && S.suelo.clave === claveCoord ? S.suelo : null;
    if (!ss) return ssCont.replaceChildren();
    if (ss.cargando) return ssCont.replaceChildren(el("p", { class: "tenue", text: t.ssurgoCargando }));
    if (ss.error) return ssCont.replaceChildren(el("p", { class: "tenue", text: t.ssurgoError }));
    ssCont.replaceChildren(tarjetaSuelo(ss, f, pick => {
      if (pick.tex === null) { ss.aviso = t.mapaSinTex; pintarSuelo(); return; }
      ss.aviso = ""; ss.elegido = pick; f.textura = pick.tex; suelo.value = pick.tex;
      suelo.classList.remove("recien"); void suelo.offsetWidth; suelo.classList.add("recien");
      pintarSuelo();
    }));
  };
  const ssBtn = el("button", { type: "button", class: "btn", text: t.ssurgo, onclick: async () => {
    const clave = claveCoord;
    S.suelo = { clave, cargando: true }; pintarSuelo();
    try {
      const q = new URLSearchParams({ lat: f.lat, lon: f.lon });
      const [rp, rm] = await Promise.all([fetch("/api/suelo?" + q), fetch("/api/suelo/mapa?" + q)]);
      if (!rp.ok) throw new Error("punto " + rp.status);
      const punto = await rp.json(), mapa = rm.ok ? await rm.json() : null;
      S.suelo = { clave, punto, mapa, elegido: null, aviso: "" };
      f.textura = punto.textura_modelo_aproximada; suelo.value = f.textura;
      suelo.classList.remove("recien"); void suelo.offsetWidth; suelo.classList.add("recien");
    } catch (e) { S.suelo = { clave, error: true }; console.warn("SSURGO:", e.message); }
    if (S.suelo.clave === claveCoord) pintarSuelo();
  } });
  pintarSuelo();
  const mas = el("details", { class: "mas" }, el("summary", { text: t.mas }),
    el("div", { class: "mas-cuerpo" },
      el("div", { style: "display:grid; gap:6px; align-content:start" },
        el("label", { for: "in-suelo" }, el("span", { text: t.suelo }), suelo),
        el("button", { type: "button", class: "btn fantasma enlace-suelo", text: t.comoSuelo,
          onclick: () => abrirGuiaSuelo(k => { f.textura = k; suelo.value = k; }) })),
      el("label", { for: "in-lab" }, el("span", { text: t.labranza }), lab),
      el("div", { style: "grid-column: 1 / -1; display: grid; gap: 8px; justify-items: stretch" },
        el("div", { style: "display:grid; gap:8px; justify-items:start" }, ssBtn, el("p", { class: "tenue", style: "font-size:.88rem; margin:0", text: t.ssurgoAyuda })),
        ssCont)));
  if (f.sitio === "otro" || (S.suelo && S.suelo.clave === claveCoord)) mas.open = true;
  return el("section", { class: "pantalla" },
    cabeza(fmt(t.paso, { n: 1 }), t.loteTitulo, t.loteBajada),
    el("form", { class: "panel form-lote", onsubmit: e => { e.preventDefault(); analizar(); } },
      el("div", { class: "campos" },
        el("label", { for: "in-sitio" }, el("span", { text: t.lugar }), sitio, el("span", { class: "ayuda", text: t.lugarAyuda })),
        el("label", { for: "in-actual" }, el("span", { text: t.actual }), actual, el("span", { class: "ayuda", text: t.actualAyuda })),
        f.sitio === "otro" ? el("label", { for: "in-lat" }, el("span", { text: t.lat }), num("in-lat", "lat")) : null,
        f.sitio === "otro" ? el("label", { for: "in-lon" }, el("span", { text: t.lon }), num("in-lon", "lon")) : null),
      mas,
      el("p", { class: "estado" + (S.cargando ? " cargando" : "") + (typeof S.error === "string" ? " error" : ""), role: "status", "aria-live": "polite",
        text: S.cargando ? t.cargando : (typeof S.error === "string" ? S.error : "") }),
      el("button", { type: "submit", hidden: true })));
}

async function analizar() {
  if (S.cargando) return;
  S.vio = {}; S.nivelesPrevios = null; S.elegida = null;
  await consultar();
  if (S.vista) ir(2);
}


/* =================== Pantalla 2: diagnóstico =================== */
function avisoSintetico() {
  return S.vista && S.vista.datos_sinteticos ? el("p", { class: "aviso-sint", role: "alert", text: T().sintetico }) : null;
}

function pDiag() {
  const t = T(), v = S.vista, d = v.destacado, A = v.lote_hoy.agua;
  const conclusion = d && el("div", { class: "panel conclusion" },
    d.nivel ? el("div", {}, nivel(d.nivel)) : null,
    el("h2", { text: d.titulo }),
    el("p", { class: "suave", text: d.texto }),
    d.texto_reducen ? el("p", { class: "reducen", text: d.texto_reducen }) : null,
    el("div", { class: "conclusion-pie" },
      d.cultivo && d.cultivo.img ? el("span", { "data-tooltip": t.ilusIA, style: "display:inline-flex" }, el("img", { src: d.cultivo.img, alt: "", title: t.ilusIA })) : null,
      el("p", { class: "tenue", text: d.cultivo_texto }),
      el("span", { style: "flex:1" }),
      el("button", { type: "button", class: "btn prim", onclick: () => ir(3) }, el("span", { text: t.compararBtn }), svg(ICO.der))));
  const agua = A && el("div", { class: "panel agua-mini" },
    el("p", { class: "eyebrow", text: `${t.aguaT} · ${A.textura.nombre_mostrar}` }),
    el("div", { class: "agua-num" }, el("strong", { text: A.texto_tanque })),
    el("div", { class: "barra-agua", role: "img", "aria-label": A.texto_estado },
      el("div", { style: `width:${Math.max(0, Math.min(1, A.fraccion_llena)) * 100}%` })),
    el("p", { class: "suave", style: "font-size:.92rem", text: A.texto_anio }),
    A.rango_dias ? el("p", { class: "tenue", style: "font-size:.85rem", text: fmt(t.aguaEstim, { a: A.rango_dias[0], b: A.rango_dias[1] }) }) : null,
    el("details", { class: "sed-det" }, el("summary", { text: t.sedQue }), el("p", { class: "tenue", text: t.sedDef })),
    el("div", {}, el("button", { type: "button", class: "btn fantasma", style: "padding:0 8px; margin-left:-8px", onclick: abrirAgua },
      el("span", { text: t.verDetalle }), svg(ICO.der))));
  const filas = v.lote_hoy.tarjetas.map(c => {
    const cambio = S.nivelesPrevios && S.nivelesPrevios[c.clave] && S.nivelesPrevios[c.clave] !== c.nivel.clave;
    return el("button", { type: "button", class: "fila-problema", "data-problema": c.clave, onclick: () => abrirProblema(c.clave) },
      miniFoto(c.foto),
      el("span", { class: "txt" }, el("span", { class: "nom", text: c.nombre }), nivel(c.nivel),
        el("span", { class: "lin", text: cambio ? t.actualizado : (c.por_que && c.por_que[0]) || c.donde_pasa_el_invierno })),
      el("span", { class: "flecha" }, svg(ICO.der)));
  });
  return el("section", { class: "pantalla" },
    cabeza(fmt(t.paso, { n: 2 }) + " · " + fmt(t.diagEyebrow, { anio: v.anio_datos || "" }), t.diagTitulo),
    avisoSintetico(),
    el("div", { class: "diag" },
      conclusion,
      el("div", { style: "display:grid; gap:20px" },
        agua,
        el("div", { class: "panel sin-pad" },
          el("div", { class: "cab-lista" }, el("h3", { text: t.problemas }), el("span", { class: "tenue", text: t.problemasAyuda }),
            el("button", { type: "button", class: "btn fantasma enlace-cat", onclick: abrirCatalogo }, el("span", { text: t.catVer }), svg(ICO.der))),
          el("p", { class: "tenue leyenda-niveles", text: t.nivelesQueSon }),
          el("div", { class: "lista-problemas" }, filas.length ? filas : el("p", { class: "tenue", style: "padding:16px 20px", text: t.sinProblemas }))))));
}

/* =================== Pantalla 3: elegir rotación =================== */
function ciclo(sec, grande = false) {
  const t = T(), partes = [];
  sec.forEach((c, i) => {
    if (i) partes.push(el("span", { class: "fl", "aria-hidden": "true", text: "→" }));
    partes.push(el("span", { class: "c", "data-tooltip": c.img ? t.ilusIA : null }, c.img ? el("img", { src: c.img, alt: "", title: t.ilusIA }) : null, el("span", { text: c.nombre })));
  });
  partes.push(el("span", { class: "fl", "aria-hidden": "true", text: "↺" }));
  return el("div", { class: "ciclo" + (grande ? " grande" : "") }, partes);
}

function pElegir() {
  const t = T(), v = S.vista;
  const ops = ordenadas();
  const chips = el("div", { class: "chips", role: "group", "aria-label": t.ordenar },
    Object.keys(t.ord).map(k => el("button", { type: "button", "aria-pressed": String(S.orden === k), text: t.ord[k],
      onclick: () => cambiarOrden(k) })));
  const previo = S.ordenPrevio;
  const lista = el("div", { class: "opciones", role: "radiogroup", "aria-label": t.elegirTitulo },
    ops.map((o, i) => {
      const f = fila(o.clave);
      const movida = previo && previo.indexOf(o.clave) !== i;
      return el("button", { type: "button", role: "radio", class: "opcion" + (movida ? " movida" : ""), "data-rotacion": o.clave,
        "aria-checked": String(S.elegida === o.clave), onclick: () => { S.elegida = o.clave; S.ordenPrevio = null; render(); } },
        el("div", { class: "opcion-cab" },
          el("span", { class: "puesto", text: String(i + 1) }),
          el("h3", { text: o.nombre }),
          o.es_actual ? el("span", { class: "etq-hoy", text: t.hoy }) : null,
          el("span", { class: "radio", "aria-hidden": "true" })),
        ciclo(o.secuencia),
        el("p", { class: "criterio" }, el("strong", { text: t.critTit[S.orden] + ": " }), o.criterios[S.orden] || "—"),
        f ? el("div", { class: "simbolos", "aria-hidden": "true" }, f.celdas.map(c => nivel(c.nivel, true))) : null);
    }));
  S.ordenPrevio = null;
  return el("section", { class: "pantalla" },
    cabeza(fmt(t.paso, { n: 3 }), t.elegirTitulo, t.elegirBajada),
    avisoSintetico(),
    el("div", { class: "elegir" },
      el("div", { style: "display:grid; gap:12px" },
        el("div", { class: "orden" }, el("span", { text: t.ordenar }), chips),
        el("p", { class: "orden-msg", role: "status", "aria-live": "polite", text: S.ordenMsg }),
        lista),
      detalleRotacion()));
}

function cambiarOrden(k) {
  const t = T(), antes = ordenadas().map(o => o.clave);
  S.orden = k;
  const despues = ordenadas();
  S.ordenPrevio = antes;
  S.ordenMsg = antes.join() === despues.map(o => o.clave).join() ? t.ordenIgual
    : fmt(t.ordenNuevo, { prio: t.ord[k].toLowerCase(), nombre: despues[0].nombre });
  render();
}

function detalleRotacion() {
  const t = T(), v = S.vista;
  const o = v.opciones.find(x => x.clave === S.elegida) || v.opciones[0];
  const fo = fila(o.clave), fh = fila(v.actual);
  const cols = v.matriz.columnas;
  const cuenta = { mejora: 0, empeora: 0, igual: 0 };
  const pill = (cls, txt) => o.es_actual || !txt ? "" : cls || txt === t.igual
    ? el("span", { class: "dif-pill " + (cls || "igual"), text: (cls === "mejora" ? "↑ " : cls === "empeora" ? "↓ " : "= ") + txt }) : txt;
  const filas = cols.map((c, i) => {
    const a = fh.celdas[i].nivel, b = fo.celdas[i].nivel;
    let dif = t.igual, cls = "";
    if (!(a.clave in PESO) || !(b.clave in PESO)) dif = t.sinDato;
    else if (PESO[b.clave] < PESO[a.clave]) { dif = t.mejora; cls = "mejora"; }
    else if (PESO[b.clave] > PESO[a.clave]) { dif = t.empeora; cls = "empeora"; }
    if (cls) cuenta[cls]++; else if (dif === t.igual) cuenta.igual++;
    return el("tr", { class: cls }, el("td", {}, el("button", { type: "button", class: "link-prob", onclick: () => abrirProblema(c.clave), text: c.titulo })), el("td", { class: "c" }, nivel(a, true)),
      el("td", { class: "c col-con" }, nivel(b, true)), el("td", { class: "dif" }, pill(cls, dif)));
  });
  let aguaDif = "", aguaCls = "";
  if (fo.agua_dias != null && fh.agua_dias != null && !o.es_actual) {
    const d = fo.agua_dias - fh.agua_dias;
    aguaDif = d < 0 ? t.mejora : d > 0 ? t.empeora : t.igual; aguaCls = d < 0 ? "mejora" : d > 0 ? "empeora" : "";
    if (aguaCls) cuenta[aguaCls]++; else cuenta.igual++;
  }
  const roya = v.lote_hoy.tarjetas.find(c => c.nivel.clave === "no_depende_de_la_rotacion");
  return el("div", { class: "panel sin-pad det-rot", "aria-live": "polite" },
    el("div", { class: "det-cab" },
      el("div", { style: "display:flex; align-items:center; gap:10px; flex-wrap:wrap" },
        el("h2", { text: o.nombre }), o.es_actual ? el("span", { class: "etq-hoy", text: t.loQueHace }) : null),
      ciclo(o.secuencia, true),
      o.es_actual ? el("p", { class: "nota", text: t.esLaActual }) : null),
    el("div", { class: "det-cuerpo" },
      el("table", { class: "comp" },
        el("caption", {}, el("span", { class: "comp-tit", text: t.frenteHoy }),
          o.es_actual ? null : el("span", { class: "comp-ley" },
            el("span", {}, el("b", { text: t.colHoy + ": " }), nombreRot(v.actual)),
            el("span", { class: "con" }, el("b", { text: t.colCon + ": " }), o.nombre)),
          o.es_actual ? null : el("span", { class: "comp-res" },
            [["mejora", t.mejora], ["empeora", t.empeora], ["igual", t.igual]].map(([k, txt]) =>
              cuenta[k] ? el("span", { class: "dif-pill " + k, text: `${txt}: ${cuenta[k]}` }) : null))),
        el("thead", {}, el("tr", {}, el("th", { scope: "col", text: t.colProblema }),
          el("th", { scope: "col", class: "c col-hoy", text: t.colHoy }),
          el("th", { scope: "col", class: "c col-con", text: o.es_actual ? t.colHoy : t.colCon }),
          el("th", { scope: "col" }))),
        el("tbody", {}, filas,
          fo.agua_dias != null ? el("tr", { class: aguaCls }, el("td", { text: t.agua + " *" }), el("td", { class: "c", text: String(fh.agua_dias) }),
            el("td", { class: "c col-con", text: String(fo.agua_dias) }), el("td", { class: "dif" }, pill(aguaCls, aguaDif))) : null,
          el("tr", {}, el("td", { text: t.sueloFila }), el("td", { colspan: "3", class: "tenue", text: o.criterios.suelo })))),
      fo.agua_dias != null ? notaSed() : null,
      roya ? el("p", { class: "nota", text: fmt(t.royaNota, { nombre: roya.nombre }) }) : null,
      el("div", { class: "dos" },
        el("div", { class: "bloque" }, el("span", { class: "eyebrow", text: t.bueno }), el("span", { text: o.lo_bueno })),
        el("div", { class: "bloque" }, el("span", { class: "eyebrow", text: t.costo }), el("span", { text: o.el_costo }))),
      el("p", { style: "font-size:.92rem" }, el("strong", { text: t.hable + ": " }), o.tecnico),
      el("details", { class: "fuentes" }, el("summary", { text: t.detalleNiveles }),
        el("ul", {}, o.lineas.filter(l => l.nivel).map(l => el("li", {}, el("strong", { text: l.titulo + ": " }), l.texto))))));
}

/* =================== Pantalla 4: resumen =================== */
function pResumen() {
  const t = T(), v = S.vista;
  const o = v.opciones.find(x => x.clave === S.elegida) || v.opciones[0];
  const fo = fila(o.clave), fh = fila(v.actual);
  const gana = [], paga = [];
  v.matriz.columnas.forEach((c, i) => {
    const a = fh.celdas[i].nivel, b = fo.celdas[i].nivel;
    if (!(a.clave in PESO) || !(b.clave in PESO) || a.clave === b.clave) return;
    const plantilla = a.clave === "sin_hospedante" ? t.nivelAparece : b.clave === "sin_hospedante" ? t.nivelDesaparece : t.nivelPasa;
    const txt = fmt(plantilla, { p: c.titulo, a: a.etiqueta, b: b.etiqueta });
    (PESO[b.clave] < PESO[a.clave] ? gana : paga).push(txt);
  });
  if (fo.agua_dias != null && fh.agua_dias != null && fo.agua_dias !== fh.agua_dias) {
    const d = fo.agua_dias - fh.agua_dias;
    (d < 0 ? gana : paga).push(fmt(d < 0 ? t.aguaMenos : t.aguaMas, { d: Math.abs(d) }));
  }
  paga.push(o.el_costo);
  gana.push(o.lo_bueno);
  const preguntas = [o.tecnico, ...v.lote_hoy.tarjetas
    .filter(c => { const i = v.matriz.columnas.findIndex(x => x.clave === c.clave); return i >= 0 && ["alta", "media"].includes(fo.celdas[i].nivel.clave); })
    .map(c => c.tecnico)];
  const item = (txt, cls, ic) => el("li", {}, el("span", { class: "ic " + cls, "aria-hidden": "true", text: ic }), el("span", { text: txt }));
  return el("section", { class: "pantalla resumen" },
    cabeza(fmt(t.paso, { n: 4 }), t.resumenTitulo, t.resumenBajada),
    avisoSintetico(),
    el("div", { class: "panel" },
      el("p", { class: "eyebrow", text: t.elegida }),
      el("h2", { text: o.nombre }),
      (() => { const fig = el("figure", { class: "rot-visual", style: "margin:0", title: t.ilusIA });
        fig.innerHTML = svgRotacion(o, fo, fh); return fig; })(),
      fo.agua_dias != null ? notaSed() : null),
    el("div", { class: "dos", style: "gap:20px" },
      el("div", { class: "panel" }, el("h3", { text: t.gana }),
        el("ul", { class: "lista-check" }, gana.length ? gana.map(x => item(x, "mas", "+")) : item(t.sinCambios, "q", "·"))),
      el("div", { class: "panel" }, el("h3", { text: t.paga }),
        el("ul", { class: "lista-check" }, paga.map(x => item(x, "menos", "−"))))),
    el("div", { class: "panel" }, el("h3", { text: t.preguntas }),
      el("ul", { class: "lista-check" }, [...new Set(preguntas)].map(x => item(x[0].toUpperCase() + x.slice(1), "q", "?")))),
    el("p", { class: "tenue", text: v.textos.aviso }),
    el("div", { class: "inicio-acc" },
      el("button", { type: "button", class: "btn", onclick: () => window.print() }, svg(ICO.print), el("span", { text: t.imprimir })),
      el("button", { type: "button", class: "btn fantasma", onclick: () => ir(3) }, svg(ICO.izq), el("span", { text: t.cambiar }))));
}

/* =================== Panel lateral =================== */
let focoPrevio = null;
function abrirLateral(titulo, ...contenido) {
  focoPrevio = document.activeElement;
  $("#lat-titulo").textContent = titulo;
  $("#lat-cuerpo").replaceChildren(...contenido.flat().filter(Boolean));
  $("#velo").hidden = false; $("#lateral").hidden = false;
  $("#lat-cerrar").focus();
}
function cerrarLateral() {
  if ($("#lateral").hidden) return;
  $("#velo").hidden = true; $("#lateral").hidden = true;
  if (focoPrevio && document.contains(focoPrevio)) focoPrevio.focus();
}
$("#lat-cerrar").onclick = cerrarLateral;
$("#velo").onclick = cerrarLateral;
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarLateral(); });

function conCaption(g, txt) { if (!g) return null; g.append(el("p", { class: "serie-cap", text: txt })); return g; }

const origen = (txt, tipo) => el("span", { class: "orig " + tipo, text: txt });
const notaSed = () => { const t = T(); return el("p", { class: "nota-sed" }, el("span", { class: "ast", "aria-hidden": "true", text: "*" }),
  el("strong", { text: t.sedQue + " " }), el("span", { text: t.sedDef })); };
function bloqueCalculo(k, pregunta) {
  const t = T();
  if (!k) return null;
  const respondio = k.pasos.some(p => p.origen === "observacion");
  return el("div", { class: "calculo" },
    el("span", { class: "eyebrow", text: t.calcTit }),
    el("ol", {},
      el("li", {}, el("span", { text: k.titulos.base }), nivel(k.base), origen(t.origRegla, "regla")),
      k.pasos.map(p => el("li", {}, el("span", { text: p.titulo }), el("span", { class: "suave", text: p.texto }),
        origen(p.origen === "clima" ? t.origNasa : t.origVio, p.origen === "clima" ? "nasa" : "vio"))),
      el("li", { class: "final" }, el("strong", { text: k.titulos.final }), nivel(k.final))),
    pregunta && !respondio ? el("button", { type: "button", class: "btn fantasma enlace-cat",
      onclick: () => { const f = document.querySelector("#lateral .preg"); if (f) { f.scrollIntoView({ behavior: "smooth", block: "center" }); const b = f.querySelector("button"); if (b) b.focus({ preventScroll: true }); } } },
      el("span", { text: t.calcResponder }), svg(ICO.der)) : null);
}

async function catalogo() {
  if (S.vista && S.vista.catalogo) return S.vista.catalogo;
  try { return (await (await fetch(`ejemplo_${S.idioma}.json`)).json()).catalogo || []; } catch (_) { return []; }
}
const miniFoto = (foto, clase = "mini") => foto && foto.src
  ? el("img", { class: clase, src: foto.src, alt: "", loading: "lazy" })
  : el("span", { class: clase + " vacia", "aria-hidden": "true" });

async function abrirCatalogo() {
  const t = T(), cat = await catalogo();
  abrirLateral(t.catTit,
    el("p", { class: "suave", text: t.catAyuda }),
    el("div", { class: "cat-lista" }, cat.map(c => el("button", { type: "button", class: "cat-item", onclick: () => abrirProblema(c.clave) },
      miniFoto(c.foto, "cat-foto"),
      el("span", {}, el("strong", { text: c.nombre }), el("span", { class: "tenue", text: fmt(t.catCultivo, { cultivos: c.cultivos.join(", ") }) }),
        el("span", { class: "suave", text: c.donde_pasa_el_invierno })),
      el("span", { class: "flecha" }, svg(ICO.der))))));
}

async function abrirFicha(clave) {
  const t = T(), c = (await catalogo()).find(x => x.clave === clave);
  if (!c) return;
  abrirLateral(c.nombre,
    S.vista ? el("p", { class: "nota", text: fmt(t.catNoHoy, { cultivos: c.cultivos.join(", ").toLowerCase() }) }) : null,
    c.foto ? el("figure", { class: "foto" }, c.foto.src ? el("img", { src: c.foto.src, alt: c.foto.alt, loading: "lazy" }) : null,
      el("figcaption", {}, el("a", { href: c.foto.url, target: "_blank", rel: "noopener", text: c.foto.src ? c.foto.credito : `${t.fotoVer} · ${c.foto.credito}` })))
      : el("p", { class: "tenue", text: t.catSinFoto }),
    el("div", { class: "tres" },
      el("div", {}, el("span", { class: "eyebrow", text: t.invierno }), origen(t.origRegla, "regla"), el("p", { text: c.donde_pasa_el_invierno })),
      el("div", {}, el("span", { class: "eyebrow", text: t.frena }), origen(t.origRegla, "regla"), el("p", { text: c.que_lo_frena }))),
    el("button", { type: "button", class: "btn fantasma", onclick: abrirCatalogo }, svg(ICO.izq), el("span", { text: t.catTit })));
}

function abrirProblema(clave) {
  const t = T(), c = S.vista && S.vista.lote_hoy.tarjetas.find(x => x.clave === clave);
  if (!c) return abrirFicha(clave);
  const cambio = S.nivelesPrevios && S.nivelesPrevios[c.clave] && S.nivelesPrevios[c.clave] !== c.nivel.clave;
  const foto = c.foto && el("figure", { class: "foto" },
    c.foto.src ? el("img", { src: c.foto.src, alt: c.foto.alt, loading: "lazy" }) : null,
    el("figcaption", {}, el("a", { href: c.foto.url, target: "_blank", rel: "noopener", text: c.foto.src ? c.foto.credito : `${t.fotoVer} · ${c.foto.credito}` })));
  const preg = c.pregunta && el("fieldset", { class: "preg" }, el("legend", { text: c.pregunta }),
    el("div", { class: "seg" }, [["si", t.si], ["no", t.no], ["nose", t.nose]].map(([val, txt]) =>
      el("button", { type: "button", "aria-pressed": String(S.vio[c.clave] === val), text: txt,
        onclick: async () => { S.vio[c.clave] = val; await consultar(); abrirProblema(clave); } }))));
  abrirLateral(c.nombre,
    el("div", {}, nivel(c.nivel)),
    cambio ? el("p", { class: "cambio-msg", role: "status", text: t.actualizado }) : null,
    c.por_que && c.por_que.length ? el("p", { text: c.por_que.join(" ") }) : null,
    bloqueCalculo(c.calculo, c.pregunta),
    el("p", { class: "tenue", style: "font-size:.85rem", text: t.nivelesQueSon }),
    foto,
    el("div", { class: "tres" },
      el("div", {}, el("span", { class: "eyebrow", text: t.invierno }), origen(t.origRegla, "regla"), el("p", { text: c.donde_pasa_el_invierno })),
      el("div", {}, el("span", { class: "eyebrow", text: t.esteAnio }), origen(t.origNasa, "nasa"), el("p", { text: c.este_anio }),
        c.tendencia ? el("p", { class: "tenue", text: c.tendencia }) : null,
        conCaption(graficoSerie25(c.este_anio_dato, c.este_anio), t.capFav)),
      el("div", {}, el("span", { class: "eyebrow", text: t.frena }), origen(t.origRegla, "regla"), el("p", { text: c.que_lo_frena }))),
    preg,
    el("p", { style: "font-size:.92rem" }, el("strong", { text: t.tecnico + ": " }), c.tecnico),
    el("div", { class: "respaldo" },
      el("span", { class: "eyebrow", text: t.respaldoTit }),
      el("details", { open: true }, el("summary", { text: `${t.conFuente} (${c.fuentes.length})` }), lista(c.fuentes)),
      el("details", { open: c.supuestos.length > 0 }, el("summary", { text: `${t.supuestosN} (${c.supuestos.length})` }),
        el("ul", {}, c.supuestos.map(x => el("li", { text: x[0].toUpperCase() + x.slice(1) })))),
      el("details", {}, el("summary", { text: `${t.lagunasN} (${c.lagunas.length})` }), lista(c.lagunas))));
}

function abrirAgua() {
  const t = T(), A = S.vista.lote_hoy.agua;
  const dato = A.serie ? { serie: A.serie, anio: A.anio, dias: A.serie[String(A.anio)] } : null;
  const delMapa = S.suelo && S.suelo.punto && S.suelo.elegido == null && S.suelo.punto.textura_modelo_aproximada === S.form.textura;
  let anios = null;
  if (A.serie) {
    const pares = Object.entries(A.serie).filter(([a]) => Number(a) !== S.vista.anio_datos || !(S.vista.nasa && S.vista.nasa.provisional)).map(([a, d]) => [Number(a), d]);
    if (pares.length >= 5) {
      const seco = pares.reduce((m, x) => x[1] > m[1] ? x : m);
      const orden = [...pares].sort((a, b) => a[1] - b[1]), med = orden[Math.floor(orden.length / 2)][1];
      const tip = pares.reduce((m, x) => Math.abs(x[1] - med) < Math.abs(m[1] - med) ? x : m);
      const max = Math.max(seco[1], 1);
      const fila = (etq, [a, d], cls) => el("div", { class: "anio-fila " + cls },
        el("span", {}, el("strong", { text: String(a) }), el("span", { class: "tenue", text: " · " + etq })),
        el("div", { class: "barra" }, el("div", { style: `width:${d / max * 100}%` })),
        el("span", { text: fmt(t.diasSed, { n: d }) }));
      anios = el("div", { class: "anios" }, el("span", { class: "eyebrow", text: t.aniosTit }),
        fila(t.anioSeco, seco, "seco"), fila(t.anioTipico, tip, "tipico"),
        el("p", { class: "suave", style: "font-size:.9rem", text: t.aniosCambia }),
        el("p", { class: "suave", style: "font-size:.9rem", text: t.aniosIgual }));
    }
  }
  abrirLateral(`${t.aguaT} · ${A.textura.nombre_mostrar}`,
    el("div", { class: "origenes" }, origen(t.origNasa, "nasa"), delMapa ? origen(t.origUsda, "usda") : origen(t.origUsted, "vio"), origen(t.origSupuesto, "sup")),
    el("p", { style: "font-weight:600", text: A.texto_estado }),
    el("p", { class: "suave", text: A.texto_anio }),
    A.texto_rango ? el("p", { class: "rango", text: A.texto_rango }) : null,
    el("p", { class: "tenue", style: "font-size:.88rem", text: A.texto_metodo }),
    notaSed(),
    conCaption(graficoSerie25(dato, A.texto_anio), t.capSed),
    anios,
    el("details", { class: "fuentes", open: true }, el("summary", { text: t.limites }), lista(A.limites)));
}

function abrirGuiaSuelo(alElegir) {
  const t = T(), i = S.idioma === "en" ? 1 : 0;
  abrirLateral(t.sgTit,
    el("p", { class: "suave", text: t.sgIntro }),
    el("ol", {}, t.sgPasos.map(x => el("li", { text: x }))),
    el("div", { class: "guia-suelo" }, Object.entries(TEX).map(([k, n]) =>
      el("div", { class: "gs-fila" + (S.form.textura === k ? " sel" : "") },
        el("div", {}, el("strong", { text: n[i] }), el("p", { class: "suave", text: t.sgClases[k] })),
        el("button", { type: "button", class: "btn", text: t.sgElegir, "aria-label": `${t.sgElegir}: ${n[i]}`,
          onclick: () => { alElegir(k); cerrarLateral(); } })))),
    el("p", { class: "tenue", text: t.sgNoSeguro }),
    el("p", { class: "tenue", style: "font-size:.85rem", text: t.sgFuente }));
}

function abrirComo(enfocarFuentes = false) {
  const t = T(), v = S.vista;
  const fuentes = el("div", { id: "lat-fuentes", style: "display:grid; gap:8px" }, el("h3", { text: t.fuentesIA }),
    el("p", { class: "suave", text: t.fuentesTexto }), v && v.ia_nota ? el("p", { class: "suave", text: v.ia_nota }) : el("p", { class: "suave", text: t.ilusIA + "." }));
  abrirLateral(t.como,
    v && v.nasa ? el("div", { style: "display:grid; gap:8px" }, el("h3", { text: v.nasa.titulo }),
      el("p", { class: "suave", text: v.nasa.texto }), v.nasa.detalle ? el("p", { class: "tenue", text: v.nasa.detalle }) : null,
      v.nasa.provisional ? el("p", { class: "tenue", text: v.nasa.provisional }) : null) : null,
    v ? el("div", { class: "celda", html: "" },
      (() => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("aria-hidden", "true");
        s.innerHTML = '<path d="M0 25H100M0 50H100M0 75H100M25 0V100M50 0V100M75 0V100" stroke="#E5E7EB"/><rect x="20" y="20" width="60" height="60" fill="#EEF4F0" stroke="#1F5135" stroke-width="2" stroke-dasharray="4 3"/><circle cx="50" cy="50" r="5" fill="#111827"/>'; return s; })(),
      el("p", { class: "suave", style: "font-size:.9rem", text: v.textos.celda })) : null,
    el("div", {}, el("h3", { text: t.pasosTitulo }), el("ol", {}, [t.paso1, t.paso2, t.paso3].map(x => el("li", { text: x })))),
    el("div", {}, el("h3", { text: t.noSabemos }), el("ul", {}, t.noSabe.map(x => el("li", { text: x })))),
    fuentes);
  if (enfocarFuentes) fuentes.scrollIntoView({ block: "start" });
}

function abrirMenu() {
  const t = T();
  const idiomaSeg = el("div", { class: "seg", role: "group", "aria-label": t.menuIdioma },
    [["es", "Español"], ["en", "English"]].map(([k, txt]) => el("button", { type: "button", "aria-pressed": String(S.idioma === k), text: txt,
      onclick: async () => { if (S.idioma === k) return; S.idioma = k; try { localStorage.setItem("idioma", k); } catch (_) {} cerrarLateral(); render(); if (S.vista) await consultar(); } })));
  abrirLateral(t.menu,
    el("div", { style: "display:grid; gap:8px" }, el("p", { class: "eyebrow", text: t.menuIdioma }), idiomaSeg),
    el("div", { class: "menu-lista" },
      el("button", { type: "button", onclick: () => { cerrarLateral(); iniciarDemo(); } }, svg(ICO.play), el("span", { text: t.verDemo })),
      el("button", { type: "button", onclick: abrirCatalogo }, svg(ICO.libro), el("span", { text: t.catMenu })),
      el("button", { type: "button", onclick: () => abrirComo() }, svg(ICO.info), el("span", { text: t.como })),
      el("button", { type: "button", onclick: () => abrirComo(true) }, svg(ICO.libro), el("span", { text: t.fuentesIA })),
      el("button", { type: "button", onclick: () => { cerrarLateral(); S.vista = null; S.vio = {}; S.elegida = null; ir(0); } }, svg(ICO.reset), el("span", { text: t.reiniciar }))));
}
$("#btn-menu").onclick = abrirMenu;
$("#marca").onclick = e => { e.preventDefault(); ir(0); };


/* =================== Demo guiada =================== */
const DEMO_MS = 8000;
const DEMO = [
  { paso: 0, foco: ".inicio-txt" },
  { paso: 1, foco: ".form-lote", antes: () => { Object.assign(S.form, { sitio: "iowa", lat: 42.03, lon: -93.63, actual: "maiz_continuo", textura: "franco_limoso", labranza: "siembra_directa" }); } },
  { paso: 2, foco: ".conclusion", carga: true, datos: () => ({ titulo: S.vista.destacado ? S.vista.destacado.titulo : "" }) },
  { paso: 2, foco: "#lateral .calculo", despues: () => { const c = S.vista.lote_hoy.tarjetas.find(x => x.calculo) || S.vista.lote_hoy.tarjetas[0]; if (c) abrirProblema(c.clave); } },
  { paso: 3, foco: ".det-rot", antes: () => { cerrarLateral(); S.orden = "sanidad"; S.elegida = primeraNoActual("sanidad"); },
    datos: () => ({ nombre: nombreRot(S.elegida) }) },
  { paso: 3, foco: ".orden", antes: () => { cambiarOrden("agua"); S.elegida = primeraNoActual("agua"); },
    datos: () => ({ nombre: ordenadas("agua")[0].nombre }) },
  { paso: 4, foco: ".resumen" }
];

function iniciarDemo() {
  cerrarLateral();
  S.demo = { i: 0, pausa: false, timer: null };
  pasoDemo(0);
}

async function pasoDemo(i) {
  const d = S.demo; if (!d) return;
  clearTimeout(d.timer);
  if (i >= DEMO.length) return salirDemo();
  d.i = i;
  const p = DEMO[i];
  if (p.antes) p.antes();
  if (p.carga) { S.vio = {}; S.nivelesPrevios = null; await consultar(); if (!S.demo) return; }
  if (p.paso === 3 && i === 4) S.ordenMsg = "";
  ir(p.paso);
  if (p.despues) p.despues();
  pintarGuia();
  document.querySelectorAll(".resaltado").forEach(n => n.classList.remove("resaltado"));
  const f = document.querySelector(p.foco);
  if (f) { f.classList.add("resaltado"); f.scrollIntoView({ block: "nearest" }); }
  if (!d.pausa) d.timer = setTimeout(() => pasoDemo(i + 1), DEMO_MS);
}

function pintarGuia() {
  const t = T(), d = S.demo, g = $("#guia");
  if (!d) { g.hidden = true; return; }
  const p = DEMO[d.i];
  const texto = fmt(t.g[d.i], p.datos ? p.datos() : {});
  const ultimo = d.i === DEMO.length - 1;
  g.hidden = false;
  g.replaceChildren(
    el("div", { class: "g-cab" }, el("span", { text: `${t.demo} · ${d.i + 1}/${DEMO.length}` }),
      el("button", { type: "button", class: "btn fantasma", text: t.demoSalir, onclick: salirDemo })),
    el("p", { text: texto }),
    el("div", { class: "prog" }, el("div", { style: `width:${((d.i + 1) / DEMO.length) * 100}%` })),
    el("div", { class: "g-acc" },
      el("button", { type: "button", class: "btn fantasma", text: d.pausa ? t.demoSeguir : t.demoPausa,
        onclick: () => { d.pausa = !d.pausa; clearTimeout(d.timer); if (!d.pausa) d.timer = setTimeout(() => pasoDemo(d.i + 1), DEMO_MS); pintarGuia(); } }),
      el("button", { type: "button", class: "btn prim", text: ultimo ? t.demoFin : t.demoSig, onclick: () => pasoDemo(d.i + 1) })));
}

function salirDemo() {
  if (S.demo) clearTimeout(S.demo.timer);
  S.demo = null;
  document.querySelectorAll(".resaltado").forEach(n => n.classList.remove("resaltado"));
  $("#guia").hidden = true;
}
$("#btn-demo").onclick = iniciarDemo;

/* =================== Inicio =================== */
const params = new URLSearchParams(location.search);
// Idioma: 1) ?idioma= o ?lang= en la URL, 2) lo que la persona eligió antes, 3) el idioma del
// navegador (español → es; cualquier otro → en, porque el proyecto se entrega en inglés).
S.idioma = (() => {
  const url = (params.get("idioma") || params.get("lang") || "").slice(0, 2).toLowerCase();
  if (url === "es" || url === "en") return url;
  try { const g = localStorage.getItem("idioma"); if (g === "es" || g === "en") return g; } catch (_) {}
  const nav = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"]);
  return String(nav[0] || "en").toLowerCase().startsWith("es") ? "es" : "en";
})();
history.replaceState({ paso: 0 }, "", location.search + "#");
render();
if (params.get("demo") === "1") iniciarDemo();
