<script lang="ts">
  import type { ChallengeSession } from '../state/challengeSession.svelte'
  import ActionButton from './ActionButton.svelte'
  import AdultControls from './AdultControls.svelte'
  import Celebration from './Celebration.svelte'
  import NumberDisplay from './NumberDisplay.svelte'
  import SpeakerButton from './SpeakerButton.svelte'
  import { recordOptionHighlight } from '../testHooks'
  import SceneLayout from './SceneLayout.svelte'
  import TenFrame from './TenFrame.svelte'

  let { game, onhome }: { game: ChallengeSession; onhome: () => void } = $props()

  const challenge = $derived(game.challenge)
  /** En "Pon N" se ve N siempre; en "¿Cuántas hay?" solo al acertar, como refuerzo. */
  const showTarget = $derived(challenge.kind === 'put' || game.phase === 'celebrating')

  $effect(() => {
    if (game.spokenOption !== null) recordOptionHighlight(game.spokenOption)
  })
</script>

<SceneLayout
  testid="challenge-scene"
  data-kind={challenge.kind}
  data-target={challenge.target}
  data-phase={game.phase}
>
  {#snippet controls()}
    <AdultControls preferences={game.preferences} {onhome} />
  {/snippet}

  {#snippet frame()}
    <TenFrame
      count={game.frame.count}
      fruit={game.frame.fruit}
      highlighted={game.highlighted}
      ontapfruit={() => game.tapFruit()}
    />
  {/snippet}

  {#snippet center()}
    {#if showTarget}
      <NumberDisplay count={challenge.target} />
    {/if}
    <SpeakerButton label="Repetir la pregunta" testid="repeat" onclick={() => game.ask()} />
  {/snippet}

  {#snippet actions()}
    {#if challenge.kind === 'howMany'}
      {#each challenge.options as option (option)}
        <!-- El altavoz va debajo y separado: un toque impreciso no debe responder. -->
        <div class="option-column">
          <ActionButton
            variant="option"
            label={String(option)}
            testid="option"
            highlighted={game.spokenOption === option}
            onclick={() => game.choose(option)}
          >
            {option}
          </ActionButton>
          <SpeakerButton
            label="Escuchar el {option}"
            testid="option-audio"
            size="small"
            onclick={() => game.sayOption(option)}
          />
        </div>
      {/each}
    {:else}
      <ActionButton
        variant="minus"
        label="Quitar una fruta"
        testid="remove"
        disabled={!game.frame.canRemove}
        onclick={() => game.remove()}
      >
        <span aria-hidden="true">−</span>
      </ActionButton>
      <ActionButton
        variant="confirm"
        label="¡Listo!"
        testid="confirm"
        onclick={() => game.confirm()}
      >
        <span aria-hidden="true">✓</span>
      </ActionButton>
      <ActionButton
        variant="plus"
        label="Añadir una fruta"
        testid="add"
        disabled={!game.frame.canAdd}
        onclick={() => game.add()}
      >
        <span aria-hidden="true">+</span>
      </ActionButton>
    {/if}
  {/snippet}

  <Celebration id={game.celebration} fruit={game.frame.fruit} />
</SceneLayout>

<style>
  .option-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
</style>
