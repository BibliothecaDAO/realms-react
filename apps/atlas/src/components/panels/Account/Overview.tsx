import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardStats,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib';

import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
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

export function AccountOverview() {
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

  return (
    <div>
      <animated.div
        style={animationUp}
        className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:px-6"
      >
        <Card className="flex col-start-1 col-end-6">
          <div className="flex">
            <div className="relative">
              <Image
                src={'/stableai/archanist.png'}
                alt="map"
                height={300}
                width={300}
                className="w-24 h-24 mr-10 border shadow-2xl md:w-48 md:h-48 border-white/20 card paper"
              />
              <div className="absolute top-0 px-2 text-xl font-semibold border bg-black/30 border-white/20 font-lords ">
                1
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="self-center">
                {account && (
                  <span className="self-center text-center sm:text-xl font-lords">
                    {shortenAddressWidth(account, 6)}
                  </span>
                )}
                <h2 className="w-full sm:text-4xl">Ser, Your Vast Empire</h2>
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-6 md:col-end-8">
          <CardTitle>Settled Realms</CardTitle>
          <CardBody>
            <CardStats>{settledRealmsCount}</CardStats>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-8 md:col-end-11">
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
        {/* <Card className="col-start-1 col-end-13 md:col-start-11 md:col-end-13">
          <CardTitle>Relics Held</CardTitle>

          <CardBody>
            <CardStats>
              <span>{userData?.relicsHeld as ReactNode}</span>
            </CardStats>
            <Button variant="outline" size="xs" href="/bank">
              Start Raiding
            </Button>
          </CardBody>
        </Card>
         <Card className="col-start-1 col-end-13 md:col-start-9 md:col-end-13">
          <CardTitle>Production rate daily</CardTitle>

          <CardBody>
            {userData.resourcesAcrossEmpire.map((a, i) => {
              return (
                <div
                  key={i}
                  className="flex justify-between my-1 text-xl font-semibold tracking-widest uppercase"
                >
                  <div className="flex">
                    <ResourceIcon
                      size="sm"
                      className="self-center mr-2"
                      resource={a.resourceName.replace('_', '') as string}
                    />{' '}
                    {a.resourceName}
                  </div>
                  + {a.resourceCount * BASE_RESOURCES_PER_DAY}
                </div>
              );
            })}
          </CardBody>
          <Button
            disabled={!userData?.resourcesClaimable}
            variant="primary"
            size="md"
            onClick={() => claimAll()}
          >
            {userData?.resourcesClaimable
              ? 'Harvest All Resources'
              : 'nothing to claim'}
          </Button>
        </Card> */}
        {/* <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-4">
            <CardTitle>Raided in past 24hrs</CardTitle>
            <CardBody>
              <CardStats className="mb-4 text-3xl">2</CardStats>
              <Button variant="outline" size="xs" href="/bank">
                Start Raiding
              </Button>
            </CardBody>
          </Card> 

        <Card
          className={`col-start-1 col-end-13 md:col-start-1 md:col-end-5 max-h-96 overflow-y-scroll`}
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

        {/* <Card className="col-start-1 col-end-13 row-span-3 md:col-start-4 md:col-end-9">
            <div className="relative overflow-x-auto">
              {balance && (
                <Table
                  columns={columns}
                  data={defaultData}
                  options={tableOptions}
                />
              )}
            </div>
          </Card> 
        <Card
          className={`col-start-1 col-end-13 md:col-start-5 md:col-end-9 max-h-96 overflow-y-scroll `}
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
        <Card className="col-span-12 sm:col-start-1 sm:col-end-4">
          <CardTitle>Quick Actions</CardTitle>

          <CardBody>
            <p className="mb-3 font-semibold">
              HINT: Add a few Realms to your tx cart. Then follow the buttons in
              sequence. You may get an error if the Realm has already been
              minted.
            </p>
            <input
              placeholder="Type Id"
              type={'number'}
              className="w-full px-3 mx-auto mb-2 text-black rounded bg-white/80"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(parseInt(e.target.value));
              }}
              min="1"
              max="8000"
            />
            <Button
              variant="primary"
              size="xs"
              onClick={() => mintRealm(selectedId)}
            >
              Add realms to tx cart
            </Button>
            <hr className="my-2" />
            <Button
              variant="primary"
              size="xs"
              className="mb-2"
              onClick={() => {
                txQueue
                  .executeMulticall(
                    approveTxs.map((t) => ({ ...t, status: ENQUEUED_STATUS }))
                  )
                  .catch((err) => {
                    // TODO: handle error
                    console.log(err);
                  });
              }}
            >
              2. Approve All game Contracts
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => {
                setIsSettleRealmsSideBarOpen(true);
              }}
            >
              3. Settle Realms
            </Button>

            <div className="w-full mt-4">
              <Button
                variant="danger"
                size="xs"
                onClick={() =>
                  burnAll({
                    ids: balance?.map((a) => a.resourceId),
                    amounts: balance?.map((a) => a.amount),
                  })
                }
              >
                burn ALl resources!
              </Button>
            </div>
          </CardBody>
        </Card> */}
      </animated.div>
    </div>
  );
}
