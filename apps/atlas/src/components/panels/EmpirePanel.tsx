import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Bank from '@bibliotheca-dao/ui-lib/icons/bank.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import { useAccount } from '@starknet-react/core';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useGetRealmsQuery } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { getAccountHex } from '@/shared/Getters/Realm';
import { SettleRealmsSideBar } from '../sidebars/SettleRealmsSideBar';
import { MyActions } from './Account/MyActions';
import { MyArmies } from './Account/MyArmies';
import { MyCrypts } from './Account/MyCrypts';
import { MyGA } from './Account/MyGA';
import { MyLoot } from './Account/MyLoot';
import { MyRealms } from './Account/MyRealms';
import { AccountOverview } from './Account/Overview';
import { BasePanel } from './BasePanel';

export function EmpirePanel() {
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { address } = useAccount();
  const [isSettleRealmsSideBarOpen, setIsSettleRealmsSideBarOpen] =
    useState(false);

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(address || '0x0') } },
      { settledOwner: { equals: getAccountHex(address || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });
  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  function onSettleRealmsClick() {
    setIsSettleRealmsSideBarOpen(!isSettleRealmsSideBarOpen);
  }

  const [selectedTab, setSelectedTab] = useState(0);
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
          <div className="flex whitespace-nowrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">Quick Actions</div>
          </div>
        ),
        component: <MyActions onSettleRealms={onSettleRealmsClick} />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Castle className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Realms</div>
          </div>
        ),
        component: <MyRealms />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Helm className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Armies</div>
          </div>
        ),
        component: <MyArmies />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Danger className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Crypts</div>
          </div>
        ),
        component: <MyCrypts />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Bag className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Loot</div>
          </div>
        ),
        component: <MyLoot />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My GA's</div>
          </div>
        ),
        component: <MyGA />,
      },
    ],
    [selectedTab]
  );
  const { claimAll, userData, burnAll } = useUsersRealms();

  const quickActions = useMemo(
    () => [
      {
        name: 'Harvest empire',
        icon: <Castle className="w-4 h-4 mr-1 fill-white self-center" />,
        details: <span className="flex"></span>,
        action: () => {
          claimAll();
        },
      },
      // {
      //   name: 'Secondary quick action',
      //   icon: <Sword className="w-4 h-4 mr-1" />,
      //   details: <span className="flex">action details</span>,
      // },
    ],
    []
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="flex px-10">
      <div className="w-9/12 px-20 bg-gray-1100 pt-20">
        <div className="flex w-full bg-black rounded-2xl mb-4 p-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              className="rounded-xl flex-col items-start whitespace-nowrap"
              variant="outline"
              onClick={action.action}
            >
              {userData?.resourcesClaimable}
              <span className="flex">
                {action.icon} {action.name}
              </span>
              {action.details}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => pressedTab(index as number)}
            variant="default"
          >
            <div className="bg-gradient-to-r from-gray-1000 via-red-900 to-gray-1000 py-[2px] sticky top-10 z-40">
              <div className="bg-gray-1100 overflow-x-auto">
                <Tabs.List>
                  {tabs.map((tab, index) => (
                    <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
                  ))}
                </Tabs.List>
              </div>
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
        </div>
      </div>
      <div className="w-3/12">
        <div className="sticky top-10">
          <img
            className="object-cover bg-white rounded h-screen"
            src={'/realm-troops/vizir.png'}
            alt="Vizir"
          />
        </div>
      </div>
    </div>
  );
}
