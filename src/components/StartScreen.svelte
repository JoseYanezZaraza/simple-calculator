<script lang="ts">
  import { FRUIT_IMAGES } from '../assets/fruits'
  import { WORLD_IDS } from '../core/worlds'

  let {
    onfree,
    onworlds,
    onadventure,
  }: { onfree: () => void; onworlds: () => void; onadventure: () => void } = $props()

  /** Mini marco de diez del botón "jugar libre": 3 manzanas. */
  const miniFrame = Array.from({ length: 10 }, (_, i) => i < 3)
</script>

<main class="start">
  <div class="choice">
    <button class="mode free" data-testid="start-free" aria-label="Jugar libre" onclick={onfree}>
      <span class="mini-frame" aria-hidden="true">
        {#each miniFrame as filled, i (i)}
          <span class="mini-slot">
            {#if filled}<img src={FRUIT_IMAGES.apple} alt="" />{/if}
          </span>
        {/each}
      </span>
    </button>
    <p class="label" aria-hidden="true">Jugar libre</p>
  </div>

  <div class="choice">
    <button class="mode worlds" data-testid="start-worlds" aria-label="Mundos" onclick={onworlds}>
      <span class="fruit-grid" aria-hidden="true">
        {#each WORLD_IDS as world (world)}
          <img src={FRUIT_IMAGES[world]} alt="" />
        {/each}
      </span>
    </button>
    <p class="label" aria-hidden="true">Mundos</p>
  </div>

  <div class="choice">
    <button
      class="mode adventure"
      data-testid="start-adventure"
      aria-label="Aventura"
      onclick={onadventure}
    >
      <span class="trail" aria-hidden="true">
        {#each WORLD_IDS as world (world)}
          <img src={FRUIT_IMAGES[world]} alt="" />
        {/each}
      </span>
    </button>
    <p class="label" aria-hidden="true">Aventura</p>
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
    width: clamp(160px, 24vmin, 250px);
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

  .worlds {
    background: var(--confirm);
    box-shadow: 0 12px 0 var(--confirm-dark);
  }

  .adventure {
    background: var(--minus);
    box-shadow: 0 12px 0 var(--minus-dark);
  }

  .worlds::before {
    animation-delay: 0.8s;
  }

  .adventure::before {
    animation-delay: 1.6s;
  }

  .fruit-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6%;
    width: 56%;
  }

  .fruit-grid img,
  .trail img {
    width: 100%;
  }

  /* Las frutas suben en escalera: un camino de un mundo al siguiente. */
  .trail {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: end;
    gap: 2%;
    width: 72%;
    height: 46%;
  }

  .trail img:nth-child(1) {
    translate: 0 30%;
  }
  .trail img:nth-child(2) {
    translate: 0 10%;
  }
  .trail img:nth-child(3) {
    translate: 0 -10%;
  }
  .trail img:nth-child(4) {
    translate: 0 -30%;
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
