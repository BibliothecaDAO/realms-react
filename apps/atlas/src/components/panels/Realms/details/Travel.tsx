import { Tabs } from '@bibliotheca-dao/ui-lib';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import React, { useMemo, useState } from 'react';

import type { RealmFragmentFragment } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { ArmiesTravel } from './ArmiesTravel';
import { RealmsTravel } from './RealmsTravel';
type Prop = {
  realm: RealmFragmentFragment;
};

export const Travel = ({ realm }: Prop) => {
  const { userRealms } = useUsersRealms();
  const { play } = useUiSounds(soundSelector.pageTurn);
  const [selectedTab, setSelectedTab] = useState(0);

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-6 h-6 fill-current" />,
        component: <RealmsTravel realm={realm} userRealms={userRealms} />,
      },
      {
        label: <Head className="self-center w-6 h-6 fill-current" />,
        component: <ArmiesTravel realm={realm} userRealms={userRealms} />,
      },
    ],
    [userRealms, realm]
  );
  return (
    <div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="small"
      >
        <Tabs.List className="">
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};
