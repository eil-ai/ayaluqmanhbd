import { LOADING_QUOTES } from '$lib/constants';

export class QuoteManager {
  #currentQuote = $state<(typeof LOADING_QUOTES)[number] | undefined>(undefined);
  current = $derived(this.#currentQuote);
  #pool = $state([...LOADING_QUOTES]);
  #history: typeof LOADING_QUOTES = [];
  #timer: ReturnType<typeof setTimeout> | null = null;

  start() {
    if (this.#pool.length === 0) {
      this.#pool = [...this.#history];
      this.#history = [];
    }

    const index = Math.floor(Math.random() * this.#pool.length);
    const picked = this.#pool.splice(index, 1)[0];

    this.#currentQuote = picked;
    this.#history.push(picked);

    this.#timer = setTimeout(() => {
      this.start();
    }, picked.length);
  }

  destroy() {
    if (this.#timer) clearTimeout(this.#timer);
  }
}
