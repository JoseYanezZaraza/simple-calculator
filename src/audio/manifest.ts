import { MAX_COUNT } from '../core/tenFrame'

/**
 * Catálogo de audios con nombres estables. Para usar grabaciones propias basta con
 * reemplazar los archivos de public/audio/es/ manteniendo estos nombres.
 */
export type NumberClip = `${number}`
export type PhraseClip =
  | 'full'
  | 'empty'
  | 'howMany'
  | 'put'
  | 'wellDone'
  | 'letsCount'
  | 'worldDone'
  | 'adventureDone'
  | 'chooseAvatar'
export type ClipId = NumberClip | PhraseClip

export const NUMBER_CLIPS: NumberClip[] = Array.from(
  { length: MAX_COUNT + 1 },
  (_, n) => `${n}` as NumberClip,
)
export const PHRASE_CLIPS: PhraseClip[] = [
  'full',
  'empty',
  'howMany',
  'put',
  'wellDone',
  'letsCount',
  'worldDone',
  'adventureDone',
  'chooseAvatar',
]
export const ALL_CLIPS: ClipId[] = [...NUMBER_CLIPS, ...PHRASE_CLIPS]

export function numberClip(n: number): NumberClip {
  return `${n}` as NumberClip
}

export function clipUrl(clip: ClipId, base: string = import.meta.env.BASE_URL): string {
  return `${base}audio/es/${clip}.m4a`
}
