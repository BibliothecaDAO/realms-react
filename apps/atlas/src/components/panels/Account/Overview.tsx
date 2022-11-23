import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardStats,
} from '@bibliotheca-dao/ui-lib';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { animated, useSpring } from '@react-spring/web';
import {
  useAccount,
  useStarknetExecute,
  useTransactionManager,
} from '@starknet-react/core';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';

type Prop = {
  onSettleRealms: () => void;
};

export function AccountOverview(props: Prop) {
  const { play } = useUiSounds(soundSelector.pageTurn);

  const { claimAll, userData, burnAll } = useUsersRealms();
  const { mintRealm } = useSettling();
  const { lordsBalance, balance } = useResourcesContext();
  const { address } = useAccount();
  const [selectedId, setSelectedId] = useState(0);

  const approveTxs = getApproveAllGameContracts();
  const txQueue = useCommandList();

  const { execute } = useStarknetExecute({ calls: approveTxs });

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(address || '0x0') } },
      { settledOwner: { equals: getAccountHex(address || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });
  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  const { data: accountData, loading: loadingData } = useGetAccountQuery({
    variables: { account: address ? getAccountHex(address) : '', realmIds },
    pollInterval: 10000,
    skip: !address,
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

  const { addTransaction } = useTransactionManager();

  const animationUp = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(+10%)`,
    // delay: 350,
  });

  const { starknetId } = useStarkNetId(address || '');

  return (
    <div>
      <animated.div
        style={animationUp}
        className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:px-6"
      >
        <Card className="flex col-start-1 col-end-13 row-span-2 md:col-start-1 md:col-end-7">
          <div className="flex">
            <div className="relative">
              <Image
                src={'/stableai/archanist.png'}
                alt="map"
                height={500}
                width={500}
                className="border shadow-2xl border-white/20 card paper"
              />
              <div className="absolute top-0 px-2 text-xl font-semibold border bg-black/30 border-white/20 font-lords ">
                1
              </div>
            </div>

            <div className="flex flex-wrap p-10">
              <div className="self-center">
                {address && (
                  <span className="self-center text-center sm:text-2xl font-display">
                    {starknetId ? starknetId : shortenAddressWidth(address, 6)}
                  </span>
                )}
                <h2 className="w-full mt-3 sm:text-4xl">Your Vast Empire</h2>
                <p>It has been busy since you have been away...</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-7 md:col-end-9">
          <CardTitle>Settled Realms</CardTitle>
          <CardBody>
            <CardStats>{settledRealmsCount}</CardStats>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-9 md:col-end-11">
          <CardTitle>Relics Held</CardTitle>

          <CardBody>
            <CardStats>
              <span>{userData?.relicsHeld as ReactNode}</span>
            </CardStats>
            <Button variant="outline" size="xs" href="/realm">
              Start Raiding
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-7 md:col-end-9">
          <CardTitle className="flex">Lords Balance</CardTitle>
          <CardBody>
            <CardStats className="flex justify-end ">
              {(+formatEther(lordsBalance)).toLocaleString()}{' '}
              <Lords className="self-center w-6 h-6 ml-4 fill-current" />
            </CardStats>
            <Button variant="outline" size="xs" href="/bank">
              Bank
            </Button>
          </CardBody>
        </Card>

        <Card
          className={`col-start-1 col-end-13 md:col-start-1 md:col-end-5 overflow-y-scroll`}
        >
          <CardTitle>Mercantile History</CardTitle>
          <CardBody>
            {economicEventData.map((a, index) => {
              return (
                <HistoryCard
                  key={index}
                  timeStamp={a.timestamp}
                  event={a.event}
                  action={a.action}
                />
              );
            })}
          </CardBody>
        </Card>

        <Card
          className={`col-start-1 col-end-13 md:col-start-5 md:col-end-9 overflow-y-scroll `}
        >
          <CardTitle>Battle History</CardTitle>
          <CardBody>
            {militaryEventData.map((a, index) => {
              return (
                <HistoryCard
                  key={index}
                  timeStamp={a.timestamp}
                  event={a.event}
                  eventId={a.eventId}
                  action={a.action}
                >
                  {a.resources}
                  {a.relic}
                </HistoryCard>
              );
            })}
          </CardBody>
        </Card>
      </animated.div>
    </div>
  );
}
