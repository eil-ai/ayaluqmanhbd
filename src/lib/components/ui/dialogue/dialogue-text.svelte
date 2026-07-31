<script lang="ts">
  import { DIALOGUES } from '$lib/constants';
  import { fly } from 'svelte/transition';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();

  function calculateAge(birthDate: string | Date) {
    const today = new Date();
    const birth = new Date(birthDate);
    const monthDifference = today.getMonth() - birth.getMonth();
    let age = today.getFullYear() - birth.getFullYear();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  const dialogue = $derived.by(() => {
    const text = DIALOGUES[engine.currentIndex].text;
    const age = calculateAge('2001-07-01'); // 01 July 2001 (YYYY-MM-DD)
    return text.replace('{age}', age.toString());
  });

  const currentImage = $derived(DIALOGUES[engine.currentIndex].image);

  let imageError = $state(false);

  $effect(() => {
    imageError = false;
  });
</script>

<div class="absolute top-0 left-0 z-2 h-dvh w-screen">
  <div class="flex h-dvh flex-col items-center justify-center max-sm:justify-end max-sm:pb-[5vh]">
    {#if engine.isPlaying && engine.currentIndex !== DIALOGUES.length}
      <div
        class="relative flex w-full max-w-[min(88vw,42rem)]
        justify-center gap-x-[clamp(0.375rem,.6vw,.75rem)] py-[clamp(0.25rem,.5vw,.75rem)]
        md:max-w-[30vw]"
      >
        {#key engine.currentIndex}
          {#if currentImage && !imageError}
            <div
              in:fly={{ y: 10, duration: 300 }}
              class="portrait-frame flex shrink-0 items-end"
            >
              <div
                class="relative overflow-hidden rounded-[clamp(0.5rem,1vw,1.5rem)]
                border-[clamp(0.15rem,.2vw,.3rem)] border-white/60
                bg-white/10 shadow-[0_0_clamp(0.5rem,1vw,1.5rem)_rgb(255_255_255/0.15)]
                h-[clamp(3.5rem,8vw,11rem)] w-[clamp(3.5rem,8vw,11rem)]
                max-sm:h-[clamp(4.5rem,16vw,8rem)] max-sm:w-[clamp(4.5rem,16vw,8rem)]"
              >
                <img
                  src={currentImage}
                  alt="portrait"
                  class="h-full w-full object-cover"
                  onerror={() => (imageError = true)}
                />
              </div>
            </div>
          {/if}
        {/key}
        <button
          onclick={() => engine.next()}
          class="relative block w-full min-h-[1vh] min-w-0 rounded-[clamp(0.5rem,1vw,1.25rem)]
          bg-white/70 px-[clamp(0.5rem,1vw,1.25rem)] py-[clamp(0.25rem,.5vw,.75rem)]
          text-[clamp(0.875rem,1.2vw,1.5rem)] text-neutral-800
          before:absolute before:left-[50%]
          before:h-0 before:w-0 before:rotate-90
          before:border-t-[clamp(0.375rem,.6vw,.75rem)]
          before:border-r-[clamp(0.5rem,.7vw,.875rem)]
          before:border-b-[clamp(0.375rem,.6vw,.75rem)]
          before:border-t-transparent before:border-r-[rgb(255_255_255/0.7)]
          before:border-b-transparent before:bg-transparent
          before:top-[clamp(-0.55rem,-0.8933vw,-0.25rem)]
          before:content-['']
"
        >
          <div class="text-start font-semibold">
            {dialogue}
          </div>
          {#if engine.isEnded}
            <div class="mt-[clamp(0.5rem,1vw,1.25rem)] flex justify-end">
              <div
                class="mr-[clamp(0.25rem,.5vw,.75rem)] mb-[clamp(0.25rem,.5vw,.75rem)] h-0 w-0
                animate-bounce border-x-[clamp(0.25rem,.5vw,.75rem)]
                border-t-[clamp(0.375rem,.7vw,.875rem)] border-solid border-x-transparent
                border-t-sky-500"
              ></div>
            </div>
          {/if}
        </button>
      </div>
    {/if}
  </div>
</div>
