<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';
  import { useEngine } from './dialogue-context.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  let { children, class: className, ...rest }: Props = $props();

  const engine = useEngine();
</script>

<div
  class={cn(
    'absolute top-0 left-0 h-dvh w-screen transition duration-1000',
    engine.isShowContinueBtn ? 'z-0 opacity-0' : 'z-40 opacity-100',
    className
  )}
  {...rest}
>
  {@render children()}
</div>
