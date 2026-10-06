/**
 * Registros solo para el build de e2e (`vite build --mode e2e`). Permiten verificar efectos
 * breves, como la celebración (1,8 s), sin depender de verlos a tiempo en un runner lento.
 * En producción la condición es constante y el código se elimina.
 */
export function recordCelebration(): void {
  if (import.meta.env.MODE !== 'e2e') return
  const w = window as unknown as { __celebrationLog?: number[] }
  ;(w.__celebrationLog ??= []).push(Date.now())
}

/** Índice (base 0) de cada fruta resaltada al contar, en orden. */
export function recordHighlight(index: number): void {
  if (import.meta.env.MODE !== 'e2e') return
  const w = window as unknown as { __highlightLog?: number[] }
  ;(w.__highlightLog ??= []).push(index)
}
