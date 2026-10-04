<script lang="ts">
  import { FRUIT_IMAGES } from '../assets/fruits'
  import type { Session } from '../state/session.svelte'
  import ActionButton from './ActionButton.svelte'
  import AdultControls from './AdultControls.svelte'
  import Celebration from './Celebration.svelte'
  import NumberDisplay from './NumberDisplay.svelte'
  import SceneLayout from './SceneLayout.svelte'
  import TenFrame from './TenFrame.svelte'

  let { session, onhome }: { session: Session; onhome: () => void } = $props()
</script>

<SceneLayout testid="play-scene">
  {#snippet controls()}
    <AdultControls preferences={session.preferences} {onhome} />
  {/snippet}

  {#snippet frame()}
    <TenFrame
      count={session.count}
      fruit={session.fruit}
      highlighted={session.highlighted}
      ontapfruit={() => session.countAloud()}
    />
  {/snippet}

  {#snippet center()}
    <NumberDisplay count={session.count} />
  {/snippet}

  {#snippet actions()}
    <ActionButton
      variant="minus"
      label="Quitar una fruta"
      testid="remove"
      disabled={!session.canRemove}
      onclick={() => session.remove()}
    >
      <span aria-hidden="true">−</span>
      <img class="hint up" src={FRUIT_IMAGES[session.fruit]} alt="" />
    </ActionButton>
    <ActionButton
      variant="plus"
      label="Añadir una fruta"
      testid="add"
      disabled={!session.canAdd}
      onclick={() => session.add()}
    >
      <span aria-hidden="true">+</span>
      <img class="hint down" src={FRUIT_IMAGES[session.fruit]} alt="" />
    </ActionButton>
  {/snippet}

  <Celebration id={session.celebration} fruit={session.fruit} />
</SceneLayout>

<style>
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
