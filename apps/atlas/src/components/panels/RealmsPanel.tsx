import { Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useMemo } from 'react';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
import { useRealmContext } from '@/context/RealmContext';
import type { RealmTraitType } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { BasePanel } from './BasePanel';

export const RealmsPanel = () => {
  const { togglePanelType, selectedPanel } = useUIContext();
  const { account } = useWalletContext();
  const { state, actions } = useRealmContext();

  const tabs = ['Your Realms', 'All Realms', 'Favourite Realms'];

  const variables = useMemo(() => {
    // Your Realms
    if (state.selectedTab === 0) {
      return {
        filter: {
          OR: [
            { owner: { equals: account?.toLowerCase() } },
            { bridgedOwner: { equals: account?.toLowerCase() } },
          ],
        },
      };
    }
    // All Realms
    else if (state.selectedTab === 1) {
      const resourceFilters = state.selectedResources.map((resource) => ({
        resourceType: { equals: resource },
      }));

      const traitsFilters = Object.keys(state.traitsFilter)
        // Filter 0 entries
        .filter((key: string) => (state.traitsFilter as any)[key])
        .map((key: string) => ({
          trait: {
            type: key as RealmTraitType,
            qty: { gte: (state.traitsFilter as any)[key] },
          },
        }));

      return {
        filter: state.searchIdFilter
          ? { realmId: { equals: parseInt(state.searchIdFilter) } }
          : {
              rarityRank: { gte: state.rarityFilter.rarityRank },
              rarityScore: { gte: state.rarityFilter.rarityScore },
              orderType:
                state.selectedOrders.length > 0
                  ? { in: [...state.selectedOrders] }
                  : undefined,
              AND: [...resourceFilters, ...traitsFilters],
            },
        take: 100,
      };
    }
    // Favourite Realms
    else if (state.selectedTab === 2) {
      return {
        filter: {
          realmId: { in: [...state.favouriteRealms] },
        },
      };
    }
    return {};
  }, [account, state]);

  const { data, loading } = useGetRealmsQuery({ variables });

  return (
    <BasePanel open={selectedPanel === 'realm'}>
      <div className="flex justify-between pt-2">
        <div className="sm:hidden"></div>
        <h1>Realms</h1>

        <button
          className="z-50 transition-all rounded sm:hidden top-4"
          onClick={() => togglePanelType('realm')}
        >
          <Close />
        </button>
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
      <div className="mt-2">
        <RealmsFilter />
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Castle className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <RealmOverviews realms={data?.getRealms ?? []} />
      </div>
    </BasePanel>
  );
};
