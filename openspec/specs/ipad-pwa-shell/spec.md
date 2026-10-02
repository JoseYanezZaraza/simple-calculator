# ipad-pwa-shell Specification

## Purpose
TBD - created by archiving change add-free-play-ten-frame. Update Purpose after archive.
## Requirements
### Requirement: Instalable como PWA en iPad
La app SHALL incluir un manifiesto web y los iconos necesarios para instalarse desde "Añadir a pantalla de inicio" en Safari para iPadOS, y MUST abrirse a pantalla completa sin la interfaz del navegador.

#### Scenario: Abrir la app instalada
- **GIVEN** la app se ha añadido a la pantalla de inicio del iPad
- **WHEN** se abre desde su icono
- **THEN** se muestra a pantalla completa, sin barra de direcciones

### Requirement: Funcionamiento sin conexión
Un service worker SHALL precachear todos los recursos de la app (HTML, JS, CSS, imágenes de frutas y audios) en la primera carga, y la app MUST funcionar por completo sin conexión a partir de entonces. (CA9)

#### Scenario: Jugar en modo avión
- **GIVEN** la app se ha cargado al menos una vez con conexión y está instalada
- **WHEN** el iPad está en modo avión y se abre la app
- **THEN** la pantalla inicial carga
- **AND** se pueden añadir y quitar frutas con sus imágenes y audios

### Requirement: Supresión de gestos accidentales
La app SHALL desactivar en Safari para iPadOS el zoom por doble toque, el zoom por pellizco, el menú contextual por pulsación larga, la selección de texto y el rebote o desplazamiento de la página. (CA10)

#### Scenario: Doble toque rápido sobre ➕
- **GIVEN** la escena de juego está abierta en un iPad
- **WHEN** la niña hace doble toque rápido sobre ➕
- **THEN** la página no hace zoom
- **AND** la cantidad aumenta en 2

#### Scenario: Pulsación larga sobre una fruta
- **GIVEN** el marco tiene al menos 1 fruta
- **WHEN** la niña mantiene pulsada una fruta durante 1 segundo
- **THEN** no aparece el menú contextual ni la previsualización de imagen
- **AND** no se selecciona texto

### Requirement: Objetivos táctiles para motricidad infantil
Los botones ➕ y ➖ SHALL medir al menos 120×120 px CSS en un iPad en cualquier orientación, y los controles de adulto MUST estar agrupados en una esquina, sin tamaño ni posición que inviten al toque infantil.

#### Scenario: Tamaño de los botones en vertical
- **GIVEN** la escena de juego se muestra en un iPad en orientación vertical
- **WHEN** se miden los botones ➕ y ➖
- **THEN** cada uno mide al menos 120×120 px CSS

