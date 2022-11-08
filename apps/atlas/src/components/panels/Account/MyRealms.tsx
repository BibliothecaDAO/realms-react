'use client';
import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { RealmsFilter } from '@/app/components/filters/RealmsFilter';
import { SearchFilter } from '@/app/components/filters/SearchFilter';
import { RealmOverviews } from '@/app/realm/(realmList)/RealmOverviews';
import { RealmsMax } from '@/constants/index';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

function useRealmsQueryVariables(page: number, limit: number) {
  const { address: l1Address } = useL1Account();
  const { address } = useAccount();

  const { state } = useRealmContext();

  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';
  return useMemo(() => {
    const resourceFilters = state.selectedResources.map((resource) => ({
      resources: { some: { resourceId: { equals: resource } } },
    }));

    const filter = {} as any;
    const orderBy = {} as any;

    if (state.searchIdFilter) {
      filter.realmId = { equals: parseInt(state.searchIdFilter) };
    } else {
      // Your realms
      filter.OR = [
        { owner: { equals: l1Address?.toLowerCase() } },
        { bridgedOwner: { equals: l1Address?.toLowerCase() } },
        { ownerL2: { equals: starknetWallet } },
        { settledOwner: { equals: starknetWallet } },
      ];

      if (state.hasWonderFilter) filter.wonder = { not: null };
      if (state.isSettledFilter) {
        filter.settledOwner = { not: null };
      }
      if (state.isRaidableFilter) {
        filter.lastVaultTime = { not: null };
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
    l1Address,
    state.selectedOrders,
    state.selectedResources,
    state.searchIdFilter,
    state.hasWonderFilter,
    state.isSettledFilter,
    state.isRaidableFilter,
    state.rarityFilter.rank,
    state.rarityFilter.score,
    state.traitsFilter.City,
    state.traitsFilter.Harbor,
    state.traitsFilter.Region,
    state.traitsFilter.River,
    page,
    starknetWallet,
  ]);
}

function useRealmsPanelPagination() {
  const limit = 20;
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

export const MyRealms = () => {
  const { state, actions } = useRealmContext();
  const pagination = useRealmsPanelPagination();

  // Reset page on filter change. UseEffect doesn't do a deep compare
  useEffect(() => {
    pagination.setPage(1);
  }, [
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
  ]);

  const variables = useRealmsQueryVariables(pagination.page, pagination.limit);

  const { data, loading, startPolling, stopPolling } = useGetRealmsQuery({
    variables,
  });

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

  const showPagination = () =>
    pagination.page > 1 || (data?.realms?.length ?? 0) === pagination.limit;

  const hasNoResults = () => !loading && (data?.realms?.length ?? 0) === 0;

  return (
    <div>
      <div className="container flex justify-between w-full px-6 sm:w-auto">
        <RealmsFilter isYourRealms={true} />
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>

      <div>
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Ouroboros className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <RealmOverviews realms={data?.realms ?? []} isYourRealms={true} />
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
