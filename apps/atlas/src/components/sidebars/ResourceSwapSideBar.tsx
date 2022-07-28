import { useQuery } from '@apollo/client';
import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { useMemo } from 'react';
import { SwapResources } from '@/components/tables/SwapResources';
import { useGetRealmQuery, useGetDesiegeQuery } from '@/generated/graphql';
import { getRealmQuery } from '@/hooks/graphql/queries';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import type { Data } from '@/types/index';
import { LpMerchant } from '../tables/LpMerchant';
import { BaseSideBar } from './BaseSideBar';
type Props = {
  resources?: string[];
};

export const ResourceSwapSideBar = (props: Props) => {
  const { toggleMenuType, selectedPanel } = useAtlasContext();
  const { approveLords, isApproved: isLordsApprovedForExchange } =
    useApproveLordsForExchange();

  const { approveResources, isApproved: isResourcesApprovedForExchange } =
    useApproveResourcesForExchange();
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
        component: <LpMerchant />,
      },
      // {
      //   label: 'Stake',
      //   component: <Menu />,
      // },
    ],
    []
  );
  return (
    <BaseSideBar open={selectedPanel === 'bank'}>
      <div className="top-0 bottom-0 right-0 w-full h-auto p-6 pt-10 lg:w-5/12 rounded-r-2xl">
        <div className="flex justify-between w-full">
          <Button
            variant="secondary"
            size="xs"
            className="ml-auto"
            onClick={() => toggleMenuType('bank')}
          >
            <Close />
          </Button>
        </div>
        <div>
          <h2 className="my-8 text-center">Resource Emporium</h2>
        </div>
        <div>
          {!isLordsApprovedForExchange && (
            <div>
              <Button
                className="w-full"
                variant="primary"
                onClick={approveLords}
              >
                APPROVE LORDS
              </Button>
            </div>
          )}
          {/* TODO: NOT WORKING */}
          {!isResourcesApprovedForExchange && (
            <div>
              <Button
                className="w-full"
                variant="primary"
                onClick={approveResources}
              >
                APPROVE RESOURCES
              </Button>
            </div>
          )}
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
            <Tabs.Panels className="h-full p-4 rounded shadow-inner bg-black/10">
              {tabs.map((tab) => (
                <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
    </BaseSideBar>
  );
};
