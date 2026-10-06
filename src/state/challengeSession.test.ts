import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { seededRandom } from '../core/random'
import { FakeAudio } from '../test/fakeAudio'
import { ChallengeSession, SUCCESS_PAUSE_MS } from './challengeSession.svelte'
import { STEP_MS } from './narrator.svelte'
import { Preferences } from './preferences.svelte'

let audio: FakeAudio
let game: ChallengeSession

beforeEach(() => {
  vi.useFakeTimers()
  audio = new FakeAudio()
  game = new ChallengeSession(audio, new Preferences(audio), seededRandom(1))
})

afterEach(() => {
  vi.useRealTimers()
})

function howMany(target: number, options: number[]) {
  game.set({ kind: 'howMany', target, options })
  audio.played = []
}

function put(target: number) {
  game.set({ kind: 'put', target })
  audio.played = []
}

describe('¿Cuántas hay?', () => {
  it('muestra N frutas y hace la pregunta (CA2)', () => {
    game.set({ kind: 'howMany', target: 7, options: [5, 7, 9] })
    expect(game.frame.count).toBe(7)
    expect(audio.played).toEqual([['howMany']])
  })

  it('al acertar celebra, dice "¡Muy bien!" y pasa a otro reto (CA3)', () => {
    howMany(3, [2, 3, 5])
    game.choose(3)
    expect(game.phase).toBe('celebrating')
    expect(game.celebration).toBe(1)
    expect(audio.played).toEqual([['wellDone']])
    vi.advanceTimersByTime(SUCCESS_PAUSE_MS)
    expect(game.phase).toBe('asking')
    expect(game.challenge).not.toEqual({ kind: 'howMany', target: 3, options: [2, 3, 5] })
  })

  it('al fallar cuenta juntos y repite la pregunta en el mismo reto (CA4)', () => {
    howMany(6, [4, 6, 8])
    game.choose(8)
    expect(game.phase).toBe('asking')
    expect(game.highlighted).toBeNull()
    vi.advanceTimersByTime(STEP_MS)
    expect(game.highlighted).toBe(0)
    vi.advanceTimersByTime(STEP_MS * 10)
    expect(audio.played).toEqual([
      ['letsCount'],
      ['1'],
      ['2'],
      ['3'],
      ['4'],
      ['5'],
      ['6'],
      ['howMany'],
    ])
    expect(game.challenge).toEqual({ kind: 'howMany', target: 6, options: [4, 6, 8] })
    expect(game.frame.count).toBe(6)
    expect(game.celebration).toBe(0)
  })

  it('ignora ➕/➖ y ✓ en este tipo de reto', () => {
    howMany(4, [3, 4, 5])
    game.add()
    game.remove()
    game.confirm()
    expect(game.frame.count).toBe(4)
    expect(audio.played).toEqual([])
  })

  it('tocar una fruta cuenta de 1 a N', () => {
    howMany(2, [1, 2, 3])
    game.tapFruit()
    vi.advanceTimersByTime(STEP_MS * 3)
    expect(audio.played).toEqual([['1'], ['2']])
  })
})

describe('Pon N frutas', () => {
  it('empieza vacío y pide "Pon N" (CA5)', () => {
    game.set({ kind: 'put', target: 4 })
    expect(game.frame.count).toBe(0)
    expect(audio.played).toEqual([['put', '4']])
  })

  it('➕/➖ funcionan como en el juego libre y en 10 no hay celebración (CA5)', () => {
    put(6)
    for (let i = 0; i < 10; i++) game.add()
    expect(game.frame.count).toBe(10)
    expect(audio.played.at(-1)).toEqual(['10'])
    expect(game.frame.celebration).toBe(0)
    expect(game.celebration).toBe(0)
  })

  it('✓ con N frutas es acierto (CA6)', () => {
    put(5)
    for (let i = 0; i < 5; i++) game.add()
    audio.played = []
    game.confirm()
    expect(game.celebration).toBe(1)
    expect(audio.played).toEqual([['wellDone']])
  })

  it('✓ con otra cantidad cuenta, repite "Pon N" y no vacía el marco (CA6)', () => {
    put(4)
    for (let i = 0; i < 6; i++) game.add()
    audio.played = []
    game.confirm()
    vi.advanceTimersByTime(STEP_MS * 10)
    expect(audio.played).toEqual([
      ['letsCount'],
      ['1'],
      ['2'],
      ['3'],
      ['4'],
      ['5'],
      ['6'],
      ['put', '4'],
    ])
    expect(game.frame.count).toBe(6)
    game.remove()
    expect(game.frame.count).toBe(5)
  })

  it('✓ con el marco vacío dice "¡Vamos a contarlas!" y repite sin conteo', () => {
    put(2)
    game.confirm()
    vi.advanceTimersByTime(STEP_MS * 3)
    expect(audio.played).toEqual([['letsCount'], ['put', '2']])
  })

  it('tocar ➕ durante el reintento cancela la narración', () => {
    put(3)
    game.add()
    game.confirm()
    game.add()
    vi.advanceTimersByTime(STEP_MS * 5)
    expect(audio.played).toEqual([['1'], ['letsCount'], ['2']])
  })
})

describe('transición y controles', () => {
  it('ignora respuestas durante la celebración (CA3)', () => {
    howMany(3, [2, 3, 5])
    game.choose(3)
    game.choose(2)
    game.choose(3)
    expect(game.celebration).toBe(1)
    expect(audio.played).toEqual([['wellDone']])
  })

  it('repetir vuelve a decir la pregunta actual (CA8)', () => {
    put(9)
    game.ask()
    expect(audio.played).toEqual([['put', '9']])
  })

  it('nunca repite el reto anterior al avanzar (CA7)', () => {
    let previous = game.challenge
    for (let i = 0; i < 200; i++) {
      game.next()
      expect(
        game.challenge.kind === previous.kind && game.challenge.target === previous.target,
      ).toBe(false)
      previous = game.challenge
    }
  })

  it('stop detiene el paso al siguiente reto y el audio (CA9)', () => {
    howMany(3, [2, 3, 5])
    game.choose(3)
    game.stop()
    vi.advanceTimersByTime(SUCCESS_PAUSE_MS * 2)
    expect(game.phase).toBe('celebrating')
    expect(audio.stops).toBe(1)
  })

  it('con la voz silenciada funciona igual sin audio (CA10)', () => {
    game.preferences.setVoice(false)
    howMany(3, [2, 3, 4])
    game.choose(2)
    vi.advanceTimersByTime(STEP_MS)
    expect(game.highlighted).toBe(0)
    vi.advanceTimersByTime(STEP_MS * 10)
    game.choose(3)
    expect(game.celebration).toBe(1)
    vi.advanceTimersByTime(SUCCESS_PAUSE_MS)
    expect(game.phase).toBe('asking')
    expect(audio.played).toEqual([])
  })

  it('usa la fruta elegida por el adulto (CA10)', () => {
    const prefs = new Preferences(audio)
    prefs.setFruit('strawberry')
    const g = new ChallengeSession(audio, prefs, seededRandom(2))
    expect(g.frame.fruit).toBe('strawberry')
  })
})

describe('escuchar el número de una opción', () => {
  it('dice el número de la opción y la resalta mientras suena (CA2)', () => {
    howMany(6, [4, 6, 8])
    game.sayOption(8)
    expect(audio.played).toEqual([['8']])
    expect(game.spokenOption).toBe(8)
    vi.advanceTimersByTime(STEP_MS)
    expect(game.spokenOption).toBeNull()
  })

  it('no cuenta como respuesta: el reto sigue y se puede acertar después (CA3)', () => {
    howMany(6, [4, 6, 8])
    game.sayOption(8)
    game.sayOption(6)
    vi.advanceTimersByTime(STEP_MS * 5)
    expect(game.celebration).toBe(0)
    expect(game.phase).toBe('asking')
    expect(audio.played).toEqual([['8'], ['6']])
    expect(game.challenge).toEqual({ kind: 'howMany', target: 6, options: [4, 6, 8] })
    game.choose(6)
    expect(game.celebration).toBe(1)
  })

  it('cancela el conteo de "contar juntos" en curso (CA2)', () => {
    howMany(6, [4, 6, 8])
    game.choose(8)
    vi.advanceTimersByTime(STEP_MS + STEP_MS / 2) // ya sonó "uno"
    game.sayOption(4)
    vi.advanceTimersByTime(STEP_MS * 10)
    expect(audio.played).toEqual([['letsCount'], ['1'], ['4']])
    expect(game.highlighted).toBeNull()
  })

  it('con la voz silenciada resalta igual sin sonar (CA4)', () => {
    game.preferences.setVoice(false)
    howMany(3, [2, 3, 4])
    game.sayOption(3)
    expect(game.spokenOption).toBe(3)
    vi.advanceTimersByTime(STEP_MS - 1)
    expect(game.spokenOption).toBe(3)
    vi.advanceTimersByTime(1)
    expect(game.spokenOption).toBeNull()
    expect(audio.played).toEqual([])
  })

  it('durante la celebración no tiene efecto (CA5)', () => {
    howMany(3, [2, 3, 5])
    game.choose(3)
    game.sayOption(5)
    expect(audio.played).toEqual([['wellDone']])
    expect(game.spokenOption).toBeNull()
  })

  it('no hace nada en "Pon N frutas"', () => {
    put(4)
    game.sayOption(4)
    expect(audio.played).toEqual([])
  })
})
