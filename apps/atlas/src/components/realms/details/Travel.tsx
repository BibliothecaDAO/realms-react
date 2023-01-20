import { OrderIcon, Tabs } from '@bibliotheca-dao/ui-lib';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import React, { useMemo, useState } from 'react';

import type { RealmFragmentFragment } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { getRealmOrderById } from '../RealmsGetters';
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
        label: <Head className="self-center w-4 h-4 fill-current" />,
        component: <ArmiesTravel realm={realm} userRealms={userRealms} />,
      },
      // {
      //   label: <Map className="self-center w-4 h-4 fill-current" />,
      //   component: <RealmsTravel realm={realm} userRealms={userRealms} />,
      // },
    ],
    [userRealms, realm]
  );
  return (
    <div className="p-5">
      <div className="mb-4">
        <h1 className="flex">
          {' '}
          <OrderIcon
            className="self-center mx-2"
            size="lg"
            order={getRealmOrderById(realm.realmId) || ''}
          />{' '}
          <span className="self-center">{realm.name}</span>
        </h1>
        <hr />
        <h3 className="mt-3">
          Travel an Army to {realm.name}, then you will be able to Attack.
        </h3>
      </div>

      <ArmiesTravel realm={realm} userRealms={userRealms} />

      {/* <Tabs
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
      </Tabs> */}
      {/* <div className="my-2">
        <img src="/vizirs/mj_travel.png" alt="" className="rounded" />
      </div> */}
    </div>
  );
};
