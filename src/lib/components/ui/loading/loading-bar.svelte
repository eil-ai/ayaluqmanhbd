<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { ASSETS } from '$lib/constants';
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';
  import IconWorldDownload from '$components/icons/IconWorldDownload.svelte';
  import IconDeviceFloppyFilled from '$components/icons/IconDeviceFloppyFilled.svelte';

  interface Props {
    quote: Snippet;
    author: Snippet;
  }

  let { quote, author }: Props = $props();

  const engine = useEngine();

  const loaded = $derived(engine.assets.items.length !== ASSETS.length);

  const formatSize = (bytes: number, decimals: number = 2) => {
    // convert Bytes to specific sizes format.
    // ref: https://stackoverflow.com/a/18650828

    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
</script>

<div
  class={cn(
    'absolute top-0 left-0 flex h-dvh w-screen flex-col items-center',
    'justify-center text-blue-300',
    engine.isRemoveLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'
  )}
>
  {#if loaded}
    <div
      transition:fade|global={{ duration: 200 }}
      onoutroend={() => (engine.isShowContinueBtn = true)}
      class="space-y-[clamp(0.25rem,.5vw,.75rem)]"
    >
      <div class="flex w-screen justify-center">
        <div class="flex flex-col">
          <div class="relative w-[clamp(18rem,40vw,50rem)] text-[clamp(0.75rem,1vw,1.25rem)] font-semibold">
            {@render quote()}
            <div
              class="h-[clamp(0.75rem,1.5vw,2rem)] overflow-hidden rounded-[clamp(0.15rem,0.313vw,0.5rem)]
              border-[0.052vw] border-blue-300"
            >
              <div
                class="ransition-[width] z-10 flex h-full w-0 items-center justify-end
                bg-blue-300 ease-linear"
                style="width: {engine.loadingWidth.current}%"
              >
                <span class="mr-1 text-[clamp(0.625rem,1vw,1.125rem)] font-bold text-black">
                  {Math.round(engine.loadingWidth.current)}%
                </span>
              </div>
              <div class="-z-10 w-full"></div>
            </div>
            <div class="mt-[clamp(0.15rem,.3vw,.5rem)] flex items-end justify-between">
              {#if engine.assets.cacheLoaded === 0 && engine.assets.networkLoaded === 0}
                {#if engine.loadError}
                  <div class="flex w-full flex-col items-center gap-[clamp(0.5rem,1vw,1.5rem)]">
                    <div class="text-red-300">Failed to load assets</div>
                    <button
                      onclick={() => engine.retry()}
                      class="rounded-[clamp(0.25rem,.5vw,.75rem)] bg-blue-500 px-[clamp(0.5rem,1vw,1.25rem)]
                      py-[clamp(0.25rem,.5vw,.75rem)] text-[clamp(0.75rem,1vw,1.25rem)] font-bold
                      text-white transition hover:bg-blue-400"
                    >
                      Retry
                    </button>
                  </div>
                {:else}
                  <div class="flex w-full animate-pulse items-center justify-center">
                    Preparing engine...
                  </div>
                {/if}
              {/if}

              {#if engine.assets.networkLoaded > 0}
                <div in:fly={{ duration: 500 }} class="flex items-center gap-x-[clamp(0.125rem,.1vw,.25rem)]">
                  <IconWorldDownload />
                  <div>
                    Network: {formatSize(engine.assets.networkLoaded)} / {formatSize(
                      engine.assets.networkTotal
                    )}
                  </div>
                </div>
              {/if}

              {#if engine.assets.cacheLoaded > 0}
                <div in:fly={{ duration: 500 }} class="flex items-center gap-x-[clamp(0.125rem,.1vw,.25rem)]">
                  <IconDeviceFloppyFilled />
                  <div>
                    Cache: {formatSize(engine.assets.cacheLoaded)} / {formatSize(
                      engine.assets.cacheTotal
                    )}
                  </div>
                </div>
              {/if}
            </div>
            {@render author()}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
