import ReactMarkdown from 'react-markdown';
import type { LorePoiFragmentFragment } from '@/generated/graphql';
import { poiRemarkPlugin } from './helpers/POIRemarkPlugin';
import { LorePOI } from './LorePOI';

type LoreMarkdownRendererProps = {
  children: any;
  pois?: { [index: string]: LorePoiFragmentFragment };
  poisLoading?: boolean | undefined;
};

export const LoreMarkdownRenderer = ({
  children,
  pois,
  poisLoading,
}: LoreMarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[poiRemarkPlugin]}
      components={{
        div: ({ node, ...props }) => {
          if (!props.poiId) {
            return <div {...props}>{node.children}</div>;
          }

          return <LorePOI {...props} pois={pois} poisLoading={poisLoading} />;
        },
      }}
      className={`prose prose-stone prose-sm text-2xl brightness-200`}
    >
      {children}
    </ReactMarkdown>
  );
};
