<script lang="ts">
  import { backOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'

  let { count }: { count: number } = $props()
</script>

<div class="number" data-testid="count-display" aria-live="polite">
  {#key count}
    <span in:scale={{ start: 0.4, duration: 350, easing: backOut }}>{count}</span>
  {/key}
</div>

<style>
  .number {
    display: grid;
    place-items: center;
    min-width: 1.6ch;
    font-size: clamp(7rem, 26vmin, 16rem);
    font-weight: 900;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  span {
    grid-area: 1 / 1;
  }
</style>
