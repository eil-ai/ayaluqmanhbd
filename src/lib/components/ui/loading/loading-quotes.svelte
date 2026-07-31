<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';

  interface Props {
    accessorKey: 'quote' | 'name';
  }

  let { accessorKey }: Props = $props();

  const engine = useEngine();
</script>

<div
    class={cn(
      'relative flex items-center justify-center',
      accessorKey === 'quote' ? 'mb-[clamp(0.75rem,1.5vw,2rem)]' : ''
    )}
>
  {#key engine.quote.current}
    <div
      in:fly={{ y: 5, duration: 400, delay: 500 }}
      out:fly={{ y: -5, duration: 400 }}
        class={cn(
          'absolute w-[clamp(18rem,30vw,40rem)] text-center text-[clamp(0.75rem,0.9vw,1.125rem)]',
          accessorKey === 'quote'
            ? 'bottom-0 text-orange-300 italic'
            : 'top-[clamp(0.125rem,.1vw,.25rem)] font-bold text-orange-300'
        )}
    >
      <span>{engine.quote.current?.[accessorKey]}</span>
    </div>
  {/key}
</div>
