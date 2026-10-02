# <Nombre del proyecto>

<!-- Rellena: qué es el proyecto, el stack y los comandos clave. -->

## Flujo de desarrollo (spec-driven con OpenSpec)

1. **Issue** — parte de un issue de Linear (o créalo con el subagente `linear-sync`).
2. **Propose** — `/opsx:propose "<idea>"` genera proposal → specs → design → tasks.
   Cada cambio lleva **criterios de aceptación** (CA1, CA2, …) y escenarios Given/When/Then.
3. **Implement** — sigue `openspec/changes/<name>/tasks.md`; marca las casillas al avanzar.
4. **Validate** — `openspec validate <name> --strict` debe pasar.
5. **PR** — rama `feature/<linear-id>-<slug>`, PR en GitHub con `gh`, enlaza el issue de Linear.
6. **Archive** — `openspec archive <name>` cuando se cumplan TODOS los CA y la Definition of Done.

## Comandos
- Tests: <!-- p.ej. npm test -->
- Lint:  <!-- p.ej. npm run lint -->
- Build: <!-- p.ej. npm run build -->

## Convenciones
<!-- Estilo de código, estructura de carpetas, naming de ramas/commits, etc. -->
