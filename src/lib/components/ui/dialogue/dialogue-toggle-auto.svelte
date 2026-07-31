<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

<div class="absolute top-0 right-0 z-50 w-screen px-[clamp(0.75rem,1.5vw,2rem)] pt-[clamp(0.5rem,1vw,1.25rem)]">
  <div class="flex justify-end">
    <div
        class={cn(
          'relative skew-x-[-8deg] overflow-hidden rounded-[clamp(0.25rem,.5vw,.75rem)]',
          'p-[.15vw] before:absolute before:top-1/2 before:left-1/2',
          'before:-z-50 before:aspect-square before:w-full',
          engine.isAutoplay
            ? 'before:animate-[rotate_4s_linear_infinite] before:bg-[conic-gradient(transparent,#fff_270deg,transparent)]'
            : ''
        )}
      >
        {#if engine.isReady}
          <button
            in:fade={{ duration: 500 }}
            onclick={() => engine.toggleAuto()}
            class="overflow-hidden rounded-[clamp(0.25rem,.5vw,.75rem)] px-[clamp(0.5rem,.8vw,1rem)]
                py-[clamp(0.25rem,.5vw,.75rem)]
                text-[clamp(0.75rem,1.1vw,1.25rem)] font-extrabold text-[#2d354b] uppercase
                drop-shadow-lg
                {engine.isAutoplay ? 'bg-yellow-400' : 'bg-white'} transition"
          >
            Auto
          </button>
        {/if}
    </div>
  </div>
</div>
