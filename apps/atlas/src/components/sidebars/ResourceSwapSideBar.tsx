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
  const { toggleMenuType, selectedMenuType, showDetails } = useUIContext();

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
    <BaseSideBar open={selectedMenuType === 'resourceSwap' && showDetails}>
      <div className="top-0 bottom-0 right-0 w-full h-auto p-6 pt-10 lg:w-5/12 rounded-r-2xl">
        <div className="flex justify-between w-full">
          <h2 className="uppercase">Resource Swap</h2>
          <button
            className="right-0 z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70 shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.25)]"
            onClick={() => toggleMenuType('resourceSwap')}
          >
            <Close />
          </button>
        </div>
        <div className="relative">
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
          <div className="absolute inset-0 backdrop-blur firefox:bg-opacity-90 firefox:bg-gray-300">
            <div className="grid h-full text-4xl font-bold text-center uppercase place-items-center text">
              Coming Soon!
            </div>
          </div>
        </div>
      </div>
    </BaseSideBar>
  );
};
