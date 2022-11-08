'use client';

import { useQuery } from '@apollo/client';
import { Tabs, Button } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';

import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { LootFilters } from '@/app/components/filters/LootFilters';
import { BasePanel } from '@/app/components/ui/BasePanel';
import { PanelHeading } from '@/app/components/ui/PanelHeading';
import { LootOverviews } from '@/components/tables/LootOverviews';
import { useLootContext } from '@/context/LootContext';
import { getLootsQuery } from '@/hooks/graphql/queries';
import type { Loot } from '@/types/index';

export const LootPanel = () => {
  const { address: l1Address } = useL1Account();
  const { state, actions } = useLootContext();

  const limit = 50;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  const queryDependencies = [
    state.favouriteLoot,
    state.searchIdFilter,
    state.ratingFilter.bagGreatness,
    state.ratingFilter.bagRating,
    state.selectedTab,
  ];
  useEffect(() => {
    setPage(1);
  }, [...queryDependencies]);

  const isLootPanel = true;
  const tabs = ['Your Loot', 'All Loot', 'Favourite Loot'];

  const variables = useMemo(() => {
    const where: any = {};
    if (state.searchIdFilter) {
      where.id = state.searchIdFilter;
    } else if (state.selectedTab === 2) {
      where.id_in = [...state.favouriteLoot];
    }

    if (state.selectedTab === 0) {
      where.currentOwner = l1Address?.toLowerCase();
    }
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
  }, [l1Address, page, ...queryDependencies]);

  const { loading, data } = useQuery<{ bags: Loot[] }>(getLootsQuery, {
    variables,
    skip: !isLootPanel,
  });

  const showPagination = () =>
    state.selectedTab === 1 &&
    (page > 1 || (data?.bags?.length ?? 0) === limit);

  const hasNoResults = () => !loading && (data?.bags?.length ?? 0) === 0;

  return (
    <BasePanel open={isLootPanel}>
      <PanelHeading
        heading="Loot"
        action={actions.updateSearchIdFilter}
        searchFilterValue={state.searchIdFilter}
      />

      <Tabs
        selectedIndex={state.selectedTab}
        onChange={actions.updateSelectedTab as any}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab}>{tab}</Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
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
            <Button
              className="whitespace-nowrap"
              onClick={actions.clearFilters}
            >
              Clear Filters
            </Button>
            {state.selectedTab !== 1 && (
              <Button
                className="whitespace-nowrap"
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
          <Button onClick={previousPage} disabled={page === 1}>
            Previous
          </Button>
          <Button onClick={nextPage} disabled={data?.bags?.length !== limit}>
            Next
          </Button>
        </div>
      )}
    </BasePanel>
  );
};
