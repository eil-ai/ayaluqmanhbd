<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';

  const engine = useEngine();
</script>

<div
  class={cn(
    'absolute top-0 left-0 flex h-dvh w-screen flex-col items-center',
    'justify-center text-blue-300',
    engine.isRemoveLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'
  )}
>
  {#if engine.isShowContinueBtn}
    <div
      transition:fade|global={{ duration: 500, delay: 100 }}
      onintroend={() => (engine.isAllowToPlay = true)}
      class="animate-pulse text-center text-[clamp(1rem,2vw,2.5rem)] font-semibold uppercase"
    >
      click anywhere to continue
    </div>
  {/if}
</div>
