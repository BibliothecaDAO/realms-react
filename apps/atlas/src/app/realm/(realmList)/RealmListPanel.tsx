'use client';

import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { useAccount } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { RealmsMax } from '@/constants/index';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

import type { FragmentType } from '@/gql/fragment-masking';
import { useFragment } from '@/gql/fragment-masking';
import { graphql } from '@/gql/gql';
import { RealmOverviews } from './RealmOverviews';

export const RealmListFragment = graphql(/* GraphQL */ `
  fragment RealmList on Realm {
    realmId
    name
    orderType
  }
`);

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

export const RealmListPanel = (props: {
  realms?: Array<FragmentType<typeof RealmListFragment>>;
}) => {
  const { state, actions } = useRealmContext();
  const pagination = useRealmsPanelPagination();
  const realms = useFragment(RealmListFragment, props.realms);
  const selectedTabIndex = 0;

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

  useEffect(() => {
    if (loading) stopPolling();
    else startPolling(5000);

    return stopPolling;
  }, [loading, data]);

  const showPagination = () =>
    pagination.page > 1 || (data?.realms?.length ?? 0) === pagination.limit;

  const hasNoResults = () => !loading && (data?.realms?.length ?? 0) === 0;
  const query = useSearchParams();
  const pathname = usePathname();
  return (
    <>
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
          realms={realms ?? []}
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
            <Button className="whitespace-nowrap" variant="outline">
              See All Realms
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
    </>
  );
};
