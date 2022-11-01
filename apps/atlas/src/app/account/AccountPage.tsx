'use client';
import { Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import React, { useState, useMemo } from 'react';

import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { MyActions } from '@/components/panels/Account/MyActions';
import { MyArmies } from '@/components/panels/Account/MyArmies';
import { MyCrypts } from '@/components/panels/Account/MyCrypts';
import { MyGA } from '@/components/panels/Account/MyGA';
import { MyLoot } from '@/components/panels/Account/MyLoot';
import { MyRealms } from '@/components/panels/Account/MyRealms';
import { AccountOverview } from '@/components/panels/Account/Overview';
import { AccountPanel } from '@/components/panels/AccountPanel';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { RealmProvider } from '@/context/RealmContext';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';

export default function AccountPage() {
  const [isSettleRealmsSideBarOpen, setIsSettleRealmsSideBarOpen] =
    useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  function onSettleRealmsClick() {
    setIsSettleRealmsSideBarOpen(!isSettleRealmsSideBarOpen);
  }

  const { play } = useUiSounds(soundSelector.pageTurn);

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <Crown className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">Empire</div>
          </div>
        ),
        component: <AccountOverview onSettleRealms={onSettleRealmsClick} />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">Quick Actions</div>
          </div>
        ),
        component: <MyActions onSettleRealms={onSettleRealmsClick} />,
      },
      {
        label: (
          <div className="flex">
            <Castle className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Realms</div>
          </div>
        ),
        component: (
          <RealmProvider>
            <MyRealms />
          </RealmProvider>
        ),
      },
      {
        label: (
          <div className="flex no-wrap">
            <Helm className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Armies</div>
          </div>
        ),
        component: <MyArmies />,
      },
      {
        label: (
          <div className="flex ">
            <Danger className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Crypts</div>
          </div>
        ),
        component: <MyCrypts />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Bag className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Loot</div>
          </div>
        ),
        component: <MyLoot />,
      },
      {
        label: (
          <div className="flex no-wrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My GA's</div>
          </div>
        ),
        component: <MyGA />,
      },
    ],
    [selectedTab]
  );
  return (
    <>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="w-full overflow-y-auto border-t pt-14 sm:pt-0 border-white/20">
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
      <SettleRealmsSideBar
        isOpen={isSettleRealmsSideBarOpen}
        onClose={onSettleRealmsClick}
      />
    </>
  );
}
