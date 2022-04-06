import { useQuery } from '@apollo/client';
import { CryptFilter } from '@/components/filters/CryptFilter';
import { CryptsOverviews } from '@/components/tables/CryptsOverviews';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import type { Crypt } from '@/types/index';

export function AllCrypts() {
  const { state } = useCryptContext();

  let where: any = {};
  if (state.searchIdFilter) {
    where = { id: state.searchIdFilter };
  } else {
    where = {
      numDoors_gt: state.statsFilter.numDoors,
      numPoints_gt: state.statsFilter.numPoints,
      size_gt: state.statsFilter.size,
    };
    if (state.environmentsFilter.length > 0) {
      where.environment_in = [...state.environmentsFilter];
    }
  }

  const { loading, error, data, fetchMore } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables: {
      first: 10,
      where,
      orderBy: 'bagGreatness',
      orderDirection: 'desc',
    },
  });

  return (
    <div>
      <CryptFilter />
      <CryptsOverviews dungeons={data?.dungeons ?? []} />
    </div>
  );
}
