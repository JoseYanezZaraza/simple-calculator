## MODIFIED Requirements

### Requirement: Desbloqueo de audio con el primer toque
El sistema SHALL inicializar y desbloquear el motor de audio dentro del gesto de toque de cualquiera de los botones de la pantalla inicial ("Jugar libre", "Mundos" o "Aventura"), para que todos los audios posteriores suenen en Safari para iPadOS sin más interacción. (CA1 de add-world-map)

#### Scenario: Audio disponible tras entrar al juego libre
- **GIVEN** la app está en la pantalla inicial con la voz activada
- **WHEN** la niña toca "Jugar libre" y después toca ➕
- **THEN** suena el audio del número "uno"

#### Scenario: Audio disponible tras entrar por "Mundos"
- **GIVEN** la app está en la pantalla inicial con la voz activada
- **WHEN** la niña toca "Mundos", después un mundo y después su nodo iluminado
- **THEN** suena la pregunta del reto
