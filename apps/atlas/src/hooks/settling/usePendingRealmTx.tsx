import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';

interface Props {
  realmId: number;
}

export const usePendingRealmTx = (props: Props) => {
  const { realmId } = props;

  const txQueue = useCommandList();

  const [enqueuedTx, setEnqueuedTx] = useState(false);

  useEffect(() => {
    setEnqueuedTx(
      !!txQueue.transactions.find(
        (tx: any) => tx.metadata['realmId'] == realmId
      )
    );
  }, [txQueue.transactions]);

  return {
    enqueuedTx,
  };
};
