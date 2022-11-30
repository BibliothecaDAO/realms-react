import { useState } from 'react';
import { CryptSideBar } from '@/components/crypts/CryptsSideBar';
import { RealmSideBar } from '@/components/realms/RealmsSideBar';
import { CryptProvider } from '@/context/CryptContext';
import { RealmProvider } from '@/context/RealmContext';
import type {
  LoreEntityFragmentFragment,
  LorePoiFragmentFragment,
} from '@/generated/graphql';
import { useGetLorePoisQuery } from '@/generated/graphql';
import { LoreMarkdownRenderer } from './LoreMarkdownRenderer';

type LoreScrollEntityProps = {
  placeholder?: string;
  entity: LoreEntityFragmentFragment;
};

export const LoreScrollEntity = ({ entity }) => {
  // const { data: pois, loading: poisLoading } = useGetLorePoisQuery();
  const [selectedRealmId, setSelectedRealmId] = useState('');
  const [selectedCryptId, setSelectedCryptId] = useState('');

  console.log('loreasd');

  if (entity.revisions.length === 0) {
    return <div>No revision found</div>;
  }

  return (
    <RealmProvider>
      <CryptProvider>
        <>
          {entity.revisions[0].title ? (
            <h2 className={``}>{entity.revisions[0].title}</h2>
          ) : null}

          <LoreMarkdownRenderer
            actions={{ setSelectedCryptId, setSelectedRealmId }}
          >
            {entity.revisions[0].markdown}
          </LoreMarkdownRenderer>

          <CryptSideBar
            cryptId={selectedCryptId}
            isOpen={!!selectedCryptId}
            onClose={() => {
              setSelectedCryptId('');
            }}
          />

          {/* <RealmsPr */}
          <RealmSideBar
            realmId={selectedRealmId}
            isOpen={!!selectedRealmId}
            onClose={() => {
              setSelectedRealmId('');
            }}
          />
        </>
      </CryptProvider>
    </RealmProvider>
  );
};
