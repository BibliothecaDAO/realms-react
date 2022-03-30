import { useQuery } from '@apollo/client';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useSettlingContext } from '@/context/SettlingContext';
import type {
  QueryGetRealmsArgs,
  GetRealmsQuery,
  RealmTraitType,
} from '@/generated/graphql';
import { getRealmsQueryV2 } from '@/hooks/graphql/queries';

export function AllRealms() {
  const settling = useSettlingContext();

  const resourceFilters = settling.state.selectedResources.map((resource) => ({
    resourceType: { equals: resource },
  }));

  const traitsFilters = Object.keys(settling.state.traitsFilter)
    // Filter 0 entries
    .filter((key: string) => (settling.state.traitsFilter as any)[key])
    .map((key: string) => ({
      trait: {
        type: key as RealmTraitType,
        qty: { gte: (settling.state.traitsFilter as any)[key] },
      },
    }));

  const variables = {
    filter: {
      rarityRank: { gte: settling.state.rarityFilter.rarityRank },
      rarityScore: { gte: settling.state.rarityFilter.rarityScore },
      orderType:
        settling.state.selectedOrders.length > 0
          ? { in: [...settling.state.selectedOrders] }
          : undefined,
      AND: [...resourceFilters, ...traitsFilters],
    },
  };

  const { data } = useQuery<GetRealmsQuery, QueryGetRealmsArgs>(
    getRealmsQueryV2,
    { variables }
  );

  return (
    <div>
      <RealmsFilter />
      <RealmOverview realms={data?.getRealms} />
    </div>
  );
}
