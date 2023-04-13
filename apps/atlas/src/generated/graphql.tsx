import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  Timestamp: any;
};

export type AggregateRealmHistory = {
  __typename?: 'AggregateRealmHistory';
  _avg?: Maybe<RealmHistoryAvgAggregate>;
  _count?: Maybe<RealmHistoryCountAggregate>;
  _max?: Maybe<RealmHistoryMaxAggregate>;
  _min?: Maybe<RealmHistoryMinAggregate>;
  _sum?: Maybe<RealmHistorySumAggregate>;
};

/** Army */
export type Army = {
  __typename?: 'Army';
  arcanistHealth: Scalars['Int'];
  arcanistQty: Scalars['Int'];
  archerHealth: Scalars['Int'];
  archerQty: Scalars['Int'];
  armyId: Scalars['Int'];
  armyPacked: Scalars['Int'];
  bastionArrivalBlock: Scalars['Int'];
  bastionCurrentLocation: Scalars['Int'];
  bastionId?: Maybe<Scalars['String']>;
  bastionPastLocation: Scalars['Int'];
  callSign: Scalars['Int'];
  destinationArrivalTime?: Maybe<Scalars['Timestamp']>;
  destinationRealm?: Maybe<Realm>;
  destinationRealmId: Scalars['Int'];
  heavyCavalryHealth: Scalars['Int'];
  heavyCavalryQty: Scalars['Int'];
  heavyInfantryHealth: Scalars['Int'];
  heavyInfantryQty: Scalars['Int'];
  lastAttacked?: Maybe<Scalars['Timestamp']>;
  level: Scalars['Int'];
  lightCavalryHealth: Scalars['Int'];
  lightCavalryQty: Scalars['Int'];
  lightInfantryHealth: Scalars['Int'];
  lightInfantryQty: Scalars['Int'];
  longbowHealth: Scalars['Int'];
  longbowQty: Scalars['Int'];
  mageHealth: Scalars['Int'];
  mageQty: Scalars['Int'];
  orderId: Scalars['Int'];
  realmId: Scalars['Int'];
  xp: Scalars['Int'];
};

export type ArmyListRelationFilter = {
  every?: InputMaybe<ArmyWhereInput>;
  none?: InputMaybe<ArmyWhereInput>;
  some?: InputMaybe<ArmyWhereInput>;
};

export type ArmyOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ArmyOrderByWithRelationInput = {
  arcanistHealth?: InputMaybe<SortOrder>;
  arcanistQty?: InputMaybe<SortOrder>;
  archerHealth?: InputMaybe<SortOrder>;
  archerQty?: InputMaybe<SortOrder>;
  armyId?: InputMaybe<SortOrder>;
  armyPacked?: InputMaybe<SortOrder>;
  bastionArrivalBlock?: InputMaybe<SortOrder>;
  bastionCurrentLocation?: InputMaybe<SortOrder>;
  bastionId?: InputMaybe<SortOrder>;
  bastionPastLocation?: InputMaybe<SortOrder>;
  callSign?: InputMaybe<SortOrder>;
  destinationArrivalTime?: InputMaybe<SortOrder>;
  destinationRealmId?: InputMaybe<SortOrder>;
  heavyCavalryHealth?: InputMaybe<SortOrder>;
  heavyCavalryQty?: InputMaybe<SortOrder>;
  heavyInfantryHealth?: InputMaybe<SortOrder>;
  heavyInfantryQty?: InputMaybe<SortOrder>;
  lastAttacked?: InputMaybe<SortOrder>;
  level?: InputMaybe<SortOrder>;
  lightCavalryHealth?: InputMaybe<SortOrder>;
  lightCavalryQty?: InputMaybe<SortOrder>;
  lightInfantryHealth?: InputMaybe<SortOrder>;
  lightInfantryQty?: InputMaybe<SortOrder>;
  longbowHealth?: InputMaybe<SortOrder>;
  longbowQty?: InputMaybe<SortOrder>;
  mageHealth?: InputMaybe<SortOrder>;
  mageQty?: InputMaybe<SortOrder>;
  orderId?: InputMaybe<SortOrder>;
  ownRealm?: InputMaybe<RealmOrderByWithRelationInput>;
  realmId?: InputMaybe<SortOrder>;
  xp?: InputMaybe<SortOrder>;
};

export type ArmyWhereInput = {
  AND?: InputMaybe<Array<ArmyWhereInput>>;
  NOT?: InputMaybe<Array<ArmyWhereInput>>;
  OR?: InputMaybe<Array<ArmyWhereInput>>;
  arcanistHealth?: InputMaybe<IntFilter>;
  arcanistQty?: InputMaybe<IntFilter>;
  archerHealth?: InputMaybe<IntFilter>;
  archerQty?: InputMaybe<IntFilter>;
  armyId?: InputMaybe<IntFilter>;
  armyPacked?: InputMaybe<IntFilter>;
  bastionArrivalBlock?: InputMaybe<IntFilter>;
  bastionCurrentLocation?: InputMaybe<IntFilter>;
  bastionId?: InputMaybe<IntFilter>;
  bastionPastLocation?: InputMaybe<IntFilter>;
  callSign?: InputMaybe<IntFilter>;
  destinationArrivalTime?: InputMaybe<DateTimeNullableFilter>;
  destinationRealmId?: InputMaybe<IntFilter>;
  heavyCavalryHealth?: InputMaybe<IntFilter>;
  heavyCavalryQty?: InputMaybe<IntFilter>;
  heavyInfantryHealth?: InputMaybe<IntFilter>;
  heavyInfantryQty?: InputMaybe<IntFilter>;
  lastAttacked?: InputMaybe<DateTimeNullableFilter>;
  level?: InputMaybe<IntFilter>;
  lightCavalryHealth?: InputMaybe<IntFilter>;
  lightCavalryQty?: InputMaybe<IntFilter>;
  lightInfantryHealth?: InputMaybe<IntFilter>;
  lightInfantryQty?: InputMaybe<IntFilter>;
  longbowHealth?: InputMaybe<IntFilter>;
  longbowQty?: InputMaybe<IntFilter>;
  mageHealth?: InputMaybe<IntFilter>;
  mageQty?: InputMaybe<IntFilter>;
  orderId?: InputMaybe<IntFilter>;
  ownRealm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntFilter>;
  xp?: InputMaybe<IntFilter>;
};

export type Bastion = {
  __typename?: 'Bastion';
  bastionId: Scalars['Int'];
  latitude: Scalars['Float'];
  locations: Array<BastionLocation>;
  longitude: Scalars['Float'];
};

/** The Bastion History Model */
export type BastionHistory = {
  __typename?: 'BastionHistory';
  bastionId: Scalars['Int'];
  realmHistory: RealmHistory;
  realmHistoryEventId: Scalars['String'];
  realmHistoryEventType: Scalars['String'];
};

export type BastionHistoryOrderByWithRelationInput = {
  bastionId?: InputMaybe<SortOrder>;
  realmHistory?: InputMaybe<RealmHistoryOrderByWithRelationInput>;
  realmHistoryEventId?: InputMaybe<SortOrder>;
  realmHistoryEventType?: InputMaybe<SortOrder>;
};

export type BastionHistoryRelationFilter = {
  is?: InputMaybe<BastionHistoryWhereInput>;
  isNot?: InputMaybe<BastionHistoryWhereInput>;
};

export type BastionHistoryWhereInput = {
  AND?: InputMaybe<Array<BastionHistoryWhereInput>>;
  NOT?: InputMaybe<Array<BastionHistoryWhereInput>>;
  OR?: InputMaybe<Array<BastionHistoryWhereInput>>;
  bastionId?: InputMaybe<IntFilter>;
  realmHistory?: InputMaybe<RealmHistoryRelationFilter>;
  realmHistoryEventId?: InputMaybe<StringFilter>;
  realmHistoryEventType?: InputMaybe<StringFilter>;
};

export type BastionLocation = {
  __typename?: 'BastionLocation';
  armies: Array<Army>;
  bastionId: Scalars['Int'];
  defendingOrderId: Scalars['Int'];
  locationId: Scalars['Int'];
  takenBlock: Scalars['Int'];
};

export type BastionLocationBastionIdLocationIdCompoundUniqueInput = {
  bastionId: Scalars['Int'];
  locationId: Scalars['Int'];
};

export type BastionLocationOrderByWithRelationInput = {
  bastionId?: InputMaybe<SortOrder>;
  defendingOrderId?: InputMaybe<SortOrder>;
  locationId?: InputMaybe<SortOrder>;
  takenBlock?: InputMaybe<SortOrder>;
};

export enum BastionLocationScalarFieldEnum {
  BastionId = 'bastionId',
  DefendingOrderId = 'defendingOrderId',
  LocationId = 'locationId',
  TakenBlock = 'takenBlock',
}

export type BastionLocationWhereInput = {
  AND?: InputMaybe<Array<BastionLocationWhereInput>>;
  NOT?: InputMaybe<Array<BastionLocationWhereInput>>;
  OR?: InputMaybe<Array<BastionLocationWhereInput>>;
  bastionId?: InputMaybe<IntFilter>;
  defendingOrderId?: InputMaybe<IntFilter>;
  locationId?: InputMaybe<IntFilter>;
  takenBlock?: InputMaybe<IntFilter>;
};

export type BastionLocationWhereUniqueInput = {
  bastionId_locationId?: InputMaybe<BastionLocationBastionIdLocationIdCompoundUniqueInput>;
};

/** Battalion Cost Model */
export type BattalionCost = {
  __typename?: 'BattalionCost';
  amount: Scalars['Float'];
  battalionId: Scalars['Int'];
  battalionName: Scalars['String'];
  resources: Scalars['JSON'];
};

/** BattalionStats */
export type BattalionStats = {
  __typename?: 'BattalionStats';
  battalionId: Scalars['Int'];
  battalionName: Scalars['String'];
  combatType: Scalars['String'];
  requiredBuildingId: Scalars['Int'];
  requiredBuildingName: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['Int'];
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<NestedBoolFilter>;
};

/** The Buildings Model */
export type Building = {
  __typename?: 'Building';
  buildingCost: BuildingCost;
  buildingId: Scalars['Int'];
  buildingIntegrity: Scalars['Int'];
  buildingName: Scalars['String'];
  builds: Array<Scalars['String']>;
  count: Scalars['Int'];
  culture: Scalars['Int'];
  food: Scalars['Int'];
  limit?: Maybe<Scalars['Float']>;
  limitTraitId: Scalars['Int'];
  limitTraitName: Scalars['String'];
  population: Scalars['Int'];
  realmId: Scalars['Float'];
  size: Scalars['Int'];
};

/** Building Cost Model */
export type BuildingCost = {
  __typename?: 'BuildingCost';
  amount: Scalars['Float'];
  buildingId: Scalars['Int'];
  buildingName: Scalars['String'];
  resources: Scalars['JSON'];
};

export type BuildingListRelationFilter = {
  every?: InputMaybe<BuildingWhereInput>;
  none?: InputMaybe<BuildingWhereInput>;
  some?: InputMaybe<BuildingWhereInput>;
};

export type BuildingOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type BuildingWhereInput = {
  AND?: InputMaybe<Array<BuildingWhereInput>>;
  NOT?: InputMaybe<Array<BuildingWhereInput>>;
  OR?: InputMaybe<Array<BuildingWhereInput>>;
  buildingId?: InputMaybe<IntFilter>;
  buildingIntegrity?: InputMaybe<IntFilter>;
  builds?: InputMaybe<StringNullableListFilter>;
  eventId?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  realm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntNullableFilter>;
};

/** The Combat History Model */
export type CombatHistory = {
  __typename?: 'CombatHistory';
  attackRealmId: Scalars['Int'];
  attackRealmOwner?: Maybe<Scalars['String']>;
  attackSquad?: Maybe<Scalars['JSON']>;
  attackType?: Maybe<Scalars['Int']>;
  defendRealmId: Scalars['Int'];
  defendRealmOwner?: Maybe<Scalars['String']>;
  defendSquad?: Maybe<Scalars['JSON']>;
  eventId: Scalars['String'];
  eventType: Scalars['String'];
  hitPoints?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  outcome?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Timestamp']>;
  transactionHash?: Maybe<Scalars['String']>;
};

/** The CombatResult Model */
export type CombatResult = {
  __typename?: 'CombatResult';
  attackRealmId: Scalars['Int'];
  defendRealmId: Scalars['Int'];
  history?: Maybe<Array<CombatHistory>>;
  outcome?: Maybe<Scalars['Int']>;
  relicLost?: Maybe<Scalars['Int']>;
  resourcesPillaged?: Maybe<Array<ResourceAmount>>;
  timestamp?: Maybe<Scalars['Timestamp']>;
  transactionHash: Scalars['String'];
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

export type DateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

/** The Desiege Model */
export type Desiege = {
  __typename?: 'Desiege';
  attackedTokens: Scalars['Int'];
  defendedTokens: Scalars['Int'];
  endBlock: Scalars['Int'];
  eventIndexed: Scalars['Float'];
  gameId: Scalars['Int'];
  id: Scalars['ID'];
  initialHealth: Scalars['Int'];
  startBlock: Scalars['Int'];
  startedOn: Scalars['Timestamp'];
  winner: Scalars['Int'];
};

export type EnumOrderTypeNullableFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type EnumOrderTypeNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  _min?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type EnumRealmTraitTypeFilter = {
  equals?: InputMaybe<RealmTraitType>;
  in?: InputMaybe<Array<RealmTraitType>>;
  not?: InputMaybe<NestedEnumRealmTraitTypeFilter>;
  notIn?: InputMaybe<Array<RealmTraitType>>;
};

export type ExchangeRate = {
  __typename?: 'ExchangeRate';
  amount: Scalars['String'];
  buyAmount: Scalars['String'];
  currencyReserve: Scalars['String'];
  date: Scalars['String'];
  hour: Scalars['Int'];
  lpAmount: Scalars['String'];
  sellAmount: Scalars['String'];
  tokenId: Scalars['Int'];
  tokenReserve: Scalars['String'];
};

/** Exchange Rate */
export type ExchangeRate24Hr = {
  __typename?: 'ExchangeRate24Hr';
  amount: Scalars['String'];
  buyAmount: Scalars['String'];
  currencyReserve: Scalars['String'];
  date: Scalars['String'];
  hour: Scalars['Int'];
  lpAmount: Scalars['String'];
  percentChange24Hr?: Maybe<Scalars['Float']>;
  sellAmount: Scalars['String'];
  tokenId: Scalars['Int'];
  tokenName: Scalars['String'];
  tokenReserve: Scalars['String'];
};

export type ExchangeRateDateHourTokenIdCompoundUniqueInput = {
  date: Scalars['String'];
  hour: Scalars['Int'];
  tokenId: Scalars['Int'];
};

export type ExchangeRateOrderByWithRelationInput = {
  amount?: InputMaybe<SortOrder>;
  buyAmount?: InputMaybe<SortOrder>;
  currencyReserve?: InputMaybe<SortOrder>;
  date?: InputMaybe<SortOrder>;
  hour?: InputMaybe<SortOrder>;
  lpAmount?: InputMaybe<SortOrder>;
  sellAmount?: InputMaybe<SortOrder>;
  tokenId?: InputMaybe<SortOrder>;
  tokenReserve?: InputMaybe<SortOrder>;
};

export enum ExchangeRateScalarFieldEnum {
  Amount = 'amount',
  BuyAmount = 'buyAmount',
  CurrencyReserve = 'currencyReserve',
  Date = 'date',
  Hour = 'hour',
  LpAmount = 'lpAmount',
  SellAmount = 'sellAmount',
  TokenId = 'tokenId',
  TokenReserve = 'tokenReserve',
}

export type ExchangeRateWhereInput = {
  AND?: InputMaybe<Array<ExchangeRateWhereInput>>;
  NOT?: InputMaybe<Array<ExchangeRateWhereInput>>;
  OR?: InputMaybe<Array<ExchangeRateWhereInput>>;
  amount?: InputMaybe<StringFilter>;
  buyAmount?: InputMaybe<StringFilter>;
  currencyReserve?: InputMaybe<StringFilter>;
  date?: InputMaybe<StringFilter>;
  hour?: InputMaybe<IntFilter>;
  lpAmount?: InputMaybe<StringFilter>;
  sellAmount?: InputMaybe<StringFilter>;
  tokenId?: InputMaybe<IntFilter>;
  tokenReserve?: InputMaybe<StringFilter>;
};

export type ExchangeRateWhereUniqueInput = {
  date_hour_tokenId?: InputMaybe<ExchangeRateDateHourTokenIdCompoundUniqueInput>;
};

export type FloatFilter = {
  equals?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

/** The Food Model */
export type Food = {
  __typename?: 'Food';
  buildingId: Scalars['Int'];
  buildingName: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  harvests?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Float']>;
  realmId: Scalars['Float'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type IntWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type JsonFilter = {
  array_contains?: InputMaybe<Scalars['JSON']>;
  array_ends_with?: InputMaybe<Scalars['JSON']>;
  array_starts_with?: InputMaybe<Scalars['JSON']>;
  equals?: InputMaybe<Scalars['JSON']>;
  gt?: InputMaybe<Scalars['JSON']>;
  gte?: InputMaybe<Scalars['JSON']>;
  lt?: InputMaybe<Scalars['JSON']>;
  lte?: InputMaybe<Scalars['JSON']>;
  not?: InputMaybe<Scalars['JSON']>;
  path?: InputMaybe<Array<Scalars['String']>>;
  string_contains?: InputMaybe<Scalars['String']>;
  string_ends_with?: InputMaybe<Scalars['String']>;
  string_starts_with?: InputMaybe<Scalars['String']>;
};

export type JsonWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedJsonFilter>;
  _min?: InputMaybe<NestedJsonFilter>;
  array_contains?: InputMaybe<Scalars['JSON']>;
  array_ends_with?: InputMaybe<Scalars['JSON']>;
  array_starts_with?: InputMaybe<Scalars['JSON']>;
  equals?: InputMaybe<Scalars['JSON']>;
  gt?: InputMaybe<Scalars['JSON']>;
  gte?: InputMaybe<Scalars['JSON']>;
  lt?: InputMaybe<Scalars['JSON']>;
  lte?: InputMaybe<Scalars['JSON']>;
  not?: InputMaybe<Scalars['JSON']>;
  path?: InputMaybe<Array<Scalars['String']>>;
  string_contains?: InputMaybe<Scalars['String']>;
  string_ends_with?: InputMaybe<Scalars['String']>;
  string_starts_with?: InputMaybe<Scalars['String']>;
};

export type Labor = {
  __typename?: 'Labor';
  balance?: Maybe<Scalars['Timestamp']>;
  createdAt: Scalars['Timestamp'];
  id: Scalars['Int'];
  lastEventId?: Maybe<Scalars['String']>;
  lastUpdate?: Maybe<Scalars['Timestamp']>;
  qtyBuilt: Scalars['Int'];
  realmId: Scalars['Int'];
  resourceId: Scalars['Int'];
  updatedAt: Scalars['Timestamp'];
  vaultBalance?: Maybe<Scalars['Timestamp']>;
};

export type LaborRelationFilter = {
  is?: InputMaybe<LaborWhereInput>;
  isNot?: InputMaybe<LaborWhereInput>;
};

export type LaborWhereInput = {
  AND?: InputMaybe<Array<LaborWhereInput>>;
  NOT?: InputMaybe<Array<LaborWhereInput>>;
  OR?: InputMaybe<Array<LaborWhereInput>>;
  balance?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  lastEventId?: InputMaybe<StringNullableFilter>;
  lastUpdate?: InputMaybe<DateTimeNullableFilter>;
  qtyBuilt?: InputMaybe<IntFilter>;
  realmId?: InputMaybe<IntFilter>;
  resourceId?: InputMaybe<IntFilter>;
  resoure?: InputMaybe<ResourceRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  vaultBalance?: InputMaybe<DateTimeNullableFilter>;
};

/** Lore Entity */
export type LoreEntity = {
  __typename?: 'LoreEntity';
  id: Scalars['ID'];
  kind: Scalars['Float'];
  owner: Scalars['String'];
  ownerDisplayName?: Maybe<Scalars['String']>;
  revisions: Array<LoreEntityRevision>;
};

export type LoreEntityRelationFilter = {
  is?: InputMaybe<LoreEntityWhereInput>;
  isNot?: InputMaybe<LoreEntityWhereInput>;
};

/** Lore Entity Revision */
export type LoreEntityRevision = {
  __typename?: 'LoreEntityRevision';
  createdAt: Scalars['Timestamp'];
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  markdown?: Maybe<Scalars['String']>;
  pois: Array<LorePoisOnEntityRevisions>;
  props: Array<LorePropsOnEntityRevisions>;
  revisionNumber: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
};

export type LoreEntityRevisionListRelationFilter = {
  every?: InputMaybe<LoreEntityRevisionWhereInput>;
  none?: InputMaybe<LoreEntityRevisionWhereInput>;
  some?: InputMaybe<LoreEntityRevisionWhereInput>;
};

export type LoreEntityRevisionRelationFilter = {
  is?: InputMaybe<LoreEntityRevisionWhereInput>;
  isNot?: InputMaybe<LoreEntityRevisionWhereInput>;
};

export type LoreEntityRevisionWhereInput = {
  AND?: InputMaybe<Array<LoreEntityRevisionWhereInput>>;
  NOT?: InputMaybe<Array<LoreEntityRevisionWhereInput>>;
  OR?: InputMaybe<Array<LoreEntityRevisionWhereInput>>;
  arweaveId?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  entity?: InputMaybe<LoreEntityRelationFilter>;
  entityId?: InputMaybe<IntFilter>;
  eventIndexed?: InputMaybe<StringNullableFilter>;
  excerpt?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  markdown?: InputMaybe<StringNullableFilter>;
  media_url?: InputMaybe<StringNullableFilter>;
  pois?: InputMaybe<LorePoisOnEntityRevisionsListRelationFilter>;
  props?: InputMaybe<LorePropsOnEntityRevisionsListRelationFilter>;
  revisionNumber?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringNullableFilter>;
};

export type LoreEntityWhereInput = {
  AND?: InputMaybe<Array<LoreEntityWhereInput>>;
  NOT?: InputMaybe<Array<LoreEntityWhereInput>>;
  OR?: InputMaybe<Array<LoreEntityWhereInput>>;
  eventIndexed?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  kind?: InputMaybe<IntFilter>;
  owner?: InputMaybe<StringNullableFilter>;
  ownerDisplayName?: InputMaybe<StringNullableFilter>;
  revisions?: InputMaybe<LoreEntityRevisionListRelationFilter>;
};

export type LorePoiRelationFilter = {
  is?: InputMaybe<LorePoiWhereInput>;
  isNot?: InputMaybe<LorePoiWhereInput>;
};

export type LorePoiWhereInput = {
  AND?: InputMaybe<Array<LorePoiWhereInput>>;
  NOT?: InputMaybe<Array<LorePoiWhereInput>>;
  OR?: InputMaybe<Array<LorePoiWhereInput>>;
  assetType?: InputMaybe<StringNullableFilter>;
  entities?: InputMaybe<LorePoisOnEntityRevisionsListRelationFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
};

/** Lore POI */
export type LorePoi = {
  __typename?: 'LorePoi';
  assetType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Lore Entity Revision */
export type LorePoisOnEntityRevisions = {
  __typename?: 'LorePoisOnEntityRevisions';
  assetId?: Maybe<Scalars['String']>;
  entityRevisionId: Scalars['ID'];
  poiId: Scalars['ID'];
};

export type LorePoisOnEntityRevisionsListRelationFilter = {
  every?: InputMaybe<LorePoisOnEntityRevisionsWhereInput>;
  none?: InputMaybe<LorePoisOnEntityRevisionsWhereInput>;
  some?: InputMaybe<LorePoisOnEntityRevisionsWhereInput>;
};

export type LorePoisOnEntityRevisionsWhereInput = {
  AND?: InputMaybe<Array<LorePoisOnEntityRevisionsWhereInput>>;
  NOT?: InputMaybe<Array<LorePoisOnEntityRevisionsWhereInput>>;
  OR?: InputMaybe<Array<LorePoisOnEntityRevisionsWhereInput>>;
  assetId?: InputMaybe<StringNullableFilter>;
  entityRevision?: InputMaybe<LoreEntityRevisionRelationFilter>;
  entityRevisionId?: InputMaybe<IntFilter>;
  id?: InputMaybe<IntFilter>;
  poi?: InputMaybe<LorePoiRelationFilter>;
  poiId?: InputMaybe<IntFilter>;
};

export type LorePropRelationFilter = {
  is?: InputMaybe<LorePropWhereInput>;
  isNot?: InputMaybe<LorePropWhereInput>;
};

export type LorePropWhereInput = {
  AND?: InputMaybe<Array<LorePropWhereInput>>;
  NOT?: InputMaybe<Array<LorePropWhereInput>>;
  OR?: InputMaybe<Array<LorePropWhereInput>>;
  entities?: InputMaybe<LorePropsOnEntityRevisionsListRelationFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
};

/** Lore Entity Revision */
export type LorePropsOnEntityRevisions = {
  __typename?: 'LorePropsOnEntityRevisions';
  entityRevisionId: Scalars['ID'];
  propId: Scalars['ID'];
  value?: Maybe<Scalars['String']>;
};

export type LorePropsOnEntityRevisionsListRelationFilter = {
  every?: InputMaybe<LorePropsOnEntityRevisionsWhereInput>;
  none?: InputMaybe<LorePropsOnEntityRevisionsWhereInput>;
  some?: InputMaybe<LorePropsOnEntityRevisionsWhereInput>;
};

export type LorePropsOnEntityRevisionsWhereInput = {
  AND?: InputMaybe<Array<LorePropsOnEntityRevisionsWhereInput>>;
  NOT?: InputMaybe<Array<LorePropsOnEntityRevisionsWhereInput>>;
  OR?: InputMaybe<Array<LorePropsOnEntityRevisionsWhereInput>>;
  entityRevision?: InputMaybe<LoreEntityRevisionRelationFilter>;
  entityRevisionId?: InputMaybe<IntFilter>;
  id?: InputMaybe<IntFilter>;
  prop?: InputMaybe<LorePropRelationFilter>;
  propId?: InputMaybe<IntFilter>;
  value?: InputMaybe<StringNullableFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  reindexDesiege: Scalars['Boolean'];
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

export type NestedDateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['Timestamp']>;
  gt?: InputMaybe<Scalars['Timestamp']>;
  gte?: InputMaybe<Scalars['Timestamp']>;
  in?: InputMaybe<Array<Scalars['Timestamp']>>;
  lt?: InputMaybe<Scalars['Timestamp']>;
  lte?: InputMaybe<Scalars['Timestamp']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Timestamp']>>;
};

export type NestedEnumOrderTypeNullableFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type NestedEnumOrderTypeNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  _min?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type NestedEnumRealmTraitTypeFilter = {
  equals?: InputMaybe<RealmTraitType>;
  in?: InputMaybe<Array<RealmTraitType>>;
  not?: InputMaybe<NestedEnumRealmTraitTypeFilter>;
  notIn?: InputMaybe<Array<RealmTraitType>>;
};

export type NestedFloatFilter = {
  equals?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type NestedIntWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export type NestedJsonFilter = {
  array_contains?: InputMaybe<Scalars['JSON']>;
  array_ends_with?: InputMaybe<Scalars['JSON']>;
  array_starts_with?: InputMaybe<Scalars['JSON']>;
  equals?: InputMaybe<Scalars['JSON']>;
  gt?: InputMaybe<Scalars['JSON']>;
  gte?: InputMaybe<Scalars['JSON']>;
  lt?: InputMaybe<Scalars['JSON']>;
  lte?: InputMaybe<Scalars['JSON']>;
  not?: InputMaybe<Scalars['JSON']>;
  path?: InputMaybe<Array<Scalars['String']>>;
  string_contains?: InputMaybe<Scalars['String']>;
  string_ends_with?: InputMaybe<Scalars['String']>;
  string_starts_with?: InputMaybe<Scalars['String']>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type NestedStringWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

/** Order By Direction */
export enum OrderByDirectionInput {
  Asc = 'asc',
  Desc = 'desc',
}

export enum OrderType {
  Anger = 'Anger',
  Brilliance = 'Brilliance',
  Detection = 'Detection',
  Enlightenment = 'Enlightenment',
  Fury = 'Fury',
  Giants = 'Giants',
  Perfection = 'Perfection',
  Power = 'Power',
  Protection = 'Protection',
  Rage = 'Rage',
  Reflection = 'Reflection',
  Skill = 'Skill',
  Titans = 'Titans',
  Vitriol = 'Vitriol',
  TheFox = 'the_Fox',
  TheTwins = 'the_Twins',
}

export type Query = {
  __typename?: 'Query';
  aggregateRealmHistory: AggregateRealmHistory;
  armies: Array<Army>;
  bastion: Bastion;
  bastionLocations: Array<BastionLocation>;
  bastions: Array<Bastion>;
  battalionCosts: Array<BattalionCost>;
  battalionStats: Array<BattalionStats>;
  economyExchangeLordsPurchasedTotal: Scalars['String'];
  economyExchangeResourcePurchasedTotals: Array<ResourceAmount>;
  economyLpResourceBurnedTotals: Array<ResourceAmount>;
  economyLpResourceMintedTotals: Array<ResourceAmount>;
  economyResourceBurnedTotals: Array<ResourceAmount>;
  economyResourceBurnedTotalsByBattalionAll: Array<ResourceAmount>;
  economyResourceBurnedTotalsByBattalionId: Array<ResourceAmountByBattalion>;
  economyResourceBurnedTotalsByBuildingAll: Array<ResourceAmount>;
  economyResourceBurnedTotalsByBuildingId: Array<ResourceAmountByBuilding>;
  economyResourceBurnedTotalsByLaborAll: Array<ResourceAmount>;
  economyResourceMintedTotals: Array<ResourceAmount>;
  economySettledRealmsTotal: Scalars['Int'];
  exchangeRates: Array<ExchangeRate>;
  getBastionHistory: Array<BastionHistory>;
  getBuildingCostById: BuildingCost;
  getBuildingCosts: Array<BuildingCost>;
  getBuildingsByRealmId: Array<Building>;
  getDesiege: Desiege;
  getDesiegeCurrent: Desiege;
  getDesiegeGames: Array<Desiege>;
  getExchangeRates: Array<ExchangeRate24Hr>;
  getFoodByRealmId: Array<Food>;
  getLoreEntities: Array<LoreEntity>;
  getLoreEntity: LoreEntity;
  getLorePois: Array<LorePoi>;
  getRealm: Realm;
  getRealmCombatResult: CombatResult;
  getRealmHistory: Array<RealmHistory>;
  getRealms: Array<Realm>;
  getResource: Resource;
  getResourceLaborAndToolCosts: Array<ResourceLaborAndToolCost>;
  getResources: Array<Resource>;
  getResourcesByAddress: Array<Resource>;
  getTroopStats: Array<TroopStats>;
  groupByRealmHistory: Array<RealmHistoryGroupBy>;
  realm: Realm;
  realmCombatHistory: CombatResult;
  realmHistory: Array<RealmHistory>;
  realms: Array<Realm>;
  realmsCount: Scalars['Int'];
  tokenBalances: Array<TokenBalance>;
  travels: Array<Travel>;
  troopStats: Array<TroopStats>;
  walletBalances: Array<WalletBalance>;
};

export type QueryAggregateRealmHistoryArgs = {
  cursor?: InputMaybe<RealmHistoryWhereUniqueInput>;
  orderBy?: InputMaybe<Array<RealmHistoryOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RealmHistoryWhereInput>;
};

export type QueryArmiesArgs = {
  orderBy?: InputMaybe<ArmyOrderByWithRelationInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
  where?: InputMaybe<ArmyWhereInput>;
};

export type QueryBastionArgs = {
  id: Scalars['Float'];
};

export type QueryBastionLocationsArgs = {
  cursor?: InputMaybe<BastionLocationWhereUniqueInput>;
  distinct?: InputMaybe<Array<BastionLocationScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<BastionLocationOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BastionLocationWhereInput>;
};

export type QueryExchangeRatesArgs = {
  cursor?: InputMaybe<ExchangeRateWhereUniqueInput>;
  distinct?: InputMaybe<Array<ExchangeRateScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<ExchangeRateOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExchangeRateWhereInput>;
};

export type QueryGetBastionHistoryArgs = {
  filter?: InputMaybe<BastionHistoryWhereInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryGetBuildingsByRealmIdArgs = {
  id: Scalars['Float'];
};

export type QueryGetDesiegeArgs = {
  id: Scalars['Float'];
};

export type QueryGetFoodByRealmIdArgs = {
  id: Scalars['Float'];
};

export type QueryGetLoreEntitiesArgs = {
  filter?: InputMaybe<LoreEntityWhereInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryGetLoreEntityArgs = {
  entityId: Scalars['Float'];
};

export type QueryGetLorePoisArgs = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryGetRealmArgs = {
  realmId: Scalars['Float'];
};

export type QueryGetRealmCombatResultArgs = {
  defendRealmId: Scalars['Float'];
  transactionHash: Scalars['String'];
};

export type QueryGetRealmHistoryArgs = {
  filter?: InputMaybe<RealmHistoryWhereInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryGetRealmsArgs = {
  filter?: InputMaybe<RealmWhereInput>;
  orderBy?: InputMaybe<RealmOrderByInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryGetResourceArgs = {
  id: Scalars['Float'];
};

export type QueryGetResourcesByAddressArgs = {
  address: Scalars['String'];
};

export type QueryGroupByRealmHistoryArgs = {
  by: Array<RealmHistoryScalarFieldEnum>;
  having?: InputMaybe<RealmHistoryScalarWhereWithAggregatesInput>;
  orderBy?: InputMaybe<Array<RealmHistoryOrderByWithAggregationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RealmHistoryWhereInput>;
};

export type QueryRealmArgs = {
  id: Scalars['Float'];
};

export type QueryRealmCombatHistoryArgs = {
  defendRealmId: Scalars['Float'];
  transactionHash: Scalars['String'];
};

export type QueryRealmHistoryArgs = {
  filter?: InputMaybe<RealmHistoryWhereInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryRealmsArgs = {
  filter?: InputMaybe<RealmWhereInput>;
  orderBy?: InputMaybe<RealmOrderByWithRelationInput>;
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type QueryRealmsCountArgs = {
  filter?: InputMaybe<RealmWhereInput>;
};

export type QueryTokenBalancesArgs = {
  address: Scalars['String'];
};

export type QueryTravelsArgs = {
  cursor?: InputMaybe<TravelWhereUniqueInput>;
  distinct?: InputMaybe<Array<TravelScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<TravelOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TravelWhereInput>;
};

export type QueryWalletBalancesArgs = {
  cursor?: InputMaybe<WalletBalanceWhereUniqueInput>;
  distinct?: InputMaybe<Array<WalletBalanceScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<WalletBalanceOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WalletBalanceWhereInput>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive',
}

/** The Realm Model */
export type Realm = {
  __typename?: 'Realm';
  bridgedOwner?: Maybe<Scalars['String']>;
  buildings?: Maybe<Array<Building>>;
  defendTroopIds: Array<Scalars['String']>;
  foods: Array<Food>;
  imageUrl?: Maybe<Scalars['String']>;
  lastAttacked?: Maybe<Scalars['Timestamp']>;
  lastClaimTime?: Maybe<Scalars['Timestamp']>;
  lastTick?: Maybe<Scalars['Timestamp']>;
  lastVaultTime?: Maybe<Scalars['Timestamp']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  orderType: Scalars['String'];
  ownArmies: Array<Army>;
  owner?: Maybe<Scalars['String']>;
  ownerL2?: Maybe<Scalars['String']>;
  rarityRank: Scalars['Int'];
  rarityScore: Scalars['Float'];
  realmId: Scalars['Int'];
  relic?: Maybe<Array<Relic>>;
  relicsOwned?: Maybe<Array<Relic>>;
  resources?: Maybe<Array<Resource>>;
  settledOwner?: Maybe<Scalars['String']>;
  squad?: Maybe<Array<Troop>>;
  traits?: Maybe<Array<RealmTrait>>;
  troops?: Maybe<Array<Troop>>;
  wallet?: Maybe<Wallet>;
  wonder?: Maybe<Scalars['String']>;
};

/** The Realm History Model */
export type RealmHistory = {
  __typename?: 'RealmHistory';
  data?: Maybe<Scalars['JSON']>;
  eventId?: Maybe<Scalars['String']>;
  eventType?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Int'];
  realmName?: Maybe<Scalars['String']>;
  realmOrder?: Maybe<Scalars['String']>;
  realmOwner?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Timestamp']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type RealmHistoryAvgAggregate = {
  __typename?: 'RealmHistoryAvgAggregate';
  id?: Maybe<Scalars['Float']>;
  realmId?: Maybe<Scalars['Float']>;
};

export type RealmHistoryAvgOrderByAggregateInput = {
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
};

export type RealmHistoryCountAggregate = {
  __typename?: 'RealmHistoryCountAggregate';
  _all: Scalars['Int'];
  data: Scalars['Int'];
  eventId: Scalars['Int'];
  eventType: Scalars['Int'];
  id: Scalars['Int'];
  realmId: Scalars['Int'];
  realmName: Scalars['Int'];
  realmOrder: Scalars['Int'];
  realmOwner: Scalars['Int'];
  timestamp: Scalars['Int'];
  transactionHash: Scalars['Int'];
};

export type RealmHistoryCountOrderByAggregateInput = {
  data?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  eventType?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  realmName?: InputMaybe<SortOrder>;
  realmOrder?: InputMaybe<SortOrder>;
  realmOwner?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionHash?: InputMaybe<SortOrder>;
};

export type RealmHistoryEventIdEventTypeCompoundUniqueInput = {
  eventId: Scalars['String'];
  eventType: Scalars['String'];
};

export type RealmHistoryGroupBy = {
  __typename?: 'RealmHistoryGroupBy';
  _avg?: Maybe<RealmHistoryAvgAggregate>;
  _count?: Maybe<RealmHistoryCountAggregate>;
  _max?: Maybe<RealmHistoryMaxAggregate>;
  _min?: Maybe<RealmHistoryMinAggregate>;
  _sum?: Maybe<RealmHistorySumAggregate>;
  data: Scalars['JSON'];
  eventId: Scalars['String'];
  eventType: Scalars['String'];
  id: Scalars['Int'];
  realmId: Scalars['Int'];
  realmName: Scalars['String'];
  realmOrder?: Maybe<OrderType>;
  realmOwner: Scalars['String'];
  timestamp: Scalars['Timestamp'];
  transactionHash: Scalars['String'];
};

export type RealmHistoryMaxAggregate = {
  __typename?: 'RealmHistoryMaxAggregate';
  eventId?: Maybe<Scalars['String']>;
  eventType?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  realmId?: Maybe<Scalars['Int']>;
  realmName?: Maybe<Scalars['String']>;
  realmOrder?: Maybe<OrderType>;
  realmOwner?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Timestamp']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type RealmHistoryMaxOrderByAggregateInput = {
  eventId?: InputMaybe<SortOrder>;
  eventType?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  realmName?: InputMaybe<SortOrder>;
  realmOrder?: InputMaybe<SortOrder>;
  realmOwner?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionHash?: InputMaybe<SortOrder>;
};

export type RealmHistoryMinAggregate = {
  __typename?: 'RealmHistoryMinAggregate';
  eventId?: Maybe<Scalars['String']>;
  eventType?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  realmId?: Maybe<Scalars['Int']>;
  realmName?: Maybe<Scalars['String']>;
  realmOrder?: Maybe<OrderType>;
  realmOwner?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Timestamp']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type RealmHistoryMinOrderByAggregateInput = {
  eventId?: InputMaybe<SortOrder>;
  eventType?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  realmName?: InputMaybe<SortOrder>;
  realmOrder?: InputMaybe<SortOrder>;
  realmOwner?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionHash?: InputMaybe<SortOrder>;
};

export type RealmHistoryOrderByWithAggregationInput = {
  _avg?: InputMaybe<RealmHistoryAvgOrderByAggregateInput>;
  _count?: InputMaybe<RealmHistoryCountOrderByAggregateInput>;
  _max?: InputMaybe<RealmHistoryMaxOrderByAggregateInput>;
  _min?: InputMaybe<RealmHistoryMinOrderByAggregateInput>;
  _sum?: InputMaybe<RealmHistorySumOrderByAggregateInput>;
  data?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  eventType?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  realmName?: InputMaybe<SortOrder>;
  realmOrder?: InputMaybe<SortOrder>;
  realmOwner?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionHash?: InputMaybe<SortOrder>;
};

export type RealmHistoryOrderByWithRelationInput = {
  BastionHistory?: InputMaybe<BastionHistoryOrderByWithRelationInput>;
  data?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  eventType?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  realmName?: InputMaybe<SortOrder>;
  realmOrder?: InputMaybe<SortOrder>;
  realmOwner?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionHash?: InputMaybe<SortOrder>;
};

export type RealmHistoryRelationFilter = {
  is?: InputMaybe<RealmHistoryWhereInput>;
  isNot?: InputMaybe<RealmHistoryWhereInput>;
};

export enum RealmHistoryScalarFieldEnum {
  Data = 'data',
  EventId = 'eventId',
  EventType = 'eventType',
  Id = 'id',
  RealmId = 'realmId',
  RealmName = 'realmName',
  RealmOrder = 'realmOrder',
  RealmOwner = 'realmOwner',
  Timestamp = 'timestamp',
  TransactionHash = 'transactionHash',
}

export type RealmHistoryScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<RealmHistoryScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<RealmHistoryScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<RealmHistoryScalarWhereWithAggregatesInput>>;
  data?: InputMaybe<JsonWithAggregatesFilter>;
  eventId?: InputMaybe<StringWithAggregatesFilter>;
  eventType?: InputMaybe<StringWithAggregatesFilter>;
  id?: InputMaybe<IntWithAggregatesFilter>;
  realmId?: InputMaybe<IntWithAggregatesFilter>;
  realmName?: InputMaybe<StringWithAggregatesFilter>;
  realmOrder?: InputMaybe<EnumOrderTypeNullableWithAggregatesFilter>;
  realmOwner?: InputMaybe<StringWithAggregatesFilter>;
  timestamp?: InputMaybe<DateTimeWithAggregatesFilter>;
  transactionHash?: InputMaybe<StringWithAggregatesFilter>;
};

export type RealmHistorySumAggregate = {
  __typename?: 'RealmHistorySumAggregate';
  id?: Maybe<Scalars['Int']>;
  realmId?: Maybe<Scalars['Int']>;
};

export type RealmHistorySumOrderByAggregateInput = {
  id?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
};

export type RealmHistoryWhereInput = {
  AND?: InputMaybe<Array<RealmHistoryWhereInput>>;
  BastionHistory?: InputMaybe<BastionHistoryRelationFilter>;
  NOT?: InputMaybe<Array<RealmHistoryWhereInput>>;
  OR?: InputMaybe<Array<RealmHistoryWhereInput>>;
  data?: InputMaybe<JsonFilter>;
  eventId?: InputMaybe<StringFilter>;
  eventType?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  realmId?: InputMaybe<IntFilter>;
  realmName?: InputMaybe<StringFilter>;
  realmOrder?: InputMaybe<EnumOrderTypeNullableFilter>;
  realmOwner?: InputMaybe<StringFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
  transactionHash?: InputMaybe<StringFilter>;
};

export type RealmHistoryWhereUniqueInput = {
  eventId_eventType?: InputMaybe<RealmHistoryEventIdEventTypeCompoundUniqueInput>;
  id?: InputMaybe<Scalars['Int']>;
};

export type RealmListRelationFilter = {
  every?: InputMaybe<RealmWhereInput>;
  none?: InputMaybe<RealmWhereInput>;
  some?: InputMaybe<RealmWhereInput>;
};

export type RealmOrderByInput = {
  rarityRank?: InputMaybe<OrderByDirectionInput>;
  rarityScore?: InputMaybe<OrderByDirectionInput>;
  realmId?: InputMaybe<OrderByDirectionInput>;
};

export type RealmOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type RealmOrderByWithRelationInput = {
  bridgedOwner?: InputMaybe<SortOrder>;
  buildings?: InputMaybe<BuildingOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  imageUrl?: InputMaybe<SortOrder>;
  lastAttacked?: InputMaybe<SortOrder>;
  lastClaimTime?: InputMaybe<SortOrder>;
  lastTick?: InputMaybe<SortOrder>;
  lastVaultTime?: InputMaybe<SortOrder>;
  latitude?: InputMaybe<SortOrder>;
  longitude?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  orderType?: InputMaybe<SortOrder>;
  ownArmies?: InputMaybe<ArmyOrderByRelationAggregateInput>;
  owner?: InputMaybe<SortOrder>;
  ownerL2?: InputMaybe<SortOrder>;
  rarityRank?: InputMaybe<SortOrder>;
  rarityScore?: InputMaybe<SortOrder>;
  realmId?: InputMaybe<SortOrder>;
  relic?: InputMaybe<RelicOrderByWithRelationInput>;
  relicsOwned?: InputMaybe<RelicOrderByRelationAggregateInput>;
  resources?: InputMaybe<ResourceOrderByRelationAggregateInput>;
  settledOwner?: InputMaybe<SortOrder>;
  squad?: InputMaybe<TroopOrderByRelationAggregateInput>;
  traits?: InputMaybe<RealmTraitOrderByRelationAggregateInput>;
  wallet?: InputMaybe<WalletOrderByWithRelationInput>;
  walletL2?: InputMaybe<WalletOrderByWithRelationInput>;
  walletSettled?: InputMaybe<WalletOrderByWithRelationInput>;
  wonder?: InputMaybe<SortOrder>;
};

export type RealmRelationFilter = {
  is?: InputMaybe<RealmWhereInput>;
  isNot?: InputMaybe<RealmWhereInput>;
};

/** Realm Trait Model */
export type RealmTrait = {
  __typename?: 'RealmTrait';
  id: Scalars['ID'];
  qty: Scalars['Float'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Float'];
  type: Scalars['String'];
};

export type RealmTraitListRelationFilter = {
  every?: InputMaybe<RealmTraitWhereInput>;
  none?: InputMaybe<RealmTraitWhereInput>;
  some?: InputMaybe<RealmTraitWhereInput>;
};

export type RealmTraitOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum RealmTraitType {
  City = 'City',
  Harbor = 'Harbor',
  Region = 'Region',
  River = 'River',
}

export type RealmTraitWhereInput = {
  AND?: InputMaybe<Array<RealmTraitWhereInput>>;
  NOT?: InputMaybe<Array<RealmTraitWhereInput>>;
  OR?: InputMaybe<Array<RealmTraitWhereInput>>;
  qty?: InputMaybe<IntFilter>;
  realm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntFilter>;
  type?: InputMaybe<EnumRealmTraitTypeFilter>;
};

export type RealmWhereInput = {
  AND?: InputMaybe<Array<RealmWhereInput>>;
  NOT?: InputMaybe<Array<RealmWhereInput>>;
  OR?: InputMaybe<Array<RealmWhereInput>>;
  bridgedOwner?: InputMaybe<StringNullableFilter>;
  buildings?: InputMaybe<BuildingListRelationFilter>;
  id?: InputMaybe<IntFilter>;
  imageUrl?: InputMaybe<StringFilter>;
  lastAttacked?: InputMaybe<DateTimeNullableFilter>;
  lastClaimTime?: InputMaybe<DateTimeNullableFilter>;
  lastTick?: InputMaybe<DateTimeNullableFilter>;
  lastVaultTime?: InputMaybe<DateTimeNullableFilter>;
  latitude?: InputMaybe<FloatFilter>;
  longitude?: InputMaybe<FloatFilter>;
  name?: InputMaybe<StringNullableFilter>;
  orderType?: InputMaybe<EnumOrderTypeNullableFilter>;
  ownArmies?: InputMaybe<ArmyListRelationFilter>;
  owner?: InputMaybe<StringNullableFilter>;
  ownerL2?: InputMaybe<StringNullableFilter>;
  rarityRank?: InputMaybe<IntFilter>;
  rarityScore?: InputMaybe<FloatFilter>;
  realmId?: InputMaybe<IntFilter>;
  relic?: InputMaybe<RelicRelationFilter>;
  relicsOwned?: InputMaybe<RelicListRelationFilter>;
  resources?: InputMaybe<ResourceListRelationFilter>;
  settledOwner?: InputMaybe<StringNullableFilter>;
  squad?: InputMaybe<TroopListRelationFilter>;
  traits?: InputMaybe<RealmTraitListRelationFilter>;
  wallet?: InputMaybe<WalletRelationFilter>;
  walletL2?: InputMaybe<WalletRelationFilter>;
  walletSettled?: InputMaybe<WalletRelationFilter>;
  wonder?: InputMaybe<StringNullableFilter>;
};

/** The Relic Model */
export type Relic = {
  __typename?: 'Relic';
  heldByRealm?: Maybe<Scalars['Float']>;
  isAnnexed: Scalars['Boolean'];
  originRealm: Realm;
  realmHolder: Realm;
  realmId?: Maybe<Scalars['Float']>;
};

export type RelicListRelationFilter = {
  every?: InputMaybe<RelicWhereInput>;
  none?: InputMaybe<RelicWhereInput>;
  some?: InputMaybe<RelicWhereInput>;
};

export type RelicOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type RelicOrderByWithRelationInput = {
  heldByRealm?: InputMaybe<SortOrder>;
  isAnnexed?: InputMaybe<SortOrder>;
  originRealm?: InputMaybe<RealmOrderByWithRelationInput>;
  realmHolder?: InputMaybe<RealmOrderByWithRelationInput>;
  realmId?: InputMaybe<SortOrder>;
};

export type RelicRelationFilter = {
  is?: InputMaybe<RelicWhereInput>;
  isNot?: InputMaybe<RelicWhereInput>;
};

export type RelicWhereInput = {
  AND?: InputMaybe<Array<RelicWhereInput>>;
  NOT?: InputMaybe<Array<RelicWhereInput>>;
  OR?: InputMaybe<Array<RelicWhereInput>>;
  heldByRealm?: InputMaybe<IntFilter>;
  isAnnexed?: InputMaybe<BoolFilter>;
  originRealm?: InputMaybe<RealmRelationFilter>;
  realmHolder?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntFilter>;
};

/** The Resource Model */
export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID'];
  labor?: Maybe<Labor>;
  level: Scalars['Int'];
  realm: Realm;
  realmId?: Maybe<Scalars['Float']>;
  resourceId: Scalars['Int'];
  resourceName: Scalars['String'];
  upgrades: Array<Scalars['String']>;
};

/** The Token Amount Model */
export type ResourceAmount = {
  __typename?: 'ResourceAmount';
  amount: Scalars['String'];
  resourceId: Scalars['Int'];
  resourceName: Scalars['String'];
};

/** The Token Amount Model */
export type ResourceAmountByBattalion = {
  __typename?: 'ResourceAmountByBattalion';
  amount: Scalars['String'];
  battalionId: Scalars['Int'];
  battalionName: Scalars['String'];
  resourceId: Scalars['Int'];
  resourceName: Scalars['String'];
};

/** The Token Amount Model */
export type ResourceAmountByBuilding = {
  __typename?: 'ResourceAmountByBuilding';
  amount: Scalars['String'];
  buildingId: Scalars['Int'];
  buildingName: Scalars['String'];
  resourceId: Scalars['Int'];
  resourceName: Scalars['String'];
};

/** Resource Labor and Tool Cost Model */
export type ResourceLaborAndToolCost = {
  __typename?: 'ResourceLaborAndToolCost';
  amount: Scalars['Float'];
  costs: Scalars['JSON'];
  resourceId: Scalars['Int'];
  resourceName: Scalars['String'];
  tier: Scalars['String'];
};

export type ResourceListRelationFilter = {
  every?: InputMaybe<ResourceWhereInput>;
  none?: InputMaybe<ResourceWhereInput>;
  some?: InputMaybe<ResourceWhereInput>;
};

export type ResourceOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ResourceRelationFilter = {
  is?: InputMaybe<ResourceWhereInput>;
  isNot?: InputMaybe<ResourceWhereInput>;
};

export type ResourceWhereInput = {
  AND?: InputMaybe<Array<ResourceWhereInput>>;
  NOT?: InputMaybe<Array<ResourceWhereInput>>;
  OR?: InputMaybe<Array<ResourceWhereInput>>;
  id?: InputMaybe<IntFilter>;
  labor?: InputMaybe<LaborRelationFilter>;
  level?: InputMaybe<IntFilter>;
  realm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntNullableFilter>;
  resourceId?: InputMaybe<IntFilter>;
  upgrades?: InputMaybe<StringNullableListFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type StringNullableListFilter = {
  equals?: InputMaybe<Array<Scalars['String']>>;
  has?: InputMaybe<Scalars['String']>;
  hasEvery?: InputMaybe<Array<Scalars['String']>>;
  hasSome?: InputMaybe<Array<Scalars['String']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
};

export type StringWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

/** TokenBalance */
export type TokenBalance = {
  __typename?: 'TokenBalance';
  address: Scalars['String'];
  amount: Scalars['String'];
  tokenId: Scalars['Int'];
};

export type Travel = {
  __typename?: 'Travel';
  contractId: Scalars['Int'];
  destinationArrivalTime: Scalars['Timestamp'];
  destinationContractId: Scalars['Int'];
  destinationNestedId: Scalars['Int'];
  destinationRealm?: Maybe<Realm>;
  destinationTokenId: Scalars['Int'];
  eventId: Scalars['String'];
  locationContractId: Scalars['Int'];
  locationNestedId: Scalars['Int'];
  locationRealm?: Maybe<Realm>;
  locationTokenId: Scalars['Int'];
  nestedId: Scalars['Int'];
  originRealm?: Maybe<Realm>;
  timestamp: Scalars['Timestamp'];
  tokenId: Scalars['Int'];
};

export type TravelOrderByWithRelationInput = {
  contractId?: InputMaybe<SortOrder>;
  destinationArrivalTime?: InputMaybe<SortOrder>;
  destinationContractId?: InputMaybe<SortOrder>;
  destinationNestedId?: InputMaybe<SortOrder>;
  destinationTokenId?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  locationContractId?: InputMaybe<SortOrder>;
  locationNestedId?: InputMaybe<SortOrder>;
  locationTokenId?: InputMaybe<SortOrder>;
  nestedId?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  tokenId?: InputMaybe<SortOrder>;
};

export enum TravelScalarFieldEnum {
  ContractId = 'contractId',
  DestinationArrivalTime = 'destinationArrivalTime',
  DestinationContractId = 'destinationContractId',
  DestinationNestedId = 'destinationNestedId',
  DestinationTokenId = 'destinationTokenId',
  EventId = 'eventId',
  LocationContractId = 'locationContractId',
  LocationNestedId = 'locationNestedId',
  LocationTokenId = 'locationTokenId',
  NestedId = 'nestedId',
  Timestamp = 'timestamp',
  TokenId = 'tokenId',
}

export type TravelWhereInput = {
  AND?: InputMaybe<Array<TravelWhereInput>>;
  NOT?: InputMaybe<Array<TravelWhereInput>>;
  OR?: InputMaybe<Array<TravelWhereInput>>;
  contractId?: InputMaybe<IntFilter>;
  destinationArrivalTime?: InputMaybe<DateTimeFilter>;
  destinationContractId?: InputMaybe<IntFilter>;
  destinationNestedId?: InputMaybe<IntFilter>;
  destinationTokenId?: InputMaybe<IntFilter>;
  eventId?: InputMaybe<StringFilter>;
  locationContractId?: InputMaybe<IntFilter>;
  locationNestedId?: InputMaybe<IntFilter>;
  locationTokenId?: InputMaybe<IntFilter>;
  nestedId?: InputMaybe<IntFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
  tokenId?: InputMaybe<IntFilter>;
};

export type TravelWhereUniqueInput = {
  eventId?: InputMaybe<Scalars['String']>;
};

/** Troop */
export type Troop = {
  __typename?: 'Troop';
  agility: Scalars['Int'];
  armor: Scalars['Int'];
  attack: Scalars['Int'];
  building: Scalars['Int'];
  index: Scalars['Int'];
  realmId: Scalars['Int'];
  squadSlot: Scalars['Int'];
  tier: Scalars['Int'];
  troopCost?: Maybe<TroopCost>;
  troopId: Scalars['Int'];
  troopName: Scalars['String'];
  type: Scalars['Int'];
  vitality: Scalars['Int'];
  wisdom: Scalars['Int'];
};

/** Troop Cost Model */
export type TroopCost = {
  __typename?: 'TroopCost';
  amount: Scalars['Float'];
  resources: Scalars['JSON'];
  troopId: Scalars['Int'];
  troopName: Scalars['String'];
};

export type TroopListRelationFilter = {
  every?: InputMaybe<TroopWhereInput>;
  none?: InputMaybe<TroopWhereInput>;
  some?: InputMaybe<TroopWhereInput>;
};

export type TroopOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

/** TroopStats */
export type TroopStats = {
  __typename?: 'TroopStats';
  agility: Scalars['Int'];
  armor: Scalars['Int'];
  attack: Scalars['Int'];
  building: Scalars['Int'];
  tier: Scalars['Int'];
  troopCost?: Maybe<TroopCost>;
  troopId: Scalars['Int'];
  troopName: Scalars['String'];
  type: Scalars['Int'];
  vitality: Scalars['Int'];
  wisdom: Scalars['Int'];
};

export type TroopWhereInput = {
  AND?: InputMaybe<Array<TroopWhereInput>>;
  NOT?: InputMaybe<Array<TroopWhereInput>>;
  OR?: InputMaybe<Array<TroopWhereInput>>;
  Realm?: InputMaybe<RealmRelationFilter>;
  agility?: InputMaybe<IntFilter>;
  armor?: InputMaybe<IntFilter>;
  attack?: InputMaybe<IntFilter>;
  building?: InputMaybe<IntFilter>;
  index?: InputMaybe<IntFilter>;
  realmId?: InputMaybe<IntFilter>;
  squadSlot?: InputMaybe<IntFilter>;
  tier?: InputMaybe<IntFilter>;
  timestamp?: InputMaybe<DateTimeNullableFilter>;
  troopId?: InputMaybe<IntFilter>;
  type?: InputMaybe<IntFilter>;
  vitality?: InputMaybe<IntFilter>;
  wisdom?: InputMaybe<IntFilter>;
};

/** The Wallet Model */
export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  realmsBridgedHeld: Scalars['Int'];
  realmsL1Held: Scalars['Int'];
  realmsL2Held: Scalars['Int'];
  realmsSettledHeld: Scalars['Int'];
};

export type WalletBalance = {
  __typename?: 'WalletBalance';
  address: Scalars['String'];
  amount: Scalars['String'];
  id: Scalars['Int'];
  lastEventId?: Maybe<Scalars['String']>;
  tokenId: Scalars['Int'];
};

export type WalletBalanceAddressTokenIdCompoundUniqueInput = {
  address: Scalars['String'];
  tokenId: Scalars['Int'];
};

export type WalletBalanceOrderByWithRelationInput = {
  address?: InputMaybe<SortOrder>;
  amount?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastEventId?: InputMaybe<SortOrder>;
  tokenId?: InputMaybe<SortOrder>;
};

export enum WalletBalanceScalarFieldEnum {
  Address = 'address',
  Amount = 'amount',
  Id = 'id',
  LastEventId = 'lastEventId',
  TokenId = 'tokenId',
}

export type WalletBalanceWhereInput = {
  AND?: InputMaybe<Array<WalletBalanceWhereInput>>;
  NOT?: InputMaybe<Array<WalletBalanceWhereInput>>;
  OR?: InputMaybe<Array<WalletBalanceWhereInput>>;
  address?: InputMaybe<StringFilter>;
  amount?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  lastEventId?: InputMaybe<StringNullableFilter>;
  tokenId?: InputMaybe<IntFilter>;
};

export type WalletBalanceWhereUniqueInput = {
  address_tokenId?: InputMaybe<WalletBalanceAddressTokenIdCompoundUniqueInput>;
  id?: InputMaybe<Scalars['Int']>;
};

export type WalletOrderByWithRelationInput = {
  address?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  realmsL1?: InputMaybe<RealmOrderByRelationAggregateInput>;
  realmsL2?: InputMaybe<RealmOrderByRelationAggregateInput>;
  realmsSettled?: InputMaybe<RealmOrderByRelationAggregateInput>;
};

export type WalletRelationFilter = {
  is?: InputMaybe<WalletWhereInput>;
  isNot?: InputMaybe<WalletWhereInput>;
};

export type WalletWhereInput = {
  AND?: InputMaybe<Array<WalletWhereInput>>;
  NOT?: InputMaybe<Array<WalletWhereInput>>;
  OR?: InputMaybe<Array<WalletWhereInput>>;
  address?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  realmsL1?: InputMaybe<RealmListRelationFilter>;
  realmsL2?: InputMaybe<RealmListRelationFilter>;
  realmsSettled?: InputMaybe<RealmListRelationFilter>;
};

export type GetBastionQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetBastionQuery = {
  __typename?: 'Query';
  bastion: {
    __typename?: 'Bastion';
    bastionId: number;
    latitude: number;
    longitude: number;
    locations: Array<{
      __typename?: 'BastionLocation';
      locationId: number;
      bastionId: number;
      defendingOrderId: number;
      takenBlock: number;
      armies: Array<{
        __typename?: 'Army';
        armyId: number;
        realmId: number;
        xp: number;
        destinationRealmId: number;
        destinationArrivalTime?: any | null;
        armyPacked: number;
        lastAttacked?: any | null;
        level: number;
        callSign: number;
        lightCavalryQty: number;
        lightCavalryHealth: number;
        heavyCavalryQty: number;
        heavyCavalryHealth: number;
        archerQty: number;
        archerHealth: number;
        longbowQty: number;
        longbowHealth: number;
        mageQty: number;
        mageHealth: number;
        arcanistQty: number;
        arcanistHealth: number;
        lightInfantryQty: number;
        lightInfantryHealth: number;
        heavyInfantryQty: number;
        heavyInfantryHealth: number;
        orderId: number;
        bastionArrivalBlock: number;
        bastionCurrentLocation: number;
        bastionId?: string | null;
      }>;
    }>;
  };
};

export type GetBastionHistoryQueryVariables = Exact<{
  filter?: InputMaybe<BastionHistoryWhereInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetBastionHistoryQuery = {
  __typename?: 'Query';
  getBastionHistory: Array<{
    __typename?: 'BastionHistory';
    bastionId: number;
    realmHistoryEventId: string;
    realmHistoryEventType: string;
    realmHistory: {
      __typename?: 'RealmHistory';
      id: number;
      eventId?: string | null;
      eventType?: string | null;
      realmId: number;
      realmOwner?: string | null;
      data?: any | null;
      timestamp?: any | null;
      transactionHash?: string | null;
    };
  }>;
};

export type DesiegeFragmentFragment = {
  __typename?: 'Desiege';
  id: string;
  gameId: number;
  winner: number;
  attackedTokens: number;
  defendedTokens: number;
  eventIndexed: number;
  initialHealth: number;
  startedOn: any;
};

export type GetDesiegeQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetDesiegeQuery = {
  __typename?: 'Query';
  getDesiege: {
    __typename?: 'Desiege';
    id: string;
    gameId: number;
    winner: number;
    attackedTokens: number;
    defendedTokens: number;
    eventIndexed: number;
    initialHealth: number;
    startedOn: any;
  };
};

export type GetExchangeRatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetExchangeRatesQuery = {
  __typename?: 'Query';
  getExchangeRates: Array<{
    __typename?: 'ExchangeRate24Hr';
    tokenId: number;
    tokenName: string;
    amount: string;
    buyAmount: string;
    sellAmount: string;
    currencyReserve: string;
    tokenReserve: string;
    percentChange24Hr?: number | null;
  }>;
};

export type GetHistoricPriceDataQueryVariables = Exact<{
  dateFrom: Scalars['String'];
  dateTo: Scalars['String'];
}>;

export type GetHistoricPriceDataQuery = {
  __typename?: 'Query';
  exchangeRates: Array<{
    __typename?: 'ExchangeRate';
    date: string;
    hour: number;
    tokenId: number;
    amount: string;
  }>;
};

export type GetLoreEntitiesQueryVariables = Exact<{
  filter?: InputMaybe<LoreEntityWhereInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetLoreEntitiesQuery = {
  __typename?: 'Query';
  getLoreEntities: Array<{
    __typename?: 'LoreEntity';
    id: string;
    owner: string;
    ownerDisplayName?: string | null;
    kind: number;
    revisions: Array<{
      __typename?: 'LoreEntityRevision';
      revisionNumber: number;
      title?: string | null;
      excerpt?: string | null;
      createdAt: any;
    }>;
  }>;
};

export type GetLoreEntityQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetLoreEntityQuery = {
  __typename?: 'Query';
  getLoreEntity: {
    __typename?: 'LoreEntity';
    id: string;
    owner: string;
    ownerDisplayName?: string | null;
    kind: number;
    revisions: Array<{
      __typename?: 'LoreEntityRevision';
      markdown?: string | null;
      revisionNumber: number;
      title?: string | null;
      excerpt?: string | null;
      createdAt: any;
    }>;
  };
};

export type GetLorePoisQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetLorePoisQuery = {
  __typename?: 'Query';
  getLorePois: Array<{
    __typename?: 'LorePoi';
    id: string;
    name: string;
    assetType?: string | null;
  }>;
};

export type LoreEntityFragmentFragment = {
  __typename?: 'LoreEntity';
  id: string;
  owner: string;
  ownerDisplayName?: string | null;
  kind: number;
  revisions: Array<{
    __typename?: 'LoreEntityRevision';
    revisionNumber: number;
    title?: string | null;
    excerpt?: string | null;
    createdAt: any;
  }>;
};

export type LorePoiFragmentFragment = {
  __typename?: 'LorePoi';
  id: string;
  name: string;
  assetType?: string | null;
};

export type GetAccountQueryVariables = Exact<{
  account: Scalars['String'];
  realmIds?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;

export type GetAccountQuery = {
  __typename?: 'Query';
  ownedRealmsCount: number;
  settledRealmsCount: number;
  accountHistory: Array<{
    __typename?: 'RealmHistory';
    id: number;
    eventType?: string | null;
    eventId?: string | null;
    realmId: number;
    realmOwner?: string | null;
    realmName?: string | null;
    realmOrder?: string | null;
    data?: any | null;
    timestamp?: any | null;
  }>;
};

export type GetGameConstantsQueryVariables = Exact<{ [key: string]: never }>;

export type GetGameConstantsQuery = {
  __typename?: 'Query';
  battalionStats: Array<{
    __typename?: 'BattalionStats';
    battalionId: number;
    battalionName: string;
    type: string;
    combatType: string;
    value: number;
    requiredBuildingId: number;
    requiredBuildingName: string;
  }>;
  buildingCosts: Array<{
    __typename?: 'BuildingCost';
    buildingId: number;
    buildingName: string;
    amount: number;
    resources: any;
  }>;
  battalionCosts: Array<{
    __typename?: 'BattalionCost';
    battalionId: number;
    battalionName: string;
    resources: any;
  }>;
  laborAndToolCosts: Array<{
    __typename?: 'ResourceLaborAndToolCost';
    resourceId: number;
    resourceName: string;
    tier: string;
    costs: any;
  }>;
};

export type GetRealmQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetRealmQuery = {
  __typename?: 'Query';
  realm: {
    __typename?: 'Realm';
    realmId: number;
    owner?: string | null;
    bridgedOwner?: string | null;
    ownerL2?: string | null;
    settledOwner?: string | null;
    name?: string | null;
    rarityRank: number;
    rarityScore: number;
    orderType: string;
    wonder?: string | null;
    lastAttacked?: any | null;
    lastClaimTime?: any | null;
    lastTick?: any | null;
    lastVaultTime?: any | null;
    longitude: number;
    latitude: number;
    resources?: Array<{
      __typename?: 'Resource';
      resourceId: number;
      resourceName: string;
      level: number;
      upgrades: Array<string>;
      labor?: {
        __typename?: 'Labor';
        qtyBuilt: number;
        lastUpdate?: any | null;
        balance?: any | null;
        vaultBalance?: any | null;
      } | null;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    relic?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    relicsOwned?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    buildings?: Array<{
      __typename?: 'Building';
      buildingId: number;
      buildingName: string;
      buildingIntegrity: number;
      count: number;
      population: number;
      culture: number;
      food: number;
      limitTraitId: number;
      limitTraitName: string;
    }> | null;
    troops?: Array<{
      __typename?: 'Troop';
      realmId: number;
      troopId: number;
      troopName: string;
      index: number;
      type: number;
      tier: number;
      agility: number;
      attack: number;
      armor: number;
      vitality: number;
      wisdom: number;
      squadSlot: number;
    }> | null;
    ownArmies: Array<{
      __typename?: 'Army';
      armyId: number;
      realmId: number;
      bastionId?: string | null;
      orderId: number;
      xp: number;
      destinationRealmId: number;
      destinationArrivalTime?: any | null;
      armyPacked: number;
      lastAttacked?: any | null;
      level: number;
      callSign: number;
      lightCavalryQty: number;
      lightCavalryHealth: number;
      heavyCavalryQty: number;
      heavyCavalryHealth: number;
      archerQty: number;
      archerHealth: number;
      longbowQty: number;
      longbowHealth: number;
      mageQty: number;
      mageHealth: number;
      arcanistQty: number;
      arcanistHealth: number;
      lightInfantryQty: number;
      lightInfantryHealth: number;
      heavyInfantryQty: number;
      heavyInfantryHealth: number;
      bastionArrivalBlock: number;
      bastionCurrentLocation: number;
      bastionPastLocation: number;
    }>;
    foods: Array<{
      __typename?: 'Food';
      realmId: number;
      buildingId: number;
      buildingName: string;
      qty?: number | null;
      harvests?: number | null;
      createdAt: any;
    }>;
  };
};

export type GetBuildingsByRealmIdQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetBuildingsByRealmIdQuery = {
  __typename?: 'Query';
  getBuildingsByRealmId: Array<{
    __typename?: 'Building';
    realmId: number;
    buildingId: number;
    buildingName: string;
    buildingIntegrity: number;
    limit?: number | null;
    limitTraitId: number;
    limitTraitName: string;
    count: number;
    population: number;
    food: number;
    culture: number;
    buildingCost: {
      __typename?: 'BuildingCost';
      amount: number;
      resources: any;
    };
  }>;
};

export type GetFoodByRealmIdQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetFoodByRealmIdQuery = {
  __typename?: 'Query';
  getFoodByRealmId: Array<{
    __typename?: 'Food';
    realmId: number;
    buildingId: number;
    buildingName: string;
    qty?: number | null;
    harvests?: number | null;
    createdAt: any;
  }>;
};

export type GetRealmHistoryQueryVariables = Exact<{
  filter?: InputMaybe<RealmHistoryWhereInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetRealmHistoryQuery = {
  __typename?: 'Query';
  getRealmHistory: Array<{
    __typename?: 'RealmHistory';
    id: number;
    eventId?: string | null;
    eventType?: string | null;
    realmId: number;
    realmOwner?: string | null;
    data?: any | null;
    timestamp?: any | null;
    transactionHash?: string | null;
  }>;
};

export type GroupByRealmHistoryQueryVariables = Exact<{
  by: Array<RealmHistoryScalarFieldEnum> | RealmHistoryScalarFieldEnum;
  orderBy?: InputMaybe<
    | Array<RealmHistoryOrderByWithAggregationInput>
    | RealmHistoryOrderByWithAggregationInput
  >;
  where?: InputMaybe<RealmHistoryWhereInput>;
  take?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  isOwner: Scalars['Boolean'];
}>;

export type GroupByRealmHistoryQuery = {
  __typename?: 'Query';
  groupByRealmHistory: Array<{
    __typename?: 'RealmHistoryGroupBy';
    realmId: number;
    realmOwner?: string;
    realmName?: string;
    _count?: { __typename?: 'RealmHistoryCountAggregate'; _all: number } | null;
  }>;
};

export type GetRealmCombatResultQueryVariables = Exact<{
  defendRealmId: Scalars['Float'];
  transactionHash: Scalars['String'];
}>;

export type GetRealmCombatResultQuery = {
  __typename?: 'Query';
  getRealmCombatResult: {
    __typename?: 'CombatResult';
    defendRealmId: number;
    attackRealmId: number;
    transactionHash: string;
    relicLost?: number | null;
    outcome?: number | null;
    timestamp?: any | null;
    history?: Array<{
      __typename?: 'CombatHistory';
      eventType: string;
      attackSquad?: any | null;
      defendSquad?: any | null;
      outcome?: number | null;
      attackType?: number | null;
      hitPoints?: number | null;
      timestamp?: any | null;
    }> | null;
    resourcesPillaged?: Array<{
      __typename?: 'ResourceAmount';
      resourceId: number;
      resourceName: string;
      amount: string;
    }> | null;
  };
};

export type GetRealmsQueryVariables = Exact<{
  filter?: InputMaybe<RealmWhereInput>;
  orderBy?: InputMaybe<RealmOrderByWithRelationInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetRealmsQuery = {
  __typename?: 'Query';
  total: number;
  realms: Array<{
    __typename?: 'Realm';
    realmId: number;
    owner?: string | null;
    bridgedOwner?: string | null;
    ownerL2?: string | null;
    settledOwner?: string | null;
    name?: string | null;
    rarityRank: number;
    rarityScore: number;
    orderType: string;
    wonder?: string | null;
    lastAttacked?: any | null;
    lastClaimTime?: any | null;
    lastTick?: any | null;
    lastVaultTime?: any | null;
    longitude: number;
    latitude: number;
    resources?: Array<{
      __typename?: 'Resource';
      resourceId: number;
      resourceName: string;
      level: number;
      upgrades: Array<string>;
      labor?: {
        __typename?: 'Labor';
        qtyBuilt: number;
        lastUpdate?: any | null;
        balance?: any | null;
        vaultBalance?: any | null;
      } | null;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    relic?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    relicsOwned?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    buildings?: Array<{
      __typename?: 'Building';
      buildingId: number;
      buildingName: string;
      buildingIntegrity: number;
      count: number;
      population: number;
      culture: number;
      food: number;
      limitTraitId: number;
      limitTraitName: string;
    }> | null;
    troops?: Array<{
      __typename?: 'Troop';
      realmId: number;
      troopId: number;
      troopName: string;
      index: number;
      type: number;
      tier: number;
      agility: number;
      attack: number;
      armor: number;
      vitality: number;
      wisdom: number;
      squadSlot: number;
    }> | null;
    ownArmies: Array<{
      __typename?: 'Army';
      armyId: number;
      realmId: number;
      bastionId?: string | null;
      orderId: number;
      xp: number;
      destinationRealmId: number;
      destinationArrivalTime?: any | null;
      armyPacked: number;
      lastAttacked?: any | null;
      level: number;
      callSign: number;
      lightCavalryQty: number;
      lightCavalryHealth: number;
      heavyCavalryQty: number;
      heavyCavalryHealth: number;
      archerQty: number;
      archerHealth: number;
      longbowQty: number;
      longbowHealth: number;
      mageQty: number;
      mageHealth: number;
      arcanistQty: number;
      arcanistHealth: number;
      lightInfantryQty: number;
      lightInfantryHealth: number;
      heavyInfantryQty: number;
      heavyInfantryHealth: number;
      bastionArrivalBlock: number;
      bastionCurrentLocation: number;
      bastionPastLocation: number;
    }>;
    foods: Array<{
      __typename?: 'Food';
      realmId: number;
      buildingId: number;
      buildingName: string;
      qty?: number | null;
      harvests?: number | null;
      createdAt: any;
    }>;
  }>;
};

export type GetRealmsWithTravelsQueryVariables = Exact<{
  filter?: InputMaybe<RealmWhereInput>;
  travelsWhere?: InputMaybe<TravelWhereInput>;
  orderBy?: InputMaybe<RealmOrderByWithRelationInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetRealmsWithTravelsQuery = {
  __typename?: 'Query';
  total: number;
  realms: Array<{
    __typename?: 'Realm';
    realmId: number;
    owner?: string | null;
    bridgedOwner?: string | null;
    ownerL2?: string | null;
    settledOwner?: string | null;
    name?: string | null;
    rarityRank: number;
    rarityScore: number;
    orderType: string;
    wonder?: string | null;
    lastAttacked?: any | null;
    lastClaimTime?: any | null;
    lastTick?: any | null;
    lastVaultTime?: any | null;
    longitude: number;
    latitude: number;
    resources?: Array<{
      __typename?: 'Resource';
      resourceId: number;
      resourceName: string;
      level: number;
      upgrades: Array<string>;
      labor?: {
        __typename?: 'Labor';
        qtyBuilt: number;
        lastUpdate?: any | null;
        balance?: any | null;
        vaultBalance?: any | null;
      } | null;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    relic?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    relicsOwned?: Array<{
      __typename?: 'Relic';
      realmId?: number | null;
      heldByRealm?: number | null;
    }> | null;
    buildings?: Array<{
      __typename?: 'Building';
      buildingId: number;
      buildingName: string;
      buildingIntegrity: number;
      count: number;
      population: number;
      culture: number;
      food: number;
      limitTraitId: number;
      limitTraitName: string;
    }> | null;
    troops?: Array<{
      __typename?: 'Troop';
      realmId: number;
      troopId: number;
      troopName: string;
      index: number;
      type: number;
      tier: number;
      agility: number;
      attack: number;
      armor: number;
      vitality: number;
      wisdom: number;
      squadSlot: number;
    }> | null;
    ownArmies: Array<{
      __typename?: 'Army';
      armyId: number;
      realmId: number;
      bastionId?: string | null;
      orderId: number;
      xp: number;
      destinationRealmId: number;
      destinationArrivalTime?: any | null;
      armyPacked: number;
      lastAttacked?: any | null;
      level: number;
      callSign: number;
      lightCavalryQty: number;
      lightCavalryHealth: number;
      heavyCavalryQty: number;
      heavyCavalryHealth: number;
      archerQty: number;
      archerHealth: number;
      longbowQty: number;
      longbowHealth: number;
      mageQty: number;
      mageHealth: number;
      arcanistQty: number;
      arcanistHealth: number;
      lightInfantryQty: number;
      lightInfantryHealth: number;
      heavyInfantryQty: number;
      heavyInfantryHealth: number;
      bastionArrivalBlock: number;
      bastionCurrentLocation: number;
      bastionPastLocation: number;
    }>;
    foods: Array<{
      __typename?: 'Food';
      realmId: number;
      buildingId: number;
      buildingName: string;
      qty?: number | null;
      harvests?: number | null;
      createdAt: any;
    }>;
  }>;
  travels: Array<{
    __typename?: 'Travel';
    contractId: number;
    tokenId: number;
    nestedId: number;
    destinationContractId: number;
    destinationTokenId: number;
    destinationNestedId: number;
    destinationArrivalTime: any;
  }>;
};

export type GetTroopStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTroopStatsQuery = {
  __typename?: 'Query';
  getTroopStats: Array<{
    __typename?: 'TroopStats';
    troopId: number;
    troopName: string;
    type: number;
    tier: number;
    agility: number;
    attack: number;
    armor: number;
    vitality: number;
    wisdom: number;
    troopCost?: {
      __typename?: 'TroopCost';
      amount: number;
      resources: any;
    } | null;
  }>;
};

export type RealmFragmentFragment = {
  __typename?: 'Realm';
  realmId: number;
  owner?: string | null;
  bridgedOwner?: string | null;
  ownerL2?: string | null;
  settledOwner?: string | null;
  name?: string | null;
  rarityRank: number;
  rarityScore: number;
  orderType: string;
  wonder?: string | null;
  lastAttacked?: any | null;
  lastClaimTime?: any | null;
  lastTick?: any | null;
  lastVaultTime?: any | null;
  longitude: number;
  latitude: number;
  resources?: Array<{
    __typename?: 'Resource';
    resourceId: number;
    resourceName: string;
    level: number;
    upgrades: Array<string>;
    labor?: {
      __typename?: 'Labor';
      qtyBuilt: number;
      lastUpdate?: any | null;
      balance?: any | null;
      vaultBalance?: any | null;
    } | null;
  }> | null;
  traits?: Array<{
    __typename?: 'RealmTrait';
    type: string;
    qty: number;
  }> | null;
  relic?: Array<{
    __typename?: 'Relic';
    realmId?: number | null;
    heldByRealm?: number | null;
  }> | null;
  relicsOwned?: Array<{
    __typename?: 'Relic';
    realmId?: number | null;
    heldByRealm?: number | null;
  }> | null;
  buildings?: Array<{
    __typename?: 'Building';
    buildingId: number;
    buildingName: string;
    buildingIntegrity: number;
    count: number;
    population: number;
    culture: number;
    food: number;
    limitTraitId: number;
    limitTraitName: string;
  }> | null;
  troops?: Array<{
    __typename?: 'Troop';
    realmId: number;
    troopId: number;
    troopName: string;
    index: number;
    type: number;
    tier: number;
    agility: number;
    attack: number;
    armor: number;
    vitality: number;
    wisdom: number;
    squadSlot: number;
  }> | null;
  ownArmies: Array<{
    __typename?: 'Army';
    armyId: number;
    realmId: number;
    bastionId?: string | null;
    orderId: number;
    xp: number;
    destinationRealmId: number;
    destinationArrivalTime?: any | null;
    armyPacked: number;
    lastAttacked?: any | null;
    level: number;
    callSign: number;
    lightCavalryQty: number;
    lightCavalryHealth: number;
    heavyCavalryQty: number;
    heavyCavalryHealth: number;
    archerQty: number;
    archerHealth: number;
    longbowQty: number;
    longbowHealth: number;
    mageQty: number;
    mageHealth: number;
    arcanistQty: number;
    arcanistHealth: number;
    lightInfantryQty: number;
    lightInfantryHealth: number;
    heavyInfantryQty: number;
    heavyInfantryHealth: number;
    bastionArrivalBlock: number;
    bastionCurrentLocation: number;
    bastionPastLocation: number;
  }>;
  foods: Array<{
    __typename?: 'Food';
    realmId: number;
    buildingId: number;
    buildingName: string;
    qty?: number | null;
    harvests?: number | null;
    createdAt: any;
  }>;
};

export type RealmArmiesFragmentFragment = {
  __typename?: 'Realm';
  ownArmies: Array<{
    __typename?: 'Army';
    armyId: number;
    realmId: number;
    bastionId?: string | null;
    orderId: number;
    xp: number;
    destinationRealmId: number;
    destinationArrivalTime?: any | null;
    armyPacked: number;
    lastAttacked?: any | null;
    level: number;
    callSign: number;
    lightCavalryQty: number;
    lightCavalryHealth: number;
    heavyCavalryQty: number;
    heavyCavalryHealth: number;
    archerQty: number;
    archerHealth: number;
    longbowQty: number;
    longbowHealth: number;
    mageQty: number;
    mageHealth: number;
    arcanistQty: number;
    arcanistHealth: number;
    lightInfantryQty: number;
    lightInfantryHealth: number;
    heavyInfantryQty: number;
    heavyInfantryHealth: number;
    bastionArrivalBlock: number;
    bastionCurrentLocation: number;
    bastionPastLocation: number;
  }>;
};

export type RealmBuildingsFragmentFragment = {
  __typename?: 'Realm';
  buildings?: Array<{
    __typename?: 'Building';
    buildingId: number;
    buildingName: string;
    buildingIntegrity: number;
    count: number;
    population: number;
    culture: number;
    food: number;
    limitTraitId: number;
    limitTraitName: string;
  }> | null;
};

export type RealmFoodsFragmentFragment = {
  __typename?: 'Realm';
  foods: Array<{
    __typename?: 'Food';
    realmId: number;
    buildingId: number;
    buildingName: string;
    qty?: number | null;
    harvests?: number | null;
    createdAt: any;
  }>;
};

export type RealmTroopsFragmentFragment = {
  __typename?: 'Realm';
  troops?: Array<{
    __typename?: 'Troop';
    realmId: number;
    troopId: number;
    troopName: string;
    index: number;
    type: number;
    tier: number;
    agility: number;
    attack: number;
    armor: number;
    vitality: number;
    wisdom: number;
    squadSlot: number;
  }> | null;
};

export type TravelFragmentFragment = {
  __typename?: 'Travel';
  contractId: number;
  tokenId: number;
  nestedId: number;
  destinationContractId: number;
  destinationTokenId: number;
  destinationNestedId: number;
  destinationArrivalTime: any;
};

export type ResourceFragmentFragment = {
  __typename?: 'Resource';
  id: string;
  resourceId: number;
  resourceName: string;
  realmId?: number | null;
};

export type GetTravelsQueryVariables = Exact<{
  where?: InputMaybe<TravelWhereInput>;
  orderBy?: InputMaybe<
    Array<TravelOrderByWithRelationInput> | TravelOrderByWithRelationInput
  >;
  take?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type GetTravelsQuery = {
  __typename?: 'Query';
  payload: Array<{
    __typename?: 'Travel';
    contractId: number;
    tokenId: number;
    nestedId: number;
    destinationContractId: number;
    destinationTokenId: number;
    destinationNestedId: number;
    destinationArrivalTime: any;
    startTime: any;
    endTime: any;
    originRealm?: {
      __typename?: 'Realm';
      realmId: number;
      longitude: number;
      latitude: number;
    } | null;
    locationRealm?: {
      __typename?: 'Realm';
      realmId: number;
      longitude: number;
      latitude: number;
    } | null;
    destinationRealm?: {
      __typename?: 'Realm';
      realmId: number;
      longitude: number;
      latitude: number;
    } | null;
  }>;
};

export type GetTokenBalancesQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type GetTokenBalancesQuery = {
  __typename?: 'Query';
  tokenBalances: Array<{
    __typename?: 'TokenBalance';
    tokenId: number;
    amount: string;
  }>;
};

export const DesiegeFragmentFragmentDoc = gql`
  fragment DesiegeFragment on Desiege {
    id
    gameId
    winner
    attackedTokens
    defendedTokens
    eventIndexed
    initialHealth
    startedOn
  }
`;
export const LoreEntityFragmentFragmentDoc = gql`
  fragment LoreEntityFragment on LoreEntity {
    id
    owner
    ownerDisplayName
    kind
    revisions {
      revisionNumber
      title
      excerpt
      createdAt
    }
  }
`;
export const LorePoiFragmentFragmentDoc = gql`
  fragment LorePoiFragment on LorePoi {
    id
    name
    assetType
  }
`;
export const RealmBuildingsFragmentFragmentDoc = gql`
  fragment RealmBuildingsFragment on Realm {
    buildings {
      buildingId
      buildingName
      buildingIntegrity
      count
      population
      culture
      food
      limitTraitId
      limitTraitName
    }
  }
`;
export const RealmTroopsFragmentFragmentDoc = gql`
  fragment RealmTroopsFragment on Realm {
    troops {
      realmId
      troopId
      troopName
      index
      type
      tier
      agility
      attack
      armor
      vitality
      wisdom
      squadSlot
    }
  }
`;
export const RealmArmiesFragmentFragmentDoc = gql`
  fragment RealmArmiesFragment on Realm {
    ownArmies {
      armyId
      realmId
      bastionId
      orderId
      xp
      destinationRealmId
      destinationArrivalTime
      armyPacked
      lastAttacked
      xp
      level
      callSign
      lightCavalryQty
      lightCavalryHealth
      heavyCavalryQty
      heavyCavalryHealth
      archerQty
      archerHealth
      longbowQty
      longbowHealth
      mageQty
      mageHealth
      arcanistQty
      arcanistHealth
      lightInfantryQty
      lightInfantryHealth
      heavyInfantryQty
      heavyInfantryHealth
      bastionArrivalBlock
      bastionCurrentLocation
      bastionPastLocation
    }
  }
`;
export const RealmFoodsFragmentFragmentDoc = gql`
  fragment RealmFoodsFragment on Realm {
    foods {
      realmId
      buildingId
      buildingName
      qty
      harvests
      createdAt
    }
  }
`;
export const RealmFragmentFragmentDoc = gql`
  fragment RealmFragment on Realm {
    realmId
    owner
    bridgedOwner
    ownerL2
    settledOwner
    name
    rarityRank
    rarityScore
    orderType
    wonder
    lastAttacked
    lastClaimTime
    lastTick
    lastVaultTime
    longitude
    latitude
    resources {
      resourceId
      resourceName
      labor {
        qtyBuilt
        lastUpdate
        balance
        vaultBalance
      }
      level
      upgrades
    }
    traits {
      type
      qty
    }
    relic {
      realmId
      heldByRealm
    }
    relicsOwned {
      realmId
      heldByRealm
    }
    ...RealmBuildingsFragment
    ...RealmTroopsFragment
    ...RealmArmiesFragment
    ...RealmFoodsFragment
  }
  ${RealmBuildingsFragmentFragmentDoc}
  ${RealmTroopsFragmentFragmentDoc}
  ${RealmArmiesFragmentFragmentDoc}
  ${RealmFoodsFragmentFragmentDoc}
`;
export const TravelFragmentFragmentDoc = gql`
  fragment TravelFragment on Travel {
    contractId
    tokenId
    nestedId
    destinationContractId
    destinationTokenId
    destinationNestedId
    destinationArrivalTime
  }
`;
export const ResourceFragmentFragmentDoc = gql`
  fragment ResourceFragment on Resource {
    id
    resourceId
    resourceName
    realmId
  }
`;
export const GetBastionDocument = gql`
  query getBastion($id: Float!) @api(name: starkIndexer) {
    bastion(id: $id) {
      bastionId
      latitude
      longitude
      locations {
        locationId
        bastionId
        defendingOrderId
        takenBlock
        armies {
          armyId
          realmId
          xp
          destinationRealmId
          destinationArrivalTime
          armyPacked
          lastAttacked
          xp
          level
          callSign
          lightCavalryQty
          lightCavalryHealth
          heavyCavalryQty
          heavyCavalryHealth
          archerQty
          archerHealth
          longbowQty
          longbowHealth
          mageQty
          mageHealth
          arcanistQty
          arcanistHealth
          lightInfantryQty
          lightInfantryHealth
          heavyInfantryQty
          heavyInfantryHealth
          orderId
          bastionArrivalBlock
          bastionCurrentLocation
          bastionId
        }
      }
    }
  }
`;

/**
 * __useGetBastionQuery__
 *
 * To run a query within a React component, call `useGetBastionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBastionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBastionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBastionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBastionQuery,
    GetBastionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBastionQuery, GetBastionQueryVariables>(
    GetBastionDocument,
    options
  );
}
export function useGetBastionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBastionQuery,
    GetBastionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBastionQuery, GetBastionQueryVariables>(
    GetBastionDocument,
    options
  );
}
export type GetBastionQueryHookResult = ReturnType<typeof useGetBastionQuery>;
export type GetBastionLazyQueryHookResult = ReturnType<
  typeof useGetBastionLazyQuery
>;
export type GetBastionQueryResult = Apollo.QueryResult<
  GetBastionQuery,
  GetBastionQueryVariables
>;
export const GetBastionHistoryDocument = gql`
  query getBastionHistory(
    $filter: BastionHistoryWhereInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    getBastionHistory(filter: $filter, take: $take, skip: $skip) {
      bastionId
      realmHistoryEventId
      realmHistoryEventType
      realmHistory {
        id
        eventId
        eventType
        realmId
        realmOwner
        data
        timestamp
        transactionHash
      }
    }
  }
`;

/**
 * __useGetBastionHistoryQuery__
 *
 * To run a query within a React component, call `useGetBastionHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBastionHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBastionHistoryQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetBastionHistoryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBastionHistoryQuery,
    GetBastionHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBastionHistoryQuery,
    GetBastionHistoryQueryVariables
  >(GetBastionHistoryDocument, options);
}
export function useGetBastionHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBastionHistoryQuery,
    GetBastionHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBastionHistoryQuery,
    GetBastionHistoryQueryVariables
  >(GetBastionHistoryDocument, options);
}
export type GetBastionHistoryQueryHookResult = ReturnType<
  typeof useGetBastionHistoryQuery
>;
export type GetBastionHistoryLazyQueryHookResult = ReturnType<
  typeof useGetBastionHistoryLazyQuery
>;
export type GetBastionHistoryQueryResult = Apollo.QueryResult<
  GetBastionHistoryQuery,
  GetBastionHistoryQueryVariables
>;
export const GetDesiegeDocument = gql`
  query getDesiege($id: Float!) @api(name: starkIndexer) {
    getDesiege(id: $id) {
      ...DesiegeFragment
    }
  }
  ${DesiegeFragmentFragmentDoc}
`;

/**
 * __useGetDesiegeQuery__
 *
 * To run a query within a React component, call `useGetDesiegeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDesiegeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDesiegeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDesiegeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDesiegeQuery,
    GetDesiegeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDesiegeQuery, GetDesiegeQueryVariables>(
    GetDesiegeDocument,
    options
  );
}
export function useGetDesiegeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDesiegeQuery,
    GetDesiegeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDesiegeQuery, GetDesiegeQueryVariables>(
    GetDesiegeDocument,
    options
  );
}
export type GetDesiegeQueryHookResult = ReturnType<typeof useGetDesiegeQuery>;
export type GetDesiegeLazyQueryHookResult = ReturnType<
  typeof useGetDesiegeLazyQuery
>;
export type GetDesiegeQueryResult = Apollo.QueryResult<
  GetDesiegeQuery,
  GetDesiegeQueryVariables
>;
export const GetExchangeRatesDocument = gql`
  query getExchangeRates @api(name: starkIndexer) {
    getExchangeRates {
      tokenId
      tokenName
      amount
      buyAmount
      sellAmount
      currencyReserve
      tokenReserve
      percentChange24Hr
    }
  }
`;

/**
 * __useGetExchangeRatesQuery__
 *
 * To run a query within a React component, call `useGetExchangeRatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExchangeRatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExchangeRatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExchangeRatesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetExchangeRatesQuery,
    GetExchangeRatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetExchangeRatesQuery, GetExchangeRatesQueryVariables>(
    GetExchangeRatesDocument,
    options
  );
}
export function useGetExchangeRatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetExchangeRatesQuery,
    GetExchangeRatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetExchangeRatesQuery,
    GetExchangeRatesQueryVariables
  >(GetExchangeRatesDocument, options);
}
export type GetExchangeRatesQueryHookResult = ReturnType<
  typeof useGetExchangeRatesQuery
>;
export type GetExchangeRatesLazyQueryHookResult = ReturnType<
  typeof useGetExchangeRatesLazyQuery
>;
export type GetExchangeRatesQueryResult = Apollo.QueryResult<
  GetExchangeRatesQuery,
  GetExchangeRatesQueryVariables
>;
export const GetHistoricPriceDataDocument = gql`
  query getHistoricPriceData($dateFrom: String!, $dateTo: String!)
  @api(name: starkIndexer) {
    exchangeRates(
      where: { date: { gt: $dateFrom, lte: $dateTo } }
      orderBy: { date: asc }
    ) {
      date
      hour
      tokenId
      amount
    }
  }
`;

/**
 * __useGetHistoricPriceDataQuery__
 *
 * To run a query within a React component, call `useGetHistoricPriceDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHistoricPriceDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHistoricPriceDataQuery({
 *   variables: {
 *      dateFrom: // value for 'dateFrom'
 *      dateTo: // value for 'dateTo'
 *   },
 * });
 */
export function useGetHistoricPriceDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetHistoricPriceDataQuery,
    GetHistoricPriceDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetHistoricPriceDataQuery,
    GetHistoricPriceDataQueryVariables
  >(GetHistoricPriceDataDocument, options);
}
export function useGetHistoricPriceDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHistoricPriceDataQuery,
    GetHistoricPriceDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetHistoricPriceDataQuery,
    GetHistoricPriceDataQueryVariables
  >(GetHistoricPriceDataDocument, options);
}
export type GetHistoricPriceDataQueryHookResult = ReturnType<
  typeof useGetHistoricPriceDataQuery
>;
export type GetHistoricPriceDataLazyQueryHookResult = ReturnType<
  typeof useGetHistoricPriceDataLazyQuery
>;
export type GetHistoricPriceDataQueryResult = Apollo.QueryResult<
  GetHistoricPriceDataQuery,
  GetHistoricPriceDataQueryVariables
>;
export const GetLoreEntitiesDocument = gql`
  query getLoreEntities(
    $filter: LoreEntityWhereInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    getLoreEntities(filter: $filter, take: $take, skip: $skip) {
      ...LoreEntityFragment
    }
  }
  ${LoreEntityFragmentFragmentDoc}
`;

/**
 * __useGetLoreEntitiesQuery__
 *
 * To run a query within a React component, call `useGetLoreEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoreEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoreEntitiesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetLoreEntitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLoreEntitiesQuery,
    GetLoreEntitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLoreEntitiesQuery, GetLoreEntitiesQueryVariables>(
    GetLoreEntitiesDocument,
    options
  );
}
export function useGetLoreEntitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLoreEntitiesQuery,
    GetLoreEntitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLoreEntitiesQuery,
    GetLoreEntitiesQueryVariables
  >(GetLoreEntitiesDocument, options);
}
export type GetLoreEntitiesQueryHookResult = ReturnType<
  typeof useGetLoreEntitiesQuery
>;
export type GetLoreEntitiesLazyQueryHookResult = ReturnType<
  typeof useGetLoreEntitiesLazyQuery
>;
export type GetLoreEntitiesQueryResult = Apollo.QueryResult<
  GetLoreEntitiesQuery,
  GetLoreEntitiesQueryVariables
>;
export const GetLoreEntityDocument = gql`
  query getLoreEntity($id: Float!) @api(name: starkIndexer) {
    getLoreEntity(entityId: $id) {
      ...LoreEntityFragment
      revisions {
        markdown
      }
    }
  }
  ${LoreEntityFragmentFragmentDoc}
`;

/**
 * __useGetLoreEntityQuery__
 *
 * To run a query within a React component, call `useGetLoreEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoreEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoreEntityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLoreEntityQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLoreEntityQuery,
    GetLoreEntityQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLoreEntityQuery, GetLoreEntityQueryVariables>(
    GetLoreEntityDocument,
    options
  );
}
export function useGetLoreEntityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLoreEntityQuery,
    GetLoreEntityQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLoreEntityQuery, GetLoreEntityQueryVariables>(
    GetLoreEntityDocument,
    options
  );
}
export type GetLoreEntityQueryHookResult = ReturnType<
  typeof useGetLoreEntityQuery
>;
export type GetLoreEntityLazyQueryHookResult = ReturnType<
  typeof useGetLoreEntityLazyQuery
>;
export type GetLoreEntityQueryResult = Apollo.QueryResult<
  GetLoreEntityQuery,
  GetLoreEntityQueryVariables
>;
export const GetLorePoisDocument = gql`
  query getLorePois($take: Float, $skip: Float) @api(name: starkIndexer) {
    getLorePois(take: $take, skip: $skip) {
      ...LorePoiFragment
    }
  }
  ${LorePoiFragmentFragmentDoc}
`;

/**
 * __useGetLorePoisQuery__
 *
 * To run a query within a React component, call `useGetLorePoisQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLorePoisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLorePoisQuery({
 *   variables: {
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetLorePoisQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLorePoisQuery,
    GetLorePoisQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLorePoisQuery, GetLorePoisQueryVariables>(
    GetLorePoisDocument,
    options
  );
}
export function useGetLorePoisLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLorePoisQuery,
    GetLorePoisQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLorePoisQuery, GetLorePoisQueryVariables>(
    GetLorePoisDocument,
    options
  );
}
export type GetLorePoisQueryHookResult = ReturnType<typeof useGetLorePoisQuery>;
export type GetLorePoisLazyQueryHookResult = ReturnType<
  typeof useGetLorePoisLazyQuery
>;
export type GetLorePoisQueryResult = Apollo.QueryResult<
  GetLorePoisQuery,
  GetLorePoisQueryVariables
>;
export const GetAccountDocument = gql`
  query getAccount($account: String!, $realmIds: [Int!])
  @api(name: starkIndexer) {
    ownedRealmsCount: realmsCount(filter: { ownerL2: { equals: $account } })
    settledRealmsCount: realmsCount(
      filter: { settledOwner: { equals: $account } }
    )
    accountHistory: getRealmHistory(filter: { realmId: { in: $realmIds } }) {
      id
      eventType
      eventId
      realmId
      realmOwner
      realmName
      realmOrder
      data
      timestamp
    }
  }
`;

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *      account: // value for 'account'
 *      realmIds: // value for 'realmIds'
 *   },
 * });
 */
export function useGetAccountQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    options
  );
}
export function useGetAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    options
  );
}
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>;
export type GetAccountLazyQueryHookResult = ReturnType<
  typeof useGetAccountLazyQuery
>;
export type GetAccountQueryResult = Apollo.QueryResult<
  GetAccountQuery,
  GetAccountQueryVariables
>;
export const GetGameConstantsDocument = gql`
  query getGameConstants @api(name: starkIndexer) {
    battalionStats: battalionStats {
      battalionId
      battalionName
      type
      combatType
      value
      requiredBuildingId
      requiredBuildingName
    }
    buildingCosts: getBuildingCosts {
      buildingId
      buildingName
      amount
      resources
    }
    battalionCosts {
      battalionId
      battalionName
      resources
    }
    laborAndToolCosts: getResourceLaborAndToolCosts {
      resourceId
      resourceName
      tier
      costs
    }
  }
`;

/**
 * __useGetGameConstantsQuery__
 *
 * To run a query within a React component, call `useGetGameConstantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameConstantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameConstantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGameConstantsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetGameConstantsQuery,
    GetGameConstantsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetGameConstantsQuery, GetGameConstantsQueryVariables>(
    GetGameConstantsDocument,
    options
  );
}
export function useGetGameConstantsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGameConstantsQuery,
    GetGameConstantsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetGameConstantsQuery,
    GetGameConstantsQueryVariables
  >(GetGameConstantsDocument, options);
}
export type GetGameConstantsQueryHookResult = ReturnType<
  typeof useGetGameConstantsQuery
>;
export type GetGameConstantsLazyQueryHookResult = ReturnType<
  typeof useGetGameConstantsLazyQuery
>;
export type GetGameConstantsQueryResult = Apollo.QueryResult<
  GetGameConstantsQuery,
  GetGameConstantsQueryVariables
>;
export const GetRealmDocument = gql`
  query getRealm($id: Float!) @api(name: starkIndexer) {
    realm(id: $id) {
      ...RealmFragment
    }
  }
  ${RealmFragmentFragmentDoc}
`;

/**
 * __useGetRealmQuery__
 *
 * To run a query within a React component, call `useGetRealmQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRealmQuery(
  baseOptions: Apollo.QueryHookOptions<GetRealmQuery, GetRealmQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRealmQuery, GetRealmQueryVariables>(
    GetRealmDocument,
    options
  );
}
export function useGetRealmLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRealmQuery,
    GetRealmQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRealmQuery, GetRealmQueryVariables>(
    GetRealmDocument,
    options
  );
}
export type GetRealmQueryHookResult = ReturnType<typeof useGetRealmQuery>;
export type GetRealmLazyQueryHookResult = ReturnType<
  typeof useGetRealmLazyQuery
>;
export type GetRealmQueryResult = Apollo.QueryResult<
  GetRealmQuery,
  GetRealmQueryVariables
>;
export const GetBuildingsByRealmIdDocument = gql`
  query getBuildingsByRealmId($id: Float!) @api(name: starkIndexer) {
    getBuildingsByRealmId(id: $id) {
      realmId
      buildingId
      buildingName
      buildingIntegrity
      limit
      limitTraitId
      limitTraitName
      count
      population
      food
      culture
      buildingCost {
        amount
        resources
      }
    }
  }
`;

/**
 * __useGetBuildingsByRealmIdQuery__
 *
 * To run a query within a React component, call `useGetBuildingsByRealmIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingsByRealmIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingsByRealmIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBuildingsByRealmIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBuildingsByRealmIdQuery,
    GetBuildingsByRealmIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBuildingsByRealmIdQuery,
    GetBuildingsByRealmIdQueryVariables
  >(GetBuildingsByRealmIdDocument, options);
}
export function useGetBuildingsByRealmIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBuildingsByRealmIdQuery,
    GetBuildingsByRealmIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBuildingsByRealmIdQuery,
    GetBuildingsByRealmIdQueryVariables
  >(GetBuildingsByRealmIdDocument, options);
}
export type GetBuildingsByRealmIdQueryHookResult = ReturnType<
  typeof useGetBuildingsByRealmIdQuery
>;
export type GetBuildingsByRealmIdLazyQueryHookResult = ReturnType<
  typeof useGetBuildingsByRealmIdLazyQuery
>;
export type GetBuildingsByRealmIdQueryResult = Apollo.QueryResult<
  GetBuildingsByRealmIdQuery,
  GetBuildingsByRealmIdQueryVariables
>;
export const GetFoodByRealmIdDocument = gql`
  query getFoodByRealmId($id: Float!) @api(name: starkIndexer) {
    getFoodByRealmId(id: $id) {
      realmId
      buildingId
      buildingName
      qty
      harvests
      createdAt
    }
  }
`;

/**
 * __useGetFoodByRealmIdQuery__
 *
 * To run a query within a React component, call `useGetFoodByRealmIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFoodByRealmIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFoodByRealmIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFoodByRealmIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetFoodByRealmIdQuery,
    GetFoodByRealmIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFoodByRealmIdQuery, GetFoodByRealmIdQueryVariables>(
    GetFoodByRealmIdDocument,
    options
  );
}
export function useGetFoodByRealmIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFoodByRealmIdQuery,
    GetFoodByRealmIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetFoodByRealmIdQuery,
    GetFoodByRealmIdQueryVariables
  >(GetFoodByRealmIdDocument, options);
}
export type GetFoodByRealmIdQueryHookResult = ReturnType<
  typeof useGetFoodByRealmIdQuery
>;
export type GetFoodByRealmIdLazyQueryHookResult = ReturnType<
  typeof useGetFoodByRealmIdLazyQuery
>;
export type GetFoodByRealmIdQueryResult = Apollo.QueryResult<
  GetFoodByRealmIdQuery,
  GetFoodByRealmIdQueryVariables
>;
export const GetRealmHistoryDocument = gql`
  query getRealmHistory(
    $filter: RealmHistoryWhereInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    getRealmHistory(filter: $filter, take: $take, skip: $skip) {
      id
      eventId
      eventType
      realmId
      realmOwner
      data
      timestamp
      transactionHash
    }
  }
`;

/**
 * __useGetRealmHistoryQuery__
 *
 * To run a query within a React component, call `useGetRealmHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmHistoryQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetRealmHistoryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRealmHistoryQuery,
    GetRealmHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRealmHistoryQuery, GetRealmHistoryQueryVariables>(
    GetRealmHistoryDocument,
    options
  );
}
export function useGetRealmHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRealmHistoryQuery,
    GetRealmHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRealmHistoryQuery,
    GetRealmHistoryQueryVariables
  >(GetRealmHistoryDocument, options);
}
export type GetRealmHistoryQueryHookResult = ReturnType<
  typeof useGetRealmHistoryQuery
>;
export type GetRealmHistoryLazyQueryHookResult = ReturnType<
  typeof useGetRealmHistoryLazyQuery
>;
export type GetRealmHistoryQueryResult = Apollo.QueryResult<
  GetRealmHistoryQuery,
  GetRealmHistoryQueryVariables
>;
export const GroupByRealmHistoryDocument = gql`
  query groupByRealmHistory(
    $by: [RealmHistoryScalarFieldEnum!]!
    $orderBy: [RealmHistoryOrderByWithAggregationInput!]
    $where: RealmHistoryWhereInput
    $take: Int
    $skip: Int
    $isOwner: Boolean!
  ) @api(name: starkIndexer) {
    groupByRealmHistory(
      by: $by
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      realmId
      realmOwner @include(if: $isOwner)
      realmName @include(if: $isOwner)
      _count {
        _all
      }
    }
  }
`;

/**
 * __useGroupByRealmHistoryQuery__
 *
 * To run a query within a React component, call `useGroupByRealmHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupByRealmHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupByRealmHistoryQuery({
 *   variables: {
 *      by: // value for 'by'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *      isOwner: // value for 'isOwner'
 *   },
 * });
 */
export function useGroupByRealmHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GroupByRealmHistoryQuery,
    GroupByRealmHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GroupByRealmHistoryQuery,
    GroupByRealmHistoryQueryVariables
  >(GroupByRealmHistoryDocument, options);
}
export function useGroupByRealmHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GroupByRealmHistoryQuery,
    GroupByRealmHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GroupByRealmHistoryQuery,
    GroupByRealmHistoryQueryVariables
  >(GroupByRealmHistoryDocument, options);
}
export type GroupByRealmHistoryQueryHookResult = ReturnType<
  typeof useGroupByRealmHistoryQuery
>;
export type GroupByRealmHistoryLazyQueryHookResult = ReturnType<
  typeof useGroupByRealmHistoryLazyQuery
>;
export type GroupByRealmHistoryQueryResult = Apollo.QueryResult<
  GroupByRealmHistoryQuery,
  GroupByRealmHistoryQueryVariables
>;
export const GetRealmCombatResultDocument = gql`
  query getRealmCombatResult($defendRealmId: Float!, $transactionHash: String!)
  @api(name: starkIndexer) {
    getRealmCombatResult(
      defendRealmId: $defendRealmId
      transactionHash: $transactionHash
    ) {
      defendRealmId
      attackRealmId
      transactionHash
      history {
        eventType
        attackSquad
        defendSquad
        outcome
        attackType
        hitPoints
        timestamp
      }
      resourcesPillaged {
        resourceId
        resourceName
        amount
      }
      relicLost
      outcome
      timestamp
    }
  }
`;

/**
 * __useGetRealmCombatResultQuery__
 *
 * To run a query within a React component, call `useGetRealmCombatResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmCombatResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmCombatResultQuery({
 *   variables: {
 *      defendRealmId: // value for 'defendRealmId'
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useGetRealmCombatResultQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRealmCombatResultQuery,
    GetRealmCombatResultQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRealmCombatResultQuery,
    GetRealmCombatResultQueryVariables
  >(GetRealmCombatResultDocument, options);
}
export function useGetRealmCombatResultLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRealmCombatResultQuery,
    GetRealmCombatResultQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRealmCombatResultQuery,
    GetRealmCombatResultQueryVariables
  >(GetRealmCombatResultDocument, options);
}
export type GetRealmCombatResultQueryHookResult = ReturnType<
  typeof useGetRealmCombatResultQuery
>;
export type GetRealmCombatResultLazyQueryHookResult = ReturnType<
  typeof useGetRealmCombatResultLazyQuery
>;
export type GetRealmCombatResultQueryResult = Apollo.QueryResult<
  GetRealmCombatResultQuery,
  GetRealmCombatResultQueryVariables
>;
export const GetRealmsDocument = gql`
  query getRealms(
    $filter: RealmWhereInput
    $orderBy: RealmOrderByWithRelationInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    realms(filter: $filter, orderBy: $orderBy, take: $take, skip: $skip) {
      ...RealmFragment
    }
    total: realmsCount(filter: $filter)
  }
  ${RealmFragmentFragmentDoc}
`;

/**
 * __useGetRealmsQuery__
 *
 * To run a query within a React component, call `useGetRealmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetRealmsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetRealmsQuery, GetRealmsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRealmsQuery, GetRealmsQueryVariables>(
    GetRealmsDocument,
    options
  );
}
export function useGetRealmsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRealmsQuery,
    GetRealmsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRealmsQuery, GetRealmsQueryVariables>(
    GetRealmsDocument,
    options
  );
}
export type GetRealmsQueryHookResult = ReturnType<typeof useGetRealmsQuery>;
export type GetRealmsLazyQueryHookResult = ReturnType<
  typeof useGetRealmsLazyQuery
>;
export type GetRealmsQueryResult = Apollo.QueryResult<
  GetRealmsQuery,
  GetRealmsQueryVariables
>;
export const GetRealmsWithTravelsDocument = gql`
  query getRealmsWithTravels(
    $filter: RealmWhereInput
    $travelsWhere: TravelWhereInput
    $orderBy: RealmOrderByWithRelationInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    realms(filter: $filter, orderBy: $orderBy, take: $take, skip: $skip) {
      ...RealmFragment
    }
    travels(where: $travelsWhere) {
      ...TravelFragment
    }
    total: realmsCount(filter: $filter)
  }
  ${RealmFragmentFragmentDoc}
  ${TravelFragmentFragmentDoc}
`;

/**
 * __useGetRealmsWithTravelsQuery__
 *
 * To run a query within a React component, call `useGetRealmsWithTravelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmsWithTravelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmsWithTravelsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      travelsWhere: // value for 'travelsWhere'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetRealmsWithTravelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRealmsWithTravelsQuery,
    GetRealmsWithTravelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRealmsWithTravelsQuery,
    GetRealmsWithTravelsQueryVariables
  >(GetRealmsWithTravelsDocument, options);
}
export function useGetRealmsWithTravelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRealmsWithTravelsQuery,
    GetRealmsWithTravelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRealmsWithTravelsQuery,
    GetRealmsWithTravelsQueryVariables
  >(GetRealmsWithTravelsDocument, options);
}
export type GetRealmsWithTravelsQueryHookResult = ReturnType<
  typeof useGetRealmsWithTravelsQuery
>;
export type GetRealmsWithTravelsLazyQueryHookResult = ReturnType<
  typeof useGetRealmsWithTravelsLazyQuery
>;
export type GetRealmsWithTravelsQueryResult = Apollo.QueryResult<
  GetRealmsWithTravelsQuery,
  GetRealmsWithTravelsQueryVariables
>;
export const GetTroopStatsDocument = gql`
  query getTroopStats @api(name: starkIndexer) {
    getTroopStats {
      troopId
      troopName
      type
      tier
      agility
      attack
      armor
      vitality
      wisdom
      troopCost {
        amount
        resources
      }
    }
  }
`;

/**
 * __useGetTroopStatsQuery__
 *
 * To run a query within a React component, call `useGetTroopStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTroopStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTroopStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTroopStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTroopStatsQuery,
    GetTroopStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTroopStatsQuery, GetTroopStatsQueryVariables>(
    GetTroopStatsDocument,
    options
  );
}
export function useGetTroopStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTroopStatsQuery,
    GetTroopStatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTroopStatsQuery, GetTroopStatsQueryVariables>(
    GetTroopStatsDocument,
    options
  );
}
export type GetTroopStatsQueryHookResult = ReturnType<
  typeof useGetTroopStatsQuery
>;
export type GetTroopStatsLazyQueryHookResult = ReturnType<
  typeof useGetTroopStatsLazyQuery
>;
export type GetTroopStatsQueryResult = Apollo.QueryResult<
  GetTroopStatsQuery,
  GetTroopStatsQueryVariables
>;
export const GetTravelsDocument = gql`
  query GetTravels(
    $where: TravelWhereInput
    $orderBy: [TravelOrderByWithRelationInput!]
    $take: Int
    $skip: Int
  ) @api(name: starkIndexer) {
    payload: travels(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      ...TravelFragment
      startTime: timestamp
      endTime: destinationArrivalTime
      originRealm {
        realmId
        longitude
        latitude
      }
      locationRealm {
        realmId
        longitude
        latitude
      }
      destinationRealm {
        realmId
        longitude
        latitude
      }
    }
  }
  ${TravelFragmentFragmentDoc}
`;

/**
 * __useGetTravelsQuery__
 *
 * To run a query within a React component, call `useGetTravelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTravelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTravelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetTravelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTravelsQuery,
    GetTravelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTravelsQuery, GetTravelsQueryVariables>(
    GetTravelsDocument,
    options
  );
}
export function useGetTravelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTravelsQuery,
    GetTravelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTravelsQuery, GetTravelsQueryVariables>(
    GetTravelsDocument,
    options
  );
}
export type GetTravelsQueryHookResult = ReturnType<typeof useGetTravelsQuery>;
export type GetTravelsLazyQueryHookResult = ReturnType<
  typeof useGetTravelsLazyQuery
>;
export type GetTravelsQueryResult = Apollo.QueryResult<
  GetTravelsQuery,
  GetTravelsQueryVariables
>;
export const GetTokenBalancesDocument = gql`
  query GetTokenBalances($address: String!) @api(name: starkIndexer) {
    tokenBalances(address: $address) {
      tokenId
      amount
    }
  }
`;

/**
 * __useGetTokenBalancesQuery__
 *
 * To run a query within a React component, call `useGetTokenBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenBalancesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetTokenBalancesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTokenBalancesQuery,
    GetTokenBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTokenBalancesQuery, GetTokenBalancesQueryVariables>(
    GetTokenBalancesDocument,
    options
  );
}
export function useGetTokenBalancesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTokenBalancesQuery,
    GetTokenBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTokenBalancesQuery,
    GetTokenBalancesQueryVariables
  >(GetTokenBalancesDocument, options);
}
export type GetTokenBalancesQueryHookResult = ReturnType<
  typeof useGetTokenBalancesQuery
>;
export type GetTokenBalancesLazyQueryHookResult = ReturnType<
  typeof useGetTokenBalancesLazyQuery
>;
export type GetTokenBalancesQueryResult = Apollo.QueryResult<
  GetTokenBalancesQuery,
  GetTokenBalancesQueryVariables
>;
