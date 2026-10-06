import type { Fruit } from '../../state/preferences.svelte'
import apple from './apple.svg'
import banana from './banana.svg'
import orange from './orange.svg'
import strawberry from './strawberry.svg'

/** Personajes cartoon del avatar (fruta con cara y patitas). */
export const AVATAR_IMAGES: Record<Fruit, string> = { apple, banana, strawberry, orange }
