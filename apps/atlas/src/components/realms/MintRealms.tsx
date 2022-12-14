import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib';

import { animated, useSpring } from '@react-spring/web';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { generateRealmEvent } from '@/components/realms/EventMappings';
import { getAccountHex } from '@/components/realms/RealmsGetters';
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
  onSettleRealms?: () => void;
};

export function MintRealms(props: Prop) {
  const { claimAll, userData, burnAll } = useUsersRealms();
  const { mintRealms } = useSettling();
  const { balance } = useUserBalancesContext();

  const [quantity, setQuantity] = useState(0);

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
        <Card className="col-span-12 1">
          <div className="flex w-full">
            <CardTitle>Mint Realms</CardTitle>
            <Button
              variant="outline"
              size="xs"
              rel="noopener noreferrer"
              target={'_blank'}
              href="https://faucet.goerli.starknet.io/"
            >
              faucet
            </Button>
          </div>
          <CardBody>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="text-3xl h-6 px-2 pb-1 pt-0 mt-2 leading-4"
                onClick={() => {
                  quantity > 0 && setQuantity(quantity - 1);
                }}
              >
                -
              </Button>
              <InputNumber
                value={quantity}
                inputSize="md"
                colorScheme="transparent"
                className="self-center align-top w-12 leading-10	 mb-2 text-3xl bg-white border rounded border-white/40"
                min={1}
                max={5}
                stringMode // to support high precision decimals
                onChange={(value: any) => {
                  setQuantity(parseInt(value));
                }}
              />
              <Button
                variant="outline"
                className="text-2xl h-6 px-2 pb-1 pt-1 mt-2 leading-4"
                onClick={() => {
                  quantity < 5 && setQuantity(quantity + 1);
                }}
              >
                +
              </Button>
            </div>
            <p className="text-center text-sm mb-4">Max Mint Amount: 5</p>

            <hr className="my-2" />
            <div className="font-bold text-lg flex justify-between">
              <span>Total</span>
              <span>{quantity * 0.01} ETH</span>
            </div>
            <hr className="my-2" />

            <Button
              variant="primary"
              size="lg"
              className="mt-4"
              onClick={() => mintRealms(quantity)}
            >
              Mint Realms
            </Button>
          </CardBody>
        </Card>
      </animated.div>
    </div>
  );
}
