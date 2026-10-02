import type { Fruit } from '../../state/session.svelte'
import apple from './apple.svg'
import banana from './banana.svg'
import orange from './orange.svg'
import strawberry from './strawberry.svg'

export const FRUIT_IMAGES: Record<Fruit, string> = { apple, banana, strawberry, orange }

export const FRUIT_LABELS: Record<Fruit, string> = {
  apple: 'manzana',
  banana: 'plátano',
  strawberry: 'fresa',
  orange: 'naranja',
}
