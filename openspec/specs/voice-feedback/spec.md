# voice-feedback Specification

## Purpose
Voz que acompaña el juego: desbloqueo de audio en iOS, locución del número en cada cambio, conteo en voz alta, frases amables en los límites, silencio controlado por el adulto y audios sustituibles por grabaciones propias.
## Requirements
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

### Requirement: Locución del número al cambiar la cantidad
Cada vez que la cantidad cambie a N por ➕ o ➖, el sistema SHALL reproducir el audio del número N. Si se produce otro cambio antes de que termine, el audio en curso MUST detenerse y sonar solo el más reciente. (CA1, CA2)

#### Scenario: Locución al añadir
- **GIVEN** el marco tiene 2 frutas y la voz está activada
- **WHEN** la niña toca ➕
- **THEN** suena el audio "tres"

#### Scenario: Locución al quitar
- **GIVEN** el marco tiene 5 frutas y la voz está activada
- **WHEN** la niña toca ➖
- **THEN** suena el audio "cuatro"

#### Scenario: Toques rápidos consecutivos
- **GIVEN** el marco tiene 1 fruta y la voz está activada
- **WHEN** la niña toca ➕ tres veces seguidas rápidamente
- **THEN** el último audio en sonar es "cuatro"
- **AND** no se oyen audios superpuestos

### Requirement: Frases amables en los límites
Al llegar a 10 el sistema SHALL reproducir una frase de celebración, y al tocar ➖ con 0 frutas SHALL reproducir una frase amable (p. ej. "no quedan frutas"). (CA3, CA4)

#### Scenario: Frase al llenar el marco
- **GIVEN** el marco tiene 9 frutas y la voz está activada
- **WHEN** la niña toca ➕
- **THEN** suena "diez" seguido de la frase de celebración

#### Scenario: Frase al tocar ➖ con el marco vacío
- **GIVEN** el marco tiene 0 frutas y la voz está activada
- **WHEN** la niña toca ➖
- **THEN** suena la frase amable de "no quedan frutas"

### Requirement: Conteo en voz alta al tocar una fruta
Al tocar cualquier fruta del marco con cantidad N, el sistema SHALL contar en voz alta de 1 a N en orden, resaltando cada fruta mientras se nombra su número. Un nuevo toque de fruta o un cambio de cantidad MUST cancelar el conteo en curso. (CA6)

#### Scenario: Contar cuatro frutas
- **GIVEN** el marco tiene 4 frutas y la voz está activada
- **WHEN** la niña toca la fruta del hueco 2
- **THEN** suenan en orden "uno", "dos", "tres", "cuatro"
- **AND** cada fruta se resalta mientras se nombra su número

### Requirement: Silenciar la voz
Un control de adulto discreto SHALL activar y desactivar la voz. Con la voz desactivada, el sistema MUST NOT reproducir ningún audio, y el resto del comportamiento (cantidad, número escrito, animaciones, celebración, resaltado del conteo) MUST mantenerse igual. (CA7)

#### Scenario: Jugar con la voz silenciada
- **GIVEN** la voz está desactivada y el marco tiene 9 frutas
- **WHEN** la niña toca ➕ y después toca una fruta
- **THEN** el marco muestra 10 frutas, el número "10" y la celebración
- **AND** no se reproduce ningún audio

### Requirement: Audios sustituibles
Los audios SHALL cargarse desde un catálogo de archivos con nombres estables (números 0–10 y frases), de modo que sustituir los provisionales por grabaciones propias MUST NOT requerir cambios de código.

#### Scenario: Sustituir un audio provisional
- **GIVEN** el catálogo contiene el audio provisional del número "tres"
- **WHEN** se reemplaza ese archivo por una grabación con el mismo nombre y se reconstruye la app
- **THEN** al llegar a 3 frutas suena la nueva grabación

