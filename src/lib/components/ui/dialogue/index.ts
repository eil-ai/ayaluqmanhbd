import Provider from './dialogue-provider.svelte';
import Root from './dialogue-root.svelte';
import Content from './dialogue-content.svelte';
import Error from './dialogue-error.svelte';
import Scenes from './dialogue-scenes.svelte';
import Choice from './dialogue-choice.svelte';
import ToggleAuto from './dialogue-toggle-auto.svelte';
import Trigger from './dialogue-trigger.svelte';
import Text from './dialogue-text.svelte';
import { useEngine } from './dialogue-context.svelte';

export {
  Provider,
  Root,
  Content,
  Error,
  Scenes,
  Choice,
  ToggleAuto,
  Trigger,
  Text,
  //
  Provider as DialogueProvider,
  Root as DialogueRoot,
  Content as DialogueContent,
  Error as DialogueError,
  Scenes as DialogueScenes,
  Choice as DialogueChoice,
  ToggleAuto as DialogueToggleAuto,
  Trigger as DialogueTrigger,
  Text as DialogueText,
  //
  useEngine
};
