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
          disabled={txQueue.transactions.length == 0}
          variant="secondary"
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
          {txQueue.transactions.length > 0
            ? `Sign for ${txQueue.transactions.length} Command${
                txQueue.transactions.length > 1 ? 's' : ''
              }`
            : 'Sign the Decree'}
        </Button>
        <Button onClick={() => txQueue.empty()}>Clear</Button>
      </div>
      {txQueue.transactions.length > 0 ? (
        <p className="z-0 mb-2 text-xl">
          Ser, your royal signature is requested to execute the following
          commands:
        </p>
      ) : null}
      {txQueue.transactions.map((c) => (
        <TxCartItem
          key={`${c.contractAddress}:${c.entrypoint}::${c.calldata
            ?.map((bignum) => bignum.toString())
            .join(':')}`}
          transaction={c}
        />
      ))}
    </>
  );
};
