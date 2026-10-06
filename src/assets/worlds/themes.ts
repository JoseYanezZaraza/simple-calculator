import type { WorldId } from '../../core/worlds'
import apple from './apple-orchard.svg'
import banana from './banana-jungle.svg'
import orange from './orange-grove.svg'
import strawberry from './strawberry-garden.svg'

export interface WorldTheme {
  /** Nombre para el adulto y para las etiquetas accesibles. */
  name: string
  bg: string
  accent: string
  accentDark: string
  /** Color del camino del mapa. */
  path: string
  decoration: string
}

export const WORLD_THEMES: Record<WorldId, WorldTheme> = {
  apple: {
    name: 'Mundo manzana',
    bg: '#fdecea',
    accent: '#e8413a',
    accentDark: '#b52c26',
    path: '#f4b4ad',
    decoration: apple,
  },
  banana: {
    name: 'Mundo plátano',
    bg: '#fff7d1',
    accent: '#e0a800',
    accentDark: '#a87d00',
    path: '#f5dc85',
    decoration: banana,
  },
  strawberry: {
    name: 'Mundo fresa',
    bg: '#ffe6ef',
    accent: '#e0435e',
    accentDark: '#a92a41',
    path: '#f6b5c4',
    decoration: strawberry,
  },
  orange: {
    name: 'Mundo naranja',
    bg: '#ffebd6',
    accent: '#f07c00',
    accentDark: '#b35c00',
    path: '#f8c48c',
    decoration: orange,
  },
}
