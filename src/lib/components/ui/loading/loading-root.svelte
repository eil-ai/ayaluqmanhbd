<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';

  interface Props {
    particles: Snippet;
    children: Snippet;
  }

  let { particles, children }: Props = $props();

  const engine = useEngine();
</script>

<button
  onclick={() => engine.play()}
  class={cn(
    'absolute top-0 left-0 h-dvh w-screen bg-neutral-800 transition duration-1000',
    engine.isRemoveLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'
  )}
>
  {@render particles()}
  <div class="relative flex h-dvh justify-center p-[clamp(0.5rem,1vw,1.25rem)]">
    {@render children()}
  </div>
</button>
