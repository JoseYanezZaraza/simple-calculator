<script lang="ts">
  import { AVATAR_IMAGES } from '../../assets/avatars'
  import { FRUIT_LABELS } from '../../assets/fruits'
  import { FRUITS, type Fruit } from '../../state/preferences.svelte'

  /** "¿Quién te acompaña?": la niña elige su personaje. */
  let { current, onchoose }: { current: Fruit | null; onchoose: (fruit: Fruit) => void } = $props()
</script>

<div class="picker" data-testid="avatar-picker">
  <p class="title">¿Quién te acompaña?</p>
  <div class="options">
    {#each FRUITS as fruit (fruit)}
      <button
        class="option"
        class:current={fruit === current}
        data-testid="avatar-option"
        data-avatar={fruit}
        data-current={fruit === current}
        aria-label={FRUIT_LABELS[fruit]}
        aria-pressed={fruit === current}
        onclick={() => onchoose(fruit)}
      >
        <img src={AVATAR_IMAGES[fruit]} alt="" draggable="false" />
      </button>
    {/each}
  </div>
</div>

<style>
  .picker {
    height: 100%;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: clamp(24px, 5vmin, 48px);
  }

  .title {
    margin: 0;
    font-size: clamp(2rem, 6vmin, 3.2rem);
    font-weight: 800;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: clamp(20px, 4vmin, 40px);
  }

  @media (orientation: landscape) {
    .options {
      grid-template-columns: repeat(4, auto);
    }
  }

  .option {
    display: grid;
    place-items: center;
    width: clamp(160px, 22vmin, 220px);
    aspect-ratio: 1;
    padding: 14%;
    border-radius: 32px;
    background: #fff;
    box-shadow:
      0 10px 0 var(--wood-dark),
      inset 0 0 0 6px var(--wood);
  }

  .option.current {
    box-shadow:
      0 10px 0 var(--plus-dark),
      inset 0 0 0 10px var(--plus);
  }

  .option:active {
    translate: 0 8px;
  }

  .option img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
