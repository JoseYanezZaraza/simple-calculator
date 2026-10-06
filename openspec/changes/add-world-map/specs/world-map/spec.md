## ADDED Requirements

### Requirement: Mundos por fruta
La app SHALL tener 4 mundos en este orden fijo, cada uno con su fruta y su número máximo de retos: manzana (3), plátano (5), fresa (7) y naranja (10). Cada mundo SHALL tener exactamente 10 niveles, y cada nivel es un reto. (CA2, CA4)

#### Scenario: Orden y rangos de los mundos
- **GIVEN** la app recién instalada
- **WHEN** se consultan los mundos
- **THEN** son manzana (1–3), plátano (1–5), fresa (1–7) y naranja (1–10), en ese orden, con 10 niveles cada uno

### Requirement: Temática de cada mundo
El selector, el mapa de niveles y los retos de un mundo SHALL mostrar su temática: una paleta de colores propia y un fondo decorado con su fruta. En los retos de un mundo, las frutas del marco MUST ser las de ese mundo y el selector de fruta del adulto MUST NOT mostrarse. (CA2, CA4)

#### Scenario: Reto en el mundo plátano
- **GIVEN** el adulto eligió fresa en el juego libre
- **WHEN** la niña juega un nivel del mundo plátano
- **THEN** todas las frutas del marco son plátanos
- **AND** la escena usa la temática del mundo plátano
- **AND** no se muestra el selector de fruta

### Requirement: Selector "Mundos"
El botón "Mundos" de la pantalla inicial SHALL abrir un selector con los 4 mundos en orden. Cada uno es un botón grande con su temática y su progreso, que muestra los niveles completados de 10 y un distintivo cuando está completo. Todos los mundos SHALL poder abrirse, sea cual sea el progreso. (CA2)

#### Scenario: Abrir un mundo posterior sin completar los anteriores
- **GIVEN** no hay progreso guardado
- **WHEN** la niña toca "Mundos" y después el mundo naranja
- **THEN** se abre el mapa de niveles del mundo naranja

#### Scenario: Progreso en el selector
- **GIVEN** el mundo manzana tiene 4 niveles completados y el mundo plátano está completo
- **WHEN** se muestra el selector
- **THEN** la manzana indica 4 de 10 y el plátano aparece completado

### Requirement: Mapa de niveles
El mapa de un mundo SHALL mostrar 10 nodos numerados en un camino, sin desplazamiento y visibles a la vez en un iPad en cualquier orientación. Cada nodo tiene uno de estos estados:
- **completado:** marcado;
- **siguiente:** el primero sin completar, iluminado y animado;
- **bloqueado:** posterior al siguiente.

Tocar un nodo completado o el siguiente SHALL iniciar su reto. Tocar un nodo bloqueado MUST NOT tener efecto ni mostrar errores. (CA3)

#### Scenario: Estados de los nodos
- **GIVEN** el mundo fresa tiene 3 niveles completados
- **WHEN** se abre su mapa
- **THEN** los nodos 1–3 aparecen completados, el 4 iluminado y del 5 al 10 bloqueados

#### Scenario: Tocar un nodo bloqueado
- **GIVEN** el mundo fresa tiene 3 niveles completados
- **WHEN** la niña toca el nodo 7
- **THEN** el mapa sigue igual y no se inicia ningún reto

### Requirement: Retos de un nivel
Al iniciar un nivel, el sistema SHALL generar un reto al azar, de tipo "¿Cuántas hay?" o "Pon N frutas", con N entre 1 y el máximo del mundo. MUST NOT ser igual (mismo tipo y N) al último reto jugado en esa sesión. Los retos "¿Cuántas hay?" SHALL ofrecer 3 opciones distintas entre 1 y el máximo del mundo. (CA4)

#### Scenario: Reto del mundo manzana
- **GIVEN** la niña inicia un nivel del mundo manzana
- **WHEN** se genera un reto "¿Cuántas hay?"
- **THEN** N está entre 1 y 3 y las opciones son exactamente 1, 2 y 3 en algún orden

### Requirement: Completar un nivel
Al acertar el reto de un nivel, tras la celebración y "¡Muy bien!", el sistema SHALL volver al mapa del mundo. Si el nivel era el siguiente, SHALL quedar completado, guardarse y el nuevo siguiente iluminarse. Repetir un nivel ya completado MUST NOT cambiar el progreso. (CA5)

#### Scenario: Completar el nivel siguiente
- **GIVEN** el mundo manzana tiene 2 niveles completados
- **WHEN** la niña juega el nodo 3 y acierta
- **THEN** tras la celebración se muestra el mapa con los nodos 1–3 completados y el 4 iluminado

#### Scenario: Repetir un nivel completado
- **GIVEN** el mundo manzana tiene 5 niveles completados
- **WHEN** la niña juega el nodo 2 y acierta
- **THEN** el mundo manzana sigue con 5 niveles completados

### Requirement: Completar un mundo
Al completar el nivel 10 de un mundo, el sistema SHALL mostrar una celebración especial de mundo y reproducir "¡Completaste el mundo!". Si se entró desde "Mundos", al terminar SHALL volver al selector, donde el mundo aparece completado. (CA6)

#### Scenario: Completar el mundo manzana desde "Mundos"
- **GIVEN** el mundo manzana tiene 9 niveles completados y se abrió desde "Mundos"
- **WHEN** la niña acierta el nivel 10
- **THEN** se muestra la celebración de mundo y suena "¡Completaste el mundo!"
- **AND** después se muestra el selector con la manzana completada

### Requirement: Aventura lineal
El botón "Aventura" SHALL abrir un camino con los 4 mundos en orden. Un mundo está desbloqueado si es el primero o si todos los anteriores están completos. Los demás SHALL mostrarse bloqueados y MUST NOT poder abrirse. Al completar un mundo en la aventura, el sistema SHALL volver al camino, mostrar el desbloqueo del siguiente y, tras una pausa de 2 a 4 segundos, abrir su mapa de niveles automáticamente. (CA7)

#### Scenario: Primera vez en la aventura
- **GIVEN** no hay progreso guardado
- **WHEN** la niña toca "Aventura"
- **THEN** la manzana está abierta e iluminada y el plátano, la fresa y la naranja aparecen bloqueados

#### Scenario: Tocar un mundo bloqueado
- **GIVEN** la aventura con solo la manzana abierta
- **WHEN** la niña toca el mundo naranja
- **THEN** no se abre ningún mundo y no se muestra ningún error

#### Scenario: Pasar al siguiente mundo
- **GIVEN** en la aventura, el mundo manzana tiene 9 niveles completados
- **WHEN** la niña acierta el nivel 10
- **THEN** tras la celebración de mundo se muestra el camino con el plátano desbloqueado
- **AND** en 4 segundos como máximo se abre el mapa de niveles del plátano

#### Scenario: Progreso hecho en "Mundos"
- **GIVEN** desde "Mundos" se completaron manzana y plátano
- **WHEN** la niña toca "Aventura"
- **THEN** manzana, plátano y fresa están abiertos, con la fresa iluminada, y la naranja bloqueada

### Requirement: Aventura completada
Al completar el mundo naranja con los 3 anteriores completos y habiendo entrado desde "Aventura", el sistema SHALL reproducir "¡Completaste la aventura!", mostrar una celebración y volver al camino de la aventura con los 4 mundos completados. Todos SHALL seguir pudiéndose abrir para repetir niveles. (CA8)

#### Scenario: Terminar la aventura
- **GIVEN** en la aventura, manzana, plátano y fresa completos y la naranja con 9 niveles
- **WHEN** la niña acierta el nivel 10 de la naranja
- **THEN** suena "¡Completaste la aventura!" y se muestra una celebración
- **AND** después se muestra el camino con los 4 mundos completados

### Requirement: Progreso persistente
El sistema SHALL guardar en el almacenamiento local del dispositivo cuántos niveles hay completados en cada mundo, cada vez que cambian, y SHALL recuperarlos al abrir la app. Si el almacenamiento no está disponible, falla al escribir o contiene datos inválidos, la app MUST seguir funcionando sin progreso previo y MUST NOT mostrar errores. (CA9)

#### Scenario: Recuperar el progreso al volver
- **GIVEN** el mundo plátano tiene 6 niveles completados
- **WHEN** se cierra y se vuelve a abrir la app y se toca "Mundos"
- **THEN** el plátano indica 6 de 10

#### Scenario: Datos guardados inválidos
- **GIVEN** el almacenamiento contiene un valor de progreso corrupto
- **WHEN** se abre la app y se toca "Mundos"
- **THEN** todos los mundos indican 0 de 10 y no se muestra ningún error

### Requirement: Reiniciar el progreso
El selector "Mundos" y el camino de la "Aventura" SHALL incluir, junto a los controles de adulto, un botón discreto "reiniciar progreso" que pide una confirmación explícita con texto. Al confirmar, todos los mundos SHALL quedar a 0 niveles completados, también en el almacenamiento. Al cancelar, MUST NOT cambiar nada. (CA10)

#### Scenario: Reiniciar con confirmación
- **GIVEN** hay mundos con niveles completados
- **WHEN** el adulto toca "reiniciar progreso" y confirma
- **THEN** todos los mundos indican 0 de 10, también tras recargar la app

#### Scenario: Cancelar el reinicio
- **GIVEN** el mundo manzana tiene 5 niveles completados
- **WHEN** el adulto toca "reiniciar progreso" y cancela
- **THEN** la manzana sigue con 5 niveles completados

### Requirement: Navegación y voz en los mundos
Los controles de adulto SHALL estar en el selector, la aventura, el mapa de niveles y los retos de un mundo, con "inicio" y "silenciar voz" (sin selector de fruta). "Inicio" SHALL detener el audio y volver a la pantalla inicial. La voz silenciada SHALL respetarse en todas estas pantallas, también en las celebraciones de mundo y de aventura. (CA11)

#### Scenario: Volver al inicio desde el mapa
- **GIVEN** la niña está en el mapa de niveles del mundo fresa
- **WHEN** el adulto toca "inicio"
- **THEN** se muestra la pantalla inicial con "Jugar libre", "Mundos" y "Aventura"

#### Scenario: Completar un mundo con la voz silenciada
- **GIVEN** la voz está desactivada y el mundo manzana tiene 9 niveles completados
- **WHEN** la niña acierta el nivel 10
- **THEN** se muestra la celebración de mundo sin que suene ningún audio

### Requirement: Mundos sin conexión
Los audios nuevos (`worldDone`, `adventureDone`) y las decoraciones de los mundos SHALL formar parte del precache del service worker, para que los mundos, la aventura y el progreso guardado MUST funcionar sin conexión tras la primera carga. (CA12)

#### Scenario: Aventura en modo avión
- **GIVEN** la app instalada se cargó al menos una vez con conexión y hay progreso guardado
- **WHEN** el iPad está en modo avión y la niña toca "Aventura"
- **THEN** se muestra el camino con el progreso guardado y se puede jugar un nivel con sus audios
