<script lang="ts">
  import { FRUIT_IMAGES, FRUIT_LABELS } from '../assets/fruits'
  import { FRUITS, type Fruit, type Preferences } from '../state/preferences.svelte'

  let {
    preferences,
    onhome,
    showFruitPicker = true,
    onreset,
  }: {
    preferences: Preferences
    onhome: () => void
    /** En los mundos la fruta es la del mundo: no se muestra el selector. */
    showFruitPicker?: boolean
    /** Si se pasa, aparece "reiniciar progreso" con confirmación. */
    onreset?: () => void
  } = $props()

  let pickerOpen = $state(false)
  let confirmingReset = $state(false)

  function confirmReset() {
    confirmingReset = false
    onreset?.()
  }

  function choose(option: Fruit) {
    preferences.setFruit(option)
    pickerOpen = false
  }
</script>

<nav class="adult" aria-label="Controles para el adulto">
  <button class="control" data-testid="home" aria-label="Volver al inicio" onclick={onhome}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
        fill="currentColor"
      />
    </svg>
  </button>

  <button
    class="control"
    data-testid="voice-toggle"
    aria-pressed={!preferences.voiceOn}
    aria-label={preferences.voiceOn ? 'Silenciar la voz' : 'Activar la voz'}
    onclick={() => preferences.setVoice(!preferences.voiceOn)}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
      {#if preferences.voiceOn}
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

  {#if showFruitPicker}
    <div class="picker">
      <button
        class="control"
        data-testid="fruit-picker"
        aria-haspopup="menu"
        aria-expanded={pickerOpen}
        aria-label="Elegir fruta (ahora: {FRUIT_LABELS[preferences.fruit]})"
        onclick={() => (pickerOpen = !pickerOpen)}
      >
        <img src={FRUIT_IMAGES[preferences.fruit]} alt="" />
      </button>
      {#if pickerOpen}
        <div class="menu" role="menu">
          {#each FRUITS as option (option)}
            <button
              class="control option"
              class:current={option === preferences.fruit}
              role="menuitemradio"
              aria-checked={option === preferences.fruit}
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
  {/if}

  {#if onreset}
    <button
      class="control"
      data-testid="reset-progress"
      aria-label="Reiniciar el progreso"
      onclick={() => (confirmingReset = true)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"
          stroke="currentColor"
          stroke-width="2.4"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  {/if}
</nav>

{#if confirmingReset}
  <!-- Texto para el adulto: la niña no lee, así que no puede confirmarlo sin querer. -->
  <div class="backdrop">
    <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-title">
      <p id="reset-title">¿Borrar todo el progreso de los mundos?</p>
      <div class="dialog-actions">
        <button
          class="dialog-button"
          data-testid="reset-cancel"
          onclick={() => (confirmingReset = false)}
        >
          Cancelar
        </button>
        <button class="dialog-button danger" data-testid="reset-confirm" onclick={confirmReset}>
          Borrar
        </button>
      </div>
    </div>
  </div>
{/if}

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

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: rgb(0 0 0 / 0.35);
  }

  .dialog {
    max-width: min(90vw, 460px);
    padding: 28px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 12px 36px rgb(0 0 0 / 0.25);
    font-size: 1.3rem;
    text-align: center;
  }

  .dialog p {
    margin: 0 0 24px;
  }

  .dialog-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .dialog-button {
    min-width: 140px;
    padding: 14px 20px;
    border-radius: 12px;
    background: rgb(61 44 30 / 0.1);
    font-size: 1.2rem;
    font-weight: 700;
  }

  .dialog-button.danger {
    color: #fff;
    background: #c62828;
  }

  .option.current {
    background: rgb(67 170 91 / 0.2);
  }
</style>
