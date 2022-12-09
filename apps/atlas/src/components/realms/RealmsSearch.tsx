import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { RealmOverviews } from '@/components/realms/RealmOverviews';
import { RealmsFilter } from '@/components/ui/filters/RealmsFilter';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { BasePanel } from '@/components/ui/panel/BasePanel';
import { RealmsMax } from '@/constants/index';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

const TABS = [
  { key: 'Your', name: 'Your Realms' },
  { key: 'All', name: 'All Realms' },
  { key: 'Favourite', name: 'Favourite Realms' },
];

function useRealmsQueryVariables(
  selectedTabIndex: number,
  page: number,
  limit: number
) {
  const { address: l1Address } = useL1Account();
  const { address } = useAccount();

  const { state } = useRealmContext();
  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';
  return useMemo(() => {
    const resourceFilters = state.selectedResources.map((resource) => ({
      resources: { some: { resourceId: { equals: resource } } },
    }));

    const filter = {} as any;
    let orderBy = { realmId: 'asc' } as any;

    if (state.searchIdFilter) {
      filter.realmId = { equals: parseInt(state.searchIdFilter) };
    } else {
      // Your realms
      if (selectedTabIndex === 0) {
        filter.OR = [
          { owner: { equals: l1Address?.toLowerCase() } },
          { bridgedOwner: { equals: l1Address?.toLowerCase() } },
          { ownerL2: { equals: starknetWallet } },
          { settledOwner: { equals: starknetWallet } },
        ];
      } else if (selectedTabIndex === 2) {
        filter.realmId = { in: [...state.favouriteRealms] };
      }

      if (state.hasWonderFilter) filter.wonder = { not: null };
      if (state.isSettledFilter) {
        filter.settledOwner = { not: null };
      }
      if (state.isRaidableFilter) {
        filter.lastVaultTime = { not: null };
        orderBy = { lastVaultTime: 'asc' };
      }
      if (
        state.rarityFilter.rank.min > 0 ||
        state.rarityFilter.rank.max < RealmsMax.Rank
      ) {
        filter.rarityRank = {
          gte: state.rarityFilter.rank.min,
          lte: state.rarityFilter.rank.max,
        };
      }
      if (
        state.rarityFilter.score.min > 0 ||
        state.rarityFilter.score.max < RealmsMax.Score
      ) {
        filter.rarityScore = {
          gte: state.rarityFilter.score.min,
          lte: state.rarityFilter.score.max,
        };
      }

      const traitsFilters = Object.keys(state.traitsFilter)
        // Filter 0 entries
        .filter((key: string) => state.traitsFilter[key])
        .map((key: string) => ({
          traits: {
            some: {
              type: { equals: key as RealmTraitType },
              qty: {
                gte: state.traitsFilter[key].min,
                lte: state.traitsFilter[key].max,
              },
            },
          },
        }));
      filter.orderType =
        state.selectedOrders.length > 0
          ? { in: [...state.selectedOrders] }
          : undefined;
      filter.AND = [...resourceFilters, ...traitsFilters];
    }

    return {
      filter,
      take: limit,
      orderBy,
      skip: limit * (page - 1),
    };
  }, [
    state.selectedResources,
    state.searchIdFilter,
    state.hasWonderFilter,
    state.isSettledFilter,
    state.isRaidableFilter,
    state.rarityFilter.rank.min,
    state.rarityFilter.rank.max,
    state.rarityFilter.score.min,
    state.rarityFilter.score.max,
    state.traitsFilter,
    state.selectedOrders,
    state.favouriteRealms,
    limit,
    page,
    selectedTabIndex,
    l1Address,
    starknetWallet,
  ]);
}

function useRealmsPanelPagination() {
  const limit = 8;
  const [page, setPage] = useState(1);
  const goBack = () => setPage(page - 1);
  const goForward = () => setPage(page + 1);

  return {
    page,
    setPage,
    limit,
    goBack,
    goForward,
  };
}

function useRealmsPanelTabs({ actions }) {
  const router = useRouter();
  const selectedTabKey = (router.query['tab'] as string) ?? TABS[1].key;
  const selectedTabIndex = TABS.findIndex(
    ({ key }) => key.toLowerCase() === selectedTabKey.toLowerCase()
  );

  function onTabChange(index: number) {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tab: TABS[index].key,
        },
      },
      undefined,
      { shallow: true }
    );
    actions.clearFilters();
  }

  return {
    selectedTabIndex,
    onTabChange,
  };
}

export const RealmsSearch = () => {
  const { state, actions } = useRealmContext();
  const pagination = useRealmsPanelPagination();

  const { selectedTabIndex, onTabChange } = useRealmsPanelTabs({
    actions: actions,
  });

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    pagination.setPage(1);
  }, [
    state.favouriteRealms,
    state.selectedOrders,
    state.selectedResources,
    state.searchIdFilter,
    state.hasWonderFilter,
    state.isSettledFilter,
    state.rarityFilter.rank,
    state.rarityFilter.score,
    state.traitsFilter.City,
    state.traitsFilter.Harbor,
    state.traitsFilter.Region,
    state.traitsFilter.River,
    selectedTabIndex,
  ]);

  const variables = useRealmsQueryVariables(
    selectedTabIndex,
    pagination.page,
    pagination.limit
  );

  const { data, loading, startPolling, stopPolling } = useGetRealmsQuery({
    variables,
  });
  const router = useRouter();

  useEffect(() => {
    if (router.query) {
      const id = router.query.asset
        ? (router.query.asset as string).split('realm')[1]
        : '';

      const tab = router.query.tab;

      if (!tab) {
        actions.updateSearchIdFilter(id);
      }
    }
  }, [router]);

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data, startPolling, stopPolling]);

  const showPagination = () =>
    selectedTabIndex === 1 &&
    (pagination.page > 1 || (data?.realms?.length ?? 0) === pagination.limit);

  const hasNoResults = () => !loading && (data?.realms?.length ?? 0) === 0;

  return (
    <div className="px-6">
      <Tabs
        key={selectedTabIndex}
        selectedIndex={selectedTabIndex}
        onChange={onTabChange as any}
        variant="primary"
      >
        <Tabs.List className="mt-2">
          {TABS.map((tab) => (
            <Tabs.Tab key={tab.key}>{tab.name}</Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <div className="flex w-full mt-2">
        <SearchFilter
          placeholder="Search by Realm Id"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <div>
        <RealmsFilter isYourRealms={selectedTabIndex === 0} />

        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Ouroboros className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <RealmOverviews
          key={selectedTabIndex}
          realms={data?.realms ?? []}
          isYourRealms={selectedTabIndex === 0}
        />
      </div>

      {hasNoResults() && (
        <div className="flex flex-col items-center justify-center gap-8 py-8">
          <h2>No results... Try remove some filters</h2>
          <div className="flex gap-4">
            <Button
              className="whitespace-nowrap"
              variant="outline"
              onClick={actions.clearFilters}
            >
              Clear Filters
            </Button>
            {selectedTabIndex !== 1 && (
              <Button
                className="whitespace-nowrap"
                variant="outline"
                onClick={() => onTabChange(1)}
              >
                See All Realms
              </Button>
            )}
          </div>
        </div>
      )}

      {showPagination() && (
        <div className="flex justify-center w-full gap-2 py-8">
          <Button
            variant="outline"
            onClick={pagination.goBack}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={pagination.goForward}
            disabled={data?.realms?.length !== pagination.limit}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
