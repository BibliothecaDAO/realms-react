import { useQuery } from '@apollo/client';
import { GaFilters } from '@/components/filters/GaFilters';
import { GaOverviews } from '@/components/tables/GaOverviews';
import { useGaContext } from '@/context/GaContext';
import { getGAsQuery } from '@/hooks/graphql/queries';
import type { GAdventurer } from '@/types/index';

export function FavouriteGa() {
  const { state } = useGaContext();

  const { loading, error, data, fetchMore } = useQuery<{
    gadventurers: GAdventurer[];
  }>(getGAsQuery, {
    variables: { first: 10, where: { id_in: [...state.favouriteGa] } },
  });

  return (
    <div>
      <GaFilters />
      <GaOverviews bags={data?.gadventurers ?? []} />
    </div>
  );
}
