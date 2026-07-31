<script lang="ts">
  import IconCloud from '$components/icons/IconCloud.svelte';
  import { DIALOGUES } from '$lib/constants';
  import { fade } from 'svelte/transition';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

{#if engine.isPlaying && DIALOGUES[engine.currentIndex].choices.length && engine.isEnded}
  <div
    in:fade={{ duration: 1000 }}
    class="absolute top-0 left-0 z-2 h-dvh w-screen"
  >
    <div class="flex h-dvh items-end justify-center pb-[clamp(0.75rem,1.5vw,2rem)]">
      <div class="flex flex-col gap-[clamp(0.25rem,.5vw,.75rem)]">
        {#each DIALOGUES[engine.currentIndex].choices as choice (choice.text)}
          <button
            onclick={() => engine.choice()}
            class="flex items-center gap-[clamp(0.25rem,.5vw,.75rem)] rounded-[clamp(0.75rem,2vw,2.5rem)]
                  border border-neutral-800/50
                  bg-white/70 px-[clamp(0.5rem,1vw,1.25rem)] py-[clamp(0.25rem,.5vw,.75rem)]
                  text-[clamp(0.875rem,1.2vw,1.5rem)] font-semibold text-neutral-800
                  filter-[drop-shadow(0_0.3vw_0.2vw_rgb(0_0_0/0.07))_drop-shadow(0_0.1vw_0.1vw_rgb(0_0_0/0.06))]"
          >
            <div class="h-[clamp(1rem,2vw,2.5rem)] w-[clamp(1rem,2vw,2.5rem)] -scale-x-100 text-neutral-800">
              <IconCloud />
            </div>
            <div>
              {choice.text}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
