## MODIFIED Requirements

### Requirement: Pantalla inicial de juego
La app SHALL arrancar en una pantalla inicial con tres botones grandes con dibujo y etiqueta: "Jugar libre", "Mundos" y "Aventura". Al tocar "Jugar libre" MUST entrar en la escena de juego libre con 0 frutas. Al tocar "Mundos" MUST abrir el selector de mundos, y al tocar "Aventura", el camino de la aventura. Los tres botones SHALL tener al menos 160×160 px CSS y caber sin desplazamiento en un iPad en cualquier orientación. (CA1 de add-world-map)

#### Scenario: Entrar al juego libre desde la pantalla inicial
- **GIVEN** la app acaba de abrirse
- **WHEN** la niña toca el botón "Jugar libre"
- **THEN** se muestra la escena de juego con el marco de diez vacío
- **AND** el número escrito muestra "0"

#### Scenario: Entrar en los mundos y en la aventura
- **GIVEN** la app acaba de abrirse
- **WHEN** la niña toca "Mundos"
- **THEN** se muestra el selector de mundos
- **AND** al volver al inicio y tocar "Aventura" se muestra el camino de la aventura

#### Scenario: Tamaño de los botones de la pantalla inicial
- **GIVEN** la pantalla inicial se muestra en un iPad en cualquier orientación
- **WHEN** se miden los botones "Jugar libre", "Mundos" y "Aventura"
- **THEN** cada uno mide al menos 160×160 px CSS y los tres están dentro de la pantalla
