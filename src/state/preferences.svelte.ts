import type { AudioPort } from '../audio/audioService'

export const FRUITS = ['apple', 'banana', 'strawberry', 'orange'] as const
export type Fruit = (typeof FRUITS)[number]

/** Ajustes del adulto, compartidos entre modos y conservados al volver al inicio. */
export class Preferences {
  fruit = $state<Fruit>('apple')
  voiceOn = $state(true)

  constructor(private readonly audio: AudioPort) {}

  setVoice(on: boolean): void {
    this.voiceOn = on
    this.audio.setMuted(!on)
  }

  setFruit(fruit: Fruit): void {
    this.fruit = fruit
  }
}
