import { useQuery } from '@apollo/client';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { useGetRealmQuery, useGetDesiegeQuery } from '@/generated/graphql';
import { getRealmQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { Data } from '@/types/index';
import { RealmCard } from '../cards/RealmCard';
import { BaseSideBar } from './BaseSideBar';

type Props = {
  id: string;
};

export const RealmSideBar = (props: Props) => {
  const { toggleMenuType, selectedMenuType } = useUIContext();

  const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={selectedMenuType === 'realm'}>
      <div className="top-0 bottom-0 right-0 w-full p-6 pt-8 overflow-auto lg:w-5/12 rounded-r-2xl">
        <div className="flex justify-end">
          <button
            className="right-0 z-10 p-2 transition-all rounded bg-white/20 hover:bg-white/70 shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.25)]"
            onClick={() => toggleMenuType('realm')}
          >
            <Close />
          </button>
        </div>
        {data && data.realm && (
          <RealmCard realm={data!.realm} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
