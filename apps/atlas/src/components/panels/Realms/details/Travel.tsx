import { OrderIcon, Tabs, Table, Button } from '@bibliotheca-dao/ui-lib';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, STORE_HOUSE_SIZE } from '@/constants/buildings';
import { useAtlasContext } from '@/context/AtlasContext';
import type { GetRealmQuery, RealmFragmentFragment } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
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
    [realm?.realmId, userRealms]
  );
  return (
    <div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <Tabs.List className="">
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index} className="uppercase">
              {tab.label}
            </Tabs.Tab>
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
