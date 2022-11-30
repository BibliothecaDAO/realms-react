import { useQuery } from '@apollo/client';

import { EmpirePanel } from '@/components/empire/EmpirePanel';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';
import { ArtBackground } from '../map/ArtBackground';
import AtlasSideBar from '../map/AtlasSideBar';

interface EmpireSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const EmpireSideBar = ({ isOpen, onClose }: EmpireSideBarProps) => {
  return (
    <AtlasSideBar
      isOpen={isOpen}
      position="left"
      containerClassName="w-full !p-0"
    >
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
    <>
      <BaseSideBarPanel position="left" className="bg-cover" onClose={onClose}>
        <RealmProvider>
          <CryptProvider>
            <LootProvider>
              <GaProvider>
                <EmpirePanel />
              </GaProvider>
            </LootProvider>
          </CryptProvider>
        </RealmProvider>
      </BaseSideBarPanel>
    </>
  );
};
