import { useQuery } from '@apollo/client';
import { LootFilters } from '@/components/filters/LootFilters';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Loot } from '@/types/index';

export function YourLoot() {
  const lootCtx = useLootContext();
  const { account } = useWalletContext();

  const { loading, error, data, fetchMore } = useQuery<{ bags: Loot[] }>(
    getLootsQuery,
    {
      variables: { where: { currentOwner: account?.toLowerCase() }, first: 10 },
    }
  );

  return (
    <div>
      <LootFilters />
      <LootOverviews bags={data?.bags ?? []} />
    </div>
  );
}
