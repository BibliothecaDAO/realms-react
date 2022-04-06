import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

export function AllRealms() {
  const { state } = useRealmContext();

  const resourceFilters = state.selectedResources.map((resource) => ({
    resourceType: { equals: resource },
  }));

  const traitsFilters = Object.keys(state.traitsFilter)
    // Filter 0 entries
    .filter((key: string) => (state.traitsFilter as any)[key])
    .map((key: string) => ({
      trait: {
        type: key as RealmTraitType,
        qty: { gte: (state.traitsFilter as any)[key] },
      },
    }));

  const variables = {
    filter: state.searchIdFilter
      ? { realmId: { equals: parseInt(state.searchIdFilter) } }
      : {
          rarityRank: { gte: state.rarityFilter.rarityRank },
          rarityScore: { gte: state.rarityFilter.rarityScore },
          orderType:
            state.selectedOrders.length > 0
              ? { in: [...state.selectedOrders] }
              : undefined,
          AND: [...resourceFilters, ...traitsFilters],
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
