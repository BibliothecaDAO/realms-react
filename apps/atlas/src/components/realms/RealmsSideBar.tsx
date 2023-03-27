import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { sidebarClassNames } from '@/constants/ui';
import { useUIContext } from '@/context/UIContext';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';
import { RealmsSearch } from './RealmsSearch';

interface RealmSideBarProps {
  realmId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const RealmSideBar = ({
  realmId,
  isOpen,
  onClose,
}: RealmSideBarProps) => {
  const {
    empireSidebar,
    resourcesListSidebar,
    loreSidebar,
    leaderboardSidebar,
  } = useUIContext();

  const offsetClasses = useMemo(() => {
    return empireSidebar ||
      resourcesListSidebar ||
      loreSidebar ||
      leaderboardSidebar
      ? 'lg:mr-12 lg:my-24'
      : '';
  }, [empireSidebar, resourcesListSidebar]);

  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={twMerge(sidebarClassNames, offsetClasses, 'z-30')}
      onClose={onClose}
    >
      {isOpen && <RealmsQuickView realmId={realmId} />}
    </AtlasSideBar>
  );
};

function RealmsQuickView({
  realmId,
  onClose,
}: {
  realmId: string;
  onClose?: () => void;
}) {
  return (
    <BaseSideBarPanel onClose={onClose}>
      <RealmsSearch />
    </BaseSideBarPanel>
  );
}
