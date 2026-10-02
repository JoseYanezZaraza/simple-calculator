<!--
  Plantilla de SPEC (delta) personalizada (code-config harness).
  Formato OpenSpec: respeta los headers de delta y usa EXACTAMENTE 4 hashtags (####) en Scenario.
  Aquí los Criterios de Aceptación del proposal se concretan como escenarios Given/When/Then.
-->

## ADDED Requirements

### Requirement: <!-- nombre del requisito -->
<!-- El sistema SHALL/MUST ...  (usa SHALL/MUST para requisitos normativos; evita should/may) -->

#### Scenario: <!-- nombre del escenario -->
- **GIVEN** <!-- contexto / precondición -->
- **WHEN** <!-- acción o evento que dispara el comportamiento -->
- **THEN** <!-- resultado esperado y verificable -->
- **AND** <!-- (opcional) resultado o condición adicional -->

<!--
  Reglas de OpenSpec (NO romper, el parser falla en silencio si no se cumplen):
  - Cada `### Requirement:` DEBE tener al menos un `#### Scenario:`.
  - Los Scenario usan EXACTAMENTE 4 hashtags (####). 3 hashtags o viñetas fallan en silencio.
  - Cada CA del proposal.md debe quedar cubierto por al menos un escenario.

  Para cambiar requisitos existentes, usa en su lugar:
  - ## MODIFIED Requirements   -> incluye el bloque COMPLETO y actualizado del requisito
  - ## REMOVED Requirements    -> incluye **Reason** y **Migration**
  - ## RENAMED Requirements     -> usa formato FROM: / TO:
-->
