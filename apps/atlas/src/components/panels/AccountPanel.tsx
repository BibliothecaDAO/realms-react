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
import { formatEther } from '@ethersproject/units';
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
import { getAccountHex } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { findResourceName } from '@/util/resources';

// import { BankCard } from './Account/AccountCards';
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

  /* const getRealmDetails = (realmId: number) =>
    realms.features.find((a: any) => a.properties.realm_idx === realmId)
      ?.properties; */

  const realmsCount =
    (accountData?.ownedRealmsCount ?? 0) +
    (accountData?.settledRealmsCount ?? 0);
  const successClass = '';
  const negativeClass = '';

  const resourcePillaged = (resources: any) => {
    return (
      <div className="my-4">
        {resources.map((resource, index) => {
          const info = findResourceName(resource.resourceId);
          return (
            <div className="flex justify-between my-1 text-white" key={index}>
              <div className="flex w-full">
                <ResourceIcon
                  size="xs"
                  className="self-center"
                  resource={info?.trait?.replace('_', '') as string}
                />{' '}
                <span className="self-center ml-4 font-semibold uppercase">
                  {info?.trait}
                </span>
              </div>

              <span className="self-center ml-4 font-semibold uppercase">
                {(+formatEther(resource.amount)).toFixed()} units
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  function genMilitaryRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return {
          event: event.data?.success ? (
            <span className="">
              Raid successful on Realm {event.data?.defendRealmId}
            </span>
          ) : (
            `Unsuccessful Raid`
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data?.pillagedResources),
          action: event.data?.success ? (
            <Button
              size="xs"
              variant="outline"
              href={'/ream/' + event.data?.defendRealmId}
            >
              Pillage and plunder again
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              href={'/ream/' + event.data?.defendRealmId}
            >
              Try again
            </Button>
          ),
        };
      case 'realm_combat_defend':
        return {
          event: event.data?.success ? (
            <span className="">
              We have been Pillaged by Realm {event.data?.attackRealmId}
            </span>
          ) : (
            <span className="">
              Defended raid from {event.data?.defendRealmId}
            </span>
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data?.pillagedResources),
          action: event.data?.success ? (
            <Button
              size="xs"
              variant="outline"
              href={'/ream/' + event.data?.attackRealmId}
            >
              Try again
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              href={'/ream/' + event.data?.attackRealmId}
            >
              muster the troops!
            </Button>
          ),
        };
      default:
        return {
          event: '',
          class: '',
          action: '',
        };
    }
  }
  function genEconomicRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_building_built':
        return {
          event: `Built ${event.data?.buildingName}`,
          class: successClass,
          action: '',
        };
      case 'realm_resource_upgraded':
        return {
          event: `Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`,
          class: successClass,
          action: '',
        };
      case 'realm_mint':
        return {
          event: `Minted Realm ${event.realmId}`,
          class: successClass,
          action: (
            <Button size="xs" variant="outline" href={'/ream/' + event.realmId}>
              Manage Realm
            </Button>
          ),
        };
      case 'realm_settle':
        return {
          event: 'Settled',
          class: successClass,
          action: '',
        };
      case 'realm_unsettle':
        return {
          event: 'Unsettled',
          class: successClass,
          action: '',
        };
      default:
        return {
          event: '',
          class: '',
          action: '',
        };
    }
  }

  const economicEventData = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        event: genEconomicRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event.event !== '');

  const militaryEventData = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        event: genMilitaryRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event.event !== '');

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
            <CardStats className="text-5xl">{realmsCount}</CardStats>
            <Button variant="primary" size="xs" href="/realm">
              See Realms
            </Button>
          </CardBody>
        </Card>
        <Card className="col-start-1 col-end-13 md:col-start-3 md:col-end-5">
          <CardTitle>Unsettled Realms</CardTitle>
          <CardBody>
            <CardStats className="text-5xl">{realmsCount}</CardStats>
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
          <div>Tenox: 91-100</div>
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
                <div
                  key={index}
                  className={`flex flex-wrap mb-2 justify-between border border-white/10 rounded-xl p-3 bg-black/80 ${
                    loadingData ?? 'animate-pulse'
                  }`}
                >
                  <div className="justify-between w-full h-full">
                    <div className="text-xs font-semibold text-white/40">
                      {new Date(a.timestamp).toLocaleTimeString('en-US')}{' '}
                      {new Date(a.timestamp).toLocaleDateString('en-US')}
                    </div>
                    <h3 className="text-white">{a.event.event}</h3>

                    {/* {a.event?.resources && a.event.resources} */}
                  </div>

                  <div className="mt-4">{a.event.action}</div>
                </div>
              );
            })}
          </CardBody>
        </Card>
        <Card className={`col-start-1 col-end-13 md:col-start-5 md:col-end-9`}>
          <CardTitle>Battle History</CardTitle>
          {/* <CardBody>
            {militaryEventData.map((a, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-wrap mb-2 justify-between border border-white/10 rounded-xl p-3 bg-black/80 ${
                    loadingData ?? 'animate-pulse'
                  }`}
                >
                  <div className="justify-between w-full h-full">
                    <div className="text-xs font-semibold text-white/40">
                      {new Date(a.timestamp).toLocaleTimeString('en-US')}{' '}
                      {new Date(a.timestamp).toLocaleDateString('en-US')}
                    </div>
                    <h3 className="text-white">{a.event.event}</h3>

                    
                  </div>

                  <div className="mt-4">{a.event.action}</div>
                </div>
              );
            })}
          </CardBody> */}
        </Card>

        {/* <Card className="col-start-5 col-end-9">
          <CardBody>
            <CardTitle>Resources + Lords</CardTitle>
            <BankCard/>
            <Button
              variant="primary"
              size="sm"
              className="mt-auto"
              href="/bank"
            >
              Go to Bank
            </Button>
          </CardBody>
        </Card> */}
      </animated.div>
    </BasePanel>
  );
}
