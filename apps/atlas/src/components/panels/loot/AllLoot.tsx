import { useQuery } from '@apollo/client';
import { LootFilters } from '@/components/filters/LootFilters';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
import type { Loot } from '@/types/index';

export function AllLoot() {
  const { state } = useLootContext();

  const { loading, error, data, fetchMore } = useQuery<{ bags: Loot[] }>(
    getLootsQuery,
    {
      variables: {
        first: 10,
        where: state.searchIdFilter
          ? { id: state.searchIdFilter }
          : {
              bagGreatness_gt: state.ratingFilter.bagGreatness,
              bagRating_gt: state.ratingFilter.bagRating,
            },
        orderBy: 'bagGreatness',
        orderDirection: 'desc',
      },
    }
  );

  return (
    <div>
      <LootFilters />
      <LootOverviews bags={data?.bags ?? []} />
    </div>
  );
}
