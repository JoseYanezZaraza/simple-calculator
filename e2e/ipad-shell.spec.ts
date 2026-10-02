import { expect, test } from '@playwright/test'
import { expectCount, startGame, tap, waitForServiceWorker } from './helpers.ts'

test.describe('Shell PWA para iPad', () => {
  test('CA9: el service worker controla la app y precachea todos sus recursos', async ({
    page,
  }) => {
    await page.goto('./')
    await waitForServiceWorker(page)
    const cached = await page.evaluate(async () => {
      const urls: string[] = []
      for (const key of await caches.keys()) {
        const cache = await caches.open(key)
        urls.push(...(await cache.keys()).map((r) => new URL(r.url).pathname))
      }
      return urls
    })
    for (let n = 0; n <= 10; n++) expect(cached).toContain(`/audio/es/${n}.m4a`)
    expect(cached).toContain('/audio/es/full.m4a')
    expect(cached).toContain('/audio/es/empty.m4a')
    expect(cached).toContain('/index.html')
    expect(cached.some((u) => u.endsWith('.js'))).toBe(true)
    expect(cached.some((u) => u.endsWith('.css'))).toBe(true)
  })

  test('el manifiesto permite instalarla a pantalla completa', async ({ page, request }) => {
    await page.goto('./')
    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    const manifest = await (await request.get(new URL(href!, page.url()).toString())).json()
    expect(manifest.display).toBe('fullscreen')
    expect(manifest.lang).toBe('es')
    expect(manifest.icons.some((i: { sizes: string }) => i.sizes === '512x512')).toBe(true)
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute(
      'content',
      'yes',
    )
  })

  test.describe('CA10: sin gestos accidentales', () => {
    test.beforeEach(async ({ page }) => {
      await startGame(page)
    })

    test('el viewport impide el zoom', async ({ page }) => {
      const content = await page.locator('meta[name="viewport"]').getAttribute('content')
      expect(content).toContain('user-scalable=no')
      expect(content).toContain('maximum-scale=1')
    })

    test('los estilos bloquean zoom por doble toque, selección, menú y rebote', async ({
      page,
    }) => {
      const styles = await page.getByTestId('add').evaluate((el) => {
        const s = getComputedStyle(el)
        const html = getComputedStyle(document.documentElement)
        return {
          touchAction: s.touchAction,
          userSelect: s.webkitUserSelect || s.userSelect,
          overscroll: html.overscrollBehavior || html.overscrollBehaviorY,
        }
      })
      expect(styles.touchAction).toBe('manipulation')
      expect(styles.userSelect).toBe('none')
      expect(styles.overscroll).toBe('none')

      // -webkit-touch-callout solo existe en iOS: el WebKit de escritorio lo descarta del CSSOM,
      // así que se comprueba en la hoja de estilos servida (y a mano en un iPad real).
      const cssHref = await page.locator('link[rel="stylesheet"]').first().getAttribute('href')
      const css = await (await page.request.get(new URL(cssHref!, page.url()).toString())).text()
      expect(css).toMatch(/-webkit-touch-callout:\s*none/)
    })

    test('el menú contextual y el pellizco se cancelan', async ({ page }) => {
      await tap(page, 'add')
      const prevented = await page.evaluate(() => {
        const fire = (type: string, target: EventTarget) => {
          const e = new Event(type, { bubbles: true, cancelable: true })
          target.dispatchEvent(e)
          return e.defaultPrevented
        }
        const fruit = document.querySelector('[data-testid="slot"] button')!
        return {
          contextmenu: fire('contextmenu', fruit),
          gesturestart: fire('gesturestart', document),
        }
      })
      expect(prevented).toEqual({ contextmenu: true, gesturestart: true })
    })

    test('un doble toque rápido sobre ➕ suma dos y no hace zoom', async ({ page }) => {
      await page.getByTestId('add').dblclick()
      await expectCount(page, 2)
      expect(await page.evaluate(() => window.visualViewport?.scale ?? 1)).toBe(1)
    })
  })
})
