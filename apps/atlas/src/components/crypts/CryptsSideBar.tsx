import { useQuery } from '@apollo/client';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { Crypt } from '@/components/crypts/CryptCard';
import { getCryptQuery } from '@/hooks/graphql/queries';
import type { CryptData } from '@/types/index';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/BaseSideBarPanel';

interface CryptSideBarProps {
  cryptId: string;
  isOpen: boolean;
  onClose?: () => void;
}
export const CryptSideBar = ({
  cryptId,
  isOpen,
  onClose,
}: CryptSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <CryptsQuickView cryptId={cryptId} onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const CryptsQuickView = ({
  cryptId,
  onClose,
}: {
  cryptId: string;
  onClose?: () => void;
}) => {
  const { loading, error, data } = useQuery<CryptData>(getCryptQuery, {
    variables: { id: cryptId ?? '' },
    skip: !cryptId,
  });

  return (
    <BaseSideBarPanel onClose={onClose}>
      {data && data.dungeon && (
        <Crypt flyto={false} crypt={data!.dungeon} loading={loading} />
      )}
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Danger className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}
    </BaseSideBarPanel>
  );
};
