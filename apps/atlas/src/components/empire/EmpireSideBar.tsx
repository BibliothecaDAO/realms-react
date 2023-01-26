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
      containerClassName="right-0 top-0 left-0 bottom-0 my-20 ml-20 mr-8 !p-0"
      overflowHidden={true}
      onClose={onClose}
    >
      <EmpireQuickView />
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
      <BaseSideBarPanel position="left" className="bg-cover !flex-row !pt-0">
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
