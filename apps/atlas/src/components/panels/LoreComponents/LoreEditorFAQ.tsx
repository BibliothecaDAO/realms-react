import type {
  LoreEntityFragmentFragment,
  LorePoiFragmentFragment,
} from '@/generated/graphql';
import { useGetLorePoisQuery } from '@/generated/graphql';
import { LoreMarkdownRenderer } from './LoreMarkdownRenderer';

export const LoreEditorFAQ = () => {
  return (
    <>
      <div
        className={
          'p-4 text-xl prose prose-stone prose-sm brightness-200 mt-2 mb-2'
        }
      >
        <h1>Lore Editor FAQ</h1>
        The Lore Editor uses Markdown.
        <h2>How to use Linking</h2>
        There is a special syntax to linking Lootverse entities (such as
        Realms): {'${1000, 100}'}.
      </div>
    </>
  );
};
