import { useQuery } from '@apollo/client';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { getLootQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { LootData } from '@/types/index';
import { Loot } from '../cards/Loot';
import { BaseSideBar } from './BaseSideBar';

type Props = {
  id: string;
};

export const LootSideBar = (props: Props) => {
  const { toggleMenuType, selectedMenuType } = useUIContext();

  const { loading, error, data } = useQuery<LootData>(getLootQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={selectedMenuType === 'loot'}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto lg:w-5/12 rounded-r-2xl">
        <button
          className="right-0 z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={() => toggleMenuType('loot')}
        >
          <Close />
        </button>
        {data && data.bag && (
          <Loot flyto={false} loot={data!.bag} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
