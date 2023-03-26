import {
  Button,
  Card,
  CardBody,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib';
import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';

import type { Tx } from '@/context/CommandListContext';
import { useCommandList } from '@/context/CommandListContext';
import { useUIContext } from '@/context/UIContext';

import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import {
  getApproveAllGameContracts,
  useDumbGameApprovals,
} from '@/hooks/settling/useApprovals';
import useSettling, { Entrypoints } from '@/hooks/settling/useSettling';
import useUsersRealms from '@/hooks/settling/useUsersRealms';

type Prop = {
  onSettleRealms?: () => void;
};

export function MintRealms(props: Prop) {
  const { mintRealms } = useSettling();

  const [quantity, setQuantity] = useState(0);

  const txQueue = useCommandList();
  const approveTxs = getApproveAllGameContracts();

  const animationUp = useSpring({
    // opacity: true === 'account' ? 1 : 0,
    // transform: true === 'account' ? `translateY(0)` : `translateY(+10%)`,
    // delay: 350,
  });

  // console.log(userData?.resourcesClaimable);
  const [enqueuedMintTx, setEnqueuedMintTx] = useState<Tx[]>();

  useEffect(() => {
    setEnqueuedMintTx(
      txQueue.transactions.filter(
        (t: any) =>
          t.contractAddress == ModuleAddr.Realms &&
          t.entrypoint == Entrypoints.mint
      )
    );
  }, [txQueue.transactions]);
  const { toggleTransactionCart } = useUIContext();
  const { isGameApproved } = useDumbGameApprovals();
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
                className="h-6 px-2 pt-0 pb-1 mt-2 text-3xl leading-4"
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
                className="self-center w-12 mb-2 text-3xl leading-10 align-top bg-white border rounded border-white/40"
                min={1}
                max={5}
                stringMode // to support high precision decimals
                onChange={(value: any) => {
                  setQuantity(parseInt(value));
                }}
              />
              <Button
                variant="outline"
                className="h-6 px-2 pt-1 pb-1 mt-2 text-2xl leading-4"
                onClick={() => {
                  quantity < 5 && setQuantity(quantity + 1);
                }}
              >
                +
              </Button>
            </div>
            <p className="mb-4 text-sm text-center">Max Mint Amount: 5</p>

            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{quantity * 0.01} ETH</span>
            </div>
            <hr className="my-2" />

            <Button
              variant="primary"
              size="lg"
              className="mt-4"
              onClick={async () => {
                mintRealms(quantity);
                !isGameApproved &&
                  (await approveTxs.map(
                    async (t) => await txQueue.add({ ...t })
                  ));

                toggleTransactionCart();
              }}
              disabled={!!enqueuedMintTx?.length || quantity == 0}
            >
              {enqueuedMintTx?.length
                ? `${enqueuedMintTx.length} Realms in queue`
                : 'Mint Realms'}
            </Button>
          </CardBody>
        </Card>
      </animated.div>
    </div>
  );
}
