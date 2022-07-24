import { Button } from '@bibliotheca-dao/ui-lib/base';
import React, { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { RealmResources } from '@/components/tables/RealmResources';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { createCall, Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import TxAddedToQueueLabel from '@/shared/TxAddedToQueueLabel';

type Prop = {
  realm: GetRealmQuery;
};

const Harvests: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;

  const isOwner = useIsOwner(realm?.settledOwner);

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const txQueue = useTransactionQueue();

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.calldata &&
          toBN(t.calldata[0]).eq(toBN(realm?.realmId))
      )
    );
  }, [txQueue.transactions]);

  if (!realm) {
    return null;
  }

  return (
    <>
      <RealmResources showClaimable realm={realm} loading={false} />
      {isOwner && (
        <div className="flex items-center">
          <Button
            disabled={enqueuedHarvestTx}
            size="sm"
            className="mt-3 ml-2"
            variant="primary"
            onClick={() => {
              txQueue.add(createCall.claim({ realmId: realm.realmId }));
            }}
          >
            Harvest Resources
          </Button>
          {enqueuedHarvestTx ? <TxAddedToQueueLabel /> : null}
        </div>
      )}
    </>
  );
};

export default Harvests;
