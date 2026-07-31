import { SvelteMap } from 'svelte/reactivity';
import { on } from 'svelte/events';
import { Tween } from 'svelte/motion';
import { cubicInOut, cubicOut } from 'svelte/easing';
import { loadBasic } from '@tsparticles/basic';
import { tsParticles } from '@tsparticles/engine';
import { ASSETS, DIALOGUES, PARTICLES_CONFIG } from '$lib/constants';
import { AssetsLoader } from './assets.svelte';
import { QuoteManager } from './quotes.svelte';

export interface EngineProps {
  volume?: number;
}

export class Engine {
  quote = new QuoteManager();
  assets = new AssetsLoader();
  #events = new SvelteMap();

  videoIntro = $state<HTMLVideoElement>();
  videoLoop = $state<HTMLVideoElement>();
  audio = $state<HTMLAudioElement>();
  bgm = $state<HTMLAudioElement>();

  isPlaying = $state<boolean>(false);
  isAutoplay = $state<boolean>(false);
  isEnded = $state<boolean>(false);
  isReady = $state<boolean>(false);
  isShowContinueBtn = $state<boolean>(false);
  isRemoveLoadingScreen = $state<boolean>(false);
  #isParticlesLoaded = $state<boolean>(false);
  isShowParticles = $state<boolean>(false);
  isAllowToPlay = $state(false);
  isSkipLoading = $derived(this.assets.allCached);
  loadError = $state<string | null>(null);

  currentIndex = $state<number>(0);
  #defaultBgmVolume = $state<number>(0.2);
  #dialogues = $state<string[]>([]);

  loadingWidth: Tween<number>;
  #bgmAudio: Tween<number>;

  constructor({ volume }: EngineProps) {
    this.#defaultBgmVolume = volume || 0.2;

    this.#bgmAudio = new Tween(this.#defaultBgmVolume, {
      duration: 2000,
      easing: cubicOut
    });

    this.loadingWidth = new Tween(0, {
      duration: 200,
      easing: cubicInOut
    });

    $effect(() => {
      if (this.bgm) this.bgm.volume = this.#bgmAudio.current;
    });

    $effect(() => {
      this.loadingWidth.set(Math.round(this.assets.percent));
    });

    $effect(() => {
      if (this.assets.percent >= 100) this.quote.destroy();
    });

    $effect(() => {
      this.#loadParticles();

      const { items: assets } = this.assets;

      if (assets.length === ASSETS.length) {
        this.bgm = new Audio(assets.find((e) => e.type === 'bgm')?.src);
        this.videoIntro!.src = assets.find((e) => e.type === 'video-intro')!.src;
        this.videoLoop!.src = assets.find((e) => e.type === 'video-loop')!.src;
        this.videoLoop!.loop = true;

        this.#dialogues = assets
          .filter((e) => e.type === 'dialogue')
          // sort it by filename
          .sort((a, b) => {
            // filename: '1.wav', '2.wav', ...
            const numA = parseInt(a.filename!.split('.')[0], 10);
            const numB = parseInt(b.filename!.split('.')[0], 10);
            return numA - numB;
          })
          .map((item, index) => {
            // remap the filename to '1.wav', '2.wav', '3.wav', ...
            item.filename = `${index + 1}.wav`;
            return item.src;
          });

        this.isShowParticles = false;
      }
    });
  }

  /**
   * play the animation scenes.
   */
  play() {
    if (!this.isShowContinueBtn || !this.isAllowToPlay) return;

    if (!this.bgm || !this.audio || !this.videoIntro || !this.videoLoop) {
      throw new Error('All assets are not loaded yet.');
    }

    this.isRemoveLoadingScreen = true;
    this.isShowContinueBtn = false;

    this.bgm.loop = true;
    this.bgm.play();

    this.videoIntro.play();

    // play & pause to prevent error:
    // `NotAllowedError: play() can only be initiated
    // by a user gesture.`
    this.videoLoop.play();
    this.videoLoop.pause();

    this.videoLoop.currentTime = 0;
  }

  #loadParticles() {
    if (this.assets.totalSize > 0 && !this.#isParticlesLoaded) {
      loadBasic(tsParticles);
      tsParticles.load({ id: 'particles', options: PARTICLES_CONFIG });

      this.#isParticlesLoaded = true;
      this.isShowParticles = true;
    }
  }

  /**
   * toggle the autoplay mode
   */
  toggleAuto() {
    this.isAutoplay = !this.isAutoplay;

    if (DIALOGUES[this.currentIndex].choices.length) return;

    if (this.isAutoplay) {
      if (!this.audio!.ended) return;
      this.audio!.src = this.#dialogues[++this.currentIndex];
      this.isEnded = false;
      this.audio!.play();
    }
  }

  /**
   * play and cycle the dialogues
   */
  cycle() {
    if (this.isPlaying || !this.isReady) return;

    this.currentIndex = 0;
    this.audio = new Audio(this.#dialogues[this.currentIndex]);
    this.isPlaying = true;
    this.isEnded = false;

    this.registerAudioEvent();
    this.#bgmAudio.set(0.02);
    this.audio.volume = 0.35;

    setTimeout(() => {
      this.audio!.play();
    }, 1000);
  }

  /**
   * play the next dialogue manually (called by clicking the dialogue text bubble).
   */
  next() {
    if (!this.audio!.ended || DIALOGUES[this.currentIndex].choices.length) return;
    this.#setDialogue();
  }

  /**
   * select a choice and advance (called by dialogue choice buttons).
   */
  choice() {
    this.#setDialogue();
  }

  /**
   * set the dialogue to the next one.
   */
  #setDialogue() {
    if (this.currentIndex === DIALOGUES.length - 1) {
      this.isPlaying = false;
      this.#bgmAudio.set(this.#defaultBgmVolume);
      return;
    }

    this.audio!.src = this.#dialogues[++this.currentIndex];
    this.audio!.play();
    this.isEnded = false;
  }

  /**
   * preload all the assets.
   */
  async preload() {
    this.loadError = null;
    this.quote.start();
    try {
      await this.assets.preload(ASSETS);
    } catch (e) {
      this.loadError = 'Failed to load assets. Check your connection.';
      console.error('Preload error:', e);
    }
  }

  retry() {
    this.assets.reset();
    this.preload();
  }

  /**
   * all events registation will use this function.
   */
  #register(id: string, func: () => void) {
    this.#events.set(id, func);
  }

  /**
   * destroy all event listeners.
   */
  destroy() {
    if (!this.audio || !this.videoIntro) return;
    this.#events.clear();
  }

  /**
   * register the orientation change event listener,
   * this event will auto reload the page when the orientation changes.
   */
  registerOrientationEvent() {
    this.#register(
      'window:orientationchange',
      on(window, 'orientationchange', async () => {
        window.location.href = '/';
        await this.preload();
      })
    );
  }

  /**
   * registers event listeners for dialogue audio to detect when playback ends.
   * This handles transitions between audio sources, similar to a music player
   * that automatically advances to the next track when the current one finishes.
   */
  registerAudioEvent() {
    if (!this.audio || !this.videoIntro) return;
    this.#register(
      'audio:ended',
      on(this.audio, 'ended', () => {
        this.isEnded = true;

        if (!this.isAutoplay || DIALOGUES[this.currentIndex].choices.length) return;
        if (this.currentIndex === DIALOGUES.length - 1) {
          this.isPlaying = false;
          this.#bgmAudio.set(this.#defaultBgmVolume);
          this.destroy();
          return;
        }

        this.audio!.src = this.#dialogues[++this.currentIndex];

        setTimeout(() => {
          this.audio!.play();
        }, DIALOGUES[this.currentIndex].playAfter);
      })
    );
    this.#register(
      'audio:canplaythrough',
      on(this.audio, 'canplaythrough', () => (this.isEnded = false))
    );
  }

  /**
   * register the video (intro and loop) event listeners.
   */
  registerVideoEvent() {
    if (!this.videoIntro || !this.videoLoop) return;
    this.#register(
      'video:ended',
      on(this.videoIntro!, 'ended', () => {
        this.videoIntro!.oncanplay = null;
        this.videoIntro?.classList.remove('z-[1]');

        this.videoLoop?.classList.remove('z-[-1]');
        this.videoLoop?.classList.add('z-[1]');
        this.videoLoop?.play();

        setTimeout(() => {
          // use timeout for letting the looped video play first.
          this.videoIntro?.remove();
        }, 1000);

        this.isReady = true;
      })
    );
  }
}
