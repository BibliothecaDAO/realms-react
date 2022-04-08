import { useQuery } from '@apollo/client';
import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
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
          <div className="flex justify-end mb-2 mr-1">
            <Button size="sm" onClick={() => toggleMenuType('realm')}>
              <Close />
            </Button>
          </div>
        </div>
        {data && data.realm && (
          <RealmCard realm={data!.realm} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
