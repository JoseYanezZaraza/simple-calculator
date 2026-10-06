## ADDED Requirements

### Requirement: Escuchar el número de una opción
En un reto "¿Cuántas hay?", cada opción SHALL tener debajo un botón de audio propio, de al menos 72×72 px CSS, sin solaparse con la opción y separado de ella al menos 16 px. Al tocarlo, el sistema SHALL cancelar la narración en curso, reproducir el clip del número de esa opción y resaltar la opción durante ese paso. Tocar un botón de audio MUST NOT contar como respuesta: no SHALL producir acierto, celebración ni el reintento "contar juntos", y el reto MUST mantenerse. Con la voz silenciada el resaltado SHALL ocurrir igual, sin audio. Durante la fase de celebración, el botón de audio MUST NOT tener efecto. (CA1–CA5)

#### Scenario: Botón de audio por opción
- **GIVEN** un reto "¿Cuántas hay?" con opciones 4, 6 y 8
- **WHEN** se muestra el reto en un iPad, en vertical o en apaisado
- **THEN** hay un botón de audio bajo cada una de las 3 opciones
- **AND** cada botón de audio mide al menos 72×72 px y está separado al menos 16 px de su opción

#### Scenario: Escuchar una opción
- **GIVEN** un reto "¿Cuántas hay?" con N = 6 y opciones 4, 6 y 8, y la voz activada
- **WHEN** la niña toca el botón de audio de la opción "8"
- **THEN** suena "ocho"
- **AND** la opción "8" se resalta mientras suena y deja de estarlo al terminar

#### Scenario: Escuchar no es responder
- **GIVEN** un reto "¿Cuántas hay?" con N = 6 y opciones 4, 6 y 8
- **WHEN** la niña toca el botón de audio de "8" y después el de "6"
- **THEN** no se muestra la celebración y no suena "¡Vamos a contarlas!"
- **AND** el reto sigue siendo "¿Cuántas hay?" con N = 6 y las mismas opciones
- **AND** si después toca la opción "6", es un acierto

#### Scenario: Interrumpir el conteo
- **GIVEN** un reto "¿Cuántas hay?" en el que suena el reintento "contar juntos"
- **WHEN** la niña toca el botón de audio de una opción
- **THEN** el conteo se detiene y suena solo el número de esa opción

#### Scenario: Voz silenciada
- **GIVEN** la voz está desactivada y un reto "¿Cuántas hay?" con opciones 2, 3 y 4
- **WHEN** la niña toca el botón de audio de "3"
- **THEN** no suena ningún audio
- **AND** la opción "3" se resalta durante el mismo tiempo que con voz

#### Scenario: Durante la celebración
- **GIVEN** la niña acaba de acertar un reto "¿Cuántas hay?"
- **WHEN** toca un botón de audio antes de que aparezca el siguiente reto
- **THEN** no suena nada más y el siguiente reto aparece igualmente
