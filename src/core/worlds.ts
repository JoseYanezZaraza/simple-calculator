/** Mundos en orden fijo, con el máximo de sus retos (dificultad creciente). */
export const WORLDS = [
  { id: 'apple', max: 3 },
  { id: 'banana', max: 5 },
  { id: 'strawberry', max: 7 },
  { id: 'orange', max: 10 },
] as const

export type WorldId = (typeof WORLDS)[number]['id']
export const WORLD_IDS: WorldId[] = WORLDS.map((w) => w.id)
export const LEVELS_PER_WORLD = 10

/** Niveles completados por mundo (0..10). Se juegan en orden, así que basta un contador. */
export type Progress = Record<WorldId, number>

/** Estado de un nodo del mapa de niveles. */
export type NodeState = 'done' | 'next' | 'locked'

export function emptyProgress(): Progress {
  return { apple: 0, banana: 0, strawberry: 0, orange: 0 }
}

export function worldMax(world: WorldId): number {
  return WORLDS.find((w) => w.id === world)!.max
}

export function worldIndex(world: WorldId): number {
  return WORLD_IDS.indexOf(world)
}

export function nextWorld(world: WorldId): WorldId | null {
  return WORLD_IDS[worldIndex(world) + 1] ?? null
}

export function isWorldComplete(progress: Progress, world: WorldId): boolean {
  return progress[world] >= LEVELS_PER_WORLD
}

/** `level` en base 1. */
export function nodeState(progress: Progress, world: WorldId, level: number): NodeState {
  const done = progress[world]
  if (level <= done) return 'done'
  if (level === done + 1) return 'next'
  return 'locked'
}

export function isLevelPlayable(progress: Progress, world: WorldId, level: number): boolean {
  return level >= 1 && level <= LEVELS_PER_WORLD && nodeState(progress, world, level) !== 'locked'
}

/** En la aventura: el primer mundo, o cualquiera cuyos anteriores estén todos completos. */
export function isWorldUnlocked(progress: Progress, world: WorldId): boolean {
  return WORLD_IDS.slice(0, worldIndex(world)).every((w) => isWorldComplete(progress, w))
}

export function isAdventureComplete(progress: Progress): boolean {
  return WORLD_IDS.every((w) => isWorldComplete(progress, w))
}

/** Completa `level`: solo avanza si es el siguiente; repetir uno completado no cambia nada. */
export function completeLevel(progress: Progress, world: WorldId, level: number): Progress {
  if (nodeState(progress, world, level) !== 'next') return progress
  return { ...progress, [world]: progress[world] + 1 }
}

/** Valida datos leídos del almacenamiento; ante cualquier anomalía devuelve progreso vacío. */
export function parseProgress(value: unknown): Progress {
  const progress = emptyProgress()
  if (typeof value !== 'object' || value === null) return progress
  const worlds = (value as { worlds?: unknown }).worlds
  if (typeof worlds !== 'object' || worlds === null) return progress
  for (const id of WORLD_IDS) {
    const n = (worlds as Record<string, unknown>)[id]
    if (n === undefined) continue
    if (!Number.isInteger(n) || (n as number) < 0 || (n as number) > LEVELS_PER_WORLD) {
      return emptyProgress()
    }
    progress[id] = n as number
  }
  return progress
}
