# Seguridad

## Alcance y supuesto de uso

Prototipo de hackathon pensado para correr **en la máquina de quien hace la demo**
(`uvicorn ... --host 127.0.0.1`). No tiene usuarios, cuentas, base de datos ni secretos.
Antes de publicarlo en internet, aplicar la sección "Si se publica".

## Qué datos maneja

- Entradas del usuario: coordenadas, rotación actual, textura de suelo, labranza, idioma y
  respuestas sí/no ("¿vio…?"). No se guardan; no hay cookies, `localStorage` ni analítica.
- Salidas a terceros: **solo coordenadas**, hacia NASA POWER (`power.larc.nasa.gov`) y
  USDA Soil Data Access (`sdmdataaccess.sc.egov.usda.gov`). Ninguno pide clave. Si la persona toca
  "Ver en vista satelital", el navegador abre Google Maps con esas coordenadas (solo con ese clic).
- En disco: respuestas de esas APIs en `cache/` (clima y suelo por coordenada).

## Revisión hecha (15-nov-2026)

| Punto | Estado |
|---|---|
| Secretos | No hay. `.env` está en `.gitignore`; `.env.example` no tiene valores sensibles. |
| Inyección SQL en `/api/suelo` y `/api/suelo/mapa` | La consulta a SDA (punto o cuadro de 2 × 2 km) se arma con `lat`/`lon` validados por FastAPI (`ge`/`le`) y formateados como número (`{:.6f}`): no entra texto del usuario. |
| Validación de parámetros | `textura`, `labranza` y `actual` se comparan con listas cerradas (400 si no); `idioma` se normaliza; `vio` solo acepta claves `si`/`no`; años acotados. |
| Archivos estáticos | `/{archivo}.json` resuelve la ruta y exige que quede dentro de `web/`; `/img` es `StaticFiles` (sin listado de directorio). |
| XSS en la web | El DOM se arma con `textContent` (función `el`); `innerHTML` solo con SVG fijos del código. Textos del USDA/NASA se muestran como texto. |
| CORS | No se habilita: otros sitios no pueden leer la API desde el navegador. |
| Dependencias | Versiones fijadas en `requirements.txt`. |

## Endurecimiento para Vercel (15-nov-2026)

| Medida | Dónde |
|---|---|
| Cabeceras: CSP (`default-src 'self'`, `script-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`), `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, COOP | `vercel.json` |
| Zona piloto: coordenadas fuera del Medio Oeste (lat 36–49,5; lon −104,5 a −80) → 422. Corta el abuso de pedir cualquier punto del mundo. `ROTACIONES_REGION=libre` lo desactiva | `api._en_region` |
| Errores 502 con mensaje genérico; el detalle va al log del servidor | `api.py` |
| `/docs` y `/openapi.json` apagados salvo `ROTACIONES_DOCS=1` | `api.py` |
| Largo máximo en parámetros de texto (`vio` ≤ 300, `textura`/`actual` ≤ 40) | `api.py` |
| Disco de solo lectura: lo nuevo se escribe en `/tmp/rotaciones-cache` | `power.py`, `ssurgo.py` |
| Dependencias de prueba fuera de producción (`requirements-dev.txt`); `pip-audit`: sin vulnerabilidades conocidas | `requirements*.txt` |
| No se suben al servidor: tests, herramientas, `.env`, `.venv`, salidas | `.vercelignore` |

`script-src 'self'` sin `'unsafe-inline'`: el script vive en `web/app.js` (con huella `?v=` para la caché)
y la misma política va en un `<meta>` del HTML, así que también rige en local. `style-src` conserva
`'unsafe-inline'` porque la interfaz usa atributos `style` y los SVG traen su `<style>`; el riesgo es bajo.

## Riesgos conocidos (aceptados para la demo)

1. **Sin límite de uso.** Cada coordenada nueva dispara ~27 descargas a NASA POWER (~15 MB en
   `cache/`) y hasta dos consultas al USDA (la del mapa devuelve ~60 KB de polígonos, que se guardan en `cache/`). Expuesto a internet, alguien podría llenar el disco o
   abusar de las APIs públicas a través de este servidor.
2. **Mensajes de error detallados.** Los 502 incluyen el texto de la excepción (útil para
   depurar, revela detalles internos).
3. **Sin HTTPS ni cabeceras de seguridad** (CSP, etc.): no hacen falta en `127.0.0.1`.

## Si se publica

- Servir detrás de un proxy con HTTPS y límite de peticiones por IP (p. ej. 10/min a `/api/*`).
- Restringir coordenadas a los sitios de demo o a una caja del Medio Oeste, o precargar y
  servir solo desde caché; poner tope de tamaño a `cache/`.
- Cambiar los `detail` de los 502 por un mensaje genérico y registrar el error en el servidor.
- Añadir CSP: `default-src 'self'; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'`.
- Correr `pip-audit -r requirements.txt` y actualizar lo que reporte.
- No usar `--reload` en producción.

## Reportar un problema

Abrir un issue privado o escribir al autor del repositorio. No publicar detalles de una falla
hasta que esté corregida.
