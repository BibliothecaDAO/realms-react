/* eslint-disable @typescript-eslint/naming-convention */

// Baseline square meter for building capacity calculations.
export const BASE_SQM = 25;

export enum RealmBuildingsSize {
  House = 2,
  StoreHouse = 3,
  Granary = 3,
  Farm = 3,
  FishingVillage = 3,
  Barracks = 6,
  MageTower = 6,
  ArcherTower = 6,
  Castle = 12,
}

export enum RealmBuildingId {
  House = 1,
  StoreHouse = 2,
  Granary = 3,
  Farm = 4,
  FishingVillage = 5,
  Barracks = 6,
  MageTower = 7,
  ArcherTower = 8,
  Castle = 9,
}

export enum HarvestType {
  Export = 1,
  Store = 2,
}

const BASE_RESOURCES_PER_DAY = 250;
const WORK_HUT_COST_IN_BP = 5; // 1/5 of resource output
export const WORK_HUT_COST = BASE_RESOURCES_PER_DAY / WORK_HUT_COST_IN_BP;
