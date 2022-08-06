import {
  Button,
  Card,
  CardBody,
  CardStats,
  CardTitle,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { initSplineTexture } from 'three-stdlib';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, HarvestType } from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useBuildings, {
  createBuildingCall,
} from '@/hooks/settling/useBuildings';
import useFood, { createFoodCall } from '@/hooks/settling/useFood';
import { createCall, Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import TxAddedToQueueLabel from '@/shared/TxAddedToQueueLabel';

type Prop = {
  realm: GetRealmQuery;
};

interface ResourceAndFoodInput {
  farmsToBuild: string;
  fishingVillagesToBuild: string;
  workHutsToBuild: string;
}

const Harvests: React.FC<Prop> = (props) => {
  const { realmFoodDetails, availableFood } = useFood(
    props.realm?.realm.realmId
  );
  const { buildings } = useBuildings(props.realm?.realm.realmId);

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

  const [input, setInput] = useState<ResourceAndFoodInput>({
    farmsToBuild: '1',
    fishingVillagesToBuild: '1',
    workHutsToBuild: '1',
  });

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
    setInput({
      farmsToBuild: farmCapacity,
      fishingVillagesToBuild: fishingVillageCapacity,
      workHutsToBuild: '1',
    });
  }, [txQueue.transactions]);

  if (!realm) {
    return null;
  }

  return (
    <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
      <Card className="col-start-1 col-end-2 ">
        <div className="w-full p-4 mx-auto bg-white rounded bg-opacity-90">
          <Image
            width={200}
            height={200}
            className={'w-72 h-72 mx-auto'}
            src={'/realm-buildings/hut.png'}
          />
        </div>

        <CardTitle>Work huts</CardTitle>

        {/* <CardBody>
          {' '}
          <p className="text-xl">
            Workhuts increase your production by 25 units per day. They cost 10%
            of all your resources to build.
          </p>{' '}
        </CardBody> */}

        <CardStats>
          <span className="text-4xl opacity-80">
            <span className="">
              {buildings?.find((a) => a.name === 'House')?.quantityBuilt}
            </span>
          </span>
        </CardStats>
        <div className="flex mt-2 space-x-2">
          <Button
            onClick={() =>
              txQueue.add(
                createBuildingCall.build({
                  realmId: realm.realmId,
                  buildingId: RealmBuildingId.House,
                  qty: input.workHutsToBuild,
                })
              )
            }
            size="xs"
            variant="primary"
          >
            Build
          </Button>
          <InputNumber
            value={input.workHutsToBuild}
            inputSize="sm"
            colorScheme="transparent"
            className="w-12 bg-white border rounded border-white/40"
            min={1}
            max={10}
            stringMode
            onChange={(value: ValueType) =>
              setInput({
                farmsToBuild: input.farmsToBuild,
                fishingVillagesToBuild: input.fishingVillagesToBuild,
                workHutsToBuild: value.toString(),
              })
            }
          />{' '}
        </div>
      </Card>
      <Card className="col-start-2 col-end-4 ">
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

        <div className="flex flex-wrap justify-between p-2">
          <div className="w-1/2">
            <h5>farms built </h5>
            <div className="text-3xl">{realmFoodDetails.farmsBuilt}</div>
          </div>
          <div className="w-1/2">
            <h5>farms to harvest </h5>
            <div className="text-3xl">{realmFoodDetails.totalFarmHarvest}</div>
          </div>
          <div className="w-1/2">
            <h5>time till next harvest </h5>
            <div className="text-3xl">
              {realmFoodDetails.totalTimeRemainingUntilFarmHarvest}
            </div>
          </div>
          <div className="w-1/2">
            <h5>decayed farms</h5>
            <div className="text-3xl">{realmFoodDetails.decayedFarms}</div>
          </div>
        </div>
        <div className="flex mt-2 space-x-2">
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.create({
                  tokenId: realm?.realmId,
                  quantity: input.farmsToBuild,
                  foodBuildingId: RealmBuildingId.Farm,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Build
          </Button>
          <InputNumber
            value={input.farmsToBuild}
            inputSize="sm"
            colorScheme="transparent"
            className="w-12 bg-white border rounded border-white/40"
            min={1}
            max={farmCapacity}
            stringMode // to support high precision decimals
            onChange={(value: ValueType) =>
              setInput({
                farmsToBuild: value.toString(),
                fishingVillagesToBuild: input.fishingVillagesToBuild,
                workHutsToBuild: input.workHutsToBuild,
              })
            }
          />{' '}
          {/* eslint-disable */}
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.harvest({
                  tokenId: realm?.realmId,
                  harvestType: HarvestType.Export,
                  foodBuildingId: RealmBuildingId.Farm,
                })
              );
            }}
            size="xs"
            disabled={realmFoodDetails.totalFarmHarvest === 0}
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
                  harvestType: HarvestType.Store,
                  foodBuildingId: RealmBuildingId.Farm,
                })
              );
            }}
            size="xs"
            disabled={realmFoodDetails.totalFarmHarvest === 0}
            variant="primary"
          >
            Harvest
          </Button>
        </div>
      </Card>
      <Card className="col-start-6 col-end-12 row-span-2">
        <CardTitle>Store house</CardTitle>
        <div className="p-2 text-4xl"> {availableFood}s</div>
      </Card>
      <Card className="flex flex-col h-full col-start-4 col-end-6">
        <CardTitle>
          Fishing Villages - Capacity {fishingVillageCapacity}
        </CardTitle>
        <div className="flex flex-wrap justify-between p-2">
          <div className="w-1/2">
            <h5>villages built </h5>
            <div className="text-3xl">{realmFoodDetails.villagesBuilt}</div>
          </div>
          <div className="w-1/2">
            <h5>villages to harvest </h5>
            <div className="text-3xl">
              {realmFoodDetails.totalVillageHarvest}
            </div>
          </div>
          <div className="w-1/2">
            <h5>time till next harvest </h5>
            <div className="text-3xl">
              {realmFoodDetails.totalTimeRemainingUntilVillageHarvest}
            </div>
          </div>
          <div className="w-1/2">
            <h5>decayed villages</h5>
            <div className="text-3xl">{realmFoodDetails.decayedVillages}</div>
          </div>
        </div>
        <div className="flex mt-auto space-x-2">
          <Button
            onClick={() => {
              txQueue.add(
                createFoodCall.create({
                  tokenId: realm?.realmId,
                  quantity: input.fishingVillagesToBuild,
                  foodBuildingId: RealmBuildingId.FishingVillage,
                })
              );
            }}
            size="xs"
            variant="primary"
          >
            Build
          </Button>
          <InputNumber
            value={input.fishingVillagesToBuild}
            inputSize="sm"
            colorScheme="transparent"
            className="w-12 bg-white border rounded border-white/40"
            min={1}
            max={fishingVillageCapacity}
            stringMode
            onChange={(value: ValueType) =>
              setInput({
                farmsToBuild: input.farmsToBuild,
                fishingVillagesToBuild: value.toString(),
                workHutsToBuild: input.workHutsToBuild,
              })
            }
          />{' '}
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
            disabled={realmFoodDetails.totalVillageHarvest === 0}
            variant="primary"
          >
            Export
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
            disabled={realmFoodDetails.totalVillageHarvest === 0}
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
