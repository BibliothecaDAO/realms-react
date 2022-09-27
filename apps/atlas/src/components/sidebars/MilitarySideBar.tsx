import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useState, useMemo } from 'react';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import { MilitaryStatistics } from '../tables/MilitaryStatistics';
import AtlasSideBar from './AtlasSideBar';
import { BaseSideBarPanel } from './BaseSideBarPanel';

interface MilitarySideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MilitarySideBar = ({ isOpen, onClose }: MilitarySideBarProps) => {
  return (
    <AtlasSideBar isOpen={isOpen} containerClassName="w-full lg:w-5/12">
      {isOpen && <MilitarySideBarPanel onClose={onClose} />}
    </AtlasSideBar>
  );
};

export const MilitarySideBarPanel = ({ onClose }: { onClose?: () => void }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const { data: troopStatsData } = useGetTroopStatsQuery();

  const tabs = useMemo(
    () => [
      {
        label: 'Armory',
        component: troopStatsData?.getTroopStats && <span></span>,
      },
      {
        label: 'Statistics & Cost',
        component: (
          <MilitaryStatistics statistics={troopStatsData?.getTroopStats} />
        ),
      },
    ],
    [selectedTab]
  );

  return (
    <BaseSideBarPanel title="Military Cart" onClose={onClose}>
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
    </BaseSideBarPanel>
  );
};
