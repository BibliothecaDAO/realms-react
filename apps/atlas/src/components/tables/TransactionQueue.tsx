import { Button } from '@bibliotheca-dao/ui-lib/base';
import { TxCartItem } from '@/components/tables/Transactions';
import { useTransactionQueue } from '@/context/TransactionQueueContext';

type Prop = {
  onSubmit?: () => void;
};

export const TransactionQueue: React.FC<Prop> = (props) => {
  const txQueue = useTransactionQueue();
  return (
    <>
      <div className="flex justify-between mb-4">
        <Button
          onClick={() =>
            txQueue
              .executeMulticall([])
              .then((_txResp) => {
                props.onSubmit && props.onSubmit();
              })
              .catch((err) => {
                console.log(err);
                // TODO: Handle error
              })
          }
        >
          Submit {txQueue.transactions.length} Transaction(s)
        </Button>
        <Button onClick={() => txQueue.empty()}>Clear</Button>
      </div>
      {txQueue.transactions.map((c) => (
        <TxCartItem
          key={`${c.contractAddress}:${c.entrypoint}`}
          transaction={c}
        />
      ))}
    </>
  );
};
