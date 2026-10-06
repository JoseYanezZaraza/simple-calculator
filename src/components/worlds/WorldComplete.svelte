<script lang="ts">
  import { FRUIT_IMAGES } from '../../assets/fruits'
  import { WORLD_IDS, type WorldId } from '../../core/worlds'
  import { recordCelebration } from '../../testHooks'

  /** Celebración especial al completar un mundo o toda la aventura. */
  let { kind, world }: { kind: 'world' | 'adventure'; world?: WorldId } = $props()

  const fruits = $derived(kind === 'world' && world ? [world] : WORLD_IDS)
  const PIECES = 18
</script>

<div
  class="complete"
  data-testid="world-complete"
  data-kind={kind}
  aria-live="polite"
  {@attach () => recordCelebration(kind)}
>
  <div class="hero">
    {#each fruits as fruit, i (fruit)}
      <img class="big" src={FRUIT_IMAGES[fruit]} alt="" style:--i={i} />
    {/each}
  </div>
  <span class="star" aria-hidden="true">{kind === 'world' ? '⭐' : '🏆'}</span>
  {#each { length: PIECES }, i (i)}
    <img
      class="piece"
      src={FRUIT_IMAGES[fruits[i % fruits.length]]}
      alt=""
      style:--x="{(i * 53) % 100}%"
      style:--delay="{(i % 6) * 140}ms"
    />
  {/each}
</div>

<style>
  .complete {
    position: relative;
    height: 100%;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .hero {
    display: flex;
    gap: 2vmin;
    animation: pop 900ms cubic-bezier(0.2, 1.4, 0.4, 1) both;
  }

  .big {
    width: clamp(140px, 30vmin, 300px);
    animation: bob 1.4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 150ms);
  }

  .complete:has(.big:nth-child(2)) .big {
    width: clamp(90px, 16vmin, 160px);
  }

  .star {
    position: absolute;
    top: 12%;
    font-size: clamp(5rem, 14vmin, 8rem);
    animation: pop 900ms 300ms cubic-bezier(0.2, 1.4, 0.4, 1) both;
  }

  .piece {
    position: absolute;
    top: -12%;
    left: var(--x);
    width: clamp(40px, 6vmin, 64px);
    animation: fall 2.6s var(--delay) ease-in infinite;
    pointer-events: none;
  }

  @keyframes pop {
    from {
      scale: 0;
    }
  }

  @keyframes bob {
    50% {
      translate: 0 -12px;
    }
  }

  @keyframes fall {
    to {
      translate: 0 125vh;
      rotate: 360deg;
    }
  }
</style>
