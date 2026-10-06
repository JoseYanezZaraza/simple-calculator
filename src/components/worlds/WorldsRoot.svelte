<script lang="ts">
  import type { WorldsController } from '../../state/worldsController.svelte'
  import AdultControls from '../AdultControls.svelte'
  import ChallengeScene from '../ChallengeScene.svelte'
  import AdventurePath from './AdventurePath.svelte'
  import LevelMap from './LevelMap.svelte'
  import WorldComplete from './WorldComplete.svelte'
  import WorldSelect from './WorldSelect.svelte'
  import WorldTheme from './WorldTheme.svelte'

  /** Pantallas de "Mundos" y "Aventura" según el estado del controlador. */
  let { controller, onhome }: { controller: WorldsController; onhome: () => void } = $props()

  const screen = $derived(controller.screen)
  const progress = $derived(controller.progress.progress)
  const preferences = $derived(controller.preferences)
  /** El reinicio solo se ofrece en el selector y en el camino de la aventura. */
  const canReset = $derived(screen.name === 'worlds' || screen.name === 'adventure')
</script>

<WorldTheme world={controller.world}>
  <div class="screen" data-testid="worlds-screen" data-screen={screen.name}>
    {#if screen.name === 'challenge' && controller.game}
      <ChallengeScene game={controller.game} {onhome} showFruitPicker={false} />
    {:else}
      <AdultControls
        {preferences}
        {onhome}
        showFruitPicker={false}
        onreset={canReset ? () => controller.progress.reset() : undefined}
      />
      <div class="body">
        {#if screen.name === 'worlds'}
          <WorldSelect {progress} onopen={(w) => controller.openWorld(w)} />
        {:else if screen.name === 'adventure'}
          <AdventurePath
            {progress}
            unlocking={screen.unlocking}
            onopen={(w) => controller.openWorld(w)}
          />
        {:else if screen.name === 'levels'}
          <LevelMap
            world={screen.world}
            {progress}
            onplay={(level) => controller.playLevel(level)}
          />
        {:else if screen.name === 'worldComplete'}
          <WorldComplete kind="world" world={screen.world} />
        {:else if screen.name === 'adventureComplete'}
          <WorldComplete kind="adventure" />
        {/if}
      </div>
    {/if}
  </div>
</WorldTheme>

<style>
  .screen {
    position: relative;
    height: 100%;
  }

  .body {
    height: 100%;
    padding: clamp(80px, 10vh, 110px) clamp(24px, 5vw, 64px) clamp(32px, 6vh, 72px);
  }
</style>
