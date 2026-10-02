<script lang="ts">
  import { AudioService } from './audio/audioService'
  import ChallengeScene from './components/ChallengeScene.svelte'
  import PlayScene from './components/PlayScene.svelte'
  import StartScreen from './components/StartScreen.svelte'
  import type { Challenge } from './core/challenges'
  import { ChallengeSession } from './state/challengeSession.svelte'
  import { Preferences } from './state/preferences.svelte'
  import { Session } from './state/session.svelte'

  type Mode = 'home' | 'free' | 'challenges'

  const audio = new AudioService()
  const preferences = new Preferences(audio)
  let mode = $state<Mode>('home')
  let session = $state.raw<Session | undefined>()
  let game = $state.raw<ChallengeSession | undefined>()

  if (import.meta.env.MODE === 'e2e') {
    Object.assign(window, {
      __audioLog: audio.log,
      __audio: audio,
      // Fuerza el reto actual para escenarios deterministas.
      __challenges: { set: (challenge: Challenge) => game?.set(challenge) },
    })
  }

  function enterFree() {
    // Síncrono dentro del toque: iOS solo deja desbloquear el audio aquí.
    void audio.unlock()
    session = new Session(audio, preferences)
    mode = 'free'
  }

  function enterChallenges() {
    const loaded = audio.unlock()
    const current = new ChallengeSession(audio, preferences)
    current.start(false)
    game = current
    mode = 'challenges'
    // La primera pregunta suena cuando los audios están decodificados.
    void loaded.then(() => {
      if (game === current) current.ask()
    })
  }

  function goHome() {
    session?.narrator.cancel()
    game?.stop()
    audio.stop()
    session = undefined
    game = undefined
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
{:else if mode === 'challenges' && game}
  <ChallengeScene {game} onhome={goHome} />
{:else}
  <StartScreen onfree={enterFree} onchallenges={enterChallenges} />
{/if}
