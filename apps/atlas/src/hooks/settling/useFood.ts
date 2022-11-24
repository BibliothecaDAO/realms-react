/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  RealmBuildingId,
  HarvestType,
  buildingIdToString,
} from '@/constants/buildings';
import { useCommandList } from '@/context/CommandListContext';
import type { Realm } from '@/generated/graphql';
import { useGetFoodByRealmIdQuery } from '@/generated/graphql';
import type {
  CallAndMetadata,
  RealmFoodDetails,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';
import { ModuleAddr, useJsonRpc } from './stark-contracts';

export const Entrypoints = {
  create: 'create',
  harvest: 'harvest',
  convert: 'convert_food_tokens_to_store',
};

export const createFoodCall: Record<string, (args: any) => CallAndMetadata> = {
  create: (args: {
    tokenId: number;
    quantity: number;
    foodBuildingId: number;
    costs: any;
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
    costs: any;
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
      action: Entrypoints.convert,
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
  [Entrypoints.convert]: (tx, _context) => ({
    title: `Storehouse`,
    description: `Storing food in #${tx.metadata.tokenId}`,
  }),
};

type UseRealmFoodDetails = {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  loading: boolean;
  create: (tokenId, quantity, foodBuildingId, costs) => void;
  harvest: (tokenId, harvestType, foodBuildingId) => void;
  convert: (tokenId, quantity, resourceId) => void;
};

const useFood = (realm: Realm | undefined): UseRealmFoodDetails => {
  const { play: harvestFish } = useUiSounds(soundSelector.harvestFish);
  const { play: harvestWheat } = useUiSounds(soundSelector.harvestWheat);
  const { play: exportFood } = useUiSounds(soundSelector.exportWheat);

  const { FoodContract } = useJsonRpc();

  const [availableFood, setAvailableFood] = useState();

  const txQueue = useCommandList();

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
  });

  useEffect(() => {
    if (!realm) {
      return;
    }

    const fetchData = async () => {
      const food = await FoodContract.available_food_in_store(
        bnToUint256(toBN(realm?.realmId ?? 0))
      );
      const foodInformation = await FoodContract.get_all_food_information(
        bnToUint256(toBN(realm?.realmId ?? 0))
      );
      setAvailableFood(food.toString());
      // food details
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
      });
    };

    fetchData().catch(console.error);
  }, [realm]);

  return {
    realmFoodDetails,
    availableFood,
    create: (tokenId, quantity, foodBuildingId, costs) => {
      if (foodBuildingId === RealmBuildingId.FishingVillage) {
        harvestFish();
      } else {
        harvestWheat();
      }

      const qtyCosts = costs.resources.map((a) => {
        return {
          resourceId: a.resourceId,
          amount: a.amount * quantity,
          resourceName: a.resourceName,
        };
      });

      txQueue.add(
        createFoodCall.create({
          tokenId,
          quantity,
          foodBuildingId,
          costs: {
            amount: 0,
            resources: qtyCosts,
          },
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
      exportFood();
      txQueue.add(
        createFoodCall.convert({
          tokenId,
          quantity,
          resourceId,
          costs: {
            amount: 0,
            resources: [
              {
                resourceId: resourceId,
                amount: parseInt(quantity),
                resourceName: 'wheat',
              },
            ],
          },
        })
      );
    },
    loading: false,
  };
};

export default useFood;
