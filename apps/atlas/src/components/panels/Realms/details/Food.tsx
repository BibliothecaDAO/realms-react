import {
  Card,
  CardTitle,
  CardStats,
  Button,
  CountdownTimer,
  InputNumber,
  CardBody,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import {
  RealmBuildingId,
  HarvestType,
  HARVEST_LENGTH,
  WORK_HUT_OUTPUT,
  WORK_HUT_COST,
  MAX_HARVESTS,
  BASE_FOOD_PRODUCTION,
  FISH_ID,
  WHEAT_ID,
} from '@/constants/buildings';
import { useCommandList } from '@/context/CommandListContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import type {
  GetRealmQuery,
  Realm,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useFood from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import { CostBlock } from '@/shared/Getters/Realm';
import type {
  BuildingDetail,
  RealmFoodDetails,
  AvailableResources,
} from '@/types/index';

type Prop = {
  realm: RealmFragmentFragment;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  loading: boolean;
};

const getTrait = (realm: any, trait: string) => {
  return realm?.traits?.find((o) => o.type === trait)
    ? realm.traits?.find((o) => o.type === trait).qty
    : '0';
};

interface ResourceAndFoodInput {
  farmsToBuild: string;
  fishingVillagesToBuild: string;
  fishConversion: string;
  wheatConversion: string;
}

const RealmsFood: React.FC<Prop> = (props) => {
  const realm = props.realm;

  console.log(realm);

  const { balance } = useResourcesContext();

  const getFishBalance = balance.find((a) => a.resourceId === FISH_ID)?.amount;
  const getWheatBalance = balance.find(
    (a) => a.resourceId === WHEAT_ID
  )?.amount;

  const { create, harvest, convert } = useFood(realm as Realm);

  const isOwner = useIsOwner(realm?.settledOwner);

  const { getBuildingCostById } = useGameConstants();

  const txQueue = useCommandList();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

  const [input, setInput] = useState<ResourceAndFoodInput>({
    farmsToBuild: farmCapacity,
    fishingVillagesToBuild: fishingVillageCapacity,
    fishConversion: '1000',
    wheatConversion: '1000',
  });

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.calldata &&
          toBN(t.calldata[0] as string).eq(toBN(realm?.realmId))
      )
    );
  }, [txQueue.transactions, realm?.realmId]);

  if (!realm) {
    return null;
  }

  const farmCosts = getBuildingCostById(RealmBuildingId.Farm);
  const fishingVillageCosts = getBuildingCostById(
    RealmBuildingId.FishingVillage
  );

  const cropLand = ({ level, color, built }) => {
    return Array.from({ length: level }, (item, index) => (
      <div key={index}>
        <div
          className={`h-2 p-2 border border-white/40 rounded ${
            index < built ? color : ''
          }`}
        ></div>
      </div>
    ));
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <Card className="col-span-12 md:col-start-1 md:col-end-13">
          <CardTitle>Storehouse - Food</CardTitle>
          <div className="flex">
            <div className=" w-1/2">
              {props.availableFood && props?.availableFood > 0 ? (
                <div className="flex justify-end text-xl">
                  <CountdownTimer
                    date={(
                      props.availableFood * 1000 +
                      new Date().getTime()
                    ).toString()}
                  />
                </div>
              ) : (
                <span className="text-red-600 animate-pulse">
                  Serfs are starving!!
                </span>
              )}
              <div className="text-5xl ">
                {props.availableFood?.toLocaleString()}
              </div>
            </div>
            <div className="flex p-3 rounded w-1/2">
              <Image
                width={100}
                height={100}
                src={'/realm-buildings/storehouse.png'}
              />
            </div>
          </div>

          {isOwner && (
            <div>
              {' '}
              <div className="flex flex-wrap w-full p-2">
                <div className="w-full mb-2">
                  {(+formatEther(getFishBalance ?? 0)).toLocaleString()} $FISH
                </div>
                <Button
                  onClick={() => {
                    convert(realm?.realmId, input.fishConversion, FISH_ID);
                  }}
                  size="xs"
                  variant="primary"
                >
                  Convert $FISH into Storehouse
                </Button>
                <InputNumber
                  value={input.fishConversion}
                  inputSize="sm"
                  colorScheme="transparent"
                  className="w-24 bg-white border rounded-r border-white/40"
                  min={1}
                  max={100000}
                  stringMode
                  onChange={(value: ValueType | null) => {
                    if (value) {
                      setInput((current) => {
                        return {
                          ...current,
                          fishConversion: value.toString(),
                        };
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap w-full p-2">
                <div className="w-full mb-2">
                  {(+formatEther(getWheatBalance ?? 0)).toLocaleString()} $WHEAT
                </div>
                <Button
                  onClick={() => {
                    convert(realm?.realmId, input.fishConversion, WHEAT_ID);
                  }}
                  size="xs"
                  variant="primary"
                >
                  Convert $WHEAT into Storehouse
                </Button>
                <InputNumber
                  value={input.wheatConversion}
                  inputSize="sm"
                  colorScheme="transparent"
                  className="w-24 bg-white border rounded-r border-white/40"
                  min={1}
                  max={100000}
                  stringMode
                  onChange={(value: ValueType | null) => {
                    if (value) {
                      setInput((current) => {
                        return {
                          ...current,
                          wheatConversion: value.toString(),
                        };
                      });
                    }
                  }}
                />{' '}
              </div>
              <p className="p-2 text-xs">
                You consume 1 food per second according to your population.
                Build and harvest Farms and Fishing Villages in order to keep
                your citizens fed. <br /> If you do not have food you are capped
                at 250 resources per day and your troops have half health.
              </p>
            </div>
          )}
        </Card>
        <Card className="col-span-12 md:col-start-1 md:col-end-13 ">
          <div className=" justify-between flex">
            <div className="w-1/2 pr-3">
              <h4>
                Farming land {props.realmFoodDetails.farmsBuilt} /{farmCapacity}
              </h4>
              {props.realmFoodDetails.farmHarvestsLeft -
                props.realmFoodDetails.decayedFarms >
                0 && (
                <div className="text-xl">
                  <CountdownTimer
                    date={(
                      (HARVEST_LENGTH -
                        props.realmFoodDetails
                          .totalTimeRemainingUntilFarmHarvest) *
                        1000 +
                      new Date().getTime()
                    ).toString()}
                  />
                </div>
              )}

              <p className="opacity-60">
                {props.realmFoodDetails.farmsBuilt} Farms producing{' '}
                {(
                  BASE_FOOD_PRODUCTION * props.realmFoodDetails.farmsBuilt
                ).toLocaleString()}{' '}
                $WHEAT every {HARVEST_LENGTH / 60} minutes.
              </p>
            </div>

            <div className=" w-1/2">
              <div>
                <Button
                  onClick={() => {
                    harvest(
                      realm?.realmId,
                      HarvestType.Export,
                      RealmBuildingId.Farm
                    );
                  }}
                  size="xs"
                  disabled={props.realmFoodDetails.totalFarmHarvest === 0}
                  variant="primary"
                >
                  {(
                    BASE_FOOD_PRODUCTION *
                    props.realmFoodDetails.farmsBuilt *
                    props.realmFoodDetails.totalFarmHarvest
                  ).toLocaleString()}{' '}
                  $WHEAT to export
                </Button>
              </div>
              <div className="flex flex-wrap mt-2">
                {cropLand({
                  level: farmCapacity,
                  color: 'bg-green-800',
                  built: props.realmFoodDetails.farmsBuilt,
                })}
              </div>
              <div className="flex mt-2">
                <div className="w-1/2">
                  <h5>to harvest </h5>
                  <div>
                    {props.realmFoodDetails.totalFarmHarvest} / {MAX_HARVESTS}
                  </div>
                </div>
                <div className="w-1/2">
                  <h5>harvests left</h5>
                  <div>
                    {props.realmFoodDetails.farmHarvestsLeft -
                      props.realmFoodDetails.decayedFarms >
                    0
                      ? props.realmFoodDetails.farmHarvestsLeft -
                        props.realmFoodDetails.decayedFarms
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between p-2">
            {isOwner && (
              <div className="flex flex-wrap mt-2">
                <div className="flex w-full space-x-2">
                  <Button
                    disabled={enqueuedHarvestTx}
                    onClick={() => {
                      create(
                        realm?.realmId,
                        input.farmsToBuild,
                        RealmBuildingId.Farm
                      );
                    }}
                    size="xs"
                    variant="primary"
                  >
                    Build Farms
                  </Button>
                  <InputNumber
                    value={input.farmsToBuild}
                    inputSize="sm"
                    colorScheme="transparent"
                    className="w-12 bg-white border rounded border-white/40"
                    min={1}
                    max={farmCapacity}
                    stringMode // to support high precision decimals
                    onChange={(value: ValueType | null) => {
                      if (value) {
                        setInput((current) => {
                          return {
                            ...current,
                            farmsToBuild: value.toString(),
                          };
                        });
                      }
                    }}
                  />{' '}
                </div>
                <div className="flex mt-4">
                  {farmCosts?.resources.map((a, i) => {
                    return (
                      <CostBlock
                        key={i}
                        resourceName={a.resourceName}
                        amount={a.amount}
                        id={a.resourceId}
                        qty={parseInt(input.farmsToBuild)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {/* <p className="mt-4 text-xs">
                <span className="font-semibold">Building:</span> You can only
                build batches of farms at a time. Meaning, if you have 1 farm
                built already then built 10, your original 1 farm will be wiped.
                <br />
                <span className="font-semibold">Export:</span> Converts your
                farmed food into $WHEAT <br />
                <span className="font-semibold">Harvest:</span> Converts your food
                directly into the store house for immediate usage.
              </p> */}
          </div>
        </Card>
        <Card className="col-span-12 md:col-start-1 md:col-end-13">
          <div className="flex justify-between w-full">
            <div className="w-1/2 pr-3">
              <h4>
                Fishing villages {props.realmFoodDetails.villagesBuilt}/
                {fishingVillageCapacity}
              </h4>
              {props.realmFoodDetails.fishingVillagesHarvestsLeft -
                props.realmFoodDetails.decayedVillages >
                0 && (
                <div className="text-xl ">
                  <CountdownTimer
                    date={(
                      (HARVEST_LENGTH -
                        props.realmFoodDetails
                          .totalTimeRemainingUntilVillageHarvest) *
                        1000 +
                      new Date().getTime()
                    ).toString()}
                  />
                </div>
              )}

              <p className="opacity-60">
                {realm.name} has {props.realmFoodDetails.villagesBuilt} Fishing
                Villages catching{' '}
                {(
                  BASE_FOOD_PRODUCTION * props.realmFoodDetails.villagesBuilt
                ).toLocaleString()}{' '}
                $FISH every {HARVEST_LENGTH / 60} minutes.
              </p>
            </div>
            <div className=" w-1/2">
              <div>
                <Button
                  onClick={() => {
                    harvest(
                      realm?.realmId,
                      HarvestType.Export,
                      RealmBuildingId.FishingVillage
                    );
                  }}
                  size="xs"
                  disabled={props.realmFoodDetails.totalVillageHarvest === 0}
                  variant="primary"
                >
                  {(
                    BASE_FOOD_PRODUCTION *
                    props.realmFoodDetails.villagesBuilt *
                    props.realmFoodDetails.totalVillageHarvest
                  ).toLocaleString()}{' '}
                  $FISH to export
                </Button>
              </div>
              <div className="flex flex-wrap mt-2">
                {' '}
                {cropLand({
                  level: fishingVillageCapacity,
                  color: 'bg-blue-800',
                  built: props.realmFoodDetails.villagesBuilt,
                })}
              </div>
              <div className="flex flex-wrap justify-between p-2 mt-auto">
                <div className="w-1/2 my-2">
                  <h5>to harvest </h5>
                  <div>
                    {props.realmFoodDetails.totalVillageHarvest} /{' '}
                    {MAX_HARVESTS}
                  </div>
                </div>

                <div className="w-1/2 my-2">
                  <h5>Harvests Left</h5>
                  <div>
                    {props.realmFoodDetails.fishingVillagesHarvestsLeft -
                      props.realmFoodDetails.decayedVillages >
                    0
                      ? props.realmFoodDetails.fishingVillagesHarvestsLeft -
                        props.realmFoodDetails.decayedVillages
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap p-2">
              <div className="flex w-full space-x-2">
                <Button
                  onClick={() => {
                    create(
                      realm?.realmId,
                      input.fishingVillagesToBuild,
                      RealmBuildingId.FishingVillage
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
                  className="w-12 border rounded border-white/40"
                  min={1}
                  max={fishingVillageCapacity}
                  stringMode
                  onChange={(value: ValueType | null) => {
                    if (value) {
                      setInput((current) => {
                        return {
                          ...current,
                          fishingVillagesToBuild: value.toString(),
                        };
                      });
                    }
                  }}
                />{' '}
              </div>
              <div className="flex mt-4">
                {fishingVillageCosts?.resources.map((a, i) => {
                  return (
                    <CostBlock
                      key={i}
                      resourceName={a.resourceName}
                      amount={a.amount}
                      id={a.resourceId}
                      qty={parseInt(input.fishingVillagesToBuild)}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {/* <p className="mt-4">
              <span className="font-semibold">Building:</span> You can only build
              batches of farms at a time. Meaning, if you have 1 farm built
              already then built 10, your original 1 farm will be wiped.
              <br />
              <span className="font-semibold">Export:</span> Converts your farmed
              food into $FISH <br />
              <span className="font-semibold">Harvest:</span> Converts your food
              directly into the store house for immediate usage.
            </p> */}
        </Card>
      </div>
    </div>
  );
};

export default RealmsFood;
