import {
  Card,
  CardTitle,
  Button,
  CountdownTimer,
  InputNumber,
  ResourceIcon,
} from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import type { ValueType } from '@rc-component/mini-decimal';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { CostBlock, getPopulation } from '@/components/realms/RealmsGetters';
import {
  RealmBuildingId,
  HarvestType,
  HARVEST_LENGTH,
  MAX_HARVESTS,
  BASE_FOOD_PRODUCTION,
  FISH_ID,
  WHEAT_ID,
  buildingIdToString,
  buildingImageById,
} from '@/constants/buildings';
import { useCommandList } from '@/context/CommandListContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { useCurrentQueuedTxs } from '@/hooks/settling/useCurrentQueuedTxs';
import useFood, { Entrypoints } from '@/hooks/settling/useFood';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import useIsOwner from '@/hooks/useIsOwner';
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

export const RealmsFood = (props: Prop) => {
  const { realm, buildings, realmFoodDetails, availableFood, loading } = props;

  const { balance } = useUserBalancesContext();
  const { getBuildingCostById } = useGameConstants();
  const { create, harvest, convert } = useFood(realm as Realm);
  const isOwner = useIsOwner(realm?.settledOwner);

  const getFishBalance = balance.find((a) => a.resourceId === FISH_ID)?.amount;
  const getWheatBalance = balance.find(
    (a) => a.resourceId === WHEAT_ID
  )?.amount;

  const { enqueuedHarvestTx: harvestFarmEnqueuedHarvestTx } =
    useCurrentQueuedTxs({
      moduleAddr: ModuleAddr.Food,
      entryPoint: Entrypoints.harvest,
      realmId: realm?.realmId,
    });

  const farmCapacity = getTrait(realm, 'River');
  const fishingVillageCapacity = getTrait(realm, 'Harbor');

  const [input, setInput] = useState<ResourceAndFoodInput>({
    farmsToBuild: farmCapacity,
    fishingVillagesToBuild: fishingVillageCapacity,
    fishConversion: '1000',
    wheatConversion: '1000',
  });

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
    <div className="grid grid-cols-2">
      {/* <div className="flex">
        <Image
          width={200}
          height={200}
          alt="Storehouse"
          className={' mx-auto border-yellow-900 border rounded'}
          src={'/realm-buildings/mj_storehouse.png'}
        />

        <div className="w-full border-4 border-yellow-800/40">
          <div className="">
            <h3 className="flex justify-between p-1 px-2 ">
              Storehouse
              <div className="flex">
                <div className="self-center mr-3 text-3xl">
                  {props.availableFood?.toLocaleString()}
                </div>
                {props.availableFood && props?.availableFood > 0 ? (
                  <div className="flex justify-end">
                    <CountdownTimer
                      date={(
                        (props.availableFood / getPopulation(props.realm)) *
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
              </div>
            </h3>
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
              {(+formatEther(getWheatBalance ?? 0)).toLocaleString()} $WHEAT
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
        </div>
      </div> */}

      <FoodBuildingComponent
        realm={props.realm}
        id={RealmBuildingId.Farm}
        built={props.realmFoodDetails.farmsBuilt}
        capacity={farmCapacity}
        harvestsLeft={props.realmFoodDetails.farmHarvestsLeft}
        timeTillHarvest={props.realmFoodDetails.farmTimeTillHarvest}
        toHarvest={props.realmFoodDetails.farmsToHarvest}
        decayed={props.realmFoodDetails.farmsDecayed}
        costs={farmCosts}
      />
      <FoodBuildingComponent
        realm={props.realm}
        id={RealmBuildingId.FishingVillage}
        built={props.realmFoodDetails.villagesBuilt}
        capacity={fishingVillageCapacity}
        harvestsLeft={props.realmFoodDetails.villagesHarvestsLeft}
        timeTillHarvest={props.realmFoodDetails.villagesTimeTillHarvest}
        toHarvest={props.realmFoodDetails.villagesToHarvest}
        decayed={props.realmFoodDetails.villagesDecayed}
        costs={fishingVillageCosts}
      />
    </div>
  );
};

export const FoodBuildingComponent = (props: {
  realm;
  id;
  built;
  capacity;
  harvestsLeft;
  timeTillHarvest;
  toHarvest;
  decayed;
  costs;
}) => {
  const {
    realm,
    id,
    toHarvest,
    built,
    capacity,
    harvestsLeft,
    timeTillHarvest,
    decayed,
    costs,
  } = props;

  const [qty, setQty] = useState(capacity);

  const { create, harvest, convert } = useFood(realm as Realm);

  const txQueue = useCommandList();

  const [enqueuedHarvestTx, setEnqueuedHarvestTx] = useState(false);

  const [enqueuedBuildTx, setEnqueuedBuildTx] = useState(false);

  useEffect(() => {
    setEnqueuedHarvestTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Food &&
          t.entrypoint == Entrypoints.harvest &&
          t.calldata &&
          BigNumber.from(t.calldata[0] as string).eq(
            BigNumber.from(realm.realmId)
          ) &&
          t.calldata[3] == id
      )
    );

    setEnqueuedBuildTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Food &&
          t.entrypoint == Entrypoints.create &&
          t.calldata &&
          BigNumber.from(t.calldata[0] as string).eq(
            BigNumber.from(realm.realmId)
          ) &&
          t.calldata[3] == id
      )
    );
  }, [txQueue.transactions]);

  const cropLand = ({ level, color, built }) => {
    return Array.from({ length: level }, (item, index) => (
      <div key={index}>
        <div
          className={`h-4 p-4 border border-white/30 rounded flex m-1 ${
            toHarvest > 0 ? 'animate-pulse' : ''
          }  ${index < built ? color : ''}`}
        >
          <ResourceIcon
            size="xs"
            resource={id === RealmBuildingId.Farm ? 'Wheat' : 'Fish'}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="border-4 border-yellow-800/40 rounded-2xl">
      <div className="flex flex-wrap justify-between ">
        <div className="relative">
          <img
            className={'mx-auto rounded-t-2xl'}
            src={buildingImageById(id)}
            alt="Hut"
          />
          <div className="absolute top-0 w-full px-10 py-8 text-white bg-gradient-to-b from-stone-400 rounded-t-xl">
            <h2 className="flex justify-between p-1 px-2">
              {buildingIdToString(id)}{' '}
              <span>
                {built} / {capacity}{' '}
              </span>
            </h2>
          </div>

          <div className="absolute bottom-0 w-full px-10 py-8 bg-gradient-to-t from-gray-900">
            <p className="self-center px-2 text-2xl text-white">
              {built} {buildingIdToString(id)} generating{' '}
              {(BASE_FOOD_PRODUCTION * built).toLocaleString()} $FISH every{' '}
              {HARVEST_LENGTH / 60} minutes.
            </p>
          </div>
        </div>{' '}
        <div className="flex flex-wrap px-6">
          {' '}
          {cropLand({
            level: capacity,
            color:
              id === RealmBuildingId.Farm
                ? 'bg-yellow-300/30'
                : 'bg-blue-300/30',
            built: built,
          })}
        </div>
        <div className="px-5 pb-5">
          {harvestsLeft - decayed > 0 && (
            <div className="px-4 text-xl">
              <CountdownTimer
                date={(timeTillHarvest + new Date().getTime()).toString()}
              />
            </div>
          )}
          <div className="flex flex-wrap justify-between w-full p-3">
            <div className="w-1/2">
              {/* <div className="flex flex-wrap justify-between p-2 mt-auto">
                <div className="w-1/2 my-2">
                  <h5>To harvest </h5>
                  <div>
                    {toHarvest} / {MAX_HARVESTS}
                  </div>
                </div>

                <div className="w-1/2 my-2">
                  <h5>Harvests Left</h5>
                  <div>
                    {harvestsLeft - decayed > 0 ? harvestsLeft - decayed : 0}
                  </div>
                </div>
              </div> */}
              <div>
                <Button
                  onClick={() => {
                    harvest(realm?.realmId, HarvestType.Export, id);
                  }}
                  size="lg"
                  disabled={toHarvest === 0 || enqueuedHarvestTx}
                  variant="primary"
                >
                  {(BASE_FOOD_PRODUCTION * built * toHarvest).toLocaleString()}{' '}
                  {RealmBuildingId.Farm === id ? '$WHEAT' : '$FISH'}
                  {enqueuedHarvestTx ? ' Harvesting...' : ' to harvest'}
                </Button>
              </div>
            </div>

            <div className="w-full my-4">
              <div className="flex flex-wrap ">
                <div className="flex w-full space-x-2">
                  <Button
                    onClick={() => {
                      create(realm?.realmId, qty, id, costs);
                    }}
                    size="sm"
                    variant="primary"
                    disabled={enqueuedBuildTx}
                  >
                    {enqueuedBuildTx ? 'Building...' : 'Build'}
                  </Button>
                  <InputNumber
                    value={qty}
                    inputSize="sm"
                    colorScheme="transparent"
                    className="w-12 border rounded border-white/40"
                    min={1}
                    max={capacity}
                    stringMode
                    onChange={(value: ValueType | null) => {
                      setQty(value);
                    }}
                  />{' '}
                </div>
                <div className="flex mt-4">
                  {costs?.resources.map((a, i) => {
                    return (
                      <CostBlock
                        key={i}
                        resourceName={a.resourceName}
                        amount={a.amount}
                        id={a.resourceId}
                        qty={parseInt(qty)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
