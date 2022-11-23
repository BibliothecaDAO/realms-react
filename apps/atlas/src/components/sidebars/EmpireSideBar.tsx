import { useQuery } from '@apollo/client';

import { AccountPanel } from '@/components/panels/AccountPanel';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

interface EmpireSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const EmpireSideBar = ({ isOpen, onClose }: EmpireSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} position="left" containerClassName="w-full">
      {isOpen && <EmpireQuickView onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const EmpireQuickView = ({ onClose }: { onClose?: () => void }) => {
  /* const { loading, data } = useQuery<LootData>(getLootQuery, {
    variables: { id: lootId ?? '' },
    skip: !lootId,
  }); */

  return (
    <BaseSideBarPanel position="left" onClose={onClose}>
      <RealmProvider>
        <CryptProvider>
          <LootProvider>
            <GaProvider>
              <AccountPanel />
            </GaProvider>
          </LootProvider>
        </CryptProvider>
      </RealmProvider>
    </BaseSideBarPanel>
  );
};
