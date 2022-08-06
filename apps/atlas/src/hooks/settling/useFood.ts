import { useStarknetCall } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';
import type { Realm } from '@/generated/graphql';
import type { RealmsCall } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { ModuleAddr, useFoodContract } from './stark-contracts';

export const entrypoints = {
  create: 'create',
  harvest: 'harvest',
};

export const createFoodCall: Record<string, (args: any) => RealmsCall> = {
  create: (args: {
    tokenId: number;
    quantity: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: entrypoints.create,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.quantity,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: entrypoints.create,
      title: 'Build',
      description: `Build ${args.quantity} x ${args.foodBuildingId} buildings`,
    },
  }),
  harvest: (args: {
    tokenId: number;
    harvestType: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: entrypoints.harvest,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.harvestType,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: entrypoints.harvest,
      title: `Harvest farms on Realm ${args.tokenId}`,
      description: `${args.harvestType} farms on Realm ${args.tokenId}`,
    },
  }),
};

type UseRealmFoodDetails = {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
};

interface RealmFoodDetails {
  totalFarmHarvest: number;
  totalTimeRemainingUntilFarmHarvest: number;
  decayedFarms: number;
  farmsBuilt: number;
  totalVillageHarvest: number;
  totalTimeRemainingUntilVillageHarvest: number;
  decayedVillages: number;
  villagesBuilt: number;
}

const useFood = (realm: Realm | undefined): UseRealmFoodDetails => {
  const [realmFoodDetails, setRealmFoodDetails] = useState<RealmFoodDetails>({
    totalFarmHarvest: 0,
    totalTimeRemainingUntilFarmHarvest: 0,
    decayedFarms: 0,
    farmsBuilt: 0,
    totalVillageHarvest: 0,
    totalTimeRemainingUntilVillageHarvest: 0,
    decayedVillages: 0,
    villagesBuilt: 0,
  });
  const { contract: foodContract } = useFoodContract();
  const [availableFood, setAvailableFood] = useState();

  const {
    data: allOutputData,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: foodContract,
    method: 'get_all_food_information',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  const {
    data: foodData,
    loading: foodLoadingData,
    error: foodError,
  } = useStarknetCall({
    contract: foodContract,
    method: 'available_food_in_store',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  useEffect(() => {
    if (!allOutputData || !allOutputData[0] || !foodData || !foodData[0]) {
      return;
    }
    setRealmFoodDetails({
      totalFarmHarvest: allOutputData['total_farm_harvest'].toNumber(),
      totalTimeRemainingUntilFarmHarvest:
        allOutputData['total_farm_remaining'].toNumber(),
      decayedFarms: allOutputData['decayed_farms'].toNumber(),
      farmsBuilt: allOutputData['farms_built'].toNumber(),
      totalVillageHarvest: allOutputData['total_village_harvest'].toNumber(),
      totalTimeRemainingUntilVillageHarvest:
        allOutputData['total_village_remaining'].toNumber(),
      decayedVillages: allOutputData['decayed_villages'].toNumber(),
      villagesBuilt: allOutputData['villages_built'].toNumber(),
    });
    setAvailableFood(foodData[0].toNumber());
  }, [allOutputData, foodData]);

  return {
    realmFoodDetails,
    availableFood,
  };
};

export default useFood;
