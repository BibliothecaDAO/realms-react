import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardStats,
  ResourceIcon,
  Table,
} from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import { formatEther } from '@ethersproject/units';
import { animated, useSpring } from '@react-spring/web';
import { useStarknet } from '@starknet-react/core';
import Image from 'next/future/image';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { RateChange } from '@/shared/Getters/Market';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  const { mintRealm } = useSettling();
  const { lordsBalance, balance } = useResourcesContext();
  const { account } = useStarknet();
  const { toggleMenuType, selectedPanel } = useAtlasContext();
  const [selectedId, setSelectedId] = useState(0);

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
      };
    })
    .filter((row) => row.event !== '');

  const txQueue = useTransactionQueue();
  const approveTxs = getApproveAllGameContracts();

  const animationUp = useSpring({
    opacity: selectedPanel === 'account' ? 1 : 0,
    transform:
      selectedPanel === 'account' ? `translateY(0)` : `translateY(+10%)`,
    delay: 350,
  });

  const animation = useSpring({
    opacity: selectedPanel === 'account' ? 1 : 0,
    transform:
      selectedPanel === 'account' ? `translateY(0)` : `translateY(-20%)`,
    delay: 150,
  });

  type Row = {
    resource: ReactElement;
    rate: ReactElement;
  };

  const defaultData: Row[] = balance?.map((resource) => {
    return {
      resource: (
        <div>
          <div className="flex flex-wrap sm:text-xl">
            <ResourceIcon
              className="self-center"
              resource={resource?.resourceName?.replace(' ', '') || ''}
              size="md"
            />
            <div className="flex flex-col w-full pt-2 md:ml-4 sm:w-2/3 md:mt-0">
              {' '}
              <span className="self-center w-full tracking-widest uppercase text-stone-200">
                {resource?.resourceName}
              </span>{' '}
              <span className="w-full text-xs tracking-widest uppercase sm:text-sm text-stone-400">
                {(+formatEther(resource.amount)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ),
      rate: (
        <span className="text-xs sm:text-lg">
          <span className="uppercase text-stone-500 sm:text-sm">
            $LORDS | {resource?.resourceName}
          </span>
          <br />1 = {(+formatEther(resource.rate)).toFixed(4)}
          <span className="ml-4 text-xs sm:text-sm">
            {RateChange(resource.percentChange)}
          </span>
        </span>
      ),

      lp_balance: (
        <span className="text-xs uppercase sm:text-lg">
          {(+formatEther(resource.lp)).toLocaleString()} <br />
          {/* <span className="text-xs sm:text-sm text-stone-500">
            LORDS: {(+formatEther(resource.currencyAmount)).toLocaleString()}
            <br />
            Token: {(+formatEther(resource.tokenAmount)).toLocaleString()}
          </span> */}
        </span>
      ),
    };
  });
  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    // { Header: 'Balance', id: 2, accessor: 'balance' },
    // { Header: 'Output', id: 3, accessor: 'output' },
    { Header: 'Rate', id: 5, accessor: 'rate' },
    // { Header: 'Change', id: 4, accessor: 'change' },

    { Header: 'Your LP', id: 6, accessor: 'lp_balance' },
  ];
  const tableOptions = { is_striped: true };

  return (
    <BasePanel open={selectedPanel === 'account'}>
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
      <animated.div
        style={animationUp}
        className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:p-6"
      >
        <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-4">
          <CardTitle>Settled Realms</CardTitle>
          <CardBody>
            <CardStats className="mb-4 text-5xl">
              {settledRealmsCount}
            </CardStats>
            <Button variant="outline" size="xs" href="/realm?tab=Your">
              See Realms
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-4 md:col-end-9">
          <CardTitle>Lords Balance</CardTitle>
          <CardBody>
            <CardStats className="mb-4 text-5xl">
              {(+formatEther(lordsBalance)).toLocaleString()}
            </CardStats>
            <Button variant="outline" size="xs" href="/bank">
              Bank
            </Button>
          </CardBody>
        </Card>
        <Card className="col-span-12 sm:col-start-9 sm:col-end-13">
          <CardTitle>Mint Test Realms</CardTitle>

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
              onClick={() => toggleMenuType('settleRealms')}
            >
              3. Settle Realms
            </Button>
          </CardBody>
        </Card>
        {/* <Card className={`col-start-1 col-end-13 md:col-start-9 md:col-end-13`}>
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
        </Card> */}

        <Card className="col-start-1 col-end-13 row-span-3 md:col-start-4 md:col-end-9">
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
          className={`col-start-1 col-end-13 md:col-start-9 md:col-end-13 `}
        >
          <CardTitle>Battle History</CardTitle>
          <CardBody>
            {militaryEventData.map((a, index) => {
              return (
                <HistoryCard
                  key={index}
                  timeStamp={a.timestamp}
                  event={a.event}
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
    </BasePanel>
  );
}
