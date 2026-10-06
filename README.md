# Contar frutas

Juego web para que una niña de 3 años explore la **suma y la resta de 0 a 10** manipulando frutas en un **marco de diez**. Está pensado para **iPad** y funciona sin conexión una vez instalado.

La pantalla inicial ofrece dos modos: **jugar libre** y **retos**.

### Jugar libre

- ➕ hace caer una fruta en el siguiente hueco y ➖ hace que la última se vaya rodando.
- El número escrito grande y la voz acompañan cada cambio.
- Al tocar una fruta, la voz cuenta de 1 a N.
- Llegar a 10 tiene celebración. Con el marco vacío, ➖ responde con una frase amable. Nunca hay errores ni puntuaciones.

### Retos

La app propone y la niña responde. Los retos se alternan al azar y nunca se repite el anterior:

- **"¿Cuántas hay?"**: el marco muestra entre 1 y 10 frutas y la niña elige el número entre 3 opciones. Las opciones incorrectas están a 3 o menos de la respuesta.
  Bajo cada número hay un altavoz que dice cómo se llama ("seis"). Escucharlo no cuenta como respuesta: sirve para oír las opciones antes de elegir.
- **"Pon N frutas"**: la voz pide un número y la niña construye la cantidad con ➕/➖ y confirma con ✓.
- Al acertar hay celebración, "¡Muy bien!" y, tras `SUCCESS_PAUSE_MS` (2 s, en `src/state/challengeSession.svelte.ts`), el siguiente reto.
- Si la respuesta no es correcta no hay error: la voz dice "¡Vamos a contarlas!", cuenta las frutas resaltándolas y repite la pregunta.
- El botón del altavoz repite la pregunta.

### Controles del adulto

Están en la esquina superior derecha, son discretos y funcionan en los dos modos:

- volver al inicio;
- silenciar la voz;
- elegir la fruta.

Stack: Svelte 5 · Vite · TypeScript · vite-plugin-pwa · Vitest · Playwright (WebKit).
Especificación: `openspec/specs/` (capacidades vigentes) y `openspec/changes/` (cambios en curso y archivados; Linear INN-12, INN-13).

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:5173
```

Para probarlo en el iPad dentro de la misma red: `npm run dev -- --host` y abre la IP que muestra Vite.
Ten en cuenta que el service worker solo funciona con HTTPS o en `localhost`.

| Comando                             | Qué hace                                                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm test`                          | Tests unitarios (Vitest): núcleo, sesión y audio                                                               |
| `npm run test:e2e`                  | Tests e2e en WebKit con perfiles de iPad vertical y apaisado (la primera vez: `npx playwright install webkit`) |
| `npm run lint`                      | ESLint + Prettier (`npm run format` corrige el formato)                                                        |
| `npm run check`                     | Typecheck con svelte-check y tsc                                                                               |
| `npm run build` / `npm run preview` | Build de producción y servidor local del build                                                                 |
| `npm run audio:tts`                 | Genera con la voz sintética de macOS los audios que falten (`FORCE=1` los regenera todos y pisa grabaciones)   |
| `npm run pwa:assets`                | Regenera los iconos de la PWA a partir de `public/icon.svg`                                                    |

## Sustituir los audios por grabaciones propias

Los audios viven en `public/audio/es/` con nombres fijos:

| Archivo            | Qué dice                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `0.m4a` … `10.m4a` | El número ("cero" … "diez")                                                                   |
| `full.m4a`         | La frase al llenar el marco (p. ej. "¡Está lleno! ¡Muy bien!"); suena justo después de "diez" |
| `empty.m4a`        | La frase amable al tocar ➖ sin frutas (p. ej. "No quedan frutas")                            |
| `howMany.m4a`      | La pregunta del reto "¿Cuántas frutas hay?"                                                   |
| `put.m4a`          | "Pon", que suena justo antes del número en el reto "Pon N frutas"                             |
| `wellDone.m4a`     | "¡Muy bien!" al acertar un reto                                                               |
| `letsCount.m4a`    | "¡Vamos a contarlas!" antes de contar juntos                                                  |

1. Graba cada frase (por ejemplo, con Notas de voz del iPhone), con poco silencio al principio y al final.
2. Expórtala o conviértela a AAC `.m4a`. En macOS: `afconvert -f m4af -d aac -b 64000 grabacion.wav public/audio/es/3.m4a`.
3. Reemplaza el archivo manteniendo el nombre y vuelve a hacer el build y el despliegue.

No hay que cambiar código. Si una grabación dura más de lo previsto, el conteo espera a que termine antes de pasar al siguiente número.

## Despliegue (GitHub Pages)

El workflow `.github/workflows/ci.yml` ejecuta lint, typecheck y los tests unitarios y e2e en cada PR. En cada push a `main` despliega en GitHub Pages en `https://<usuario>.github.io/<repo>/`.

Configuración inicial del repositorio, una sola vez: **Settings → Pages → Source: GitHub Actions**.

Para construir con otra ruta base: `BASE_PATH=/mi-ruta/ npm run build`.

## Instalación en el iPad

1. Abre la URL de GitHub Pages en **Safari**.
2. Pulsa **Compartir → Añadir a pantalla de inicio**.
3. Abre la app desde el icono una vez con conexión, para que descargue imágenes y audios.
4. Desde ese momento funciona **sin conexión**, también en modo avión.

Para que la niña no pueda salir de la app, activa **Acceso Guiado**:

1. En **Ajustes → Accesibilidad → Acceso Guiado**, actívalo y define un código.
2. Abre la app y pulsa tres veces el botón lateral (o el botón de inicio) para iniciarlo.

> iPadOS puede borrar la caché de una PWA que lleva semanas sin abrirse. Si pasa, basta con abrirla de nuevo con conexión.
