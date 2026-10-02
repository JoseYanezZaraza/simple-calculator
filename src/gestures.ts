/**
 * Bloquea los gestos de Safari para iPadOS que una niña puede disparar sin querer.
 * Complementa el CSS global (touch-action, user-select, touch-callout, overscroll).
 */
export function installGestureGuards(target: Document = document): void {
  const prevent = (e: Event) => e.preventDefault()
  // Pellizco: Safari ignora user-scalable=no desde iOS 10.
  target.addEventListener('gesturestart', prevent)
  target.addEventListener('gesturechange', prevent)
  // Menú contextual por pulsación larga.
  target.addEventListener('contextmenu', prevent)
  // Zoom por doble toque en zonas sin touch-action (refuerzo).
  target.addEventListener('dblclick', prevent)
  // Pellizco con dos dedos y arrastres que desplazan la página (la app nunca hace scroll).
  target.addEventListener(
    'touchmove',
    (e) => {
      if (e.cancelable) e.preventDefault()
    },
    { passive: false },
  )
}
