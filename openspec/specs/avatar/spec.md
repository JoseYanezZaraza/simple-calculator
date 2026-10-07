# avatar Specification

## Purpose
Personaje cartoon elegido por la niña (manzana, plátano, fresa o naranja) que la representa en el mapa de niveles y en la aventura y salta al siguiente nivel o mundo cuando avanza; se guarda en el dispositivo aparte del progreso.

## Requirements
### Requirement: Personajes de avatar
La app SHALL ofrecer 4 personajes de avatar, uno por fruta: manzana, plátano, fresa y naranja. Cada uno SHALL ser una ilustración cartoon con ojos, sonrisa y patitas, y SHALL tener una animación de reposo sutil que no cambie su posición. (CA1)

#### Scenario: Personajes disponibles
- **GIVEN** la pantalla de elección de avatar
- **WHEN** se muestra
- **THEN** aparecen la manzana, el plátano, la fresa y la naranja como personajes cartoon

### Requirement: Elegir el avatar la primera vez
Al tocar "Mundos" o "Aventura" sin avatar guardado, el sistema SHALL mostrar la pantalla "¿Quién te acompaña?" antes que el selector o el camino, con los 4 personajes en botones de al menos 160×160 px, y SHALL reproducir el audio de la pregunta. Al elegir un personaje, el sistema SHALL guardarlo y mostrar la pantalla que se había pedido. (CA1)

#### Scenario: Primera entrada en "Mundos"
- **GIVEN** no hay avatar guardado
- **WHEN** la niña toca "Mundos"
- **THEN** se muestra "¿Quién te acompaña?" con los 4 personajes y suena la pregunta
- **AND** al tocar la fresa se muestra el selector de mundos

#### Scenario: Primera entrada en "Aventura"
- **GIVEN** no hay avatar guardado
- **WHEN** la niña toca "Aventura" y elige el plátano
- **THEN** se muestra el camino de la aventura con el plátano como avatar

### Requirement: Avatar persistente
El avatar elegido SHALL guardarse en el almacenamiento local del dispositivo, con una clave propia distinta de la del progreso, y SHALL recuperarse al abrir la app. Con un avatar guardado, la pantalla de elección MUST NOT aparecer sola. Si el almacenamiento no está disponible, falla o tiene un valor inválido, el sistema MUST permitir elegir y jugar durante la sesión sin mostrar errores. (CA2)

#### Scenario: Recordar el avatar
- **GIVEN** la niña eligió la naranja
- **WHEN** se cierra y se vuelve a abrir la app y se toca "Mundos"
- **THEN** se muestra directamente el selector de mundos con la naranja como avatar

#### Scenario: Valor guardado inválido
- **GIVEN** el almacenamiento contiene un avatar desconocido
- **WHEN** se toca "Mundos"
- **THEN** se muestra la pantalla de elección sin ningún error

### Requirement: Cambiar de avatar
El selector de mundos y el camino de la aventura SHALL mostrar un botón con el avatar actual que abre la pantalla de elección, con ese personaje marcado. Elegir otro SHALL sustituirlo, guardarlo y volver a la pantalla de origen. (CA3)

#### Scenario: Cambiar de la fresa al plátano
- **GIVEN** el avatar es la fresa y la niña está en el selector de mundos
- **WHEN** toca el botón del avatar y elige el plátano
- **THEN** vuelve al selector con el plátano en el botón
- **AND** al abrir un mundo, el avatar del mapa es el plátano

### Requirement: Avatar en el mapa de niveles
En el mapa de niveles, el avatar SHALL mostrarse sobre el nodo siguiente o, si el mundo está completo, sobre el nodo 10. El avatar MUST NOT interceptar toques: tocar el nodo que tiene debajo SHALL iniciar su reto. (CA4)

#### Scenario: Posición con progreso
- **GIVEN** el mundo fresa tiene 3 niveles completados
- **WHEN** se abre su mapa
- **THEN** el avatar está sobre el nodo 4

#### Scenario: Tocar el nodo bajo el avatar
- **GIVEN** el avatar está sobre el nodo 4
- **WHEN** la niña toca ese nodo, también sobre el avatar
- **THEN** se inicia el reto del nivel 4

### Requirement: Salto al avanzar de nivel
Al volver al mapa tras completar el nivel siguiente, el avatar SHALL aparecer sobre el nodo completado y saltar en arco hasta el nuevo nodo siguiente (o hasta el 10 si el mundo quedó completo) en no más de 1,2 segundos. Si el nivel jugado ya estaba completado, el avatar MUST NOT moverse. (CA5)

#### Scenario: Saltar del nodo 3 al 4
- **GIVEN** el mundo manzana tiene 2 niveles completados y el avatar está sobre el nodo 3
- **WHEN** la niña acierta el nivel 3 y vuelve al mapa
- **THEN** el avatar salta del nodo 3 al nodo 4

#### Scenario: Repetir un nivel
- **GIVEN** el mundo manzana tiene 5 niveles completados
- **WHEN** la niña juega el nivel 2, acierta y vuelve al mapa
- **THEN** el avatar sigue sobre el nodo 6 sin saltar

### Requirement: Avatar en la aventura
En el camino de la aventura, el avatar SHALL mostrarse sobre el mundo actual: el primero sin completar o, si todos lo están, el último. Al desbloquearse un mundo tras completar el anterior, el avatar SHALL saltar del mundo completado al desbloqueado durante la pausa previa a abrirlo, y MUST llegar antes de que se abra. Los toques MUST pasar al mundo que tiene debajo. (CA6)

#### Scenario: Primera vez en la aventura
- **GIVEN** no hay progreso y el avatar es la naranja
- **WHEN** se abre la aventura
- **THEN** la naranja-avatar está sobre el mundo manzana

#### Scenario: Saltar al mundo desbloqueado
- **GIVEN** en la aventura, el mundo manzana tiene 9 niveles completados
- **WHEN** la niña completa el nivel 10 y, tras la celebración, se muestra el camino
- **THEN** el avatar salta del mundo manzana al mundo plátano antes de que se abra su mapa

### Requirement: Avatar y reinicio del progreso
Reiniciar el progreso MUST NOT cambiar el avatar elegido. Tras el reinicio, el avatar SHALL mostrarse sobre el nodo 1 de cada mundo y sobre el primer mundo de la aventura. (CA7)

#### Scenario: Reiniciar con avatar elegido
- **GIVEN** el avatar es el plátano y hay progreso
- **WHEN** el adulto reinicia el progreso y confirma
- **THEN** el avatar sigue siendo el plátano y está sobre el primer mundo de la aventura

### Requirement: Movimiento reducido
Si el sistema indica preferencia por movimiento reducido (`prefers-reduced-motion: reduce`), el avatar SHALL cambiar de posición sin animación de salto, y la animación de reposo MUST desactivarse. (CA8)

#### Scenario: Avanzar con movimiento reducido
- **GIVEN** el iPad tiene activado "reducir movimiento"
- **WHEN** la niña completa un nivel y vuelve al mapa
- **THEN** el avatar aparece directamente sobre el nuevo nodo siguiente, sin arco

### Requirement: Avatar sin conexión
Las ilustraciones de los personajes y el audio `chooseAvatar` SHALL formar parte del precache del service worker, de modo que la elección, la posición y el salto del avatar MUST funcionar sin conexión tras la primera carga. (CA9)

#### Scenario: Elegir avatar en modo avión
- **GIVEN** la app instalada se cargó al menos una vez con conexión y no hay avatar guardado
- **WHEN** el iPad está en modo avión y la niña toca "Aventura"
- **THEN** se muestran los 4 personajes, suena la pregunta y, al elegir uno, aparece en el camino

