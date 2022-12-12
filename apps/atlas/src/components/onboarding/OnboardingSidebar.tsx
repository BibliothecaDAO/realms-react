import { useQuery } from '@apollo/client';

import { EmpirePanel } from '@/components/empire/EmpirePanel';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';
import { ArtBackground } from '../map/ArtBackground';
import AtlasSideBar from '../map/AtlasSideBar';
import { Onboarding } from './Onboarding';

interface EmpireSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const OnboardingSidebar = ({ isOpen, onClose }: EmpireSideBarProps) => {
  return (
    <AtlasSideBar
      isOpen={isOpen}
      position="left"
      containerClassName="w-full !p-0"
      isTransparent={true}
    >
      {isOpen && <EmpireQuickView onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const EmpireQuickView = ({ onClose }: { onClose?: () => void }) => {
  return (
    <>
      <BaseSideBarPanel position="left" className="bg-cover">
        <RealmProvider>
          <CryptProvider>
            <LootProvider>
              <GaProvider>
                <Onboarding />
              </GaProvider>
            </LootProvider>
          </CryptProvider>
        </RealmProvider>
      </BaseSideBarPanel>
    </>
  );
};
