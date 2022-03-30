import { useQuery } from '@apollo/client';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useSettlingContext } from '@/context/SettlingContext';
import type { QueryGetRealmsArgs, GetRealmsQuery } from '@/generated/graphql';
import { getRealmsQueryV2 } from '@/hooks/graphql/queries';

export function FavouriteRealms() {
  const { state } = useSettlingContext();

  const variables = {
    filter: {
      realmId: { in: [...state.favouriteRealms] },
    },
  };

  const { data } = useQuery<GetRealmsQuery, QueryGetRealmsArgs>(
    getRealmsQueryV2,
    { variables }
  );

  return (
    <div>
      <RealmsFilter />
      <RealmOverview realms={data?.getRealms ?? []} />
    </div>
  );
}
