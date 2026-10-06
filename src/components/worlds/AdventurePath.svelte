<script lang="ts">
  import { FRUIT_IMAGES } from '../../assets/fruits'
  import { WORLD_THEMES } from '../../assets/worlds/themes'
  import {
    isAdventureComplete,
    isWorldComplete,
    isWorldUnlocked,
    WORLD_IDS,
    type Progress,
    type WorldId,
  } from '../../core/worlds'
  import type { Fruit } from '../../state/preferences.svelte'
  import Avatar, { type AvatarSpot } from './Avatar.svelte'

  /** "Aventura": los 4 mundos en camino; solo se abren en orden. */
  let {
    progress,
    unlocking,
    avatar,
    hopFrom,
    onopen,
  }: {
    progress: Progress
    unlocking?: WorldId
    avatar: Fruit | null
    /** Mundo recién completado desde el que salta el avatar al desbloqueado. */
    hopFrom?: WorldId
    onopen: (world: WorldId) => void
  } = $props()

  /** Mismas posiciones que las clases .n0–.n3 (en %). */
  const LANDSCAPE: [number, number][] = [
    [12, 50],
    [37, 50],
    [62, 50],
    [87, 50],
  ]
  const PORTRAIT: [number, number][] = [
    [30, 12],
    [70, 37],
    [30, 62],
    [70, 87],
  ]

  function spot(world: WorldId): AvatarSpot {
    const i = WORLD_IDS.indexOf(world)
    return { id: world, landscape: LANDSCAPE[i], portrait: PORTRAIT[i] }
  }

  /** Mundo actual: el primero sin completar, o el último si la aventura está completa. */
  const avatarWorld = $derived(
    WORLD_IDS.find((w) => !isWorldComplete(progress, w)) ?? WORLD_IDS[WORLD_IDS.length - 1],
  )

  function stateOf(world: WorldId): 'done' | 'next' | 'locked' {
    if (isWorldComplete(progress, world)) return 'done'
    return isWorldUnlocked(progress, world) ? 'next' : 'locked'
  }
</script>

<div class="adventure" data-testid="adventure-path" data-complete={isAdventureComplete(progress)}>
  <svg class="line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline class="landscape" points="12,50 37,50 62,50 87,50" />
    <polyline class="portrait" points="30,12 70,37 30,62 70,87" />
  </svg>
  {#each WORLD_IDS as world, i (world)}
    {@const state = stateOf(world)}
    {@const theme = WORLD_THEMES[world]}
    <button
      class="node n{i} {state}"
      class:unlocking={unlocking === world}
      data-testid="adventure-world"
      data-world={world}
      data-state={state}
      aria-label="{theme.name}{state === 'locked' ? ' (bloqueado)' : ''}"
      aria-disabled={state === 'locked'}
      style:--accent={theme.accent}
      style:--accent-dark={theme.accentDark}
      style:--tint={theme.bg}
      onclick={() => onopen(world)}
    >
      <img src={FRUIT_IMAGES[world]} alt="" />
      {#if state === 'done'}<span class="mark" aria-hidden="true">⭐</span>{/if}
      {#if state === 'locked'}<span class="mark lock" aria-hidden="true">🔒</span>{/if}
    </button>
  {/each}
  {#if isAdventureComplete(progress)}
    <span class="trophy" aria-hidden="true">🏆</span>
  {/if}
  {#if avatar}
    <Avatar
      fruit={avatar}
      at={spot(avatarWorld)}
      from={hopFrom ? spot(hopFrom) : undefined}
      size="clamp(110px, 14vmin, 140px)"
      lift="clamp(60px, 7.6vmin, 76px)"
    />
  {/if}
</div>

<style>
  .adventure {
    position: relative;
    height: 100%;
    isolation: isolate;
  }

  .line {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .line polyline {
    fill: none;
    stroke: #d9c19a;
    stroke-width: 3;
    stroke-dasharray: 4 3;
    vector-effect: non-scaling-stroke;
    stroke-width: 14px;
  }

  .line .landscape {
    display: none;
  }

  .node {
    position: absolute;
    translate: -50% -50%;
    display: grid;
    place-items: center;
    width: clamp(160px, 20vmin, 200px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--tint);
    box-shadow:
      0 10px 0 var(--accent-dark),
      inset 0 0 0 8px var(--accent);
  }

  .node img {
    width: 58%;
  }

  /* Vertical: zigzag de arriba abajo. */
  .n0 {
    left: 30%;
    top: 12%;
  }
  .n1 {
    left: 70%;
    top: 37%;
  }
  .n2 {
    left: 30%;
    top: 62%;
  }
  .n3 {
    left: 70%;
    top: 87%;
  }

  @media (orientation: landscape) {
    .line .landscape {
      display: inline;
    }
    .line .portrait {
      display: none;
    }
    .n0 {
      left: 12%;
      top: 50%;
    }
    .n1 {
      left: 37%;
      top: 50%;
    }
    .n2 {
      left: 62%;
      top: 50%;
    }
    .n3 {
      left: 87%;
      top: 50%;
    }
  }

  /* Late el halo, no el nodo: un objetivo quieto es más fácil de acertar. */
  .node.next::before {
    content: '';
    position: absolute;
    inset: -12%;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.3;
    z-index: -1;
    animation: pulse 1.6s ease-in-out infinite;
  }

  /* Apagado pero opaco: que el camino no se vea a través del nodo. */
  .node.locked {
    background: #ece8e1;
    box-shadow:
      0 10px 0 #c9c1b4,
      inset 0 0 0 8px #d6cfc4;
  }

  .node.locked img {
    filter: grayscale(1);
    opacity: 0.45;
  }

  .node.unlocking {
    animation: unlock 1.2s ease-out both;
  }

  .mark {
    position: absolute;
    top: -12px;
    right: -6px;
    font-size: 2.8rem;
    line-height: 1;
  }

  .mark.lock {
    top: auto;
    right: auto;
    font-size: 3.5rem;
  }

  .trophy {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    font-size: clamp(5rem, 14vmin, 8rem);
    pointer-events: none;
  }

  @keyframes pulse {
    50% {
      scale: 1.16;
      opacity: 0.12;
    }
  }

  @keyframes unlock {
    0% {
      scale: 0.6;
    }
    60% {
      scale: 1.2;
    }
    100% {
      scale: 1;
    }
  }
</style>
