import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { useRealmContext } from '@/context/RealmContext';
import { useGetRealmsQuery } from '@/generated/graphql';

export function FavouriteRealms() {
  const { state } = useRealmContext();

  const variables = {
    filter: {
      realmId: { in: [...state.favouriteRealms] },
    },
  };

  const { data } = useGetRealmsQuery({ variables });

  return (
    <div>
      <RealmsFilter />
      <RealmOverviews realms={data?.getRealms ?? []} />
    </div>
  );
}
