import { useQuery } from '@apollo/client';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { useGetRealmQuery, useGetDesiegeQuery } from '@/generated/graphql';
import { getRealmQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { Data } from '@/types/index';
import { Realm } from '../cards/Realm';
import { BaseSideBar } from './BaseSideBar';

type Props = {
  id: string;
};

export const RealmSideBar = (props: Props) => {
  const { toggleMenuType, selectedMenuType } = useUIContext();

  const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: props.id.toString() },
  });
  const { data: IndexerData } = useGetRealmQuery({
    variables: {
      id: parseInt(props.id), // value for 'id'
    },
  });
  return (
    <BaseSideBar open={selectedMenuType === 'realm'}>
      <div className="top-0 bottom-0 right-0 w-full h-screen p-6 pt-10 overflow-auto sm:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={() => toggleMenuType('realm')}
        >
          <Menu />
        </button>
        {data && data.realm && <Realm realm={data!.realm} loading={loading} />}
      </div>
    </BaseSideBar>
  );
};
