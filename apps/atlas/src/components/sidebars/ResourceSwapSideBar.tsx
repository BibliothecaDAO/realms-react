import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { useMemo } from 'react';
import { SwapResources } from '@/components/tables/SwapResources';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import AtlasSideBar from '../sidebars/AtlasSideBar';
import { LpMerchant } from '../tables/LpMerchant';
import { Nexus } from '../tables/Nexus';
import { BaseSideBarPanel } from './BaseSideBarPanel';

type ResourceSwapSideBarProps = {
  resources?: string[];
  isOpen: boolean;
  onClose?: () => void;
};

export const ResourceSwapSideBar = ({
  isOpen,
  onClose,
  resources,
}: ResourceSwapSideBarProps) => {
  return (
    <AtlasSideBar
      position="left"
      isOpen={isOpen}
      containerClassName="w-full lg:w-5/12 z-20"
    >
      {isOpen && (
        <ResourceSwapSideBarPanel resources={resources} onClose={onClose} />
      )}
    </AtlasSideBar>
  );
};

type ResourceSwapSideBarPanelProps = {
  resources?: string[];
  onClose?: () => void;
};
export const ResourceSwapSideBarPanel = (
  props: ResourceSwapSideBarPanelProps
) => {
  const { approveLords, isApproved: isLordsApprovedForExchange } =
    useApproveLordsForExchange();

  const { approveResources, isApproved: isResourcesApprovedForExchange } =
    useApproveResourcesForExchange();
  const tabs = useMemo(
    () => [
      {
        label: 'Swap',
        component: <SwapResources key="1" />,
      },
      {
        label: 'LP',
        component: <LpMerchant />,
      },
      // {
      //   label: 'Nexus',
      //   component: <Nexus />,
      // },
    ],
    []
  );
  return (
    <BaseSideBarPanel position="left" onClose={props.onClose}>
      <div>
        <h2 className="mt-2 mb-4 text-center">Trade</h2>
        {(!isLordsApprovedForExchange || !isResourcesApprovedForExchange) && (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              className="w-full"
              variant="primary"
              onClick={approveLords}
              disabled={isLordsApprovedForExchange}
            >
              APPROVE $LORDS <Lords className="w-4" />
            </Button>
            <Button
              className="w-full"
              variant="primary"
              onClick={approveResources}
              disabled={isResourcesApprovedForExchange}
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
              <Tabs.Tab key={tab.label} className="">
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panels className="h-full p-2 rounded shadow-inner bg-black/10">
            {tabs.map((tab) => (
              <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs>
      </div>
    </BaseSideBarPanel>
  );
};
