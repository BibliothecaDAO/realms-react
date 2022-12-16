/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { number, uint256 } from 'starknet';
import {
  RealmBuildingId,
  HarvestType,
  buildingIdToString,
  HARVEST_LENGTH,
  MAX_HARVESTS,
  DAY,
  BASE_HARVESTS,
} from '@/constants/buildings';
import { useCommandList } from '@/context/CommandListContext';
import type { Food, Realm } from '@/generated/graphql';

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

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
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
    title: `Resupply Storehouse`,
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
  const { play: buildFishingVillage } = useUiSounds(
    soundSelector.buildFishingVillage
  );
  const { play: buildFarm } = useUiSounds(soundSelector.buildFarm);
  const { play: buildStorehouse } = useUiSounds(soundSelector.buildStorehouse);
  const { play: buildWorkHut } = useUiSounds(soundSelector.buildWorkHut);

  const playFoodBuildingSound = (buildingId: RealmBuildingId) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (buildingId) {
      case RealmBuildingId.FishingVillage:
        buildFishingVillage();
        break;
      case RealmBuildingId.Farm:
        buildFarm();
        break;
      case RealmBuildingId.StoreHouse:
        buildStorehouse();
        break;
      case RealmBuildingId.House:
        buildWorkHut();
        break;
      default:
        harvestWheat();
        break;
    }
  };

  const { FoodContract } = useJsonRpc();

  const [availableFood, setAvailableFood] = useState();

  const txQueue = useCommandList();

  const [realmFoodDetails, setRealmFoodDetails] = useState<RealmFoodDetails>({
    farmsToHarvest: 0,
    farmTimeTillHarvest: 0,
    farmHarvestsLeft: 0,
    farmsDecayed: 0,
    farmsBuilt: 0,
    villagesToHarvest: 0,
    villagesTimeTillHarvest: 0,
    villagesDecayed: 0,
    villagesHarvestsLeft: 0,
    villagesBuilt: 0,
  });

  useEffect(() => {
    if (!realm) {
      return;
    }

    const farm = realm?.foods?.find(
      (a) => a.buildingId === RealmBuildingId.Farm
    );
    const fishingVillage = realm?.foods?.find(
      (a) => a.buildingId === RealmBuildingId.FishingVillage
    );

    const createdAt = (food?: Food) => {
      return food?.createdAt || 0;
    };

    const harvests = (food?: Food) => {
      return food?.harvests || 0;
    };

    const qty = (food?: Food) => {
      return food?.qty || 0;
    };

    const sinceUpdate = (food?: Food) => {
      const now = Math.floor(Date.now());
      return now - createdAt(food);
    };

    const getHarvestsAvailable = (food?: Food) => {
      const difference = sinceUpdate(food);

      const total_harvests_since_creation =
        difference / (HARVEST_LENGTH * 1000);

      const total_harvested = BASE_HARVESTS - total_harvests_since_creation;

      const to_harvest = harvests(food) - total_harvested;

      if (to_harvest < 1 || to_harvest > 10000) {
        return [0, 0];
      }

      // remaining harvests
      const remaining_harvests = difference % (HARVEST_LENGTH * 1000);

      const possible_harvest = to_harvest >= MAX_HARVESTS ? 6 : to_harvest;

      return [Math.floor(possible_harvest), remaining_harvests];
    };

    const getTimeTillHarvest = (food?: Food) => {
      const difference = sinceUpdate(food);
      return HARVEST_LENGTH * 1000 - difference;
    };

    const fetchData = async () => {
      const food = await FoodContract.available_food_in_store(
        uint256.bnToUint256(number.toBN(realm?.realmId ?? 0))
      );
      setAvailableFood(food.toString());
    };

    setRealmFoodDetails({
      farmsToHarvest: harvests(farm) > 0 ? getHarvestsAvailable(farm)[0] : 0,
      farmHarvestsLeft: harvests(farm),
      farmTimeTillHarvest: getTimeTillHarvest(farm),
      farmsDecayed: getHarvestsAvailable(farm)[1],
      farmsBuilt: harvests(farm) > 0 ? qty(farm) : 0,
      // villages
      villagesToHarvest:
        harvests(fishingVillage) > 0
          ? getHarvestsAvailable(fishingVillage)[0]
          : 0,
      villagesHarvestsLeft: harvests(fishingVillage),
      villagesTimeTillHarvest: getTimeTillHarvest(fishingVillage),
      villagesDecayed: getHarvestsAvailable(fishingVillage)[1],
      villagesBuilt: harvests(fishingVillage) > 0 ? qty(fishingVillage) : 0,
    });

    fetchData().catch(console.error);
  }, [realm]);

  return {
    realmFoodDetails,
    availableFood,
    create: (tokenId, quantity, foodBuildingId, costs) => {
      playFoodBuildingSound(foodBuildingId);

      const qtyCosts = costs.resources.map((a) => {
        return {
          resourceId: a.resourceId,
          amount: a.amount * quantity,
          resourceName: a.resourceName,
        };
      });

      txQueue.add(
        createCall.create({
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
        createCall.harvest({
          tokenId,
          harvestType,
          foodBuildingId,
        })
      );
    },
    convert: (tokenId, quantity, resourceId) => {
      exportFood();
      txQueue.add(
        createCall.convert({
          tokenId,
          quantity,
          resourceId,
          costs: {
            amount: 0,
            resources: [
              {
                resourceId: resourceId,
                amount: parseInt(quantity),
                resourceName: 'Wheat',
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
