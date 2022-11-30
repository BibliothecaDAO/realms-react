import { useQuery } from '@apollo/client';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import { getLootQuery } from '@/hooks/graphql/queries';
import type { LootData } from '@/types/index';
import AtlasSideBar from '../map/AtlasSideBar';
import { BaseSideBarPanel } from '../ui/sidebar/BaseSideBarPanel';
import { Loot } from './Loot';

interface LootSideBarProps {
  lootId: string;
  isOpen: boolean;
  onClose?: () => void;
}
export const LootSideBar = ({ lootId, isOpen, onClose }: LootSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <LootQuickView lootId={lootId} onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const LootQuickView = ({
  lootId,
  onClose,
}: {
  lootId: string;
  onClose?: () => void;
}) => {
  const { loading, data } = useQuery<LootData>(getLootQuery, {
    variables: { id: lootId ?? '' },
    skip: !lootId,
  });

  return (
    <BaseSideBarPanel onClose={onClose}>
      {data && data.bag && (
        <Loot flyto={false} loot={data!.bag} loading={loading} />
      )}
      {loading && (
        <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
          <Bag className="block w-20 fill-current" />
          <h2>Loading</h2>
        </div>
      )}
    </BaseSideBarPanel>
  );
};
