/**
 * Registros solo para el build de e2e (`vite build --mode e2e`). Permiten verificar efectos
 * breves, como la celebración (1,8 s), sin depender de verlos a tiempo en un runner lento.
 * En producción la condición es constante y el código se elimina.
 */
export type CelebrationKind = 'level' | 'world' | 'adventure'

export function recordCelebration(kind: CelebrationKind = 'level'): void {
  if (import.meta.env.MODE !== 'e2e') return
  const w = window as unknown as { __celebrationLog?: { kind: CelebrationKind; at: number }[] }
  ;(w.__celebrationLog ??= []).push({ kind, at: Date.now() })
}

/** Índice (base 0) de cada fruta resaltada al contar, en orden. */
export function recordHighlight(index: number): void {
  if (import.meta.env.MODE !== 'e2e') return
  const w = window as unknown as { __highlightLog?: number[] }
  ;(w.__highlightLog ??= []).push(index)
}

/** Cada opción de respuesta resaltada mientras suena su número. */
export function recordOptionHighlight(option: number): void {
  if (import.meta.env.MODE !== 'e2e') return
  const w = window as unknown as { __optionHighlightLog?: number[] }
  ;(w.__optionHighlightLog ??= []).push(option)
}
