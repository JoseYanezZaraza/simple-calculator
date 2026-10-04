<script lang="ts">
  import type { Snippet } from 'svelte'

  /** Rejilla común de las escenas: marco arriba (o a la izquierda en apaisado), centro y acciones. */
  let {
    testid,
    controls,
    frame,
    center,
    actions,
    children,
    ...rest
  }: {
    testid: string
    controls: Snippet
    frame: Snippet
    center: Snippet
    actions: Snippet
    children?: Snippet
    [data: `data-${string}`]: unknown
  } = $props()
</script>

<main class="scene" data-testid={testid} {...rest}>
  {@render controls()}
  <div class="frame-area">{@render frame()}</div>
  <div class="center-area">{@render center()}</div>
  <div class="actions">{@render actions()}</div>
  {@render children?.()}
</main>

<style>
  .scene {
    position: relative;
    height: 100%;
    display: grid;
    grid-template-areas:
      'frame'
      'center'
      'actions';
    grid-template-rows: auto 1fr auto;
    align-items: center;
    justify-items: center;
    padding: clamp(64px, 9vh, 96px) clamp(16px, 5vw, 48px) clamp(24px, 5vh, 56px);
    gap: 2vh;
  }

  .frame-area {
    grid-area: frame;
    width: min(100%, 780px);
  }

  .center-area {
    grid-area: center;
    display: flex;
    align-items: center;
    gap: clamp(16px, 4vw, 40px);
  }

  .actions {
    grid-area: actions;
    display: flex;
    gap: clamp(32px, 8vw, 120px);
  }

  @media (orientation: landscape) {
    .scene {
      grid-template-areas:
        'frame center'
        'actions actions';
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr auto;
      column-gap: 4vw;
    }

    .frame-area {
      width: min(100%, 720px);
    }

    .center-area {
      flex-direction: column;
    }
  }
</style>
