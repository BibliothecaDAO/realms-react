import { useQuery } from '@apollo/client';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { getRealmQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { Data } from '@/types/index';
import { Realm } from '../realms/Realm';
import { BaseSideBar } from './BaseSideBar';

type Props = {
  id: number;
};

export const RealmSideBar = (props: Props) => {
  const { toggleMapMenu, mapMenu } = useUIContext();

  const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={mapMenu}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto sm:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleMapMenu}
        >
          <Menu />
        </button>
        {data && data.realm && <Realm realm={data!.realm} loading={loading} />}
      </div>
    </BaseSideBar>
  );
};
