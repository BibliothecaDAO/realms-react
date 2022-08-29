/* eslint-disable @typescript-eslint/naming-convention */
import { useStarknetCall } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';
import {
  RealmBuildingId,
  HarvestType,
  buildingIdToString,
} from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import { useGetFoodByRealmIdQuery } from '@/generated/graphql';
import type {
  RealmsCall,
  BuildingDetail,
  RealmFoodDetails,
  AvailableResources,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';
import {
  ModuleAddr,
  useCalculatorContract,
  useFoodContract,
} from './stark-contracts';

export const Entrypoints = {
  create: 'create',
  harvest: 'harvest',
  convert: 'convert_food_tokens_to_store',
};

export const createFoodCall: Record<string, (args: any) => RealmsCall> = {
  create: (args: {
    tokenId: number;
    quantity: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: Entrypoints.create,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.quantity,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: Entrypoints.create,
    },
  }),
  harvest: (args: {
    tokenId: number;
    harvestType: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: Entrypoints.harvest,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.harvestType,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: Entrypoints.harvest,
    },
  }),
  convert: (args: {
    tokenId: number;
    quantity: number;
    resourceId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: Entrypoints.convert,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.quantity,
      args.resourceId,
    ],
    metadata: {
      ...args,
      action: Entrypoints.harvest,
    },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.create]: (tx, _context) => ({
    title: 'Construct building',
    description: `Build ${tx.metadata.quantity} ${buildingIdToString(
      tx.metadata.foodBuildingId
    )}${tx.metadata.quantity > 1 ? 's' : ''}`,
  }),
  [Entrypoints.harvest]: (tx, _context) => ({
    title: `Harvesting Food`,
    description: `Harvesting food for Realm #${tx.metadata.tokenId}`,
  }),
};

type UseRealmFoodDetails = {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  loading: boolean;
  create: (tokenId, quantity, foodBuildingId) => void;
  harvest: (tokenId, harvestType, foodBuildingId) => void;
  convert: (tokenId, quantity, resourceId) => void;
};

const useFood = (realm: Realm | undefined): UseRealmFoodDetails => {
  const { play: harvestFish } = useUiSounds(soundSelector.harvestFish);
  const { play: harvestWheat } = useUiSounds(soundSelector.harvestWheat);
  const { play: exportFood } = useUiSounds(soundSelector.exportWheat);

  const { contract: foodContract } = useFoodContract();
  const { contract: calculatorContract } = useCalculatorContract();

  const [availableFood, setAvailableFood] = useState();

  const txQueue = useTransactionQueue();

  const { data: foodData } = useGetFoodByRealmIdQuery({
    variables: { id: realm?.realmId as number },
    skip: !realm,
  });

  const [realmFoodDetails, setRealmFoodDetails] = useState<RealmFoodDetails>({
    totalFarmHarvest: 0,
    totalTimeRemainingUntilFarmHarvest: 0,
    farmHarvestsLeft: 0,
    decayedFarms: 0,
    farmsBuilt: 0,
    totalVillageHarvest: 0,
    totalTimeRemainingUntilVillageHarvest: 0,
    decayedVillages: 0,
    fishingVillagesHarvestsLeft: 0,
    villagesBuilt: 0,
    population: 0,
  });

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
      !population[0] ||
      !realm
    ) {
      return;
    }

    const fishingVillagesHarvestsLeft =
      foodInformation['fishing_villages_harvests_left'].toNumber();
    const isFishingVillagesLeft =
      fishingVillagesHarvestsLeft > 0 ? true : false;

    const farmHarvestsLeft = foodInformation['farm_harvests_left'].toNumber();
    const isFarmHarvestsLeft = farmHarvestsLeft > 0 ? true : false;

    setRealmFoodDetails({
      totalFarmHarvest: isFarmHarvestsLeft
        ? foodInformation['total_farm_harvest'].toNumber()
        : 0,
      farmHarvestsLeft: farmHarvestsLeft,
      totalTimeRemainingUntilFarmHarvest:
        foodInformation['total_farm_remaining'].toNumber(),
      decayedFarms: foodInformation['decayed_farms'].toNumber(),
      farmsBuilt: isFarmHarvestsLeft
        ? foodInformation['farms_built'].toNumber()
        : 0,
      totalVillageHarvest: isFishingVillagesLeft
        ? foodInformation['total_village_harvest'].toNumber()
        : 0,
      totalTimeRemainingUntilVillageHarvest:
        foodInformation['total_village_remaining'].toNumber(),
      decayedVillages: foodInformation['decayed_villages'].toNumber(),
      villagesBuilt: isFishingVillagesLeft
        ? foodInformation['villages_built'].toNumber()
        : 0,
      fishingVillagesHarvestsLeft: fishingVillagesHarvestsLeft,
      population: population[0].toNumber() + 1,
    });

    setAvailableFood(storehouse[0].toNumber());
  }, [foodInformation, storehouse, population]);

  return {
    realmFoodDetails,
    availableFood,
    create: (tokenId, quantity, foodBuildingId) => {
      if (foodBuildingId === RealmBuildingId.FishingVillage) {
        harvestFish();
      } else {
        harvestWheat();
      }
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
    convert: (tokenId, quantity, resourceId) => {
      txQueue.add(
        createFoodCall.convert({
          tokenId,
          quantity,
          resourceId,
        })
      );
    },
    loading: foodLoading || populationLoading || storehouseLoading,
  };
};

export default useFood;
