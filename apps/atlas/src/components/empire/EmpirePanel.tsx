import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Bank from '@bibliotheca-dao/ui-lib/icons/bank.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
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
import {
  getAccountHex,
  hasSettledRealms,
} from '@/components/realms/RealmsGetters';
import { useCommandList } from '@/context/CommandListContext';
import { useUIContext } from '@/context/UIContext';
import {
  getApproveAllGameContracts,
  useDumbGameApprovals,
} from '@/hooks/settling/useApprovals';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { MyActions } from './MyActions';

export function EmpirePanel() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { play } = useUiSounds(soundSelector.pageTurn);
  const { address } = useAccount();
  const { userRealms } = useUsersRealms();

  const { toggleSettleRealms } = useUIContext();

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
        component: <MyActions onSettleRealms={toggleSettleRealms} />,
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

  const unsettledRealms = userRealms?.realms.filter(
    (r) => r.ownerL2 == getAccountHex(address || '0x0')
  );
  const { toggleTransactionCart } = useUIContext();
  const approveTxs = getApproveAllGameContracts();
  const txQueue = useCommandList();
  const { isGameApproved } = useDumbGameApprovals();
  const quickActions = useMemo(() => {
    const allActions = [
      {
        name: 'Get Started',
        icon: <Globe className="self-center w-4 h-4 mr-1 fill-white" />,
        details: <span className="flex"></span>,
        action: () => toggleSettleRealms(),
        enabled: !userRealms?.realms.length,
      },
      {
        name: 'Approve Eternum Contracts',
        icon: <Globe className="self-center w-4 h-4 mr-1 fill-white" />,
        details: <span className="flex"></span>,
        action: async () => {
          await approveTxs.map(async (t) => await txQueue.add({ ...t }));
          toggleTransactionCart();
        },
        enabled:
          !!userRealms?.realms.length &&
          userRealms?.realms.length > 0 &&
          !!isGameApproved &&
          !isGameApproved,
      },
      {
        name: 'Settle Realms (' + unsettledRealms?.length + ')',
        icon: <Castle className="self-center w-4 h-4 mr-1 fill-white" />,
        details: <span className="flex"></span>,
        action: () => toggleSettleRealms(),
        enabled:
          unsettledRealms?.length && unsettledRealms?.length > 0 ? true : false,
      },
      // {
      //   name: 'Harvest Resources',
      //   icon: <Castle className="self-center w-4 h-4 mr-1 fill-white" />,
      //   details: <span className="flex"></span>,
      //   action: () => claimAll(),
      //   enabled: userData.resourcesClaimable,
      // },
      // {
      //   name: 'Harvest Farms',
      //   icon: <Sword className="self-center w-4 h-4 mr-1" />,
      //   details: <span className="flex"></span>,
      //   action: () => {
      //     claimAll();
      //   },
      // },
    ];
    return allActions.filter((a) => a.enabled);
  }, [userRealms, isGameApproved, unsettledRealms]);

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <div className="relative flex flex-1 bg-yellow-scroll">
      <div className="relative w-9/12">
        <div className="flex-col h-full overflow-auto bg-gradient-to-r from-gray-900 to-gray-1000 rounded-xl">
          {quickActions.length > 0 && (
            <div className="flex w-full gap-2 p-4 mb-4 rounded-2xl">
              {quickActions.map((action) => {
                return (
                  <>
                    {
                      <Button
                        key={action.name}
                        className={`flex-col items-start rounded-xl whitespace-nowrap`}
                        variant="outline"
                        onClick={() => action.action()}
                      >
                        {/* {userData?.resourcesClaimable} */}
                        <span className="flex">
                          {action.icon} {action.name}
                        </span>
                        {action.details}
                      </Button>
                    }
                  </>
                );
              })}
            </div>
          )}
          <div className="relative">
            <Tabs
              selectedIndex={selectedTab}
              onChange={(index) => pressedTab(index as number)}
              variant="primary"
            >
              <div className="sticky top-0 z-20 p-4 overflow-x-auto rounded-xl backdrop-blur-sm">
                <Tabs.List className="py-0">
                  {tabs.map((tab, index) => (
                    <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
                  ))}
                </Tabs.List>
              </div>
              <div className="px-6 pb-6 mt-2">
                <Tabs.Panels>
                  {tabs.map((tab, index) => (
                    <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
                  ))}
                </Tabs.Panels>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="w-3/12 ml-4">
        <img
          className="object-cover h-full bg-white rounded-xl"
          src={'/vizirs/mj_military_vizir.png'}
          alt="Vizir"
        />
      </div>
    </div>
  );
}
