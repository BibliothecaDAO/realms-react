import {
  Button,
  Card,
  CardBody,
  CardTitle,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib';

import { animated, useSpring } from '@react-spring/web';
import { useStarknet } from '@starknet-react/core';
import { useState } from 'react';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { BASE_RESOURCES_PER_DAY } from '@/constants/buildings';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useCommandList } from '@/context/CommandListContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import {
  genEconomicRealmEvent,
  genMilitaryRealmEvent,
} from '@/shared/Dashboard/EventMappings';

import { getAccountHex } from '@/shared/Getters/Realm';
type Prop = {
  onSettleRealms: () => void;
};

export function MyActions(props: Prop) {
  const { play } = useUiSounds(soundSelector.pageTurn);

  const { claimAll, userData, burnAll } = useUsersRealms();
  const { mintRealm } = useSettling();
  const { lordsBalance, balance } = useResourcesContext();
  const { account } = useStarknet();
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
        eventId: realmEvent.eventId,
      };
    })
    .filter((row) => row.event !== '');

  const txQueue = useCommandList();
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
        </Card> */}
        <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-6">
          <CardTitle>Production rate daily</CardTitle>

          <CardBody>
            {userData.resourcesAcrossEmpire.map((a, i) => {
              return (
                <div
                  key={i}
                  className="flex justify-between my-1 text-xl font-semibold tracking-widest uppercase font-display"
                >
                  <div className="flex">
                    <ResourceIcon
                      size="sm"
                      label
                      className="self-center mr-2"
                      resource={a.resourceName.replace('_', '') as string}
                    />{' '}
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
        </Card>

        <Card className="col-span-12 sm:col-start-6 sm:col-end-9">
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
              onClick={async () => {
                await txQueue.add(
                  approveTxs.map((t) => ({ ...t, status: ENQUEUED_STATUS }))
                );
                await txQueue.executeMulticall();
              }}
            >
              2. Approve All game Contracts
            </Button>
            <Button variant="primary" size="xs" onClick={props.onSettleRealms}>
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
        </Card>
      </animated.div>
    </div>
  );
}
