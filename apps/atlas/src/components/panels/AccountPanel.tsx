import {
  Button,
  ResourceIcon,
  Card,
  CardBody,
  CardTitle,
  CardStats,
  Donut,
} from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import { animated, useSpring } from '@react-spring/web';
import { useStarknet } from '@starknet-react/core';
import Image from 'next/future/image';
import { useState } from 'react';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useGetAccountQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';
import { HistoryCard } from '@/shared/Dashboard/HistoryCard';
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { BasePanel } from './BasePanel';

export function AccountPanel() {
  /* const { state, actions } = useJourneyContext(); */

  const { mintRealm } = useSettling();

  const { account } = useStarknet();
  const { toggleMenuType, selectedPanel } = useAtlasContext();

  const [selectedId, setSelectedId] = useState(0);

  const { data: accountData, loading: loadingData } = useGetAccountQuery({
    variables: { account: account ? getAccountHex(account) : '' },
    pollInterval: 10000,
  });

  console.log(accountData);

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
        ...genMilitaryRealmEvent(realmEvent),
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

  return (
    <BasePanel open={selectedPanel === 'account'}>
      <animated.div
        style={animation}
        className="w-full p-10 py-10 border-b-4 shadow-xl bg-black/60 border-black/40"
      >
        <div className="flex">
          <div className="relative">
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

          <div className="flex flex-wrap">
            <div className="flex">
              {' '}
              <Crown className={`stroke-current w-12 h-12 self-center`} />
              {account && (
                <span className="self-center ml-4 text-xl font-semibold text-center">
                  {shortenAddressWidth(account, 6)}
                </span>
              )}
            </div>

            <h2 className="w-full sm:text-5xl">Ser, Your Vast Empire</h2>
            <div>
              <Button
                variant="primary"
                size="xs"
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
                Approve All game Contracts
              </Button>
              {/* <Button
                variant="primary"
                className="mt-auto ml-8"
                size="xs"
                onClick={() => toggleMenuType('bridgeRealms')}
              >
                Bridge Realms
              </Button> */}
              <Button
                className="ml-8"
                variant="primary"
                size="xs"
                onClick={() => toggleMenuType('settleRealms')}
              >
                Settle Realms
              </Button>
            </div>
          </div>
        </div>
      </animated.div>
      <animated.div
        style={animationUp}
        className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:p-6"
      >
        <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-3">
          <CardTitle>Settled Realms</CardTitle>
          <CardBody>
            <CardStats className="text-5xl">{settledRealmsCount}</CardStats>
            <Button variant="primary" size="xs" href="/realm">
              See Realms
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-3 md:col-end-5">
          <CardTitle>Unsettled Realms</CardTitle>
          <CardBody>
            <CardStats className="text-5xl">{unSettledRealmsCount}</CardStats>
            <Button
              className="w-full"
              variant="primary"
              size="xs"
              onClick={() => toggleMenuType('settleRealms')}
            >
              Settle Realms
            </Button>
          </CardBody>
        </Card>
        {/* <Card className="col-start-3 col-end-5">
          <CardTitle>Crypts</CardTitle>
          <CardBody>
            <CardStats className="text-5xl">20</CardStats>
            <Button className="mt-10" variant="primary" size="sm" href="/crypt">
              See Crypts
            </Button>
          </CardBody>
        </Card> */}
        <Card className="col-start-8 col-end-13">
          <CardTitle>Mint Test Realms [card only for alpha]</CardTitle>
          <div>loaf: 21-30</div>
          <div>redbeard: 31-40</div>
          <div>unidendefi: 41-50</div>
          <div>milan: 51-60</div>
          <div>abrax: 61-70</div>
          <div>secretive: 71-80</div>
          <div>amaro: 81-90</div>
          <div>tenox: 151-160</div>
          <CardBody>
            <input
              placeholder="Type Id"
              type={'number'}
              className="w-3/12 p-2 mx-auto mb-2 text-black rounded bg-white/80"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(parseInt(e.target.value));
              }}
              min="1"
              max="8000"
            />
            <Button
              className="ml-8"
              variant="primary"
              size="sm"
              onClick={() => mintRealm(selectedId)}
            >
              Mint Realms
            </Button>
          </CardBody>
        </Card>
        <Card className={`col-start-1 col-end-13 md:col-start-1 md:col-end-5`}>
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
        <Card className={`col-start-1 col-end-13 md:col-start-5 md:col-end-9`}>
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
                </HistoryCard>
              );
            })}
          </CardBody>
        </Card>
      </animated.div>
    </BasePanel>
  );
}
