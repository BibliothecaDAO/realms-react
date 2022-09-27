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

const barracks = '/realm-buildings/barracks.png';

export const buildingImageById = (id: RealmBuildingId) => {
  let name = 'n/a';
  switch (id) {
    case RealmBuildingId.House:
      name = barracks;
      break;
    case RealmBuildingId.StoreHouse:
      name = '/realm-buildings/storeHouse.png';
      break;
    case RealmBuildingId.Granary:
      name = barracks;
      break;
    case RealmBuildingId.Farm:
      name = barracks;
      break;
    case RealmBuildingId.FishingVillage:
      name = barracks;
      break;
    case RealmBuildingId.Barracks:
      name = barracks;
      break;
    case RealmBuildingId.MageTower:
      name = '/realm-buildings/mageTower.png';
      break;
    case RealmBuildingId.ArcherTower:
      name = barracks;
      break;
    case RealmBuildingId.Castle:
      name = barracks;
      break;
  }
  return name;
};

export const buildingIdToString = (id: RealmBuildingId) => {
  let name = 'n/a';
  switch (id) {
    case RealmBuildingId.House:
      name = 'House';
      break;
    case RealmBuildingId.StoreHouse:
      name = 'Store House';
      break;
    case RealmBuildingId.Granary:
      name = 'Granary';
      break;
    case RealmBuildingId.Farm:
      name = 'Farm';
      break;
    case RealmBuildingId.FishingVillage:
      name = 'Fishing Village';
      break;
    case RealmBuildingId.Barracks:
      name = 'Barracks';
      break;
    case RealmBuildingId.MageTower:
      name = 'Mage Tower';
      break;
    case RealmBuildingId.ArcherTower:
      name = 'Archer Tower';
      break;
    case RealmBuildingId.Castle:
      name = 'Castle';
      break;
  }
  return name;
};

export const buildingIntegrity = (id: RealmBuildingId) => {
  let name = 0;
  switch (id) {
    case RealmBuildingId.House:
      name = 3600;
      break;
    case RealmBuildingId.Barracks:
      name = 37319;
      break;
    case RealmBuildingId.MageTower:
      name = 37319;
      break;
    case RealmBuildingId.ArcherTower:
      name = 37319;
      break;
    case RealmBuildingId.Castle:
      name = 37319;
      break;
  }
  return name;
};

export enum HarvestType {
  Export = 1,
  Store = 2,
}

export enum RealmBuildingIntegrity {
  House = 3600,
  StoreHouse = 2000,
  Granary = 2000,
  Farm = 2000,
  FishingVillage = 2000,
  Barracks = 37319,
  MageTower = 37319,
  ArcherTower = 37319,
  Castle = 37319,
}

export const BASE_SQM = 100;
export const MAX_DAYS_ACCURED = 3;
export const BASE_RESOURCES_PER_DAY = 250;
export const WONDER_RATE = BASE_RESOURCES_PER_DAY / 10;

export const VAULT_LENGTH = 7;
export const DAY = 14400;
export const VAULT_LENGTH_SECONDS = VAULT_LENGTH * DAY;

export const BASE_LORDS_PER_DAY = 25;

export const WORK_HUT_COST_IN_BP = 5;
export const WORK_HUT_COST = 75;
export const WORK_HUT_OUTPUT = 50;

export const PILLAGE_AMOUNT = 25;

export const STORE_HOUSE_SIZE = 1000;

export const BASE_HARVESTS = 24;
export const MAX_HARVESTS = BASE_HARVESTS / 4;
export const HARVEST_LENGTH = DAY / 10;

export const FARM_LENGTH = (DAY / 3) * BASE_HARVESTS;
export const FISHING_TRAPS = (DAY / 3) * BASE_HARVESTS;
export const BASE_FOOD_PRODUCTION = 2000;

export const FISH_ID = 10001;
export const WHEAT_ID = 10000;

export const SECONDS_PER_KM = 30;
