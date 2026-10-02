<script lang="ts">
  import { FRUIT_IMAGES, FRUIT_LABELS } from '../assets/fruits'
  import { FRUITS, type Fruit } from '../state/session.svelte'

  let {
    voiceOn,
    fruit,
    onvoice,
    onfruit,
  }: {
    voiceOn: boolean
    fruit: Fruit
    onvoice: (on: boolean) => void
    onfruit: (fruit: Fruit) => void
  } = $props()

  let pickerOpen = $state(false)

  function choose(option: Fruit) {
    onfruit(option)
    pickerOpen = false
  }
</script>

<nav class="adult" aria-label="Controles para el adulto">
  <button
    class="control"
    data-testid="voice-toggle"
    aria-pressed={!voiceOn}
    aria-label={voiceOn ? 'Silenciar la voz' : 'Activar la voz'}
    onclick={() => onvoice(!voiceOn)}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
      {#if voiceOn}
        <path
          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      {:else}
        <path
          d="M16 9l6 6M22 9l-6 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      {/if}
    </svg>
  </button>

  <div class="picker">
    <button
      class="control"
      data-testid="fruit-picker"
      aria-haspopup="menu"
      aria-expanded={pickerOpen}
      aria-label="Elegir fruta (ahora: {FRUIT_LABELS[fruit]})"
      onclick={() => (pickerOpen = !pickerOpen)}
    >
      <img src={FRUIT_IMAGES[fruit]} alt="" />
    </button>
    {#if pickerOpen}
      <div class="menu" role="menu">
        {#each FRUITS as option (option)}
          <button
            class="control option"
            class:current={option === fruit}
            role="menuitemradio"
            aria-checked={option === fruit}
            aria-label={FRUIT_LABELS[option]}
            data-fruit-option={option}
            onclick={() => choose(option)}
          >
            <img src={FRUIT_IMAGES[option]} alt="" />
          </button>
        {/each}
      </div>
    {/if}
  </div>
</nav>

<style>
  .adult {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    z-index: 5;
  }

  .control {
    width: 44px;
    height: 44px;
    padding: 8px;
    border-radius: 12px;
    background: rgb(61 44 30 / 0.08);
    opacity: 0.6;
  }

  .control svg,
  .control img {
    width: 100%;
    height: 100%;
  }

  .picker {
    position: relative;
  }

  .menu {
    position: absolute;
    top: 52px;
    right: 0;
    display: flex;
    gap: 6px;
    padding: 6px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 18px rgb(0 0 0 / 0.15);
  }

  .option {
    opacity: 1;
    background: none;
  }

  .option.current {
    background: rgb(67 170 91 / 0.2);
  }
</style>
