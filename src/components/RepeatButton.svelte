<script lang="ts">
  let { onclick }: { onclick: () => void } = $props()
</script>

<button class="repeat" data-testid="repeat" aria-label="Repetir la pregunta" {onclick}>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
    <path
      d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</button>

<style>
  .repeat {
    --size: clamp(88px, 13vmin, 120px);
    flex: none;
    width: var(--size);
    height: var(--size);
    padding: calc(var(--size) * 0.2);
    border-radius: 50%;
    color: #fff;
    background: var(--wood);
    box-shadow: 0 8px 0 var(--wood-dark);
    transition: transform 80ms ease;
  }

  .repeat:active {
    transform: translateY(6px);
    box-shadow: 0 2px 0 var(--wood-dark);
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
