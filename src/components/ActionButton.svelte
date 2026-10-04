<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Botón redondo grande (≥120 px). Usa aria-disabled y no `disabled`: un botón apagado
   * sigue respondiendo al toque (p. ej. ➖ en 0 suena amable).
   */
  let {
    variant,
    label,
    testid,
    disabled = false,
    onclick,
    children,
  }: {
    variant: 'plus' | 'minus' | 'confirm' | 'option'
    label: string
    testid: string
    disabled?: boolean
    onclick: () => void
    children: Snippet
  } = $props()
</script>

<button
  class="big {variant}"
  data-testid={testid}
  aria-label={label}
  aria-disabled={disabled}
  {onclick}
>
  {@render children()}
</button>

<style>
  .big {
    position: relative;
    display: grid;
    place-items: center;
    width: clamp(120px, 20vmin, 200px);
    aspect-ratio: 1;
    border-radius: 50%;
    color: #fff;
    font-size: clamp(5rem, 14vmin, 9rem);
    font-weight: 900;
    line-height: 1;
    transition:
      transform 80ms ease,
      box-shadow 80ms ease,
      filter 200ms ease;
  }

  .plus {
    background: var(--plus);
    box-shadow: 0 10px 0 var(--plus-dark);
  }

  .minus {
    background: var(--minus);
    box-shadow: 0 10px 0 var(--minus-dark);
  }

  .confirm {
    background: var(--confirm);
    box-shadow: 0 10px 0 var(--confirm-dark);
  }

  /* Las opciones de número son neutras e iguales entre sí: el color no da pistas. */
  .option {
    color: var(--ink);
    background: #fff;
    box-shadow:
      0 10px 0 var(--wood),
      inset 0 0 0 6px var(--wood);
    font-variant-numeric: tabular-nums;
  }

  .big:active {
    transform: translateY(8px);
    box-shadow: 0 2px 0 rgb(0 0 0 / 0.2);
  }

  .big[aria-disabled='true'] {
    filter: grayscale(1) opacity(0.45);
  }
</style>
