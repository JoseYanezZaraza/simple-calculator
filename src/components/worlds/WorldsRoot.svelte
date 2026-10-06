<script lang="ts">
  import type { WorldsController } from '../../state/worldsController.svelte'
  import AdultControls from '../AdultControls.svelte'
  import ChallengeScene from '../ChallengeScene.svelte'
  import { AVATAR_IMAGES } from '../../assets/avatars'
  import AdventurePath from './AdventurePath.svelte'
  import AvatarPicker from './AvatarPicker.svelte'
  import LevelMap from './LevelMap.svelte'
  import WorldComplete from './WorldComplete.svelte'
  import WorldSelect from './WorldSelect.svelte'
  import WorldTheme from './WorldTheme.svelte'

  /** Pantallas de "Mundos" y "Aventura" según el estado del controlador. */
  let { controller, onhome }: { controller: WorldsController; onhome: () => void } = $props()

  const screen = $derived(controller.screen)
  const progress = $derived(controller.progress.progress)
  const preferences = $derived(controller.preferences)
  const avatar = $derived(controller.avatar.avatar)
  /** El reinicio y el cambio de avatar se ofrecen solo en el selector y en la aventura. */
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
        {#if screen.name === 'avatarPicker'}
          <AvatarPicker current={avatar} onchoose={(f) => controller.chooseAvatar(f)} />
        {:else if screen.name === 'worlds'}
          <WorldSelect {progress} onopen={(w) => controller.openWorld(w)} />
        {:else if screen.name === 'adventure'}
          <AdventurePath
            {progress}
            unlocking={screen.unlocking}
            {avatar}
            hopFrom={screen.hopFrom}
            onopen={(w) => controller.openWorld(w)}
          />
        {:else if screen.name === 'levels'}
          <LevelMap
            world={screen.world}
            {progress}
            {avatar}
            hopFrom={screen.hopFrom}
            onplay={(level) => controller.playLevel(level)}
          />
        {:else if screen.name === 'worldComplete'}
          <WorldComplete kind="world" world={screen.world} />
        {:else if screen.name === 'adventureComplete'}
          <WorldComplete kind="adventure" />
        {/if}
      </div>
      {#if canReset && avatar}
        <!-- Para la niña: cambiar de personaje es parte del juego. -->
        <button
          class="avatar-button"
          data-testid="avatar-button"
          data-avatar={avatar}
          aria-label="Cambiar de personaje"
          onclick={() => controller.openAvatarPicker()}
        >
          <img src={AVATAR_IMAGES[avatar]} alt="" draggable="false" />
        </button>
      {/if}
    {/if}
  </div>
</WorldTheme>

<style>
  .screen {
    position: relative;
    height: 100%;
  }

  .avatar-button {
    position: absolute;
    left: max(16px, env(safe-area-inset-left));
    bottom: max(16px, env(safe-area-inset-bottom));
    z-index: 4;
    width: 96px;
    height: 96px;
    padding: 12px;
    border-radius: 50%;
    background: #fff;
    box-shadow:
      0 6px 0 var(--wood-dark),
      inset 0 0 0 5px var(--wood);
  }

  .avatar-button:active {
    translate: 0 5px;
  }

  .avatar-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .body {
    height: 100%;
    padding: clamp(80px, 10vh, 110px) clamp(24px, 5vw, 64px) clamp(32px, 6vh, 72px);
  }
</style>
