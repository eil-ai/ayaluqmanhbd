<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { createEngine } from './dialogue-context.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children }: Props = $props();

  const engine = createEngine();

  onMount(async () => {
    engine.registerOrientationEvent();
    await engine.preload();
    engine.registerVideoEvent();
  });

  onDestroy(() => {
    engine.destroy();
  });
</script>

{@render children()}
