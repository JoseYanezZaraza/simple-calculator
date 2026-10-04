import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FakeAudio } from '../test/fakeAudio'
import { COUNT_STEP_MS, Session } from './session.svelte'

let audio: FakeAudio
let session: Session

function withCount(n: number) {
  for (let i = 0; i < n; i++) session.add()
  audio.played = []
}

beforeEach(() => {
  audio = new FakeAudio()
  session = new Session(audio)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Session', () => {
  it('empieza con 0 frutas, manzanas y voz activada', () => {
    expect(session.count).toBe(0)
    expect(session.fruit).toBe('apple')
    expect(session.voiceOn).toBe(true)
    expect(session.canRemove).toBe(false)
  })

  it('añadir sube la cantidad y dice el número (CA1)', () => {
    withCount(2)
    session.add()
    expect(session.count).toBe(3)
    expect(audio.played).toEqual([['3']])
  })

  it('quitar baja la cantidad y dice el número (CA2)', () => {
    withCount(5)
    session.remove()
    expect(session.count).toBe(4)
    expect(audio.played).toEqual([['4']])
  })

  it('al llegar a 10 celebra y dice "diez" y la frase de lleno (CA3)', () => {
    withCount(9)
    session.add()
    expect(session.count).toBe(10)
    expect(session.celebration).toBe(1)
    expect(session.canAdd).toBe(false)
    expect(audio.played).toEqual([['10', 'full']])
  })

  it('celebra cada vez que vuelve a llegar a 10 (CA3)', () => {
    withCount(10)
    session.remove()
    session.add()
    expect(session.celebration).toBe(2)
  })

  it('con el marco lleno ➕ no cambia nada ni suena', () => {
    withCount(10)
    session.add()
    expect(session.count).toBe(10)
    expect(session.celebration).toBe(1)
    expect(audio.played).toEqual([])
  })

  it('con el marco vacío ➖ no cambia la cantidad y suena la frase amable (CA4)', () => {
    session.remove()
    expect(session.count).toBe(0)
    expect(audio.played).toEqual([['empty']])
  })

  it('cuenta de 1 a N resaltando cada fruta (CA6)', () => {
    vi.useFakeTimers()
    withCount(4)
    session.countAloud()
    expect(session.highlighted).toBe(0)
    vi.advanceTimersByTime(COUNT_STEP_MS)
    expect(session.highlighted).toBe(1)
    vi.advanceTimersByTime(COUNT_STEP_MS * 3)
    expect(session.highlighted).toBeNull()
    expect(audio.played).toEqual([['1'], ['2'], ['3'], ['4']])
  })

  it('espera más entre números si la grabación es larga', () => {
    vi.useFakeTimers()
    audio.durations['1'] = 1.2
    withCount(2)
    session.countAloud()
    vi.advanceTimersByTime(COUNT_STEP_MS)
    expect(session.highlighted).toBe(0)
    vi.advanceTimersByTime(1350 - COUNT_STEP_MS)
    expect(session.highlighted).toBe(1)
  })

  it('un cambio de cantidad cancela el conteo en curso', () => {
    vi.useFakeTimers()
    withCount(5)
    session.countAloud()
    session.add()
    expect(session.highlighted).toBeNull()
    vi.advanceTimersByTime(COUNT_STEP_MS * 10)
    expect(audio.played).toEqual([['1'], ['6']])
  })

  it('un nuevo toque de fruta reinicia el conteo', () => {
    vi.useFakeTimers()
    withCount(3)
    session.countAloud()
    vi.advanceTimersByTime(COUNT_STEP_MS)
    session.countAloud()
    expect(session.highlighted).toBe(0)
  })

  it('con la voz silenciada no suena nada pero todo lo demás sigue igual (CA7)', () => {
    vi.useFakeTimers()
    session.setVoice(false)
    withCount(9)
    session.add()
    session.countAloud()
    expect(session.count).toBe(10)
    expect(session.celebration).toBe(1)
    expect(session.highlighted).toBe(0)
    vi.advanceTimersByTime(COUNT_STEP_MS * 10)
    expect(audio.played).toEqual([])
  })

  it('cambiar de fruta no altera la cantidad (CA8)', () => {
    withCount(4)
    session.setFruit('banana')
    expect(session.fruit).toBe('banana')
    expect(session.count).toBe(4)
  })
})
