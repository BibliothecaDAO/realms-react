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
import { MyArmies } from '@/components/empire/MyArmies';
import { MyCrypts } from '@/components/empire/MyCrypts';
import { MyGA } from '@/components/empire/MyGA';
import { MyLoot } from '@/components/empire/MyLoot';
import { MyRealms } from '@/components/empire/MyRealms';
import { AccountOverview } from '@/components/empire/Overview';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { useGetRealmsQuery } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { SettleRealmsSideBar } from '../realms/SettleRealmsSideBar';
import { BasePanel } from '../ui/panel/BasePanel';
import { MyActions } from './MyActions';

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
        component: <AccountOverview />,
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
      // {
      //   label: (
      //     <div className="flex whitespace-nowrap">
      //       <Castle className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
      //       <div className="hidden md:block">My Realms</div>
      //     </div>
      //   ),
      //   component: <MyRealms />,
      // },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Helm className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
            <div className="hidden md:block">My Armies</div>
          </div>
        ),
        component: <MyArmies />,
      },
      // {
      //   label: (
      //     <div className="flex whitespace-nowrap">
      //       <Danger className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
      //       <div className="hidden md:block">My Crypts</div>
      //     </div>
      //   ),
      //   component: <MyCrypts />,
      // },
      // {
      //   label: (
      //     <div className="flex whitespace-nowrap">
      //       <Bag className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
      //       <div className="hidden md:block">My Loot</div>
      //     </div>
      //   ),
      //   component: <MyLoot />,
      // },
      // {
      //   label: (
      //     <div className="flex whitespace-nowrap">
      //       <Sword className="self-center w-6 h-6 fill-current md:mr-4" />{' '}
      //       <div className="hidden md:block">My GA's</div>
      //     </div>
      //   ),
      //   component: <MyGA />,
      // },
    ],
    [selectedTab]
  );
  const { claimAll, userData } = useUsersRealms();

  const quickActions = useMemo(
    () => [
      {
        name: 'Harvest Resources',
        icon: <Castle className="self-center w-4 h-4 mr-1 fill-white" />,
        details: <span className="flex"></span>,
        action: () => claimAll(),
      },
      // {
      //   name: 'Harvest Farms',
      //   icon: <Sword className="self-center w-4 h-4 mr-1" />,
      //   details: <span className="flex"></span>,
      //   action: () => {
      //     claimAll();
      //   },
      // },
    ],
    [userData]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="flex pl-2 pr-6">
      <div className="w-9/12 py-16 pl-16 pr-4">
        <div className="sticky flex flex-col p-6 border-4 border-yellow-800/60 bg-gradient-to-r from-gray-900 to-gray-1000 rounded-2xl top-10 ">
          <div className="flex w-full gap-2 mb-4 rounded-2xl">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                className="flex-col items-start rounded-xl whitespace-nowrap"
                variant="outline"
                onClick={() => action.action()}
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
              variant="primary"
            >
              <div className="overflow-x-auto">
                <Tabs.List>
                  {tabs.map((tab, index) => (
                    <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
                  ))}
                </Tabs.List>
              </div>
              <div className="p-0 mt-2">
                <Tabs.Panels>
                  {tabs.map((tab, index) => (
                    <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
                  ))}
                </Tabs.Panels>
              </div>
            </Tabs>
            <SettleRealmsSideBar
              isOpen={isSettleRealmsSideBarOpen}
              onClose={onSettleRealmsClick}
            />
          </div>
        </div>
      </div>
      <div className="w-3/12 py-16">
        <div className="sticky top-10">
          <img
            className="object-cover h-screen bg-white rounded-2xl"
            src={'/vizirs/mj_military_vizir.png'}
            alt="Vizir"
          />
        </div>
      </div>
    </div>
  );
}
