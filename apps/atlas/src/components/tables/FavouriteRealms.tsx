import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useSettlingContext } from '@/context/SettlingContext';
import { useGetRealmsQuery } from '@/generated/graphql';

export function FavouriteRealms() {
  const { state } = useSettlingContext();

  const variables = {
    filter: {
      realmId: { in: [...state.favouriteRealms] },
    },
  };

  const { data } = useGetRealmsQuery({ variables });

  return (
    <div>
      <RealmsFilter />
      <RealmOverview realms={data?.getRealms ?? []} />
    </div>
  );
}
