import { useQuery } from '@apollo/client';
import { Button } from '@bibliotheca-dao/ui-lib';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { CryptsOverviews } from '@/components/crypts/CryptsOverviews';
import { CryptFilter } from '@/components/ui/filters/CryptFilter';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import type { Crypt } from '@/types/index';

export const MyCrypts = () => {
  const { address: l1Address } = useL1Account();
  const { state, actions } = useCryptContext();

  const limit = 50;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    setPage(1);
  }, [
    state.isLegendaryFilter,
    state.searchIdFilter,
    state.environmentsFilter,
    state.statsFilter.numDoors,
    state.statsFilter.numPoints,
    state.statsFilter.size,
  ]);

  const isCryptPanel = true;

  const variables = useMemo(() => {
    const where: any = {};
    if (state.searchIdFilter) {
      where.id = state.searchIdFilter;
    }

    where.currentOwner = l1Address?.toLowerCase();

    if (state.isLegendaryFilter) {
      where.name_starts_with = "'";
    }

    where.numDoors_gte = state.statsFilter.numDoors.min;
    where.numDoors_lte = state.statsFilter.numDoors.max;
    where.numPoints_gte = state.statsFilter.numPoints.min;
    where.numPoints_lte = state.statsFilter.numPoints.max;
    where.size_gte = state.statsFilter.size.min;
    where.size_lte = state.statsFilter.size.max;

    if (state.environmentsFilter.length > 0) {
      where.environment_in = [...state.environmentsFilter];
    }

    return {
      first: limit,
      skip: limit * (page - 1),
      where,
    };
  }, [l1Address, state, page]);

  const { loading, data } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables,
    skip: !isCryptPanel,
  });

  const showPagination = () =>
    page > 1 || (data?.dungeons?.length ?? 0) === limit;

  const hasNoResults = () => !loading && (data?.dungeons?.length ?? 0) === 0;

  return (
    <div>
      <div>
        <CryptFilter />
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Danger className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <CryptsOverviews dungeons={data?.dungeons ?? []} />
      </div>

      {hasNoResults() && (
        <div className="flex flex-col items-center justify-center gap-8 my-8">
          <h2>No Crypts & Caverns found.</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={actions.clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {showPagination() && (
        <div className="flex gap-2 my-8">
          <Button
            variant="outline"
            onClick={previousPage}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={data?.dungeons?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
