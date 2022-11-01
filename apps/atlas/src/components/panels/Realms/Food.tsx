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
import type { GetRealmQuery, Realm } from '@/generated/graphql';
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
import { BaseRealmDetailPanel } from './BaseRealmDetailPanel';

type Prop = {
  realm: GetRealmQuery;
  buildings: BuildingDetail[] | undefined;
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  open: boolean;
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

const Food: React.FC<Prop> = (props) => {
  const realm = props.realm?.realm;

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
  }, [txQueue.transactions]);

  if (!realm) {
    return null;
  }

  const farmCosts = getBuildingCostById(RealmBuildingId.Farm);
  const fishingVillageCosts = getBuildingCostById(
    RealmBuildingId.FishingVillage
  );

  const cropLand = ({ level, color, built }) => {
    return Array.from({ length: level }, (item, index) => (
      <div className="m-1" key={index}>
        <div
          className={`h-4 p-4 border border-white/40 rounded ${
            index < built ? color : ''
          }`}
        ></div>
      </div>
    ));
  };

  return (
    <BaseRealmDetailPanel open={props.open}>
      <div className="grid grid-cols-12 gap-6 py-4">
        <Card className="col-span-12 md:col-start-1 md:col-end-5 ">
          <div className="flex justify-between my-4">
            <h3>
              Farming land {props.realmFoodDetails.farmsBuilt} /{farmCapacity}
            </h3>
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
          </div>
          <p className="px-1 mb-2 text-xl">
            {realm.name} has {props.realmFoodDetails.farmsBuilt} Farm producing{' '}
            {(
              BASE_FOOD_PRODUCTION * props.realmFoodDetails.farmsBuilt
            ).toLocaleString()}{' '}
            $WHEAT every {HARVEST_LENGTH / 60} minutes.
          </p>
          <div className="flex flex-wrap">
            {cropLand({
              level: farmCapacity,
              color: 'bg-green-800',
              built: props.realmFoodDetails.farmsBuilt,
            })}
          </div>

          <div className="flex flex-wrap justify-between p-2">
            <div className="w-1/2 my-2">
              <h5>farms to harvest </h5>
              <div className="text-5xl">
                {props.realmFoodDetails.totalFarmHarvest} / {MAX_HARVESTS}
              </div>
            </div>
            <div className="w-1/2 my-2">
              <h5>harvests left</h5>
              <div className="text-5xl">
                {props.realmFoodDetails.farmHarvestsLeft -
                  props.realmFoodDetails.decayedFarms >
                0
                  ? props.realmFoodDetails.farmHarvestsLeft -
                    props.realmFoodDetails.decayedFarms
                  : 0}
              </div>
            </div>
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
                {/* eslint-disable */}
                <div className="mt-5">
                  <p className="text-xl">
                    {(
                      BASE_FOOD_PRODUCTION *
                      props.realmFoodDetails.farmsBuilt *
                      props.realmFoodDetails.totalFarmHarvest
                    ).toLocaleString()}{' '}
                    $WHEAT available to action
                  </p>

                  <div className="flex space-x-2">
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
                      Export $WHEAT{' '}
                    </Button>
                    {/* eslint-disable */}
                    {/* <Button
                      onClick={() => {
                        harvest(
                          realm?.realmId,
                          HarvestType.Store,
                          RealmBuildingId.Farm
                        );
                      }}
                      size="xs"
                      disabled={props.realmFoodDetails.totalFarmHarvest === 0}
                      variant="primary"
                    >
                      Harvest $WHEAT
                    </Button> */}
                  </div>
                </div>
              </div>
            )}
            <p className="mt-4">
              <span className="font-semibold">Building:</span> You can only
              build batches of farms at a time. Meaning, if you have 1 farm
              built already then built 10, your original 1 farm will be wiped.
              <br />
              <span className="font-semibold">Export:</span> Converts your
              farmed food into $WHEAT <br />
              <span className="font-semibold">Harvest:</span> Converts your food
              directly into the store house for immediate usage.
            </p>
          </div>
        </Card>
        <Card className="col-span-12 md:col-start-5 md:col-end-9 ">
          <div className="flex justify-between w-full my-4">
            <h3>
              Fishing villages {props.realmFoodDetails.villagesBuilt}/
              {fishingVillageCapacity}
            </h3>
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
          </div>
          <div className="w-full">
            <p className="px-1 mb-2 text-xl">
              {realm.name} has {props.realmFoodDetails.villagesBuilt} Fishing
              Villages catching{' '}
              {(
                BASE_FOOD_PRODUCTION * props.realmFoodDetails.villagesBuilt
              ).toLocaleString()}{' '}
              $FISH every {HARVEST_LENGTH / 60} minutes.
            </p>
          </div>

          <div className="flex flex-wrap">
            {cropLand({
              level: fishingVillageCapacity,
              color: 'bg-blue-800',
              built: props.realmFoodDetails.villagesBuilt,
            })}
          </div>

          <div className="flex flex-wrap justify-between p-2 mt-auto">
            <div className="w-1/2 my-2">
              <h5>villages to harvest </h5>
              <div className="sm:text-5xl">
                {props.realmFoodDetails.totalVillageHarvest} / {MAX_HARVESTS}
              </div>
            </div>

            <div className="w-1/2 my-2">
              <h5>Harvests Left</h5>
              <div className="sm:text-5xl">
                {props.realmFoodDetails.fishingVillagesHarvestsLeft -
                  props.realmFoodDetails.decayedVillages >
                0
                  ? props.realmFoodDetails.fishingVillagesHarvestsLeft -
                    props.realmFoodDetails.decayedVillages
                  : 0}
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
              <p className="w-full mt-4 text-xl">
                {(
                  BASE_FOOD_PRODUCTION *
                  props.realmFoodDetails.villagesBuilt *
                  props.realmFoodDetails.totalVillageHarvest
                ).toLocaleString()}{' '}
                $FISH available to action
              </p>
              <div className="w-full space-x-2">
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
                  Export $FISH
                </Button>
                {/* <Button
                  onClick={() => {
                    harvest(
                      realm?.realmId,
                      HarvestType.Store,
                      RealmBuildingId.FishingVillage
                    );
                  }}
                  size="xs"
                  disabled={props.realmFoodDetails.totalVillageHarvest === 0}
                  variant="primary"
                >
                  Harvest $FISH
                </Button> */}
              </div>
            </div>
          )}
          <p className="mt-4">
            <span className="font-semibold">Building:</span> You can only build
            batches of farms at a time. Meaning, if you have 1 farm built
            already then built 10, your original 1 farm will be wiped.
            <br />
            <span className="font-semibold">Export:</span> Converts your farmed
            food into $FISH <br />
            <span className="font-semibold">Harvest:</span> Converts your food
            directly into the store house for immediate usage.
          </p>
        </Card>

        <Card className="col-span-12 md:col-start-9 md:col-end-13">
          <div className="flex p-3 bg-white rounded">
            <Image
              width={200}
              height={220}
              className={' mx-auto'}
              src={'/realm-buildings/storehouse.png'}
              alt="Storehouse"
            />
          </div>
          <CardTitle>Store house [food]</CardTitle>
          <div>
            <div className="text-right">
              <br />
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
          </div>
          {isOwner && (
            <div>
              {' '}
              <div className="flex flex-wrap w-full p-2">
                <div className="w-full mb-2 text-2xl">
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
                <div className="w-full mb-2 text-2xl">
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
              <p className="p-2">
                You consume 1 food per second according to your population.
                Build and harvest Farms and Fishing Villages in order to keep
                your citizens fed. <br /> If you do not have food you are capped
                at 250 resources per day and your troops have half health.
              </p>
            </div>
          )}
        </Card>
      </div>
    </BaseRealmDetailPanel>
  );
};

export default Food;
