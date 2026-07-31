import { ASSETS_CACHE_KEY } from '$lib/constants';
import type { Asset, Progress } from '$types';
import { SvelteMap } from 'svelte/reactivity';

export class AssetsLoader {
  items = $state<Asset[]>([]);
  progress = $state<Progress[]>([]);
  #sizes = $state(new SvelteMap<string, number>());

  #cacheProgress = $state(new SvelteMap<string, number>());
  #networkProgress = $state(new SvelteMap<string, number>());
  #cacheAvailable = false;

  totalSize = $derived([...this.#sizes.values()].reduce((a, b) => a + b, 0));
  loaded = $derived(this.progress.reduce((acc, p) => acc + p.size, 0));
  percent = $derived(this.totalSize ? Math.min((this.loaded / this.totalSize) * 100, 100) : 0);
  allCached = $derived(this.items.length > 0 && this.items.every((a) => a.cached === true));

  cacheTotal = $derived(
    [...this.#sizes.entries()]
      .filter(
        ([src]) =>
          this.items.some((a) => a.src !== src && this.#cacheProgress.has(src)) ||
          this.#cacheProgress.has(src)
      )
      .reduce((acc, [src]) => acc + (this.#sizes.get(src) ?? 0), 0)
  );
  cacheLoaded = $derived([...this.#cacheProgress.values()].reduce((a, b) => a + b, 0));

  networkTotal = $derived(
    [...this.#sizes.entries()]
      .filter(([src]) => this.#networkProgress.has(src))
      .reduce((acc, [src]) => acc + (this.#sizes.get(src) ?? 0), 0)
  );

  networkLoaded = $derived([...this.#networkProgress.values()].reduce((a, b) => a + b, 0));

  async preload(assets: Asset[]): Promise<void> {
    await this.#fetchHeads(assets);
    await Promise.all(assets.map((asset) => this.#download(asset)));
  }

  reset(): void {
    this.items = [];
    this.progress = [];
    this.#sizes = new SvelteMap();
    this.#cacheProgress = new SvelteMap();
    this.#networkProgress = new SvelteMap();
  }

  async #fetchHeads(assets: Asset[]): Promise<void> {
    let cache: Cache | null = null;
    try {
      cache = await caches.open(ASSETS_CACHE_KEY);
      this.#cacheAvailable = true;
    } catch {
      this.#cacheAvailable = false;
    }

    await Promise.all(
      assets.map(async (asset) => {
        try {
          if (cache) {
            const cached = await cache.match(asset.src);
            if (cached) {
              const size = (await cached.blob()).size;
              this.#sizes = new SvelteMap([...this.#sizes, [asset.src, size]]);
              return;
            }
          }
        } catch {
          // cache match failed, fall through to HEAD request
        }

        try {
          const res = await fetch(asset.src, { method: 'HEAD' });
          const size = parseInt(res.headers.get('Content-Length') ?? '0') || 0;
          this.#sizes = new SvelteMap([...this.#sizes, [asset.src, size]]);
        } catch {
          this.#sizes = new SvelteMap([...this.#sizes, [asset.src, 0]]);
        }
      })
    );
  }

  async #download(asset: Asset): Promise<void> {
    const filename = decodeURIComponent(asset.src).split('/').at(-1) ?? 'unknown';

    if (this.#cacheAvailable) {
      try {
        const cache = await caches.open(ASSETS_CACHE_KEY);
        const cached = await cache.match(asset.src);
        if (cached) {
          const blob = await cached.blob();
          const size = this.#sizes.get(asset.src) ?? blob.size;

          this.#cacheProgress = new SvelteMap([...this.#cacheProgress, [asset.src, size]]);
          this.progress = upsertProgress(this.progress, { filename, size });
          this.items.push({ ...asset, filename, src: URL.createObjectURL(blob), cached: true });
          return;
        }
      } catch {
        // cache unavailable, fall through to network download
      }
    }

    this.#networkProgress = new SvelteMap([...this.#networkProgress, [asset.src, 0]]);

    const res = await fetch(asset.src);
    if (!res.body) {
      const blob = new Blob();
      this.items.push({ ...asset, filename, src: URL.createObjectURL(blob), cached: false });
      return;
    }

    const reader = res.body.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.byteLength;

      this.#networkProgress = new SvelteMap([...this.#networkProgress, [asset.src, loaded]]);
      this.progress = upsertProgress(this.progress, { filename, size: loaded });
    }

    const blob = new Blob(chunks);

    if (this.#cacheAvailable) {
      try {
        const cache = await caches.open(ASSETS_CACHE_KEY);
        await cache.put(
          asset.src,
          new Response(blob, {
            headers: { 'Content-Length': String(blob.size) }
          })
        );
      } catch {
        // cache put failed, non-critical
      }
    }

    this.#sizes = new SvelteMap([...this.#sizes, [asset.src, blob.size]]);
    this.#networkProgress = new SvelteMap([...this.#networkProgress, [asset.src, blob.size]]);
    this.items.push({ ...asset, filename, src: URL.createObjectURL(blob), cached: false });
  }
}

function upsertProgress(array: Progress[], newItem: Progress): Progress[] {
  const next = [...array];
  const i = next.findIndex((p) => p.filename === newItem.filename);
  if (i === -1) next.push(newItem);
  else next[i] = { ...next[i], ...newItem };
  return next;
}
