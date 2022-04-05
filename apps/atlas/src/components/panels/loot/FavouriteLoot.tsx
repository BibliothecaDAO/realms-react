import { useQuery } from '@apollo/client';
import { LootFilters } from '@/components/filters/LootFilters';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
import type { Loot } from '@/types/index';

export function FavouriteLoot() {
  const lootCtx = useLootContext();

  const { loading, error, data, fetchMore } = useQuery<{ bags: Loot[] }>(
    getLootsQuery,
    {
      variables: {
        first: 10,
        where: { id_in: [...lootCtx.state.favouriteLoot] },
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
