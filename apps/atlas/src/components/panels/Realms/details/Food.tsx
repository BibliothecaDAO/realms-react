import {
  Card,
  CardTitle,
  Button,
  CountdownTimer,
  InputNumber,
} from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import React, { useEffect, useState } from 'react';

import {
  RealmBuildingId,
  HarvestType,
  HARVEST_LENGTH,
  MAX_HARVESTS,
  BASE_FOOD_PRODUCTION,
  FISH_ID,
  WHEAT_ID,
} from '@/constants/buildings';
import { useCommandList } from '@/context/CommandListContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useFood from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { Entrypoints } from '@/hooks/settling/useResources';
import useIsOwner from '@/hooks/useIsOwner';
import { CostBlock, getPopulation } from '@/shared/Getters/Realm';
import type { BuildingDetail, RealmFoodDetails } from '@/types/index';

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
        (t: any) =>
          t.contractAddress == ModuleAddr.ResourceGame &&
          t.entrypoint == Entrypoints.claim &&
          t.calldata &&
          BigNumber.from(t.calldata[0] as string).eq(
            BigNumber.from(realm?.realmId)
          )
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
          className={`h-2 p-2 border border-green-900 rounded ${
            index < built ? color : ''
          }`}
        ></div>
      </div>
    ));
  };

  return (
    <div>
      <div>
        <Card className="w-full">
          <div className="flex">
            <div>
              <Image
                width={200}
                height={200}
                alt="Storehouse"
                src={'/realm-buildings/mj_storehouse.png'}
              />
            </div>
            {isOwner && (
              <div className="p-4">
                <div className=" w-full ">
                  <div className="bg-gradient-to-r from-gray-1100 via-red-900 to-gray-1100 py-[2px] ">
                    <h3 className=" p-1 shadow-xl shadow-red-700/20 px-2 flex bg-gray-1100 justify-between">
                      Storehouse
                      <div>
                        {props.availableFood && props?.availableFood > 0 ? (
                          <div className="flex justify-end text-xl">
                            <CountdownTimer
                              date={(
                                (props.availableFood /
                                  getPopulation(props.realm)) *
                                  1000 +
                                new Date().getTime()
                              ).toString()}
                            />
                          </div>
                        ) : (
                          <span className="text-red-900 animate-pulse">
                            Serfs are starving!!
                          </span>
                        )}
                        <div className="text-5xl ">
                          {props.availableFood?.toLocaleString()}
                        </div>
                      </div>
                    </h3>
                  </div>
                </div>{' '}
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
                    {(+formatEther(getWheatBalance ?? 0)).toLocaleString()}{' '}
                    $WHEAT
                  </div>
                  <Button
                    onClick={() => {
                      convert(realm?.realmId, input.wheatConversion, WHEAT_ID);
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
                  your citizens fed. <br /> If you do not have food you are
                  capped at 250 resources per day and your troops have half
                  health.
                </p>
              </div>
            )}
          </div>
        </Card>
        {isOwner && (
          <Card className="w-full">
            <div className=" flex">
              <Image
                width={200}
                height={200}
                className={' mx-auto'}
                src={'/realm-buildings/mj_farm.png'}
                alt="Hut"
              />
              <div className="w-full p-2">
                <div className="bg-gradient-to-r from-gray-1100 via-red-900 to-gray-1100 py-[2px] ">
                  <h3 className=" p-1 shadow-xl shadow-red-700/20 px-2 flex bg-gray-1100 justify-between">
                    Farming land {props.realmFoodDetails.farmsBuilt} /
                    {farmCapacity}
                    <span className="text-gray-700 text-sm self-center">
                      {props.realmFoodDetails.farmsBuilt} Farms producing{' '}
                      {(
                        BASE_FOOD_PRODUCTION * props.realmFoodDetails.farmsBuilt
                      ).toLocaleString()}{' '}
                      $WHEAT every {HARVEST_LENGTH / 60} minutes.
                    </span>
                  </h3>
                </div>

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

                <div className="flex justify-between w-full p-3">
                  <div className=" w-1/2">
                    <div className="flex mb-2">
                      <div className="w-1/2">
                        <h5>To Harvest </h5>
                        <div>
                          {props.realmFoodDetails.totalFarmHarvest} /{' '}
                          {MAX_HARVESTS}
                        </div>
                      </div>
                      <div className="w-1/2">
                        <h5>Harvests Left</h5>
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
                  </div>
                  <div className="flex flex-wrap justify-between p-2 w-1/2">
                    {isOwner && (
                      <div className="flex flex-wrap mt-2">
                        <div className="flex w-full space-x-2">
                          <Button
                            disabled={enqueuedHarvestTx}
                            onClick={() => {
                              create(
                                realm?.realmId,
                                input.farmsToBuild,
                                RealmBuildingId.Farm,
                                farmCosts
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
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        {isOwner && (
          <Card className="w-full">
            <div className="flex justify-between w-full">
              <Image
                width={200}
                height={200}
                className={'mx-auto rounded'}
                src={'/realm-buildings/mj_fishing_village.png'}
                alt="Hut"
              />
              <div className="w-full p-2">
                <div className="bg-gradient-to-r from-gray-1100 via-red-900 to-gray-1100 py-[2px] ">
                  <h3 className=" p-1 shadow-xl shadow-red-700/20 px-2 flex bg-gray-1100 justify-between">
                    Fishing villages {props.realmFoodDetails.villagesBuilt} /
                    {fishingVillageCapacity}
                    <span className="text-gray-700 text-sm self-center">
                      {realm.name} has {props.realmFoodDetails.villagesBuilt}{' '}
                      Fishing Villages catching{' '}
                      {(
                        BASE_FOOD_PRODUCTION *
                        props.realmFoodDetails.villagesBuilt
                      ).toLocaleString()}{' '}
                      $FISH every {HARVEST_LENGTH / 60} minutes.
                    </span>
                  </h3>
                </div>

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
                <div className="flex justify-between w-full p-3">
                  <div className="w-1/2">
                    <div className="flex flex-wrap justify-between p-2 mt-auto">
                      <div className="w-1/2 my-2">
                        <h5>To harvest </h5>
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
                            ? props.realmFoodDetails
                                .fishingVillagesHarvestsLeft -
                              props.realmFoodDetails.decayedVillages
                            : 0}
                        </div>
                      </div>
                    </div>
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
                        disabled={
                          props.realmFoodDetails.totalVillageHarvest === 0
                        }
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
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-wrap p-2">
                      <div className="flex w-full space-x-2">
                        <Button
                          onClick={() => {
                            create(
                              realm?.realmId,
                              input.fishingVillagesToBuild,
                              RealmBuildingId.FishingVillage,
                              fishingVillageCosts
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
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RealmsFood;
