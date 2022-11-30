import type { Dispatch, SetStateAction } from 'react';
import ReactMarkdown from 'react-markdown';
import type { LorePoiFragmentFragment } from '@/generated/graphql';
import { poiRemarkPlugin } from './helpers/POIRemarkPlugin';
import { LorePOI } from './LorePOI';

type LoreMarkdownRendererProps = {
  children: any;
  actions?: {
    setSelectedCryptId?: Dispatch<SetStateAction<string>>;
    setSelectedRealmId?: Dispatch<SetStateAction<string>>;
  };
};

export const LoreMarkdownRenderer = ({
  children,
  actions,
}: LoreMarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[poiRemarkPlugin]}
      components={{
        div: ({ node, ...props }) => {
          // TODO: it breaks build but it custom plugin for Remark - how to make it TypeScript?
          if (!(props as any).poiId) {
            return <div {...props}>{(node as any).children}</div>;
          }

          const newProps = {
            poiId: (props as any).poiId,
            assetId: (props as any).assetId,
          };

          return <LorePOI {...newProps} actions={actions} />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
