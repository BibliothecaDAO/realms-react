import { Button, Tabs } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown_icon.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import { useAccount } from '@starknet-react/core';
import { useState, useMemo } from 'react';
import { MyArmies } from '@/components/empire/MyArmies';
import { AccountOverview } from '@/components/empire/Overview';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { useCommandList } from '@/context/CommandListContext';
import { useUIContext } from '@/context/UIContext';
import {
  getApproveAllGameContracts,
  useDumbGameApprovals,
} from '@/hooks/settling/useApprovals';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useBreakpoint } from '@/hooks/useBreakPoint';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { MyActions } from './MyActions';
import { MyFood } from './MyFood';

export function EmpirePanel() {
  const breakpoints: any = useBreakpoint();
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
            <Crown className="self-center w-6 h-6 fill-current lg:mr-2" />
            <div className="hidden lg:block"> Empire</div>
          </div>
        ),
        component: <AccountOverview />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Sword className="self-center w-6 h-6 fill-current lg:mr-2" />
            <div className="hidden lg:block"> Quick Actions</div>
          </div>
        ),
        component: <MyActions onSettleRealms={toggleSettleRealms} />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Sickle className="self-center w-6 h-6 fill-current lg:mr-4" />
            <div className="hidden lg:block"> Food</div>
          </div>
        ),
        component: <MyFood />,
      },
      {
        label: (
          <div className="flex whitespace-nowrap">
            <Helm className="self-center w-6 h-6 fill-current lg:mr-2" />
            <div className="hidden lg:block"> My Armies</div>
          </div>
        ),
        component: <MyArmies />,
      },
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
                  <Button
                    key={action.name}
                    className={`flex-col items-start rounded-xl whitespace-nowrap`}
                    variant="outline"
                    onClick={() => action.action()}
                  >
                    <span className="flex">
                      {action.icon} {action.name}
                    </span>
                    {action.details}
                  </Button>
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
              <div className="sticky top-0 p-4 overflow-x-auto text-sm z-100 bg-gradient-to-r from-gray-900 to-gray-1000">
                <Tabs.List className="py-0">
                  {tabs.map((tab, index) => (
                    <Tabs.Tab noText={!breakpoints.lg} key={index}>
                      {tab.label}
                    </Tabs.Tab>
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
          className="object-cover w-full h-full bg-white rounded-xl"
          src={'/vizirs/mj_military_vizir.png'}
          alt="Vizir"
        />
      </div>
    </div>
  );
}
