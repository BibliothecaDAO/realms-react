import { Tabs } from '@bibliotheca-dao/ui-lib';
import { useEffect, useMemo, useState } from 'react';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { BasePanel } from './BasePanel';
import { AllCreations } from './creation/AllCreations';
import { Creation } from './creation/Creation';
import { MyCreations } from './creation/MyCreations';

export const CreationPanel = () => {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">Summon</div>
          </div>
        ),
        component: <Creation />,
      },
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">My Rulers</div>
          </div>
        ),
        component: <MyCreations />,
      },
      {
        label: (
          <div className="flex">
            <div className="hidden md:block">All</div>
          </div>
        ),
        component: <AllCreations />,
      },
    ],
    [selectedTab]
  );

  return (
    <BasePanel open={true}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="w-full overflow-y-auto bg-black border-t pt-14 sm:pt-0 border-white/20">
          <Tabs.List className="">
            {tabs.map((tab, index) => (
              <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </BasePanel>
  );
};
