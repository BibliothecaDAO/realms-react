import { Tabs, Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useEffect, useMemo, useState } from 'react';
// import { RealmsFilter } from '@/components/filters/RealmsFilter';
import ReactMarkdown from 'react-markdown';
import { LoreEntitiesOverview } from '@/components/tables/LoreEntitiesOverview';
import { useRealmContext } from '@/context/RealmContext';
import type { LoreEntityFragmentFragment } from '@/generated/graphql';
import {
  useGetLoreEntityQuery,
  RealmTraitType,
  useGetLoreEntitiesQuery,
  useGetRealmsQuery,
} from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { LoreMarkdownRenderer } from '../modules/Lore/LoreMarkdownRenderer';
import { LorePOI } from '../modules/Lore/LorePOI';
import { LoreScrollEntity } from '../modules/Lore/LoreScrollEntity';
import { BaseModal } from './BaseModal';

export const LoreEntityModal = ({ entityId }) => {
  const { data, loading } = useGetLoreEntityQuery({
    variables: {
      id: entityId,
    },
  });

  const loreEntity = data?.getLoreEntity;

  return (
    <div className={``}>
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}

      {loreEntity ? <LoreScrollEntity entity={loreEntity} /> : null}
    </div>
  );
};

// Temporary
