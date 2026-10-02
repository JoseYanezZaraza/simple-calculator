---
description: Crea un cambio de OpenSpec con criterios de aceptación (schema spec-driven-ca)
argument-hint: <idea o nombre-del-cambio>
---

Crea un cambio de OpenSpec usando el schema personalizado **`spec-driven-ca`**, que exige
criterios de aceptación en cada artifact.

Idea / nombre del cambio: **$ARGUMENTS**

## Pasos

1. **Entiende qué construir.** Si `$ARGUMENTS` no es claro, pregunta con AskUserQuestion qué se
   quiere construir o arreglar. Si hay un issue de Linear asociado, léelo (subagente `linear-sync`)
   y úsalo como contexto. Deriva un nombre kebab-case (p.ej. "add user auth" → `add-user-auth`).

2. **Crea el cambio CON el schema personalizado** (el flag `--schema` es OBLIGATORIO; sin él se
   usa el schema por defecto, que no trae criterios de aceptación):
   ```bash
   openspec new change "<name>" --schema spec-driven-ca
   ```

3. **Obtén el orden de artifacts:**
   ```bash
   openspec status --change "<name>" --json
   ```

4. **Crea los artifacts en orden de dependencia** (proposal → specs → design → tasks). Para cada uno:
   ```bash
   openspec instructions <artifact-id> --change "<name>" --json
   ```
   - Escribe el archivo en `resolvedOutputPath` usando el `template` devuelto (ya incluye las
     secciones de criterios de aceptación / Definition of Done).
   - Aplica `context` y `rules` como restricciones — **NO** los copies dentro del archivo.
   - En `proposal.md`: define criterios de aceptación numerados (**CA1, CA2, …**) observables.
   - En los `spec.md`: concreta cada CA como escenario `#### Scenario:` con **GIVEN/WHEN/THEN**
     (exactamente 4 hashtags; cada `### Requirement:` con ≥1 escenario; usa SHALL/MUST).
   - En `tasks.md`: el último grupo verifica cada CA 1:1 y la Definition of Done.

5. **Valida** y corrige hasta que pase:
   ```bash
   openspec validate "<name>" --strict
   ```

6. **Resumen:** artifacts creados, lista de CA definidos, y "listo para implementar con `/opsx:apply`".

> Para artifacts complejos, delega la redacción al subagente `spec-writer`.
