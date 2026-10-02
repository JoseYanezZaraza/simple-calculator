<!--
  Plantilla de PROPOSAL personalizada (code-config harness).
  Mantiene la estructura de OpenSpec y añade Criterios de Aceptación + enlace a Linear.
  Enfócate en el PORQUÉ y el QUÉ; el CÓMO va en design.md. Mantenlo conciso (1-2 páginas).
-->

> **Linear:** <!-- ENG-123 o URL del issue --> · **Estado:** Draft

## Why

<!-- Motivación del cambio. ¿Qué problema resuelve? ¿Por qué ahora? (1-2 frases) -->

## What Changes

<!-- Qué cambia. Sé específico: nuevas capacidades, modificaciones, eliminaciones.
     Marca cambios que rompen compatibilidad con **BREAKING**. -->

## Capabilities

### New Capabilities
<!-- Capacidades nuevas. Reemplaza <name> con identificador kebab-case (p.ej. user-auth,
     data-export). Cada una crea specs/<name>/spec.md -->
- `<name>`: <breve descripción de lo que cubre esta capacidad>

### Modified Capabilities
<!-- Capacidades existentes cuyos REQUISITOS cambian (no solo la implementación).
     Cada una necesita un delta spec. Usa nombres existentes de openspec/specs/.
     Deja vacío si no cambia ningún requisito. -->
- `<existing-name>`: <qué requisito está cambiando>

## Impact

<!-- Código, APIs, dependencias y sistemas afectados. -->

## Criterios de Aceptación

<!--
  Criterios de ALTO NIVEL, verificables y observables que definen cuándo este cambio está "hecho".
  Cada criterio debe poder marcarse como cumplido / no cumplido sin ambigüedad.
  Se mapean 1:1 con la sección "Verificación de Criterios de Aceptación" de tasks.md
  y se detallan como escenarios Given/When/Then en los spec.md.
-->
- [ ] **CA1:** <resultado observable que se debe cumplir>
- [ ] **CA2:** <...>
