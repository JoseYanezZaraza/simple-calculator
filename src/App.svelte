<script lang="ts">
  import { AudioService } from './audio/audioService'
  import PlayScene from './components/PlayScene.svelte'
  import StartScreen from './components/StartScreen.svelte'
  import WorldsRoot from './components/worlds/WorldsRoot.svelte'
  import type { Challenge } from './core/challenges'
  import type { Progress } from './core/worlds'
  import { AvatarStore } from './state/avatar.svelte'
  import { Preferences, type Fruit } from './state/preferences.svelte'
  import { ProgressStore } from './state/progress.svelte'
  import { Session } from './state/session.svelte'
  import { WorldsController, type WorldsOrigin } from './state/worldsController.svelte'

  type Mode = 'home' | 'free' | 'worlds'

  const audio = new AudioService()
  const preferences = new Preferences(audio)
  const progress = new ProgressStore()
  const avatar = new AvatarStore()
  let mode = $state<Mode>('home')
  let session = $state.raw<Session | undefined>()
  let worlds = $state.raw<WorldsController | undefined>()

  if (import.meta.env.MODE === 'e2e') {
    Object.assign(window, {
      __audioLog: audio.log,
      __audio: audio,
      // Fuerza el reto del nivel en curso para escenarios deterministas.
      __challenges: { set: (challenge: Challenge) => worlds?.game?.set(challenge) },
      // Siembra el avatar elegido.
      __avatar: { set: (fruit: Fruit) => avatar.set(fruit), get: () => avatar.avatar },
      // Siembra o lee el progreso guardado.
      __progress: {
        set: (p: Progress) => progress.set(p),
        get: () => ({ ...progress.progress }),
      },
    })
  }

  function enterFree() {
    // Síncrono dentro del toque: iOS solo deja desbloquear el audio aquí.
    void audio.unlock()
    session = new Session(audio, preferences)
    mode = 'free'
  }

  function enterWorlds(origin: WorldsOrigin) {
    const audioReady = audio.unlock()
    worlds = new WorldsController(audio, preferences, progress, origin, { avatar, audioReady })
    mode = 'worlds'
  }

  function goHome() {
    session?.narrator.cancel()
    worlds?.stop()
    audio.stop()
    session = undefined
    worlds = undefined
    mode = 'home'
  }

  // iOS suspende el AudioContext al pasar a segundo plano o bloquear la pantalla.
  function resumeAudio() {
    if (mode !== 'home') audio.resume()
  }
</script>

<svelte:document onvisibilitychange={resumeAudio} onpointerdown={resumeAudio} />

{#if mode === 'free' && session}
  <PlayScene {session} onhome={goHome} />
{:else if mode === 'worlds' && worlds}
  <WorldsRoot controller={worlds} onhome={goHome} />
{:else}
  <StartScreen
    onfree={enterFree}
    onworlds={() => enterWorlds('worlds')}
    onadventure={() => enterWorlds('adventure')}
  />
{/if}
