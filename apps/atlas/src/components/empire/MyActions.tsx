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
import { generateRealmEvent } from '@/components/realms/EventMappings';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { SettleRealmsSideBar } from '@/components/realms/SettleRealmsSideBar';
import { BASE_RESOURCES_PER_DAY } from '@/constants/buildings';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useCommandList } from '@/context/CommandListContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';

type Prop = {
  onSettleRealms: () => void;
};

export function MyActions(props: Prop) {
  const { play } = useUiSounds(soundSelector.pageTurn);

  const { claimAll, userData, burnAll } = useUsersRealms();
  const { mintRealm } = useSettling();
  const { balance } = useUserBalancesContext();

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

  const txQueue = useCommandList();
  const approveTxs = getApproveAllGameContracts();

  const animationUp = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(+10%)`,
    // delay: 350,
  });

  // console.log(userData?.resourcesClaimable);
  console.log(!!userData?.resourcesClaimable);

  return (
    <div>
      <animated.div
        style={animationUp}
        className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:px-6"
      >
        <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-6">
          <CardTitle>Production rate daily</CardTitle>

          <CardBody>
            {userData.resourcesAcrossEmpire.map((a, i) => {
              return (
                <div key={i} className="flex justify-between my-1">
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

        <Card className="col-span-12 sm:col-start-6 sm:col-end-11">
          <CardTitle>Quick Actions</CardTitle>

          <CardBody>
            <p className="mb-3 font-semibold">
              Mint Realms for 0.01 ETH each. Input quantity below.
            </p>
            <Button
              variant="outline"
              size="xs"
              target={'_blank'}
              href="https://faucet.goerli.starknet.io/"
            >
              Get ETH from faucet
            </Button>
            <hr className="my-2" />
            <input
              placeholder="Type Id"
              type={'number'}
              className="w-full px-4 py-4 mx-auto mb-2 text-3xl text-center text-black rounded bg-white/80"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(parseInt(e.target.value));
              }}
              min="1"
              max="8000"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={() => mintRealm(selectedId)}
            >
              Mint Realms
            </Button>
            <hr className="my-2" />
            <Button
              variant="primary"
              size="lg"
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
            <Button variant="primary" size="lg" onClick={props.onSettleRealms}>
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
                burn all resources!
              </Button>
            </div>
          </CardBody>
        </Card>
      </animated.div>
    </div>
  );
}
