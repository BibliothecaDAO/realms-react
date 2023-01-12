import {
  Button,
  Card,
  CardBody,
  CardTitle,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib';

import { animated, useSpring } from '@react-spring/web';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { generateRealmEvent } from '@/components/realms/EventMappings';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { BASE_RESOURCES_PER_DAY } from '@/constants/globals';
import { ENQUEUED_STATUS } from '@/constants/index';
import { useCommandList } from '@/context/CommandListContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { getApproveAllGameContracts } from '@/hooks/settling/useApprovals';
import useSettling from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { LaborTable } from '../realms/details/LaborTable';

type Prop = {
  onSettleRealms?: () => void;
};

export function MyActions(props: Prop) {
  const { claimAll, userData, burnAll, userRealms } = useUsersRealms();
  const { mintRealms } = useSettling();
  const { balance } = useUserBalancesContext();

  return (
    <div className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:px-6">
      <div className="col-start-1 col-end-13">
        {userRealms?.realms.map((realm, index) => {
          return <LaborTable key={index} realm={realm} />;
        })}
      </div>
      {/* <Card className="col-start-1 col-end-13 md:col-start-1 md:col-end-6">
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
      </Card> */}

      <Card className="col-span-12 sm:col-start-1 sm:col-end-5">
        <CardTitle>Quick Actions</CardTitle>

        <CardBody>
          <Button variant="primary" size="lg" onClick={props.onSettleRealms}>
            Mint & Settle Realms
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
    </div>
  );
}
