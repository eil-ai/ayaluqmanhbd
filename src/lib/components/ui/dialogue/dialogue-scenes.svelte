<script lang="ts">
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

<video
  bind:this={engine.videoIntro}
  preload="auto"
  class="absolute top-0 left-0 z-1 h-dvh w-screen
          object-cover object-center brightness-80 max-sm:object-[center_30%]"
>
  <track kind="captions" />
  <source type="video/webm" />
</video>

<video
  bind:this={engine.videoLoop}
  preload="auto"
  class="absolute top-0 left-0 z-[-1] h-dvh
          w-screen object-cover object-center brightness-80 max-sm:object-[center_30%]"
>
  <track kind="captions" />
  <source type="video/webm" />
</video>

<audio bind:this={engine.audio} preload="auto"></audio>
<audio bind:this={engine.bgm} preload="auto"></audio>
