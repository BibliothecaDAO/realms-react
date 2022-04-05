import { useQuery } from '@apollo/client';
import { GaFilters } from '@/components/filters/GaFilters';
import { GaOverviews } from '@/components/tables/GaOverviews';
import { useGaContext } from '@/context/GaContext';
import { getGAsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { GAdventurer } from '@/types/index';

export function YourGa() {
  const gaCtx = useGaContext();
  const { account } = useWalletContext();

  const { loading, error, data, fetchMore } = useQuery<{
    gadventurers: GAdventurer[];
  }>(getGAsQuery, {
    variables: { where: { currentOwner: account.toLowerCase() }, first: 10 },
  });

  return (
    <div>
      <GaFilters />
      <GaOverviews bags={data?.gadventurers ?? []} />
    </div>
  );
}
