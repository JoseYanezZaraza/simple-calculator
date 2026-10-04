<script lang="ts">
  import apple from '../assets/fruits/apple.svg'

  let { onfree, onchallenges }: { onfree: () => void; onchallenges: () => void } = $props()

  /** Mini marco de diez del botón "jugar libre": 3 manzanas. */
  const miniFrame = Array.from({ length: 10 }, (_, i) => i < 3)
</script>

<main class="start">
  <div class="choice">
    <button class="mode free" data-testid="start-free" aria-label="Jugar libre" onclick={onfree}>
      <span class="mini-frame" aria-hidden="true">
        {#each miniFrame as filled, i (i)}
          <span class="mini-slot">
            {#if filled}<img src={apple} alt="" />{/if}
          </span>
        {/each}
      </span>
    </button>
    <p class="label" aria-hidden="true">Jugar libre</p>
  </div>

  <div class="choice">
    <button
      class="mode challenges"
      data-testid="start-challenges"
      aria-label="Retos"
      onclick={onchallenges}
    >
      <span class="question" aria-hidden="true">?</span>
      <img class="badge" src={apple} alt="" />
    </button>
    <p class="label" aria-hidden="true">Retos</p>
  </div>
</main>

<style>
  .start {
    isolation: isolate;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    gap: clamp(32px, 8vmin, 96px);
  }

  .choice {
    display: grid;
    justify-items: center;
    gap: 1.25rem;
  }

  .mode {
    position: relative;
    display: grid;
    place-items: center;
    width: clamp(200px, 34vmin, 300px);
    aspect-ratio: 1;
    border-radius: 50%;
  }

  /* El halo late; el botón queda quieto para que sea fácil de acertar. */
  .mode::before {
    content: '';
    position: absolute;
    inset: -6%;
    border-radius: 50%;
    background: inherit;
    opacity: 0.25;
    z-index: -1;
    animation: breathe 2.4s ease-in-out infinite;
  }

  /* `top` y no `transform`: un transform crearía un contexto de apilamiento y el halo taparía el botón. */
  .mode:active {
    top: 8px;
  }

  .free {
    background: var(--plus);
    box-shadow: 0 12px 0 var(--plus-dark);
  }

  .challenges {
    background: var(--confirm);
    box-shadow: 0 12px 0 var(--confirm-dark);
  }

  .challenges::before {
    animation-delay: 1.2s;
  }

  .mini-frame {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    width: 72%;
    padding: 6px;
    border-radius: 12px;
    background: var(--wood);
  }

  .mini-slot {
    aspect-ratio: 1;
    border-radius: 6px;
    background: var(--slot);
  }

  .mini-slot img {
    width: 100%;
    height: 100%;
    padding: 8%;
  }

  .question {
    color: #fff;
    font-size: clamp(7rem, 20vmin, 11rem);
    font-weight: 900;
    line-height: 1;
  }

  .badge {
    position: absolute;
    width: 34%;
    top: -10%;
    right: -6%;
    transform: rotate(14deg);
  }

  .label {
    margin: 0;
    font-size: clamp(2rem, 6vmin, 3.5rem);
    font-weight: 800;
  }

  @keyframes breathe {
    50% {
      transform: scale(1.12);
      opacity: 0.1;
    }
  }
</style>
