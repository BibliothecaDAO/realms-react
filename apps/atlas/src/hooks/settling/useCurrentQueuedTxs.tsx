import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';

interface Props {
  moduleAddr: string;
  entryPoint: string;
  realmId: number;
}

export const useCurrentQueuedTxs = (props: Props) => {
  const { moduleAddr, entryPoint, realmId } = props;

  const txQueue = useCommandList();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == moduleAddr &&
          t.entrypoint == entryPoint &&
          t.calldata &&
          BigNumber.from(t.calldata[0] as string).eq(BigNumber.from(realmId))
      )
    );
  }, [txQueue.transactions]);

  return {
    enqueuedHarvestTx,
  };
};
