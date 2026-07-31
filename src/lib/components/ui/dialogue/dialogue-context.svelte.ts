import { getContext, setContext } from 'svelte';
import { Engine, type EngineProps } from '$hooks/engine.svelte';

const SYMBOL_KEY = 'kz-dialogue';

/**
 * Instantiates a new `Engine` instance and sets it in the context.
 *
 * @param props The constructor props for the `Engine` class.
 * @returns  The `Engine` instance.
 */
export function createEngine(props?: EngineProps): Engine {
  return setContext(Symbol.for(SYMBOL_KEY), new Engine(props || {}));
}

/**
 * Retrieves the `Engine` instance from the context. This is a class instance,
 * so you cannot destructure it.
 * @returns The `Engine` instance.
 */
export function useEngine(): Engine {
  return getContext(Symbol.for(SYMBOL_KEY));
}
