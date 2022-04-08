import { useQuery } from '@apollo/client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import { useMemo } from 'react';
import { CryptFilter } from '@/components/filters/CryptFilter';
import { CryptsOverviews } from '@/components/tables/CryptsOverviews';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Crypt } from '@/types/index';
import { BasePanel } from './BasePanel';

export const CryptsPanel = () => {
  const { togglePanelType, selectedPanel } = useUIContext();
  const { account } = useWalletContext();
  const { state, actions } = useCryptContext();

  const tabs = ['Your Crypts', 'All Crypts', 'Favourite Crypts'];

  const where = useMemo(() => {
    if (state.selectedTab === 0) {
      return { currentOwner: account.toLowerCase() };
    } else if (state.selectedTab === 1) {
      let where: any = {};
      if (state.searchIdFilter) {
        where = { id: state.searchIdFilter };
      } else {
        where = {
          numDoors_gt: state.statsFilter.numDoors,
          numPoints_gt: state.statsFilter.numPoints,
          size_gt: state.statsFilter.size,
        };
        if (state.environmentsFilter.length > 0) {
          where.environment_in = [...state.environmentsFilter];
        }
      }
      return where;
    } else if (state.selectedTab === 2) {
      return { id_in: [...state.favouriteCrypt] };
    }
  }, [account, state]);

  const { loading, data } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables: {
      first: 100,
      where,
    },
  });

  return (
    <BasePanel open={selectedPanel === 'crypt'}>
      <div className="flex justify-between pt-2">
        <div className="sm:hidden"></div>
        <h1>Crypts</h1>

        <button
          className="z-50 transition-all rounded sm:hidden top-4"
          onClick={() => togglePanelType('crypt')}
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
        <CryptFilter />
        {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <Danger className="block w-20 fill-current" />
            <h2>Loading</h2>
          </div>
        )}
        <CryptsOverviews dungeons={data?.dungeons ?? []} />
      </div>
    </BasePanel>
  );
};
