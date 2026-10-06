<script lang="ts">
  import { FRUIT_IMAGES } from '../../assets/fruits'
  import { WORLD_THEMES } from '../../assets/worlds/themes'
  import { LEVELS_PER_WORLD, WORLD_IDS, type Progress, type WorldId } from '../../core/worlds'

  /** "Mundos": los 4 mundos en orden, todos abiertos, con su progreso. */
  let { progress, onopen }: { progress: Progress; onopen: (world: WorldId) => void } = $props()
</script>

<div class="grid" data-testid="world-select">
  {#each WORLD_IDS as world (world)}
    {@const theme = WORLD_THEMES[world]}
    {@const done = progress[world]}
    <button
      class="world"
      data-testid="world"
      data-world={world}
      data-progress={done}
      data-state={done >= LEVELS_PER_WORLD ? 'done' : 'open'}
      aria-label="{theme.name}: {done} de {LEVELS_PER_WORLD}"
      style:--accent={theme.accent}
      style:--accent-dark={theme.accentDark}
      style:--tint={theme.bg}
      onclick={() => onopen(world)}
    >
      <img class="fruit" src={FRUIT_IMAGES[world]} alt="" />
      <span class="dots" aria-hidden="true">
        {#each { length: LEVELS_PER_WORLD }, i (i)}
          <span class="dot" class:filled={i < done}></span>
        {/each}
      </span>
      {#if done >= LEVELS_PER_WORLD}
        <span class="badge" aria-hidden="true">⭐</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: clamp(24px, 5vmin, 56px);
    place-content: center;
    height: 100%;
  }

  @media (orientation: landscape) {
    .grid {
      grid-template-columns: repeat(4, auto);
    }
  }

  .world {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 12px;
    width: clamp(160px, 22vmin, 220px);
    aspect-ratio: 1;
    border-radius: 32px;
    background: var(--tint);
    box-shadow:
      0 10px 0 var(--accent-dark),
      inset 0 0 0 8px var(--accent);
  }

  .world:active {
    top: 8px;
    box-shadow:
      0 2px 0 var(--accent-dark),
      inset 0 0 0 8px var(--accent);
  }

  .fruit {
    width: 52%;
  }

  .dots {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgb(0 0 0 / 0.12);
  }

  .dot.filled {
    background: var(--accent);
  }

  .badge {
    position: absolute;
    top: -14px;
    right: -14px;
    font-size: 3rem;
    line-height: 1;
  }
</style>
