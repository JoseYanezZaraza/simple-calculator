# Contar frutas

Juego web para que una niña de 3 años explore la **suma y la resta de 0 a 10** manipulando frutas en un **marco de diez**. Está pensado para **iPad** y funciona sin conexión una vez instalado.

La pantalla inicial ofrece tres opciones: **Jugar libre**, **Mundos** y **Aventura**.

### Jugar libre

- ➕ hace caer una fruta en el siguiente hueco y ➖ hace que la última se vaya rodando.
- El número escrito grande y la voz acompañan cada cambio.
- Al tocar una fruta, la voz cuenta de 1 a N.
- Llegar a 10 tiene celebración. Con el marco vacío, ➖ responde con una frase amable. Nunca hay errores ni puntuaciones.

### Mundos y Aventura

Los retos se organizan en **4 mundos**, uno por fruta, con **10 niveles** cada uno y dificultad creciente:

| Mundo      | Números | Temática |
| ---------- | ------- | -------- |
| 🍎 Manzana | 1–3     | huerto   |
| 🍌 Plátano | 1–5     | selva    |
| 🍓 Fresa   | 1–7     | jardín   |
| 🍊 Naranja | 1–10    | naranjal |

- **Mapa de niveles:** cada mundo tiene un camino de 10 nodos.
  - El siguiente nivel aparece iluminado y los posteriores, bloqueados.
  - Al acertar se vuelve al mapa con el nodo completado.
  - Los niveles completados se pueden repetir sin cambiar el progreso.
- **Mundos:** desde el selector se abre cualquier mundo. Todos están abiertos.
- **Aventura:** los mundos se juegan en orden.
  - Al completar uno, el siguiente se desbloquea y se abre solo.
  - Al terminar la naranja, se celebra la aventura completa.
- Completar un mundo o la aventura tiene una celebración especial con audio propio.

**Avatar:** la primera vez que se entra en "Mundos" o "Aventura", la niña elige su personaje ("¿Quién te acompaña?"): una manzana, un plátano, una fresa o una naranja cartoon.

- El avatar está de pie sobre el nivel siguiente del mapa y sobre el mundo actual de la aventura.
- **Salta** al siguiente nivel o mundo cuando avanza.
- Se cambia con el botón redondo de abajo a la izquierda, en el selector y en la aventura.
- Se guarda en el iPad (`contar-frutas:avatar:v1`), aparte del progreso: reiniciar el progreso no lo borra.
- Con "Reducir movimiento" activado en iPadOS, cambia de sitio sin saltar.

Cada nivel es un reto:

- **"¿Cuántas hay?"**: el marco muestra entre 1 y el máximo del mundo frutas, y la niña elige el número entre 3 opciones. Las opciones incorrectas están a 3 o menos de la respuesta; en el mundo manzana siempre son 1, 2 y 3.
  Bajo cada número hay un altavoz que dice cómo se llama ("seis"). Escucharlo no cuenta como respuesta: sirve para oír las opciones antes de elegir.
- **"Pon N frutas"**: la voz pide un número y la niña construye la cantidad con ➕/➖ y confirma con ✓.
- Al acertar hay celebración, "¡Muy bien!" y, tras `SUCCESS_PAUSE_MS` (2 s, en `src/state/challengeSession.svelte.ts`), se vuelve al mapa.
- Si la respuesta no es correcta no hay error: la voz dice "¡Vamos a contarlas!", cuenta las frutas resaltándolas y repite la pregunta.
- El botón del altavoz grande repite la pregunta.

**Progreso:** se guarda en el iPad (`localStorage`, clave `contar-frutas:progress:v1`) y funciona sin conexión. Si el almacenamiento no está disponible o tiene datos inválidos, la app empieza sin progreso, sin errores.

> iPadOS puede borrar los datos de una PWA que lleva semanas sin abrirse. En ese caso se pierde el progreso de los mundos y la app sigue funcionando desde cero.

### Controles del adulto

Están en la esquina superior derecha y son discretos:

- **Volver al inicio**: en todas las pantallas.
- **Silenciar la voz**: en todas las pantallas.
- **Elegir la fruta**: solo en el juego libre; en los mundos la fruta es la del mundo.
- **Reiniciar el progreso** (↺): en "Mundos" y "Aventura". Pide confirmación con texto.

Stack: Svelte 5 · Vite · TypeScript · vite-plugin-pwa · Vitest · Playwright (WebKit).
Especificación: `openspec/specs/` (capacidades vigentes) y `openspec/changes/` (cambios en curso y archivados; Linear INN-12 a INN-16).

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

| Archivo             | Qué dice                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `0.m4a` … `10.m4a`  | El número ("cero" … "diez")                                                                   |
| `full.m4a`          | La frase al llenar el marco (p. ej. "¡Está lleno! ¡Muy bien!"); suena justo después de "diez" |
| `empty.m4a`         | La frase amable al tocar ➖ sin frutas (p. ej. "No quedan frutas")                            |
| `howMany.m4a`       | La pregunta del reto "¿Cuántas frutas hay?"                                                   |
| `put.m4a`           | "Pon", que suena justo antes del número en el reto "Pon N frutas"                             |
| `wellDone.m4a`      | "¡Muy bien!" al acertar un reto                                                               |
| `letsCount.m4a`     | "¡Vamos a contarlas!" antes de contar juntos                                                  |
| `worldDone.m4a`     | "¡Completaste el mundo!" al completar los 10 niveles de un mundo                              |
| `adventureDone.m4a` | "¡Completaste la aventura!" al terminar el último mundo de la aventura                        |
| `chooseAvatar.m4a`  | "¿Quién te acompaña?" al elegir el personaje                                                  |

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
