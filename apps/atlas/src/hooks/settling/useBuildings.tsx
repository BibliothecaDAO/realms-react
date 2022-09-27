import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  RealmBuildingId,
  HarvestType,
  RealmBuildingsSize,
  RealmBuildingIntegrity,
  buildingIdToString,
  buildingImageById,
} from '@/constants/buildings';
import { useResourcesContext } from '@/context/ResourcesContext';
import type { Realm } from '@/generated/graphql';
import { useGetBuildingsByRealmIdQuery } from '@/generated/graphql';
import {
  ModuleAddr,
  useBuildingContract,
  useFoodContract,
} from '@/hooks/settling/stark-contracts';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { getTrait } from '@/shared/Getters/Realm';
import type {
  RealmsCall,
  BuildingFootprint,
  BuildingDetail,
  RealmsTransactionRenderConfig,
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
  build: (args: { realmId; buildingId; qty; costs }) => ({
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

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.build]: ({ metadata }, ctx) => ({
    title: ctx.isQueued
      ? `Construct ${metadata.qty} ${buildingIdToString(
          metadata.buildingId
        )} on Realm ${metadata.realmId}`
      : 'Constructing Building',
    description: (
      <span>
        <div className="flex my-1">
          <Image
            height={80}
            width={80}
            className="object-fill border rounded paper"
            src={buildingImageById(metadata.buildingId)}
            alt=""
          />
          <div className="self-center ml-4">
            <h3>{buildingIdToString(metadata.buildingId)}</h3>
          </div>
        </div>
      </span>
    ),
  }),
};

const useBuildings = (realm: Realm | undefined): Building => {
  const [buildings, setBuildings] = useState<BuildingDetail[]>();

  const { gameConstants } = useGameConstants();

  const [buildingUtilisation, SetBuildingUtilisation] =
    useState<BuildingFootprint>({ maxSqm: 0, currentSqm: 0 });

  const currentTime = new Date().getTime();

  const getRealmBuildings = (integrity, buildingLength) => {
    const buildings = Math.floor(
      (integrity - currentTime / 1000) / buildingLength
    );
    return buildings < 0 ? 0 : buildings;
  };

  const pluckBuilding = (realm: Realm | undefined, buildingId) => {
    const integrity = realm?.buildings?.find(
      (a) => a.buildingId === buildingId
    )?.buildingIntegrity;
    return integrity ? integrity : 0;
  };

  useEffect(() => {
    if (!gameConstants || !realm) {
      return;
    }

    const barracks = getRealmBuildings(
      pluckBuilding(realm, RealmBuildingId.Barracks),
      RealmBuildingIntegrity.Barracks
    );
    const castles = getRealmBuildings(
      pluckBuilding(realm, RealmBuildingId.Castle),
      RealmBuildingIntegrity.Castle
    );
    const archerTowers = getRealmBuildings(
      pluckBuilding(realm, RealmBuildingId.ArcherTower),
      RealmBuildingIntegrity.ArcherTower
    );
    const mageTowers = getRealmBuildings(
      pluckBuilding(realm, RealmBuildingId.MageTower),
      RealmBuildingIntegrity.MageTower
    );

    const huts = getRealmBuildings(
      pluckBuilding(realm, RealmBuildingId.House),
      RealmBuildingIntegrity.House
    );

    setBuildings([
      {
        name: 'Archer Tower',
        key: 'archerTower',
        id: RealmBuildingId.ArcherTower,
        quantityBuilt: archerTowers,
        img: buildingImageById(RealmBuildingId.ArcherTower),
        type: 'military',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.ArcherTower),
        buildingSize: RealmBuildingsSize.ArcherTower,
        sqmUsage: archerTowers * RealmBuildingsSize.ArcherTower,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.ArcherTower
        )?.resources,
      },
      {
        name: 'Barracks',
        key: 'barracks',
        id: RealmBuildingId.Barracks,
        quantityBuilt: barracks,
        img: buildingImageById(RealmBuildingId.Barracks),
        type: 'military',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.Barracks),
        buildingSize: RealmBuildingsSize.Barracks,
        sqmUsage: barracks * RealmBuildingsSize.Barracks,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.Barracks
        )?.resources,
      },
      {
        name: 'Castle',
        key: 'castle',
        id: RealmBuildingId.Castle,
        quantityBuilt: castles,
        img: buildingImageById(RealmBuildingId.Castle),
        type: 'military',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.Castle),
        buildingSize: RealmBuildingsSize.Castle,
        sqmUsage: castles * RealmBuildingsSize.Castle,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.Castle
        )?.resources,
      },
      {
        name: 'Farm',
        key: 'farm',
        id: RealmBuildingId.Farm,
        quantityBuilt: 0,
        img: buildingImageById(RealmBuildingId.Farm),
        type: 'economic',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.Farm),
        buildingSize: RealmBuildingsSize.Farm,
        sqmUsage: 0 * RealmBuildingsSize.Farm,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.Farm
        )?.resources,
      },
      {
        name: 'Fishing Village',
        key: 'fishingVillage',
        id: RealmBuildingId.FishingVillage,
        quantityBuilt: 0,
        img: buildingImageById(RealmBuildingId.FishingVillage),
        type: 'economic',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.FishingVillage),
        buildingSize: RealmBuildingsSize.FishingVillage,
        sqmUsage: 0 * RealmBuildingsSize.FishingVillage,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.FishingVillage
        )?.resources,
      },
      {
        name: 'House',
        key: 'house',
        id: RealmBuildingId.House,
        quantityBuilt: huts,
        img: buildingImageById(RealmBuildingId.House),
        type: 'economic',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.House),
        buildingSize: RealmBuildingsSize.House,
        sqmUsage: huts * RealmBuildingsSize.House,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.House
        )?.resources,
      },
      {
        name: 'Mage Tower',
        key: 'mageTower',
        id: RealmBuildingId.MageTower,
        quantityBuilt: mageTowers,
        img: buildingImageById(RealmBuildingId.MageTower),
        type: 'military',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.MageTower),
        buildingSize: RealmBuildingsSize.MageTower,
        sqmUsage: mageTowers * RealmBuildingsSize.MageTower,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.MageTower
        )?.resources,
      },
      {
        name: 'Store House',
        key: 'storeHouse',
        id: RealmBuildingId.StoreHouse,
        quantityBuilt: 0,
        img: buildingImageById(RealmBuildingId.StoreHouse),
        type: 'economic',
        buildingDecay: pluckBuilding(realm, RealmBuildingId.StoreHouse),
        buildingSize: RealmBuildingsSize.StoreHouse,
        sqmUsage: 0 * RealmBuildingsSize.StoreHouse,
        cost: gameConstants?.buildingCosts.find(
          (a) => a.buildingId === RealmBuildingId.StoreHouse
        )?.resources,
      },
    ]);

    const sqm =
      RealmBuildingsSize.Barracks * barracks +
      RealmBuildingsSize.ArcherTower * archerTowers +
      RealmBuildingsSize.Castle * castles +
      RealmBuildingsSize.MageTower * mageTowers +
      RealmBuildingsSize.House * huts +
      RealmBuildingsSize.StoreHouse * 0;

    const cities = getTrait(realm, 'City');
    const regions = getTrait(realm, 'Region');

    const max = cities * (regions / 2) + 100;

    SetBuildingUtilisation({ maxSqm: max, currentSqm: sqm });
  }, [realm, gameConstants]);

  return {
    buildings,
    loading: false,
    buildingUtilisation,
  };
};

export default useBuildings;
