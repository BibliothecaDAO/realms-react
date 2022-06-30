import { Tabs, Button } from '@bibliotheca-dao/ui-lib';

import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';

import { useState, useMemo } from 'react';

import { useAtlasContext } from '@/hooks/useAtlasContext';

import { TransactionCartTable } from '../tables/Transactions';
import { BaseSideBar } from './BaseSideBar';

/* TBD Should this be merged with Bridge Realms Sidebar */
export const TransactionCartSideBar = () => {
  const { toggleMenuType, selectedMenuType, showDetails } = useAtlasContext();
  const { account } = useStarknet();
  const isSettleRealms = selectedMenuType === 'transactionCart' && showDetails;

  const [selectedTab, setSelectedTab] = useState(1);

  const tabs = useMemo(
    () => [
      {
        label: 'To Submit',
        component: <span />,
      },
      {
        label: 'Processing',
        component: <TransactionCartTable />,
      },
    ],
    [selectedTab]
  );

  return (
    <BaseSideBar open={isSettleRealms}>
      <div className="relative top-0 bottom-0 right-0 flex flex-col justify-between w-full h-full p-6 pt-8 overflow-auto lg:w-5/12 rounded-r-2xl">
        <div>
          <div className="flex justify-between mb-2">
            <h2>Transaction Cart</h2>
            <div className="flex justify-end mb-2 mr-1">
              <Button
                size="sm"
                onClick={() => toggleMenuType('transactionCart')}
              >
                <Close />
              </Button>
            </div>
          </div>

          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => setSelectedTab(index as number)}
            variant="primary"
          >
            <Tabs.List className="">
              {tabs.map((tab) => (
                <Tabs.Tab key={tab.label} className="uppercase">
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panels>
              {tabs.map((tab) => (
                <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>

        {/* {loading && (
          <div className="flex flex-col items-center w-20 gap-2 mx-auto my-40 animate-pulse">
            <h2>Loading</h2>
          </div>
        )} */}
      </div>
    </BaseSideBar>
  );
};
