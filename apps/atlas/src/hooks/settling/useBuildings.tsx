import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { RealmBuildingId, HarvestType } from '@/constants/buildings';
import {
  ModuleAddr,
  useBuildingContract,
  useFoodContract,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

type Building = {
  buildings: BuildingDetail[] | undefined;
  loading: boolean;
};

interface BuildingDetail {
  name: string;
  id: number;
  quantityBuilt: number;
  img: string;
  type: string;
  key: string;
}

export const Entrypoints = {
  build: 'build',
};

export const createBuildingCall: Record<string, (args: any) => RealmsCall> = {
  build: (args: { realmId; buildingId; qty }) => ({
    contractAddress: ModuleAddr.Building,
    entrypoint: Entrypoints.build,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.buildingId,
      args.qty,
    ],
    metadata: { ...args, action: Entrypoints.build },
  }),
};

const useBuildings = (realmId: number): Building => {
  const { contract: buildingContract } = useBuildingContract();
  const [buildings, setBuildings] = useState<BuildingDetail[]>();
  const { contract: foodContract } = useFoodContract();

  const {
    data: foodData,
    loading: foodLoadingData,
    error: foodError,
  } = useStarknetCall({
    contract: foodContract,
    method: 'available_food_in_store',
    args: [bnToUint256(toBN(realmId))],
  });

  const {
    data: allOutputData,
    loading,
    error: outputError,
  } = useStarknetCall({
    contract: buildingContract,
    method: 'get_effective_buildings',
    args: [bnToUint256(toBN(realmId))],
  });

  useEffect(() => {
    if (!allOutputData || !allOutputData[0]) {
      return;
    }
    // setAvailableFood(foodData[0].toNumber());
    setBuildings([
      {
        name: 'Archer Tower',
        key: 'archerTower',
        id: RealmBuildingId.ArcherTower,
        quantityBuilt: allOutputData[0].ArcherTower.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
      },
      {
        name: 'Barracks',
        key: 'barracks',
        id: RealmBuildingId.Barracks,
        quantityBuilt: allOutputData[0].Barracks.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
      },
      {
        name: 'Castle',
        key: 'castle',
        id: RealmBuildingId.Castle,
        quantityBuilt: allOutputData[0].Castle.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
      },
      {
        name: 'Farm',
        key: 'farm',
        id: RealmBuildingId.Farm,
        quantityBuilt: allOutputData[0].Farm.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
      },
      {
        name: 'Fishing Village',
        key: 'fishingVillage',
        id: RealmBuildingId.FishingVillage,
        quantityBuilt: allOutputData[0].FishingVillage.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
      },
      {
        name: 'House',
        key: 'house',
        id: RealmBuildingId.House,
        quantityBuilt: allOutputData[0].House.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
      },
      {
        name: 'MageTower',
        key: 'mageTower',
        id: RealmBuildingId.MageTower,
        quantityBuilt: allOutputData[0].MageTower.toNumber(),
        img: '/realm-buildings/mageTower.png',
        type: 'military',
      },
      {
        name: 'Store House',
        key: 'storeHouse',
        id: RealmBuildingId.StoreHouse,
        quantityBuilt: allOutputData[0].StoreHouse.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
      },
    ]);
  }, [allOutputData]);

  return {
    buildings,
    loading,
  };
};

export default useBuildings;
