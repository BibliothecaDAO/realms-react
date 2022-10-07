import { useQuery } from '@apollo/client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import { useEffect, useMemo, useState } from 'react';
import { GaFilters } from '@/components/filters/GaFilters';
import { GaOverviews } from '@/components/tables/GaOverviews';
import { useGaContext } from '@/context/GaContext';
import { getGAsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import Button from '@/shared/Button';
import type { GAdventurer } from '@/types/index';
import { BasePanel } from './BasePanel';
import { PanelHeading } from './PanelComponents/PanelHeading';

export const GaPanel = () => {
  const { account } = useWalletContext();
  const { state, actions } = useGaContext();

  const limit = 50;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  const queryDependencies = [
    state.favouriteGa,
    state.selectedOrders,
    state.searchIdFilter,
    state.ratingFilter.bagGreatness,
    state.ratingFilter.bagRating,
    state.selectedTab,
  ];
  useEffect(() => {
    setPage(1);
  }, [...queryDependencies]);

  const isGaPanel = true;
  const tabs = ['Your GA', 'All GA', 'Favourite GA'];

  const variables = useMemo(() => {
    const where: any = {};
    if (state.searchIdFilter) {
      where.id = state.searchIdFilter;
    } else if (state.selectedTab === 2) {
      where.id_in = [...state.favouriteGa];
    }

    if (state.selectedTab === 0) {
      where.currentOwner = account?.toLowerCase();
    }
    where.bagGreatness_gte = state.ratingFilter.bagGreatness.min;
    where.bagGreatness_lte = state.ratingFilter.bagGreatness.max;
    where.bagRating_gte = state.ratingFilter.bagRating.min;
    where.bagRating_lte = state.ratingFilter.bagRating.max;

    if (state.selectedOrders.length > 0) {
      where.order_in = [
        ...state.selectedOrders.map((orderType) => orderType.replace('_', ' ')),
      ];
    }

    return {
      first: limit,
      skip: limit * (page - 1),
      where,
      orderBy: 'minted',
      orderDirection: 'asc',
    };
  }, [account, page, ...queryDependencies]);

  const { loading, data } = useQuery<{
    gadventurers: GAdventurer[];
  }>(getGAsQuery, {
    variables,
    skip: !isGaPanel,
  });

  const showPagination = () =>
    state.selectedTab === 1 &&
    (page > 1 || (data?.gadventurers?.length ?? 0) === limit);

  const hasNoResults = () =>
    !loading && (data?.gadventurers?.length ?? 0) === 0;

  return (
    <BasePanel open={isGaPanel}>
      <PanelHeading
        heading="Genesis Adventurers"
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
        <GaFilters />
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Helm className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <GaOverviews bags={data?.gadventurers ?? []} />
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
                See All GA
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
          <Button
            onClick={nextPage}
            disabled={data?.gadventurers?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
    </BasePanel>
  );
};
