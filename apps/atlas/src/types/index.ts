import type { Call } from '@starknet-react/core';
import type { ReactElement } from 'react';
import type { RealmFragmentFragment, Army } from '@/generated/graphql';
export type GameStatus = 'active' | 'completed' | 'expired';

export const dndTypes = {
  TX: 'tx',
};

interface Owner {
  address: string;
  realmsHeld: number;
  bridgedRealmsHeld: number;
  bagsHeld: number;
  gAdventurersHeld: number;
}

export interface Realm {
  id: string;
  resourceIds: Array<string>;
  order: string;
  wonder: string;
  cities: number;
  harbours: number;
  rivers: number;
  regions: number;
  name: string;
  rarityScore: number;
  rarityRank: number;
  currentOwner: Owner;
}

export interface Crypt {
  id: string;
  size: number;
  environment: number;
  numDoors: number;
  numPoints: number;
  name: string;
  svg: string;
  currentOwner: Owner;
}
export interface Loot {
  id: string;
  chest: string;
  foot: string;
  hand: string;
  head: string;
  neck: string;
  ring: string;
  waist: string;
  weapon: string;
  chestSuffixId: number;
  footSuffixId: number;
  handSuffixId: number;
  headSuffixId: number;
  neckSuffixId: number;
  ringSuffixId: number;
  waistSuffixId: number;
  weaponSuffixId: number;
  manasClaimed: string;
  manas: { id: string; inventoryId: number }[];
  currentOwner: Owner;
  minted: number;
}
export interface GAdventurer {
  id: string;
  chest: string;
  foot: string;
  hand: string;
  head: string;
  neck: string;
  ring: string;
  waist: string;
  weapon: string;
  order: string;
  orderColor: string;
  orderCount: string;
  currentOwner: Owner;
  minted: number;
  bagGreatness: number;
  bagLevel: number;
  bagRating: number;
  manasClaimed: number;
  itemsClaimed: boolean;
  lootTokenIds: number[];
}
export interface Data {
  realm: Realm;
}
export interface CryptData {
  dungeon: Crypt;
}
export interface LootData {
  bag: Loot;
}
export interface GAData {
  gadventurer: GAdventurer;
}
export interface RealmProps {
  realm: Realm;
  loading: boolean;
  size?: string;
}
export interface RealmsCardProps {
  realm: RealmFragmentFragment;
  loading: boolean;
  size?: string;
}
export interface CryptProps {
  crypt: Crypt;
  loading: boolean;
  size?: string;
  flyto?: boolean;
}
export interface LootProps {
  loot: Loot;
  loading: boolean;
  size?: string;
  flyto?: boolean;
}
export interface GAProps {
  ga: GAdventurer;
  loading: boolean;
  size?: string;
  flyto?: boolean;
}

export interface WalletRealmsData {
  realms: Realm[];
  bridgedRealms: Realm[];
  wallet: Owner;
}

export interface WalletCryptsData {
  dungeons: Crypt[];
}

export interface UiState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface RealmFilters {
  address?: string;
  resources?: number[];
  orders?: string[];
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: string;
}

export interface Queries {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': string;
}

export interface CryptFilters {
  address?: string;
  first?: number;
  skip?: number;
}
export enum realmMilitaryEvents {
  realmCombatAttack = 'realm_combat_attack',
  realmCombatDefend = 'realm_combat_defend',
}
export enum realmEconomicEvents {
  realmBuildingBuilt = 'realm_building_built',
  realmTransfer = 'realm_transfer',
}
export const realmEvents = { ...realmMilitaryEvents, ...realmEconomicEvents };
export type RealmEvents = typeof realmEvents;

export interface RealmEventTypes {
  realmBuildingBuilt: 'realm_building_built';
  realmTransfer: 'realm_transfer';
}

export interface WalletData {
  wallet: WalletEcosystemData;
}

export interface WalletEcosystemData {
  currentOwner: Owner;
  bags: Loot[];
}
export interface GAsData {
  currentOwner: Owner;
  gadventurers: GAdventurer[];
}

export type RealmFeatures = {
  type?: string;
  geometry: RealmFeatureGeometry;
  properties: RealmFeatureProperties;
};
export type RealmFeatureGeometry = {
  type?: string;
  coordinates: number[];
};
export type RealmFeatureProperties = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  realm_idx: number;
  order: string;
  resources: string[];
};

export interface BattalionStatistics {
  type: string;
  attack: number;
  cavalryDefence: number;
  archeryDefence: number;
  magicDefence: number;
  infantryDefence: number;
}

export interface BattalionInterface extends BattalionStatistics {
  battalionId: number;
  index: number;
  battalionName: string;
  battalionCost: ResourceCost[];
  buildingId?: number | undefined;
}
export interface ArmyStatistics {
  cavalryAttack: number;
  archeryAttack: number;
  magicAttack: number;
  infantryAttack: number;
  cavalryDefence: number;
  archeryDefence: number;
  magicDefence: number;
  infantryDefence: number;
}
export interface ArmyInterface extends Army {
  statistics: ArmyStatistics;
}

export type ArmyBattalionQty = Pick<
  Army,
  | 'heavyCavalryQty'
  | 'lightCavalryQty'
  | 'archerQty'
  | 'longbowQty'
  | 'mageQty'
  | 'arcanistQty'
  | 'lightInfantryQty'
  | 'heavyInfantryQty'
>;

export interface ItemCost {
  amount: number;
  resources: ResourceCost[];
}

export interface ResourceCost {
  amount: number;
  resourceId: number;
  resourceName: string;
}

export interface MinMaxRange {
  min: number;
  max: number;
}

export interface CallAndMetadata extends Call {
  metadata: { title: string; description: string } | any;
}

export type RealmsTransaction = { status?: string; metadata?: any };
export interface RealmsTransactionRender {
  title: string;
  description: string | ReactElement;
}

export interface RealmsTransactionQueueContext {
  isQueued: boolean;
}

export type RealmsTransactionRenderConfig = Record<
  string,
  (
    tx: RealmsTransaction,
    context: RealmsTransactionQueueContext
  ) => RealmsTransactionRender
>;

export type NetworkState = 'loading' | 'success' | 'error';

export interface BuildingDetail {
  name: string;
  id: number;
  quantityBuilt: number;
  img: string;
  type: string;
  key: string;
  sqmUsage: number;
  buildingSize: number;
  cost: ResourceCost[];
  buildingDecay: number;
}

export interface RealmFoodDetails {
  totalFarmHarvest: number;
  totalTimeRemainingUntilFarmHarvest: number;
  decayedFarms: number;
  farmsBuilt: number;
  totalVillageHarvest: number;
  totalTimeRemainingUntilVillageHarvest: number;
  decayedVillages: number;
  villagesBuilt: number;
  fishingVillagesHarvestsLeft: number;
  farmHarvestsLeft: number;
}

export interface BuildingFootprint {
  maxSqm: number;
  currentSqm: number;
}

export type AvailableResources = {
  daysAccrued: number;
  daysRemainder: number;
  vaultAccrued: number;
  vaultRemainder: number;
  claimableResources: string[] | undefined;
  vaultResources: string[] | undefined;
};

export interface HistoricPriceData {
  date: string | undefined;
  amount: number | undefined;
}

export interface HistoricPrices {
  [tokenId: number]: HistoricPriceData[] | [];
}
