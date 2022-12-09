import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useState, useMemo } from 'react';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { CommandList } from '@/components/ui/transactions/CommandList';
import { TransactionCartTable } from '@/components/ui/transactions/Transactions';
import { sidebarClassNames } from '@/constants/ui';
import AtlasSideBar from '../../map/AtlasSideBar';

interface TransactionCartSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const TransactionCartSideBar = ({
  isOpen,
  onClose,
}: TransactionCartSideBarProps) => {
  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={sidebarClassNames.replace('z-30', 'z-40')}
    >
      {isOpen && <TransactionCartSideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

const TransactionCartSideBarPanel = ({ onClose }: { onClose?: () => void }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = useMemo(
    () => [
      {
        label: 'Command List',
        component: (
          <CommandList
            onSubmit={() => {
              setSelectedTab(1);
            }}
          />
        ),
      },
      {
        label: 'Status',
        component: <TransactionCartTable />,
      },
    ],
    []
  );

  return (
    <BaseSideBarPanel className="px-6 py-4">
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index as number)}
        variant="primary"
      >
        <Tabs.List className="">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.label}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels>
          {tabs.map((tab) => (
            <Tabs.Panel className="mt-0" key={tab.label}>
              {tab.component}
            </Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BaseSideBarPanel>
  );
};
