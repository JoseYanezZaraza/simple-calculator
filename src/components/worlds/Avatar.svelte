<script lang="ts" module>
  /** Posición en % del contenedor: [x, y] en apaisado y en vertical. */
  export interface AvatarSpot {
    id: string
    landscape: [number, number]
    portrait: [number, number]
  }
</script>

<script lang="ts">
  import { AVATAR_IMAGES } from '../../assets/avatars'
  import type { Fruit } from '../../state/preferences.svelte'
  import { recordHop } from '../../testHooks'

  /** Avatar de pie sobre un nodo. Con `from`, salta en arco desde ese nodo al actual. */
  let {
    fruit,
    at,
    from,
    size,
    lift,
  }: {
    fruit: Fruit
    at: AvatarSpot
    from?: AvatarSpot
    size: string
    /** Cuánto por encima del centro del nodo apoya los pies (≈ su radio): el número queda visible. */
    lift: string
  } = $props()

  const HOP_MS = 900
  /** Altura extra del arco, en % del contenedor. */
  const ARC = 14

  function hop(node: HTMLElement) {
    if (!from || from.id === at.id) return
    const landscape = matchMedia('(orientation: landscape)').matches
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    recordHop(from.id, at.id, !reduced)
    if (reduced) return
    const [fx, fy] = landscape ? from.landscape : from.portrait
    const [tx, ty] = landscape ? at.landscape : at.portrait
    node.animate(
      [
        { left: `${fx}%`, top: `${fy}%` },
        { left: `${(fx + tx) / 2}%`, top: `${Math.min(fy, ty) - ARC}%`, offset: 0.5 },
        { left: `${tx}%`, top: `${ty}%` },
      ],
      { duration: HOP_MS, easing: 'ease-in-out' },
    )
    node
      .querySelector('img')
      ?.animate([{ scale: '1' }, { scale: '1.12 0.88', offset: 0.85 }, { scale: '1' }], {
        duration: HOP_MS,
      })
  }
</script>

<div
  class="avatar"
  data-testid="avatar"
  data-avatar={fruit}
  data-at={at.id}
  aria-hidden="true"
  style:--lx="{at.landscape[0]}%"
  style:--ly="{at.landscape[1]}%"
  style:--px="{at.portrait[0]}%"
  style:--py="{at.portrait[1]}%"
  style:--size={size}
  style:--lift={lift}
  {@attach hop}
>
  <img src={AVATAR_IMAGES[fruit]} alt="" draggable="false" />
</div>

<style>
  /* Nunca intercepta toques: el nodo de debajo los recibe. */
  .avatar {
    position: absolute;
    left: var(--px);
    top: var(--py);
    z-index: 3;
    width: var(--size);
    pointer-events: none;
  }

  @media (orientation: landscape) {
    .avatar {
      left: var(--lx);
      top: var(--ly);
    }
  }

  /* De pie sobre el borde superior del nodo. */
  .avatar img {
    display: block;
    width: 100%;
    translate: -50% calc(-100% - var(--lift));
    transform-origin: 50% 100%;
    animation: sway 2.4s ease-in-out infinite;
  }

  @keyframes sway {
    25% {
      rotate: -4deg;
    }
    75% {
      rotate: 4deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .avatar img {
      animation: none;
    }
  }
</style>
