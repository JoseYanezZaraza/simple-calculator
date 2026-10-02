<script lang="ts">
  import { backOut, bounceOut } from 'svelte/easing'
  import type { TransitionConfig } from 'svelte/transition'
  import { FRUIT_IMAGES, FRUIT_LABELS } from '../assets/fruits'
  import { filledSlots } from '../core/tenFrame'
  import type { Fruit } from '../state/session.svelte'

  let {
    count,
    fruit,
    highlighted,
    ontapfruit,
  }: {
    count: number
    fruit: Fruit
    highlighted: number | null
    ontapfruit: () => void
  } = $props()

  const slots = $derived(filledSlots(count))

  /** La fruta cae desde arriba y rebota en su hueco. */
  function drop(_node: Element): TransitionConfig {
    return {
      duration: 550,
      easing: bounceOut,
      css: (t, u) => `transform: translateY(${-120 * u}vh) scale(${0.8 + 0.2 * t})`,
    }
  }

  /** La fruta sale rodando hacia la derecha. */
  function rollAway(_node: Element): TransitionConfig {
    return {
      duration: 450,
      easing: backOut,
      css: (t, u) => `transform: translateX(${60 * u}vw) rotate(${360 * u}deg); opacity: ${t}`,
    }
  }
</script>

<div class="frame" data-testid="ten-frame" data-fruit={fruit}>
  {#each slots as filled, i (i)}
    <div class="slot" data-testid="slot" data-filled={filled} data-highlighted={highlighted === i}>
      {#if filled}
        <button
          class="fruit"
          class:highlighted={highlighted === i}
          aria-label="Contar las frutas"
          onclick={ontapfruit}
          in:drop
          out:rollAway
        >
          <img
            src={FRUIT_IMAGES[fruit]}
            alt={FRUIT_LABELS[fruit]}
            data-fruit={fruit}
            draggable="false"
          />
        </button>
      {/if}
    </div>
  {/each}
</div>

<style>
  .frame {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: clamp(6px, 1.2vmin, 14px);
    padding: clamp(10px, 2vmin, 20px);
    width: 100%;
    aspect-ratio: 5 / 2;
    border-radius: 28px;
    background: var(--wood);
    box-shadow:
      inset 0 -8px 0 var(--wood-dark),
      0 10px 24px rgb(0 0 0 / 0.12);
  }

  .slot {
    position: relative;
    border-radius: 18px;
    background: var(--slot);
    box-shadow: inset 0 4px 8px rgb(0 0 0 / 0.12);
  }

  .fruit {
    position: absolute;
    inset: 6%;
    padding: 0;
    background: none;
    border-radius: 50%;
    transition: transform 150ms ease;
  }

  .fruit img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .fruit.highlighted {
    transform: scale(1.18);
    background: radial-gradient(circle, var(--highlight) 0 55%, transparent 72%);
  }
</style>
