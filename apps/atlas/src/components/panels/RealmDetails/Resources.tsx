import {
  Button,
  Card,
  CardBody,
  CardStats,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import React, { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { RealmResources } from '@/components/tables/RealmResources';
import { useRealmContext } from '@/context/RealmDetailContext';
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
  const { availableFood } = useRealmContext();
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
    <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
      <Card className="col-start-1 col-end-3 ">
        <CardTitle>Vault accrued</CardTitle>
        <CardStats className="text-4xl">100</CardStats>
        <Button size="xs" variant="primary">
          Raid
        </Button>
      </Card>
      <Card className="col-start-3 col-end-4 ">
        <CardTitle>Harvestable Days</CardTitle>
        <CardStats className="text-4xl">100</CardStats>
      </Card>
      <Card className="col-start-1 col-end-4 ">
        <CardTitle>Work huts built</CardTitle>
        <CardBody>
          {' '}
          <p className="text-xl">
            Workhuts increase your production by 50 units per day. They cost 10%
            of all your resources to build.
          </p>{' '}
        </CardBody>

        <CardStats className="text-4xl">
          0 / <span className="text-xl opacity-80"> + 100 resources</span>
        </CardStats>
        <div className="mt-2">
          <Button size="xs" variant="outline">
            Build workhuts
          </Button>
        </div>
      </Card>
      <Card className="col-start-1 col-end-4 ">
        <CardTitle>Resources</CardTitle>
        <RealmResources showClaimable realm={realm} loading={false} />
        <div className="mt-2">
          {isOwner && (
            <div className="flex items-center">
              <Button
                disabled={enqueuedHarvestTx}
                size="xs"
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
        </div>
      </Card>
      <Card className="col-start-4 col-end-12 ">
        <CardTitle>Instructions</CardTitle>
        <CardBody>
          <h4>Resources</h4>
          <p className="text-xl">
            Try and maximise your resource output by building workhuts.
          </p>
          <hr />
          <h4>Food</h4>
          <p className="text-xl">
            Food accures per day after harvesting farms.
          </p>
        </CardBody>
      </Card>
      <Card className="flex flex-col h-full col-start-4 col-end-6 ">
        <CardTitle>Farms Built</CardTitle>

        <CardStats className="text-4xl">0</CardStats>
        <div className="flex mt-2 space-x-2">
          <Button size="xs" variant="primary">
            Building farms
          </Button>
          <Button size="xs" variant="primary">
            Harvest
          </Button>
        </div>
      </Card>
      <Card className="col-start-6 col-end-12 row-span-2">
        <CardTitle>Store house</CardTitle>
        <div className="w-1/2">Available food: {availableFood}</div>
      </Card>
      <Card className="flex flex-col h-full col-start-4 col-end-6">
        <CardTitle>Fishing Villages Built</CardTitle>
        <CardStats className="text-4xl">0</CardStats>
        <div className="flex mt-auto space-x-2">
          <Button size="xs" variant="primary">
            Building fishing villages
          </Button>
          <Button size="xs" variant="primary">
            Harvest
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Harvests;
