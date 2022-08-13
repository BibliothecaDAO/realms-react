import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  RealmBuildingId,
  HarvestType,
  RealmBuildingsSize,
} from '@/constants/buildings';
import type { Realm } from '@/generated/graphql';
import {
  ModuleAddr,
  useBuildingContract,
  useFoodContract,
} from '@/hooks/settling/stark-contracts';
import { getTrait } from '@/shared/Getters/Realm';
import type {
  RealmsCall,
  BuildingFootprint,
  BuildingDetail,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

type Building = {
  buildings: BuildingDetail[] | undefined;
  loading: boolean;
  buildingUtilisation: BuildingFootprint | undefined;
};

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

const useBuildings = (realm: Realm | undefined): Building => {
  const { contract: buildingContract } = useBuildingContract();
  const [buildings, setBuildings] = useState<BuildingDetail[]>();

  const [buildingUtilisation, SetBuildingUtilisation] =
    useState<BuildingFootprint>({ maxSqm: 0, currentSqm: 0 });

  const {
    data: allOutputData,
    loading,
    error: outputError,
  } = useStarknetCall({
    contract: buildingContract,
    method: 'get_effective_buildings',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  useEffect(() => {
    if (!allOutputData || !allOutputData[0]) {
      return;
    }
    console.log(realm);
    setBuildings([
      {
        name: 'Archer Tower',
        key: 'archerTower',
        id: RealmBuildingId.ArcherTower,
        quantityBuilt: allOutputData[0].ArcherTower.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
        buildingSize: RealmBuildingsSize.ArcherTower,
        sqmUsage:
          allOutputData[0].ArcherTower.toNumber() *
          RealmBuildingsSize.ArcherTower,
      },
      {
        name: 'Barracks',
        key: 'barracks',
        id: RealmBuildingId.Barracks,
        quantityBuilt: allOutputData[0].Barracks.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
        buildingSize: RealmBuildingsSize.Barracks,
        sqmUsage:
          allOutputData[0].Barracks.toNumber() * RealmBuildingsSize.Barracks,
      },
      {
        name: 'Castle',
        key: 'castle',
        id: RealmBuildingId.Castle,
        quantityBuilt: allOutputData[0].Castle.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'military',
        buildingSize: RealmBuildingsSize.Castle,
        sqmUsage:
          allOutputData[0].Castle.toNumber() * RealmBuildingsSize.Castle,
      },
      {
        name: 'Farm',
        key: 'farm',
        id: RealmBuildingId.Farm,
        quantityBuilt: allOutputData[0].Farm.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
        buildingSize: RealmBuildingsSize.Farm,
        sqmUsage: allOutputData[0].Farm.toNumber() * RealmBuildingsSize.Farm,
      },
      {
        name: 'Fishing Village',
        key: 'fishingVillage',
        id: RealmBuildingId.FishingVillage,
        quantityBuilt: allOutputData[0].FishingVillage.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
        buildingSize: RealmBuildingsSize.FishingVillage,
        sqmUsage:
          allOutputData[0].FishingVillage.toNumber() *
          RealmBuildingsSize.FishingVillage,
      },
      {
        name: 'House',
        key: 'house',
        id: RealmBuildingId.House,
        quantityBuilt: allOutputData[0].House.toNumber(),
        img: '/realm-buildings/barracks.png',
        type: 'economic',
        buildingSize: RealmBuildingsSize.House,
        sqmUsage: allOutputData[0].House.toNumber() * RealmBuildingsSize.House,
      },
      {
        name: 'MageTower',
        key: 'mageTower',
        id: RealmBuildingId.MageTower,
        quantityBuilt: allOutputData[0].MageTower.toNumber(),
        img: '/realm-buildings/mageTower.png',
        type: 'military',
        buildingSize: RealmBuildingsSize.MageTower,
        sqmUsage:
          allOutputData[0].MageTower.toNumber() * RealmBuildingsSize.MageTower,
      },
      {
        name: 'Store House',
        key: 'storeHouse',
        id: RealmBuildingId.StoreHouse,
        quantityBuilt: allOutputData[0].StoreHouse.toNumber(),
        img: '/realm-buildings/storeHouse.png',
        type: 'economic',
        buildingSize: RealmBuildingsSize.StoreHouse,
        sqmUsage:
          allOutputData[0].StoreHouse.toNumber() *
          RealmBuildingsSize.StoreHouse,
      },
    ]);

    const sqm =
      RealmBuildingsSize.Barracks * allOutputData[0].Barracks.toNumber() +
      RealmBuildingsSize.ArcherTower * allOutputData[0].ArcherTower.toNumber() +
      RealmBuildingsSize.Castle * allOutputData[0].Castle.toNumber() +
      RealmBuildingsSize.MageTower * allOutputData[0].MageTower.toNumber() +
      RealmBuildingsSize.House * allOutputData[0].House.toNumber() +
      RealmBuildingsSize.StoreHouse * allOutputData[0].StoreHouse.toNumber();

    const cities = getTrait(realm, 'City');
    const regions = getTrait(realm, 'Region');

    const max = cities * (regions / 2) + 100;

    SetBuildingUtilisation({ maxSqm: max, currentSqm: sqm });
  }, [allOutputData, realm]);

  return {
    buildings,
    loading,
    buildingUtilisation,
  };
};

export default useBuildings;
