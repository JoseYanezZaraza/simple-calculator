<script lang="ts">
  import { FRUIT_IMAGES } from '../assets/fruits'
  import type { Session } from '../state/session.svelte'
  import AdultControls from './AdultControls.svelte'
  import Celebration from './Celebration.svelte'
  import NumberDisplay from './NumberDisplay.svelte'
  import TenFrame from './TenFrame.svelte'

  let { session }: { session: Session } = $props()
</script>

<main class="scene" data-testid="play-scene">
  <AdultControls
    voiceOn={session.voiceOn}
    fruit={session.fruit}
    onvoice={(on) => session.setVoice(on)}
    onfruit={(f) => session.setFruit(f)}
  />

  <div class="frame-area">
    <TenFrame
      count={session.count}
      fruit={session.fruit}
      highlighted={session.highlighted}
      ontapfruit={() => session.countAloud()}
    />
  </div>

  <div class="number-area">
    <NumberDisplay count={session.count} />
  </div>

  <div class="buttons">
    <!-- aria-disabled y no `disabled`: en 0 el toque de ➖ debe seguir sonando amable (CA4). -->
    <button
      class="big minus"
      data-testid="remove"
      aria-label="Quitar una fruta"
      aria-disabled={!session.canRemove}
      onclick={() => session.remove()}
    >
      <span class="sign" aria-hidden="true">−</span>
      <img class="hint up" src={FRUIT_IMAGES[session.fruit]} alt="" />
    </button>
    <button
      class="big plus"
      data-testid="add"
      aria-label="Añadir una fruta"
      aria-disabled={!session.canAdd}
      onclick={() => session.add()}
    >
      <span class="sign" aria-hidden="true">+</span>
      <img class="hint down" src={FRUIT_IMAGES[session.fruit]} alt="" />
    </button>
  </div>

  <Celebration id={session.celebration} fruit={session.fruit} />
</main>

<style>
  .scene {
    position: relative;
    height: 100%;
    display: grid;
    grid-template-areas:
      'frame'
      'number'
      'buttons';
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

  .number-area {
    grid-area: number;
  }

  .buttons {
    grid-area: buttons;
    display: flex;
    gap: clamp(48px, 12vw, 160px);
  }

  @media (orientation: landscape) {
    .scene {
      grid-template-areas:
        'frame number'
        'buttons buttons';
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr auto;
      column-gap: 4vw;
    }

    .frame-area {
      width: min(100%, 720px);
    }
  }

  .big {
    position: relative;
    width: clamp(120px, 20vmin, 200px);
    aspect-ratio: 1;
    border-radius: 50%;
    color: #fff;
    transition:
      transform 80ms ease,
      box-shadow 80ms ease,
      filter 200ms ease;
  }

  .sign {
    font-size: clamp(5rem, 14vmin, 9rem);
    font-weight: 900;
    line-height: 1;
  }

  .plus {
    background: var(--plus);
    box-shadow: 0 10px 0 var(--plus-dark);
  }

  .minus {
    background: var(--minus);
    box-shadow: 0 10px 0 var(--minus-dark);
  }

  .big:active {
    transform: translateY(8px);
    box-shadow: 0 2px 0 rgb(0 0 0 / 0.2);
  }

  .big[aria-disabled='true'] {
    filter: grayscale(1) opacity(0.45);
  }

  .hint {
    position: absolute;
    width: 32%;
    right: -4%;
  }

  .hint.down {
    top: -10%;
  }

  .hint.up {
    bottom: -6%;
  }
</style>
