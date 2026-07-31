<script lang="ts">
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';

  const engine = useEngine();

  const show = $derived(engine.isShowParticles);
</script>

<div
  id="particles"
  class={cn(
    'absolute top-0 left-0 h-dvh w-screen',
    show ? 'opacity-100' : 'opacity-0',
    ' transition-opacity duration-2000'
  )}
></div>
