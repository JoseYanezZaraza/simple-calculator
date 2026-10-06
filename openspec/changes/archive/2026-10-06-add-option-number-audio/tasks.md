## 1. Estado

- [x] 1.1 Añadir `option?: number` a `NarrationStep` y el estado `option` a `Narrator` (se limpia al cancelar y al terminar), con sus tests
- [x] 1.2 Implementar `ChallengeSession.sayOption(n)`: solo en `howMany` y en fase `asking`, cancela la narración y dice el número resaltando la opción
- [x] 1.3 Tests unitarios de `sayOption`: audio, resaltado, no es respuesta, cancela el conteo, voz silenciada y celebración

## 2. UI

- [x] 2.1 Generalizar `RepeatButton` a `SpeakerButton` (`label`, `testid`, `size`) y usarlo en "repetir la pregunta"
- [x] 2.2 En "¿Cuántas hay?", apilar cada opción con su botón de audio (80 px, 16 px de separación) y un anillo de resaltado neutro
- [x] 2.3 Revisar el layout en vertical y apaisado con capturas

## 3. Tests e2e y documentación

- [x] 3.1 e2e WebKit iPad (ambas orientaciones) para CA1–CA5
- [x] 3.2 README: botón de audio de las opciones

## 4. Verificación de Criterios de Aceptación

- [x] 4.1 Verificar **CA1**: un botón de audio por opción, ≥72 px y separado ≥16 px (e2e en ambas orientaciones)
- [x] 4.2 Verificar **CA2**: dice el número de la opción y la resalta, cancelando la narración en curso (e2e + unit)
- [x] 4.3 Verificar **CA3**: no cuenta como respuesta y el reto sigue igual (e2e + unit)
- [x] 4.4 Verificar **CA4**: con la voz silenciada no suena y resalta igual (e2e + unit)
- [x] 4.5 Verificar **CA5**: durante la celebración no tiene efecto (unit + e2e)
- [x] 4.6 Cumplir la **Definition of Done** de design.md
