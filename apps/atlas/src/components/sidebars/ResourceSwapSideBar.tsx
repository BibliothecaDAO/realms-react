import { useQuery } from '@apollo/client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';

import { useMemo } from 'react';
import { SwapResources } from '@/components/tables/SwapResources';
import { useGetRealmQuery, useGetDesiegeQuery } from '@/generated/graphql';
import { getRealmQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import type { Data } from '@/types/index';
import { BaseSideBar } from './BaseSideBar';
type Props = {
  resources?: string[];
};

export const ResourceSwapSideBar = (props: Props) => {
  const { toggleMenuType, selectedMenuType } = useUIContext();

  /* const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: props.id.toString() },
  }); */
  const tabs = useMemo(
    () => [
      {
        label: 'Swap',
        component: <SwapResources key="1" />,
      },
      {
        label: 'LP Merchant',
        component: <Menu />,
      },
      {
        label: 'Stake',
        component: <Menu />,
      },
    ],
    []
  );
  return (
    <BaseSideBar open={selectedMenuType === 'resourceSwap'}>
      <div className="top-0 bottom-0 right-0 w-full h-auto p-6 pt-10 sm:w-5/12 rounded-r-2xl">
        <div className="flex justify-between">
          <button
            className="right-0 z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
            onClick={() => toggleMenuType('resourceSwap')}
          >
            <Close />
          </button>
          <h2 className="uppercase">Resource Swap</h2>
          <div />
        </div>
        <Tabs className="h-full" variant="primary">
          <Tabs.List className="">
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.label} className="uppercase">
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panels className="h-full">
            {tabs.map((tab) => (
              <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs>
      </div>
    </BaseSideBar>
  );
};
