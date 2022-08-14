import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { RealmsMax } from '@/constants/index';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { SearchFilter } from '../filters/SearchFilter';
import { BasePanel } from './BasePanel';

export const RealmsPanel = () => {
  const { isDisplayLarge, selectedId, selectedPanel, openDetails } =
    useAtlasContext();
  const { account } = useWalletContext();
  const { account: starkAccount } = useStarknet();
  const { state, actions } = useRealmContext();

  const limit = 20;
  const [page, setPage] = useState(1);
  const previousPage = () => setPage(page - 1);
  const nextPage = () => setPage(page + 1);

  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    setPage(1);
  }, [
    state.favouriteRealms,
    state.selectedOrders,
    state.searchIdFilter,
    state.hasWonderFilter,
    state.rarityFilter.rank,
    state.rarityFilter.score,
    state.traitsFilter.City,
    state.traitsFilter.Harbor,
    state.traitsFilter.Region,
    state.traitsFilter.River,
    state.selectedTab,
  ]);

  const isRealmPanel = selectedPanel === 'realm';
  const tabs = ['Your Realms', 'All Realms', 'Favourite Realms'];

  const variables = useMemo(() => {
    const resourceFilters = state.selectedResources.map((resource) => ({
      resources: { some: { resourceId: { equals: resource } } },
    }));

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

    const filter = {} as any;
    const orderBy = {} as any;

    if (state.searchIdFilter) {
      filter.realmId = { equals: parseInt(state.searchIdFilter) };
    } else if (state.selectedTab === 2) {
      filter.realmId = { in: [...state.favouriteRealms] };
    }

    if (state.selectedTab === 0) {
      filter.OR = [
        { owner: { equals: account?.toLowerCase() } },
        { bridgedOwner: { equals: account?.toLowerCase() } },
        { ownerL2: { equals: starknetWallet } },
        { settledOwner: { equals: starknetWallet } },
      ];
    }

    if (state.hasWonderFilter) {
      filter.NOT = {
        wonder: { equals: null },
      };
    }

    if (state.isSettledFilter) {
      filter.NOT = {
        settledOwner: { equals: null },
      };
    }

    if (state.isRaidableFilter) {
      filter.NOT = {
        lastVaultTime: { equals: null },
      };
      orderBy.lastVaultTime = 'asc';
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

    filter.orderType =
      state.selectedOrders.length > 0
        ? { in: [...state.selectedOrders] }
        : undefined;
    filter.AND = [...resourceFilters, ...traitsFilters];

    return {
      filter,
      take: limit,
      orderBy,
      skip: limit * (page - 1),
    };
  }, [account, state, page]);

  const { data, loading } = useGetRealmsQuery({
    variables,
    skip: !isRealmPanel,
    pollInterval: 5000,
  });

  useEffect(() => {
    if (
      !selectedId &&
      isDisplayLarge &&
      page === 1 &&
      (data?.realms?.length ?? 0) > 0
    ) {
      openDetails('realm', data?.realms[0].realmId + '');
    }
  }, [data, page, selectedId]);

  const showPagination = () =>
    state.selectedTab === 1 &&
    (page > 1 || (data?.realms?.length ?? 0) === limit);

  const hasNoResults = () => !loading && (data?.realms?.length ?? 0) === 0;

  const displayResults = () => {
    if (!data) {
      return '';
    }
    const resultStr = `${data?.total?.toLocaleString()} Results`;
    if (data.total <= limit) {
      return resultStr;
    }
    const start = (page - 1) * limit;
    const count = Math.min(data.realms.length, limit);
    return `${start.toLocaleString()} - ${(
      start + count
    ).toLocaleString()} of ${resultStr}`;
  };

  return (
    <BasePanel open={isRealmPanel} style="lg:w-7/12">
      <div className="flex flex-wrap justify-between px-3 pt-20 sm:px-6 bg-black/90">
        {/* <Link href="/">
          <button className="z-50 transition-all rounded top-4">
            <Close />
          </button>
        </Link> */}
        <h2>Loot Realms</h2>
        <div className="w-full my-1 sm:w-auto">
          <SearchFilter
            placeholder="SEARCH BY ID"
            onSubmit={(value) => {
              actions.updateSearchIdFilter(parseInt(value) ? value : '');
            }}
            defaultValue={state.searchIdFilter + ''}
          />
        </div>
      </div>
      <Tabs
        selectedIndex={state.selectedTab}
        onChange={actions.updateSelectedTab as any}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab} className="uppercase">
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <div>
        <RealmsFilter isYourRealms={state.selectedTab === 0} />
        {/* {data && (
          <div className="pb-4 font-semibold text-right">
            {displayResults()}
          </div>
        )} */}
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Castle className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <RealmOverviews
          realms={data?.realms ?? []}
          isYourRealms={state.selectedTab === 0}
        />
      </div>

      {hasNoResults() && (
        <div className="flex flex-col items-center justify-center gap-8 py-8 bg-black">
          <h2>No results... Try remove some filters</h2>
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
                See All Realms
              </Button>
            )}
          </div>
        </div>
      )}

      {showPagination() && (
        <div className="flex justify-center w-full gap-2 py-8 bg-black">
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
            disabled={data?.realms?.length !== limit}
          >
            Next
          </Button>
        </div>
      )}
    </BasePanel>
  );
};
