import { CardBody } from '@bibliotheca-dao/ui-lib';
import {
  useAccount,
  useStarknetExecute,
  useTransactionManager,
} from '@starknet-react/core';

import { useState } from 'react';
import {
  genEconomicRealmEvent,
  generateRealmEvent,
} from '@/components/realms/EventMappings';
import { HistoryCard } from '@/components/realms/HistoryCard';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { useCommandList } from '@/context/CommandListContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { MyRealms } from './MyRealms';

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

  const events = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        ...generateRealmEvent(realmEvent, true),
        timestamp: realmEvent.timestamp,
        eventId: realmEvent.eventId,
      };
    })
    .filter((row) => row.event !== '');

  console.log(accountData?.accountHistory);

  const { addTransaction } = useTransactionManager();

  return (
    <div>
      <div className="grid grid-cols-12 gap-3 md:gap-2 md:grid-cols-12 sm:px-2">
        {/* <Card className="col-start-1 col-end-13 md:col-start-7 md:col-end-9">
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
        </Card> */}

        {/* <Card
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
        </Card> */}
        <div className={`col-start-1 col-end-13 md:col-start-1 md:col-end-7 `}>
          <MyRealms />
        </div>
        <div className={`col-start-1 col-end-13 md:col-start-7 md:col-end-13 `}>
          <div className="p-2 mb-8">
            <h2>Vizir Reports</h2>
            <div className="px-10 mt-4 text-xl italic">
              "Your Majesty, we have been busy since you have been away."
            </div>
          </div>

          <CardBody className="h-screen overflow-y-auto border border-yellow-900">
            {events
              ? events.map((a, index) => {
                  return (
                    <HistoryCard
                      key={index}
                      timeStamp={a.timestamp}
                      event={a.event}
                      eventId={a.eventId}
                      action={a.action}
                    >
                      {a.relic}
                      {a.resources}
                    </HistoryCard>
                  );
                })
              : 'loading'}
          </CardBody>
        </div>
      </div>
    </div>
  );
}
