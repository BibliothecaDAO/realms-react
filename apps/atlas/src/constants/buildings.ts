/* eslint-disable @typescript-eslint/naming-convention */

// Baseline square meter for building capacity calculations.

export enum RealmBuildingsSize {
  House = 4,
  StoreHouse = 2,
  Granary = 3,
  Farm = 3,
  FishingVillage = 3,
  Barracks = 16,
  MageTower = 16,
  ArcherTower = 16,
  Castle = 16,
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

export const BASE_SQM = 25;
export const MAX_DAYS_ACCURED = 3;
export const BASE_RESOURCES_PER_DAY = 250;
export const WONDER_RATE = BASE_RESOURCES_PER_DAY / 10;

export const VAULT_LENGTH = 7;
export const DAY = 1800;
export const VAULT_LENGTH_SECONDS = VAULT_LENGTH * DAY;

export const BASE_LORDS_PER_DAY = 25;

export const WORK_HUT_COST_IN_BP = 5;
export const WORK_HUT_COST = 75;
export const WORK_HUT_OUTPUT = 200;

export const PILLAGE_AMOUNT = 25;

export const STORE_HOUSE_SIZE = 1000;

export const BASE_HARVESTS = 24;
export const MAX_HARVESTS = BASE_HARVESTS / 4;
export const HARVEST_LENGTH = DAY / 10;

export const FARM_LENGTH = (DAY / 3) * BASE_HARVESTS;
export const FISHING_TRAPS = (DAY / 3) * BASE_HARVESTS;
export const BASE_FOOD_PRODUCTION = 2000;
