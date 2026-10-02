import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // El icono ya trae su fondo crema; sin relleno extra.
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#fff8e7' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#fff8e7' } },
  },
  images: ['public/icon.svg'],
})
