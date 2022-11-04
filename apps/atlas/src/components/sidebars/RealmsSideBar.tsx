import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import { useGetRealmQuery } from '@/generated/graphql';
import { RealmCard } from '../../app/realm/(realmList)/RealmCard';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

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
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
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
  const { data, loading } = useGetRealmQuery({
    variables: {
      id: parseInt(realmId ?? '0'),
    },
  });

  return (
    <BaseSideBarPanel onClose={onClose}>
      {data && data.realm && (
        <RealmCard realm={data!.realm} loading={loading} />
      )}
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Castle className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}
    </BaseSideBarPanel>
  );
}
