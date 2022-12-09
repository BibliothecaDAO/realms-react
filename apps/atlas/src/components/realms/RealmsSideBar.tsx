import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { RealmCard } from '@/components/realms/RealmCard';
import { sidebarClassNames } from '@/constants/ui';
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
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName={sidebarClassNames}>
      {isOpen && <RealmsQuickView realmId={realmId} onClose={onClose} />}
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
