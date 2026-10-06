<script lang="ts">
  import { FRUIT_IMAGES } from '../../assets/fruits'
  import { LEVELS_PER_WORLD, nodeState, type Progress, type WorldId } from '../../core/worlds'

  /** Mapa de un mundo: 10 nodos en camino serpenteante, visibles sin scroll. */
  let {
    world,
    progress,
    onplay,
  }: { world: WorldId; progress: Progress; onplay: (level: number) => void } = $props()

  const levels = Array.from({ length: LEVELS_PER_WORLD }, (_, i) => i + 1)

  /** Apaisado: 2 filas de 5 (ida y vuelta). Vertical: 5 filas de 2 (zigzag). Coordenadas en %. */
  function landscape(level: number): [number, number] {
    const row = Math.floor((level - 1) / 5)
    const col = (level - 1) % 5
    return [10 + 20 * (row === 0 ? col : 4 - col), row === 0 ? 30 : 72]
  }
  function portrait(level: number): [number, number] {
    const row = Math.floor((level - 1) / 2)
    const col = (level - 1) % 2
    return [row % 2 === 0 ? (col === 0 ? 28 : 72) : col === 0 ? 72 : 28, 8 + 19 * row]
  }
  const points = (f: (l: number) => [number, number]) => levels.map((l) => f(l).join(',')).join(' ')
</script>

<div class="map" data-testid="level-map" data-world={world}>
  <svg class="line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline class="landscape" points={points(landscape)} />
    <polyline class="portrait" points={points(portrait)} />
  </svg>
  {#each levels as level (level)}
    {@const state = nodeState(progress, world, level)}
    {@const [lx, ly] = landscape(level)}
    {@const [px, py] = portrait(level)}
    <button
      class="node {state}"
      data-testid="level-node"
      data-level={level}
      data-state={state}
      aria-label="Nivel {level}{state === 'locked' ? ' (bloqueado)' : ''}"
      aria-disabled={state === 'locked'}
      style:--lx="{lx}%"
      style:--ly="{ly}%"
      style:--px="{px}%"
      style:--py="{py}%"
      onclick={() => onplay(level)}
    >
      {#if state === 'done'}
        <img src={FRUIT_IMAGES[world]} alt="" />
        <span class="check" aria-hidden="true">✓</span>
      {:else if state === 'locked'}
        <span class="lock" aria-hidden="true">🔒</span>
      {:else}
        <span class="number">{level}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .map {
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
    stroke: var(--world-path);
    stroke-width: 18px;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .line .landscape {
    display: none;
  }

  .node {
    position: absolute;
    left: var(--px);
    top: var(--py);
    translate: -50% -50%;
    display: grid;
    place-items: center;
    width: clamp(96px, 13vmin, 124px);
    aspect-ratio: 1;
    border-radius: 50%;
    font-size: clamp(2.6rem, 6vmin, 3.4rem);
    font-weight: 900;
  }

  @media (orientation: landscape) {
    .line .landscape {
      display: inline;
    }
    .line .portrait {
      display: none;
    }
    .node {
      left: var(--lx);
      top: var(--ly);
    }
  }

  .done {
    background: #fff;
    box-shadow:
      0 8px 0 var(--world-accent-dark),
      inset 0 0 0 6px var(--world-accent);
  }

  .done img {
    width: 62%;
  }

  .check {
    position: absolute;
    right: -6px;
    bottom: -6px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    background: var(--plus);
    font-size: 1.6rem;
  }

  .next {
    color: #fff;
    background: var(--world-accent);
    box-shadow: 0 10px 0 var(--world-accent-dark);
  }

  /* Late el halo, no el nodo: un objetivo quieto es más fácil de acertar. */
  .next::before {
    content: '';
    position: absolute;
    inset: -14%;
    border-radius: 50%;
    background: var(--world-accent);
    opacity: 0.3;
    z-index: -1;
    animation: pulse 1.4s ease-in-out infinite;
  }

  .locked {
    background: #e7e2da;
    box-shadow: 0 6px 0 #c9c1b4;
  }

  .lock {
    font-size: 2.2rem;
    opacity: 0.6;
  }

  @keyframes pulse {
    50% {
      scale: 1.18;
      opacity: 0.12;
    }
  }
</style>
