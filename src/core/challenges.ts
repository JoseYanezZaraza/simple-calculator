import { randomInt, shuffle, type Random } from './random'
import { MAX_COUNT } from './tenFrame'

export const MIN_TARGET = 1
export const MAX_TARGET = MAX_COUNT
/** Distancia máxima entre una opción incorrecta y la respuesta. */
export const DISTRACTOR_SPREAD = 3
export const OPTION_COUNT = 3

export type Challenge =
  { kind: 'howMany'; target: number; options: number[] } | { kind: 'put'; target: number }

export type ChallengeKind = Challenge['kind']

export function sameChallenge(a: Challenge | null, b: Challenge): boolean {
  return a !== null && a.kind === b.kind && a.target === b.target
}

/** Dos opciones incorrectas distintas a ±DISTRACTOR_SPREAD de `target`, barajadas con ella. */
export function howManyOptions(target: number, random: Random): number[] {
  const candidates: number[] = []
  for (let n = target - DISTRACTOR_SPREAD; n <= target + DISTRACTOR_SPREAD; n++) {
    if (n !== target && n >= MIN_TARGET && n <= MAX_TARGET) candidates.push(n)
  }
  const distractors = shuffle(candidates, random).slice(0, OPTION_COUNT - 1)
  return shuffle([target, ...distractors], random)
}

/** Reto nuevo al azar (tipo 50 %, objetivo 1..10), nunca igual al anterior. */
export function nextChallenge(previous: Challenge | null, random: Random): Challenge {
  for (;;) {
    const kind: ChallengeKind = random() < 0.5 ? 'howMany' : 'put'
    const target = randomInt(random, MIN_TARGET, MAX_TARGET)
    const challenge: Challenge =
      kind === 'howMany'
        ? { kind, target, options: howManyOptions(target, random) }
        : { kind, target }
    if (!sameChallenge(previous, challenge)) return challenge
  }
}

/** `answer` es la opción tocada ("¿Cuántas hay?") o la cantidad al pulsar ✓ ("Pon N"). */
export function isCorrect(challenge: Challenge, answer: number): boolean {
  return answer === challenge.target
}
