import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useState, useMemo } from 'react';
import { CommandList } from '../tables/CommandList';
import { TransactionCartTable } from '../tables/Transactions';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

interface TransactionCartSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const TransactionCartSideBar = ({
  isOpen,
  onClose,
}: TransactionCartSideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12 z-[31]">
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
    [selectedTab]
  );

  return (
    <BaseSideBarPanel onClose={onClose}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index as number)}
        variant="default"
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
    </BaseSideBarPanel>
  );
};
