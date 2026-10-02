<script lang="ts">
  import { AudioService } from './audio/audioService'
  import PlayScene from './components/PlayScene.svelte'
  import StartScreen from './components/StartScreen.svelte'
  import { Session } from './state/session.svelte'

  const audio = new AudioService()
  const session = new Session(audio)
  let started = $state(false)

  if (import.meta.env.MODE === 'e2e') {
    Object.assign(window, { __audioLog: audio.log, __audio: audio })
  }

  function start() {
    // Síncrono dentro del toque: iOS solo deja desbloquear el audio aquí (CA11).
    void audio.unlock()
    started = true
  }

  // iOS suspende el AudioContext al pasar a segundo plano o bloquear la pantalla.
  function resumeAudio() {
    if (started) audio.resume()
  }
</script>

<svelte:document onvisibilitychange={resumeAudio} onpointerdown={resumeAudio} />

{#if started}
  <PlayScene {session} />
{:else}
  <StartScreen onstart={start} />
{/if}
