export const MIN_COUNT = 0
export const MAX_COUNT = 10
export const ROW_SIZE = 5

export type FrameEvent =
  | { type: 'changed'; count: number }
  | { type: 'reachedFull'; count: typeof MAX_COUNT }
  | { type: 'blockedFull'; count: typeof MAX_COUNT }
  | { type: 'blockedEmpty'; count: typeof MIN_COUNT }

export interface FrameResult {
  count: number
  event: FrameEvent
}

function assertValid(count: number): void {
  if (!Number.isInteger(count) || count < MIN_COUNT || count > MAX_COUNT) {
    throw new RangeError(`count must be an integer in [${MIN_COUNT}, ${MAX_COUNT}], got ${count}`)
  }
}

/** Llega una fruta. En 10 no cambia nada y avisa de que está lleno. */
export function add(count: number): FrameResult {
  assertValid(count)
  if (count === MAX_COUNT) return { count, event: { type: 'blockedFull', count: MAX_COUNT } }
  const next = count + 1
  if (next === MAX_COUNT) return { count: next, event: { type: 'reachedFull', count: MAX_COUNT } }
  return { count: next, event: { type: 'changed', count: next } }
}

/** Se va una fruta. En 0 no cambia nada y avisa de que está vacío. */
export function remove(count: number): FrameResult {
  assertValid(count)
  if (count === MIN_COUNT) return { count, event: { type: 'blockedEmpty', count: MIN_COUNT } }
  const next = count - 1
  return { count: next, event: { type: 'changed', count: next } }
}

/**
 * Ocupación de los 10 huecos con `count` frutas: siempre los huecos 1..count,
 * fila superior de izquierda a derecha y después la inferior.
 */
export function filledSlots(count: number): boolean[] {
  assertValid(count)
  return Array.from({ length: MAX_COUNT }, (_, i) => i < count)
}

/** Fila y columna (base 0) del hueco con índice base 0. */
export function slotPosition(index: number): { row: number; col: number } {
  return { row: Math.floor(index / ROW_SIZE), col: index % ROW_SIZE }
}
