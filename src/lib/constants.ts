import type { Asset } from '$types';
import type { SingleOrMultiple, RecursivePartial, IOptions } from '@tsparticles/engine';

export const ASSETS_CACHE_KEY = 'assets/v1';

// dialogue assets data.
export const DIALOGUES = [
  {
    text: 'دكتورة آية! أليس اليوم عيد ميلادك؟',
    audio: '/audio/1.mp3',
    image: '/portraits/1.png',
    playAfter: 0,
    choices: [
      {
        text: 'نعم...',
        selected: false
      }
    ]
  },
  {
    text: 'أنتي تعرفين أن اليوم هو أجمل يوم لطيف أليس كذلك يادكتورة؟',
    audio: '/audio/2.mp3',
    image: '/portraits/2.png',
    playAfter: 300,
    choices: [
      {
        text: 'هممممم...ماذا هناك ياأليس؟',
        selected: false
      }
    ]
  },
  {
    text: 'دكتورة آية! هل أصدقائك موجودين في يوم عيد ميلادك اللطيف؟',
    audio: '/audio/3.mp3',
    image: '/portraits/3.png',
    playAfter: 500,
    choices: [
      {
        text: 'أعتقد ذلك...',
        selected: false
      },
      {
        text: 'ربما...'
      }
    ]
  },
  {
    text: 'أنا ايضاً هنا يادكتورة آية!',
    audio: '/audio/4.mp3',
    image: '/portraits/4.png',
    playAfter: 300,
    choices: []
  },
  {
    text: 'آه! كدتُ أنسى!',
    audio: '/audio/5.mp3',
    image: '/portraits/5.png',
    playAfter: 600,
    choices: []
  },
  {
    text: 'دكتورة آية! عيد ميلاد سعيد يا ألطف دكتورة بالعالم!!',
    audio: '/audio/6.mp3',
    image: '/portraits/6.png',
    playAfter: 500,
    choices: []
  },
  {
    text: 'أتمنى أن تظلي بصحة جيدة دائماً وموفقة في كل أهدافك في مسيرتك المهنية يادكتورة آية! وأن تحققي كل أهدافك قريباً جداً مثل أن تذهبي الى زحل أو المريخ!',
    audio: '/audio/7.mp3',
    image: '/portraits/7.png',
    playAfter: 500,
    choices: []
  },
  {
    text: 'وبالطبع! آمل أن تنجحي دائماً بكل شي!!!',
    audio: '/audio/8.mp3',
    image: '/portraits/8.png',
    playAfter: 500,
    choices: []
  },
  {
    text: 'هذا كل شيء يا دكتورة آية! أعتذر، لا أعرف ماذا أقول أيضاً...',
    audio: '/audio/9.mp3',
    image: '/portraits/9.png',
    playAfter: 500,
    choices: [
      {
        text: 'واو! شكراً على تهنئتي بعيد ميلادي!',
        selected: false
      }
    ]
  },
  {
    text: 'رائع!! لنلعب معاً ياآية ياأحلى دكتورة أسنان بالتاريخ طوال اليوم!',
    audio: '/audio/10.mp3',
    image: '/portraits/10.png',
    playAfter: 500,
    choices: []
  }
];

// define all assets.
export const ASSETS: Asset[] = [
  {
    type: 'video-intro',
    src: '/video/Tendou Arisu Maid Live2D - Intro.webm'
  },
  {
    type: 'video-loop',
    src: '/video/Tendou Arisu Maid Live2D - Loop.webm'
  },
  {
    type: 'bgm',
    src: '/audio/Koi is Love BGM - Compressed.flac'
  },
  // merge dialogue audio assets.
  ...DIALOGUES.flatMap((e): Asset => ({ type: 'dialogue', src: e.audio }))
];

export const PARTICLES_CONFIG = {
  particles: {
    number: {
      value: 29,
      density: {
        enable: true,
        value_area: 6573.989449548644
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 3
      },
      image: {
        src: '',
        width: 0,
        height: 0
      }
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        size_min: 4.87246327380807,
        sync: false
      }
    },
    line_linked: {
      enable: false,
      distance: 0,
      color: '#ffffff',
      opacity: 0,
      width: 0
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
} as unknown as SingleOrMultiple<RecursivePartial<IOptions>>;

/**
 * @description the loading quotes that will be displayed on the loading screen.
 * @property {object} quote[] - the array of objects that contain the quote informations.
 * @property {string} quote.name - the name of the person who said the quote.
 * @property {string} quote.quote - the quote itself.
 * @property {number} quote.length - to read the quote in milliseconds
 */
export const LOADING_QUOTES = [
  {
    name: 'some one!',
    quote: `Even if it's a story where the ending is already decided... we can still choose how we get there. That's why I won't give up!`,
    length: 7500
  },
  {
    name: 'some one!',
    quote: `It doesn't matter how many times we have to start over. As long as we don't stop, we haven't lost.`,
    length: 6500
  },
  {
    name: 'some one',
    quote: `Even if everything is vanity, that is no reason to abandon hope. We struggle because it is fleeting.`,
    length: 6000
  },
  {
    name: 'some one',
    quote: `If the path ahead is blocked, we just have to find a way around it. Or just break through. Giving up isn't an option.`,
    length: 7000
  },
  {
    name: 'some one',
    quote: `Even if I'm scared, even if I want to hide in my locker... if it's for my friends, I'll find the courage to step out.`,
    length: 8000
  },
  {
    name: 'some one',
    quote: `To be an adult is to take responsibility for the world you have created. That is the weight of your choices, Sensei.`,
    length: 7000
  },
  {
    name: 'some one',
    quote: `Our pasts don't have to define our futures. We can choose to become something more than what we were taught to be.`,
    length: 7000
  },
  {
    name: 'some one',
    quote: `Moving forward is tiring, and it hurts sometimes. But if you stop, you'll never see the sunrise. So, let's keep walking, okay?`,
    length: 8000
  },
  {
    name: 'some one',
    quote: `Efficiency is important, but it is the 'irrational' will of the students that truly changes the world.`,
    length: 6000
  },
  {
    name: 'some one',
    quote: `Life is like an RPG! Even if you fail a quest, you gain experience points. As long as you don't press 'Delete Save,' you can always try again!`,
    length: 9000
  },
  {
    name: 'some one',
    quote: `If you're not having fun, what's the point? Let's turn this disaster into the best game ever!`,
    length: 5500
  },
  {
    name: 'some one',
    quote: `Passion is the secret ingredient to any masterpiece. Without the drive to seek perfection, one is simply existing, not living.`,
    length: 7000
  },
  {
    name: 'some one',
    quote: `Sensei, don't worry! Even if things look dark, a miracle is just a heartbeat away. I'll be right here to help you!`,
    length: 7000
  },
  {
    name: 'some one',
    quote: `Even if the stars are far away and hard to see, they are always there. You just have to keep looking up.`,
    length: 6500
  },
  {
    name: 'some one',
    quote: `Sometimes, the most 'proper' thing you can do is stop caring about what others think and just be true to yourself.`,
    length: 7000
  }
];
