<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

<button
  in:fade={{ duration: 1000 }}
  onclick={() => engine.cycle()}
  class={cn('absolute top-0 left-0 h-dvh w-screen', !engine.isPlaying ? 'z-20' : 'z-0')}
>
  <div class="relative flex h-dvh justify-center p-[clamp(0.5rem,1vw,1.25rem)]">
    <div class="flex w-screen items-end justify-center">
      {#if engine.isReady}
        <div
          in:fade={{ duration: 1000 }}
          class={cn(
            'w-[min(90vw,50rem)] px-[.5vw] text-center text-[clamp(1rem,2vw,2.5rem)] font-semibold text-[#7887AE] uppercase',
            'bg-[linear-gradient(90deg,#ffffff00_0%,#ffffffe2_30%,#ffffffe2_70%,#ffffff00_100%)]',
            engine.isPlaying ? 'opacity-0' : 'opacity-100'
          )}
        >
          Click on the screen to play.
        </div>
      {/if}
    </div>
  </div>
</button>
