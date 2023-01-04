import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { BaseSideBarPanel } from '@/components/ui/sidebar/BaseSideBarPanel';
import { CommandList } from '@/components/ui/transactions/CommandList';
import { TransactionCartTable } from '@/components/ui/transactions/Transactions';
import { sidebarClassNames } from '@/constants/ui';
import { useUIContext } from '@/context/UIContext';
import AtlasSideBar from '../../map/AtlasSideBar';

interface TransactionCartSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const TransactionCartSideBar = ({
  isOpen,
  onClose,
}: TransactionCartSideBarProps) => {
  const { empireSidebar, resourcesListSidebar } = useUIContext();
  const offsetClasses = useMemo(() => {
    return empireSidebar || resourcesListSidebar ? 'mr-12 my-24' : '';
  }, [empireSidebar, resourcesListSidebar]);
  return (
    <AtlasSideBar
      isOpen={isOpen}
      containerClassName={twMerge(sidebarClassNames, offsetClasses, ' z-50')}
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
    <BaseSideBarPanel position="left" onClose={onClose}>
      <div className="relative px-6 rounded">
        <Tabs
          selectedIndex={selectedTab}
          onChange={(index) => setSelectedTab(index as number)}
          variant="primary"
        >
          <Tabs.List className="mt-2">
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
      </div>
    </BaseSideBarPanel>
  );
};
