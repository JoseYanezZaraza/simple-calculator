# Calculadora interactiva infantil

Juego web para que una niña de 3 años explore sumas y restas de 0 a 10 con frutas en un marco de diez.
PWA pensada para iPad (Safari para iPadOS), offline. Linear: proyecto P-INN-2 (equipo Inno8).

Stack: Svelte 5 + Vite + TypeScript + vite-plugin-pwa · Vitest + Playwright (WebKit, perfiles iPad).

## Flujo de desarrollo (spec-driven con OpenSpec)

1. **Issue** — parte de un issue de Linear (o créalo con el subagente `linear-sync`).
2. **Propose** — `/opsx:propose "<idea>"` genera proposal → specs → design → tasks.
   Cada cambio lleva **criterios de aceptación** (CA1, CA2, …) y escenarios Given/When/Then.
3. **Implement** — sigue `openspec/changes/<name>/tasks.md`; marca las casillas al avanzar.
4. **Validate** — `openspec validate <name> --strict` debe pasar.
5. **PR** — rama `feature/<linear-id>-<slug>`, PR en GitHub con `gh`, enlaza el issue de Linear.
6. **Archive** — `openspec archive <name>` cuando se cumplan TODOS los CA y la Definition of Done.

## Comandos
- Dev:        `npm run dev`
- Tests:      `npm test` (Vitest, unitarios) · `npm run test:e2e` (Playwright WebKit iPad)
- Lint:       `npm run lint` (ESLint + Prettier) · `npm run format` para corregir formato
- Typecheck:  `npm run check`
- Build:      `npm run build` · `npm run preview` para servir el build
- Audios TTS provisionales: `npm run audio:tts` (macOS, usa `say` + `afconvert`)

## Convenciones
- `src/core/`: lógica pura, sin DOM ni Svelte; la UI nunca cambia la cantidad por su cuenta.
- `src/audio/`: la UI no reproduce audio directamente; todo pasa por `AudioService`.
- Audios en `public/audio/es/` con nombres estables (`0..10.m4a`, `full.m4a`, `empty.m4a`).
- Textos y nombres de cara al usuario en español; código en inglés.
