<script lang="ts">
  import apple from '../assets/fruits/apple.svg'

  let { onstart }: { onstart: () => void } = $props()
</script>

<main class="start">
  <button class="play" data-testid="start" aria-label="¡A jugar!" onclick={onstart}>
    <img src={apple} alt="" />
    <span class="triangle" aria-hidden="true"></span>
  </button>
  <p class="title" aria-hidden="true">¡A jugar!</p>
</main>

<style>
  .start {
    isolation: isolate;
    height: 100%;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 2rem;
  }

  .play {
    position: relative;
    width: clamp(200px, 40vmin, 340px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--plus);
    box-shadow: 0 12px 0 var(--plus-dark);
  }

  /* El halo late; el botón queda quieto para que sea fácil de acertar. */
  .play::before {
    content: '';
    position: absolute;
    inset: -6%;
    border-radius: 50%;
    background: var(--plus);
    opacity: 0.25;
    z-index: -1;
    animation: breathe 2.4s ease-in-out infinite;
  }

  .play:active {
    transform: translateY(8px);
    box-shadow: 0 4px 0 var(--plus-dark);
  }

  .play img {
    position: absolute;
    width: 34%;
    top: -12%;
    right: -6%;
    transform: rotate(14deg);
  }

  .triangle {
    position: absolute;
    left: 38%;
    top: 28%;
    border-style: solid;
    border-width: clamp(44px, 9vmin, 76px) 0 clamp(44px, 9vmin, 76px) clamp(70px, 14vmin, 118px);
    border-color: transparent transparent transparent #fff;
  }

  .title {
    margin: 0;
    font-size: clamp(2.5rem, 8vmin, 5rem);
    font-weight: 800;
  }

  @keyframes breathe {
    50% {
      transform: scale(1.12);
      opacity: 0.1;
    }
  }
</style>
