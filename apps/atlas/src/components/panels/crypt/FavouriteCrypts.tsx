import { useQuery } from '@apollo/client';
import { CryptFilter } from '@/components/filters/CryptFilter';
import { CryptsOverviews } from '@/components/tables/CryptsOverviews';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import type { Crypt } from '@/types/index';

export function FavouriteCrypts() {
  const { state } = useCryptContext();

  const { loading, error, data, fetchMore } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables: { first: 10, where: { id_in: [...state.favouriteCrypt] } },
  });

  return (
    <div>
      <CryptFilter />
      <CryptsOverviews dungeons={data?.dungeons ?? []} />
    </div>
  );
}
