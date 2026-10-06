<script lang="ts">
  import { FRUIT_IMAGES } from '../assets/fruits'
  import type { Fruit } from '../state/session.svelte'
  import { recordCelebration } from '../testHooks'

  /** `id` cambia cada vez que se llega a 10; 0 significa que aún no ha habido celebración. */
  let { id, fruit }: { id: number; fruit: Fruit } = $props()

  const DURATION_MS = 1800
  const PIECES = 14

  let visible = $state(false)

  $effect(() => {
    if (id === 0) return
    visible = true
    const timer = setTimeout(() => (visible = false), DURATION_MS)
    return () => clearTimeout(timer)
  })
</script>

{#if visible}
  {#key id}
    <div
      class="celebration"
      data-testid="celebration"
      aria-hidden="true"
      {@attach recordCelebration}
    >
      <span class="star">⭐</span>
      {#each { length: PIECES }, i (i)}
        <img
          src={FRUIT_IMAGES[fruit]}
          alt=""
          class="piece"
          style:--angle="{(360 / PIECES) * i}deg"
          style:--delay="{(i % 3) * 60}ms"
        />
      {/each}
    </div>
  {/key}
{/if}

<style>
  .celebration {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    z-index: 10;
  }

  .star {
    grid-area: 1 / 1;
    font-size: clamp(8rem, 30vmin, 18rem);
    animation: pop 1.8s ease-out forwards;
  }

  .piece {
    grid-area: 1 / 1;
    width: clamp(48px, 8vmin, 80px);
    animation: burst 1.6s cubic-bezier(0.2, 0.8, 0.3, 1) var(--delay) forwards;
    opacity: 0;
  }

  @keyframes pop {
    0% {
      transform: scale(0) rotate(-30deg);
      opacity: 0;
    }
    25% {
      transform: scale(1.2) rotate(8deg);
      opacity: 1;
    }
    75% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
    100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }

  @keyframes burst {
    0% {
      transform: rotate(var(--angle)) translateY(0) scale(0.3);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: rotate(var(--angle)) translateY(-38vmin) scale(1);
      opacity: 0;
    }
  }
</style>
