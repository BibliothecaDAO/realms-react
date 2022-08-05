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
import { RealmBuildingId, HarvestType } from '@/constants/buildings';
import { useRealmContext } from '@/context/RealmDetailContext';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useBuildings, {
  createBuildingCall,
} from '@/hooks/settling/useBuildings';
import { createFoodCall } from '@/hooks/settling/useFood';
import { createCall, Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import TxAddedToQueueLabel from '@/shared/TxAddedToQueueLabel';

type Prop = {
  realm: GetRealmQuery;
};

const Harvests: React.FC<Prop> = (props) => {
  const { buildings, loading } = useRealmContext();

  const { build } = useBuildings();
  const { availableFood } = useRealmContext();
  const realm = props.realm?.realm;

  const isOwner = useIsOwner(realm?.settledOwner);
  const txQueue = useTransactionQueue();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const getTrait = (realm: any, trait: string) => {
    return realm?.traits?.find((o) => o.type === trait)
      ? realm.traits?.find((o) => o.type === trait).qty
      : '0';
  };

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

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
        <CardTitle>Work huts</CardTitle>
        <CardBody>
          {' '}
          <p className="text-xl">
            Workhuts increase your production by 25 units per day. They cost 10%
            of all your resources to build.
          </p>{' '}
        </CardBody>

        <CardStats>
          <span className="text-4xl opacity-80">
            <span className="">
              {buildings?.find((a) => a.name === 'House')?.quantityBuilt}
            </span>
          </span>
        </CardStats>
        <div className="mt-2">
          <Button
            onClick={() =>
              txQueue.add(
                createBuildingCall.build({
                  realmId: realm.realmId,
                  buildingId: RealmBuildingId.House,
                  qty: 1,
                })
              )
            }
            size="xs"
            variant="primary"
          >
            Build workhuts
          </Button>
        </div>
      </Card>
      <Card className="col-start-1 col-end-4 ">
        <CardTitle>Resources</CardTitle>
        <RealmResources showClaimable realm={realm} loading={false} />
        <div className="mt-2">
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
          </div>
        </div>
      </Card>
      <Card className="col-start-4 col-end-12 ">
        <CardTitle>Instructions</CardTitle>
        <CardBody>
          <div className="p-2">
            <h4>Resources</h4>
            <p className="text-xl">
              Try and maximise your resource output by building workhuts.
            </p>
          </div>
          <hr />
          <div className="p-2">
            <h4>Food</h4>
            <p className="text-xl">
              Food accures per day after harvesting farms. You consume 1 food
              per second according to your population
            </p>
          </div>
        </CardBody>
      </Card>
      <Card className="flex flex-col h-full col-start-4 col-end-6 ">
        <CardTitle>Farms Built - Capacity {farmCapacity}</CardTitle>

        <CardStats className="text-4xl">
          {buildings?.find((a) => a.id === RealmBuildingId.Farm)?.quantityBuilt}
        </CardStats>
        <div className="flex mt-2 space-x-2">
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.create({
                  tokenId: realm?.realmId,
                  quantity: 1,
                  foodBuildingId: RealmBuildingId.Farm,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Build
          </Button>
          {/* eslint-disable */}
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.harvest({
                  tokenId: realm?.realmId,
                  harvestType: HarvestType.Store,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Export
          </Button>
          {/* eslint-disable */}
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.harvest({
                  tokenId: realm?.realmId,
                  harvestType: HarvestType.Export,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Harvest
          </Button>
        </div>
      </Card>
      <Card className="col-start-6 col-end-12 row-span-2">
        <CardTitle>Store house</CardTitle>
        <div className="w-1/2">Available food: {availableFood}</div>
      </Card>
      <Card className="flex flex-col h-full col-start-4 col-end-6">
        <CardTitle>
          Fishing Villages - Capacity {fishingVillageCapacity}
        </CardTitle>
        <CardStats className="text-4xl">
          {
            buildings?.find((a) => a.id === RealmBuildingId.FishingVillage)
              ?.quantityBuilt
          }
        </CardStats>
        <div className="flex mt-auto space-x-2">
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.create({
                  tokenId: realm?.realmId,
                  quantity: 1,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Build
          </Button>
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.harvest({
                  tokenId: realm?.realmId,
                  harvestType: HarvestType.Store,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Export
          </Button>
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.harvest({
                  tokenId: realm?.realmId,
                  harvestType: HarvestType.Export,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Harvest
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Harvests;
