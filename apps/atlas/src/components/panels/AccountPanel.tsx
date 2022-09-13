import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardStats,
  ResourceIcon,
  Table,
  Tabs,
} from '@bibliotheca-dao/ui-lib';

import Bag from '@bibliotheca-dao/ui-lib/icons/bag.svg';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Eth from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';

import Laurel from '@bibliotheca-dao/ui-lib/icons/laurel.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';

import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { formatEther } from '@ethersproject/units';
import { animated, useSpring } from '@react-spring/web';
import { useStarknet } from '@starknet-react/core';
import Image from 'next/future/image';
import type { ReactNode } from 'react';
import { ReactElement, useState, useMemo } from 'react';
import { BASE_RESOURCES_PER_DAY } from '@/constants/buildings';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { RateChange } from '@/shared/Getters/Market';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { SettleRealmsSideBar } from '../sidebars/SettleRealmsSideBar';
import { MyRealms } from './Account/MyRealms';
import { AccountOverview } from './Account/Overview';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  const { play } = useUiSounds(soundSelector.pageTurn);

  const { claimAll, userData, burnAll } = useUsersRealms();
  const { mintRealm } = useSettling();
  const { lordsBalance, balance } = useResourcesContext();
  const { account } = useStarknet();
  const [selectedId, setSelectedId] = useState(0);
  const [isSettleRealmsSideBarOpen, setIsSettleRealmsSideBarOpen] =
    useState(false);

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(account || '0x0') } },
      { settledOwner: { equals: getAccountHex(account || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });
  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  const { data: accountData, loading: loadingData } = useGetAccountQuery({
    variables: { account: account ? getAccountHex(account) : '', realmIds },
    pollInterval: 10000,
    skip: !account,
  });

  /* const getRealmDetails = (realmId: number) =>
    realms.features.find((a: any) => a.properties.realm_idx === realmId)
      ?.properties; */

  const settledRealmsCount = accountData?.settledRealmsCount ?? 0;

  const unSettledRealmsCount = accountData?.ownedRealmsCount ?? 0;

  const economicEventData = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        ...genEconomicRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event !== '');

  const militaryEventData = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        ...genMilitaryRealmEvent(realmEvent, true),
        timestamp: realmEvent.timestamp,
        eventId: realmEvent.eventId,
      };
    })
    .filter((row) => row.event !== '');

  const txQueue = useTransactionQueue();
  const approveTxs = getApproveAllGameContracts();

  const animationUp = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(+10%)`,
    // delay: 350,
  });

  const animation = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(-20%)`,
    // delay: 150,
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        label: (
          <div className="flex">
            <Crown className="self-center w-6 h-6 mr-4 fill-current" /> Empire
          </div>
        ),
        component: <AccountOverview />,
      },
      {
        label: (
          <div className="flex">
            <Castle className="self-center w-6 h-6 mr-4 fill-current" /> My
            Realms
          </div>
        ),
        component: <MyRealms />,
      },
      {
        label: (
          <div className="flex ">
            <Danger className="self-center w-6 h-6 mr-4 fill-current" /> My
            Crypts
          </div>
        ),
        component: <div />,
      },
      {
        label: (
          <div className="flex ">
            <Bag className="self-center w-6 h-6 mr-4 fill-current" /> My Loot
          </div>
        ),
        component: <div />,
      },
    ],
    [selectedTab]
  );

  const pressedTab = (index) => {
    play();
    setSelectedTab(index as number);
  };

  return (
    <BasePanel open={true}>
      <animated.div
        style={animation}
        className="w-full p-10 py-10 border-b-4 shadow-xl bg-black/60 border-black/40"
      >
        <div className="flex justify-start">
          <div className="relative hidden sm:block">
            <Image
              src={'/keyImage-tablet.png'}
              alt="map"
              height={300}
              width={300}
              className="w-24 h-24 mr-10 border-2 rounded-full shadow-2xl md:w-48 md:h-48 border-white/20"
            />
            <div className="absolute px-2 text-xl font-semibold border-2 rounded-full bg-black/80 border-white/70 bottom-10 right-10">
              1
            </div>
          </div>

          <div className="flex flex-wrap mt-10">
            <div className="self-center">
              <h2 className="w-full sm:text-5xl">Ser, Your Vast Empire</h2>
              {account && (
                <span className="self-center font-semibold text-center sm:text-xl">
                  {shortenAddressWidth(account, 6)}
                </span>
              )}
            </div>
          </div>
        </div>
      </animated.div>

      <Tabs
        selectedIndex={selectedTab}
        onChange={(index) => pressedTab(index as number)}
        variant="default"
      >
        <div className="border-t border-white/20">
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
        onClose={() => {
          setIsSettleRealmsSideBarOpen(false);
        }}
      />
    </BasePanel>
  );
}
