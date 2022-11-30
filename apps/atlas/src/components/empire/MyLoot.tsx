import { useQuery } from '@apollo/client';
import { Button } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { LootOverviews } from '@/components/loot/LootOverviews';
import { LootFilters } from '@/components/ui/filters/LootFilters';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
import type { Loot } from '@/types/index';

export const MyLoot = () => {
  const { address: l1Address } = useL1Account();
  const { state, actions } = useLootContext();

  const limit = 50;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    setPage(1);
  }, [
    state.searchIdFilter,
    state.ratingFilter.bagGreatness,
    state.ratingFilter.bagRating,
  ]);

  const isLootPanel = true;

  const variables = useMemo(() => {
    const where: any = {};
    where.currentOwner = l1Address?.toLowerCase();
    where.bagGreatness_gte = state.ratingFilter.bagGreatness.min;
    where.bagGreatness_lte = state.ratingFilter.bagGreatness.max;
    where.bagRating_gte = state.ratingFilter.bagRating.min;
    where.bagRating_lte = state.ratingFilter.bagRating.max;

    return {
      first: limit,
      skip: limit * (page - 1),
      where,
      orderBy: 'minted',
      orderDirection: 'asc',
    };
  }, [l1Address, state, page]);

  const { loading, data } = useQuery<{ bags: Loot[] }>(getLootsQuery, {
    variables,
    skip: !isLootPanel,
  });

  // useEffect(() => {
  //   if (
  //     !selectedId &&
  //     isDisplayLarge &&
  //     page === 1 &&
  //     (data?.bags?.length ?? 0) > 0
  //   ) {
  //     openDetails('loot', data?.bags[0].id as string);
  //   }
  // }, [data, page]);

  const showPagination = () => page > 1 || (data?.bags?.length ?? 0) === limit;

  const hasNoResults = () => !loading && (data?.bags?.length ?? 0) === 0;

  return (
    <div>
      <div>
        <LootFilters />
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Bag className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <LootOverviews bags={data?.bags ?? []} />
      </div>

      {hasNoResults() && (
        <div className="flex flex-col items-center justify-center gap-8 my-8">
          <h2>No results.</h2>
          <div className="flex gap-4">
            <Button variant="primary" onClick={actions.clearFilters}>
              Clear Filters
            </Button>
            {state.selectedTab !== 1 && (
              <Button
                variant="primary"
                onClick={() => actions.updateSelectedTab(1)}
              >
                See All Loot
              </Button>
            )}
          </div>
        </div>
      )}

      {showPagination() && (
        <div className="flex gap-2 my-8">
          <Button
            variant="primary"
            onClick={previousPage}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={nextPage}
            disabled={data?.bags?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
