import { useQuery } from '@apollo/client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CryptFilter } from '@/components/filters/CryptFilter';
import { CryptsOverviews } from '@/components/tables/CryptsOverviews';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import Button from '@/shared/Button';
import type { Crypt } from '@/types/index';
import { BasePanel } from './BasePanel';
import { PanelHeading } from './PanelComponents/PanelHeading';

export const CryptsPanel = () => {
  // const { selectedId, openDetails, isDisplayLarge } = useAtlasContext();
  const { account } = useWalletContext();
  const { state, actions } = useCryptContext();

  const limit = 50;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  // Reset page on filter change. UseEffect doesn't do a deep compare
  const filterDependencies = [
    state.favouriteCrypt,
    state.isLegendaryFilter,
    state.searchIdFilter,
    state.environmentsFilter,
    state.statsFilter.numDoors,
    state.statsFilter.numPoints,
    state.statsFilter.size,
    state.selectedTab,
  ];
  useEffect(() => {
    setPage(1);
  }, [...filterDependencies]);

  const isCryptPanel = true;
  const tabs = ['Your Crypts', 'All Crypts', 'Favourite Crypts'];

  const variables = useMemo(() => {
    const where: any = {};
    if (state.searchIdFilter) {
      where.id = state.searchIdFilter;
    } else if (state.selectedTab === 2) {
      where.id_in = [...state.favouriteCrypt];
    }

    if (state.selectedTab === 0) {
      where.currentOwner = account?.toLowerCase();
    }

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
  }, [account, page, ...filterDependencies]);

  const { loading, data } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables,
    skip: !isCryptPanel,
  });

  const showPagination = () =>
    state.selectedTab === 1 &&
    (page > 1 || (data?.dungeons?.length ?? 0) === limit);

  const hasNoResults = () => !loading && (data?.dungeons?.length ?? 0) === 0;

  return (
    <BasePanel open={isCryptPanel}>
      <PanelHeading
        heading="Crypts"
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
                See All Crypts
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
            disabled={data?.dungeons?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
    </BasePanel>
  );
};
