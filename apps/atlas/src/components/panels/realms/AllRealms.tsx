import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

export function AllRealms() {
  const realmCtx = useRealmContext();

  const resourceFilters = realmCtx.state.selectedResources.map((resource) => ({
    resourceType: { equals: resource },
  }));

  const traitsFilters = Object.keys(realmCtx.state.traitsFilter)
    // Filter 0 entries
    .filter((key: string) => (realmCtx.state.traitsFilter as any)[key])
    .map((key: string) => ({
      trait: {
        type: key as RealmTraitType,
        qty: { gte: (realmCtx.state.traitsFilter as any)[key] },
      },
    }));

  const variables = {
    filter: {
      rarityRank: { gte: realmCtx.state.rarityFilter.rarityRank },
      rarityScore: { gte: realmCtx.state.rarityFilter.rarityScore },
      orderType:
        realmCtx.state.selectedOrders.length > 0
          ? { in: [...realmCtx.state.selectedOrders] }
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
