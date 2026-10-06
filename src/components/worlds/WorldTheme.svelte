<script lang="ts">
  import type { Snippet } from 'svelte'
  import { WORLD_THEMES } from '../../assets/worlds/themes'
  import type { WorldId } from '../../core/worlds'

  /** Aplica la paleta y la decoración de un mundo; sin `world` usa el fondo neutro. */
  let { world, children }: { world: WorldId | null; children: Snippet } = $props()

  const theme = $derived(world ? WORLD_THEMES[world] : null)
</script>

<div
  class="world-theme"
  data-testid="world-theme"
  data-world={world ?? 'none'}
  style:--world-bg={theme?.bg}
  style:--world-accent={theme?.accent}
  style:--world-accent-dark={theme?.accentDark}
  style:--world-path={theme?.path}
>
  {#if theme}
    <img class="decoration" src={theme.decoration} alt="" aria-hidden="true" />
  {/if}
  <div class="content">{@render children()}</div>
</div>

<style>
  .world-theme {
    --world-bg: var(--bg);
    --world-accent: var(--confirm);
    --world-accent-dark: var(--confirm-dark);
    --world-path: #e8d5b5;
    position: relative;
    height: 100%;
    background: var(--world-bg);
    isolation: isolate;
  }

  /* Decoración solo en el borde inferior y suave: no compite con el marco ni los números. */
  .decoration {
    position: absolute;
    inset: auto 0 0;
    width: 100%;
    height: 26%;
    object-fit: cover;
    object-position: bottom;
    opacity: 0.6;
    z-index: -1;
  }

  .content {
    height: 100%;
  }
</style>
