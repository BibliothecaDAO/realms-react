import { useStarknetCall } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';
import { RealmBuildingId, HarvestType } from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import type {
  RealmsCall,
  BuildingDetail,
  RealmFoodDetails,
  AvailableResources,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';
import {
  ModuleAddr,
  useCalculatorContract,
  useFoodContract,
} from './stark-contracts';

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
      title: `Harvesting on Realm ${args.tokenId}`,
      description: `Harvesting  ${args.tokenId}`,
    },
  }),
};

type UseRealmFoodDetails = {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  loading: boolean;
  create: (tokenId, quantity, foodBuildingId) => void;
  harvest: (tokenId, harvestType, foodBuildingId) => void;
};

const useFood = (realm: Realm | undefined): UseRealmFoodDetails => {
  const { play: harvestFish } = useUiSounds(soundSelector.harvestFish);
  const { play: harvestWheat } = useUiSounds(soundSelector.harvestWheat);
  const { play: exportFood } = useUiSounds(soundSelector.exportWheat);

  const txQueue = useTransactionQueue();

  const [realmFoodDetails, setRealmFoodDetails] = useState<RealmFoodDetails>({
    totalFarmHarvest: 0,
    totalTimeRemainingUntilFarmHarvest: 0,
    decayedFarms: 0,
    farmsBuilt: 0,
    totalVillageHarvest: 0,
    totalTimeRemainingUntilVillageHarvest: 0,
    decayedVillages: 0,
    villagesBuilt: 0,
    population: 0,
  });
  const { contract: foodContract } = useFoodContract();

  const { contract: calculatorContract } = useCalculatorContract();
  const [availableFood, setAvailableFood] = useState();

  const {
    data: population,
    loading: populationLoading,
    error: errorPopulation,
  } = useStarknetCall({
    contract: calculatorContract,
    method: 'calculate_population',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  const {
    data: foodInformation,
    loading: foodLoading,
    error: errorFoodInformation,
  } = useStarknetCall({
    contract: foodContract,
    method: 'get_all_food_information',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  const {
    data: storehouse,
    loading: storehouseLoading,
    error: errorStorehouse,
  } = useStarknetCall({
    contract: foodContract,
    method: 'available_food_in_store',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  useEffect(() => {
    if (
      !foodInformation ||
      !foodInformation[0] ||
      !storehouse ||
      !storehouse[0] ||
      !population ||
      !population[0]
    ) {
      return;
    }

    setRealmFoodDetails({
      totalFarmHarvest: foodInformation['total_farm_harvest'].toNumber(),
      totalTimeRemainingUntilFarmHarvest:
        foodInformation['total_farm_remaining'].toNumber(),
      decayedFarms: foodInformation['decayed_farms'].toNumber(),
      farmsBuilt: foodInformation['farms_built'].toNumber(),
      totalVillageHarvest: foodInformation['total_village_harvest'].toNumber(),
      totalTimeRemainingUntilVillageHarvest:
        foodInformation['total_village_remaining'].toNumber(),
      decayedVillages: foodInformation['decayed_villages'].toNumber(),
      villagesBuilt: foodInformation['villages_built'].toNumber(),
      population: population[0].toNumber(),
    });

    setAvailableFood(storehouse[0].toNumber());
  }, [foodInformation, storehouse, population]);

  return {
    realmFoodDetails,
    availableFood,
    create: (tokenId, quantity, foodBuildingId) => {
      txQueue.add(
        createFoodCall.create({
          tokenId,
          quantity,
          foodBuildingId,
        })
      );
    },
    harvest: (tokenId, harvestType, foodBuildingId) => {
      if (harvestType === RealmBuildingId.FishingVillage) {
        if (harvestType === HarvestType.Export) {
          harvestFish();
        } else {
          exportFood();
        }
      } else {
        if (harvestType === HarvestType.Export) {
          harvestWheat();
        } else {
          exportFood();
        }
      }

      txQueue.add(
        createFoodCall.harvest({
          tokenId,
          harvestType,
          foodBuildingId,
        })
      );
    },
    loading: foodLoading || populationLoading || storehouseLoading,
  };
};

export default useFood;
