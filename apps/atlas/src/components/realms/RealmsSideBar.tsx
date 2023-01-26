import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { RealmCard } from '@/components/realms/RealmCard';
import { sidebarClassNames } from '@/constants/ui';
import { useUIContext } from '@/context/UIContext';
import { useGetRealmQuery } from '@/generated/graphql';
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
      ? 'mr-12 my-24'
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
      {/* {data && data.realm && (
        <RealmCard realm={data!.realm} loading={loading} />
      )}
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )} */}
      <RealmsSearch />
    </BaseSideBarPanel>
  );
}
