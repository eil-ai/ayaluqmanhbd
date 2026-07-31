<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.png';
  import { DialogueProvider } from '$components/ui/dialogue';

  let { children } = $props();

  const META_TITLE = 'Happy Birthday, Aya Luqman!';
  const META_DESC = 'A birthday wishes website made for Aya Luqman';
  const META_IMG = favicon;
</script>

<svelte:head>
  <title>{META_TITLE}</title>
  <meta name="description" content={META_DESC} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={META_TITLE} />
  <meta property="og:description" content={META_DESC} />
  <meta property="og:image" content={META_IMG} />
  <meta property="og:image:alt" content={META_IMG} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={META_TITLE} />
  <meta name="twitter:description" content={META_DESC} />
  <meta name="twitter:image" content={META_IMG} />
  <meta name="twitter:image:alt" content={META_IMG} />
  <link rel="icon" href={favicon} />
</svelte:head>

<DialogueProvider>
  {@render children()}
</DialogueProvider>
