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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AffectedRowsOutput = {
  __typename?: 'AffectedRowsOutput';
  count: Scalars['Int'];
};

export type AggregateEvent = {
  __typename?: 'AggregateEvent';
  _avg?: Maybe<EventAvgAggregate>;
  _count?: Maybe<EventCountAggregate>;
  _max?: Maybe<EventMaxAggregate>;
  _min?: Maybe<EventMinAggregate>;
  _sum?: Maybe<EventSumAggregate>;
};

/** The Buildings Model */
export type Building = {
  __typename?: 'Building';
  id: Scalars['ID'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Float'];
  type?: Maybe<Scalars['String']>;
};

/** Building Cost Model */
export type BuildingCost = {
  __typename?: 'BuildingCost';
  buildingType: Scalars['String'];
  qty: Scalars['Float'];
  resourceType: Scalars['String'];
};

export enum BuildingType {
  Amphitheater = 'Amphitheater',
  ArcherTower = 'Archer_Tower',
  Architect = 'Architect',
  Barracks = 'Barracks',
  Castle = 'Castle',
  Dock = 'Dock',
  Fairgrounds = 'Fairgrounds',
  Farms = 'Farms',
  Fishmonger = 'Fishmonger',
  Granary = 'Granary',
  GrandMarket = 'Grand_Market',
  Guild = 'Guild',
  Hamlet = 'Hamlet',
  Housing = 'Housing',
  MageTower = 'Mage_Tower',
  OfficerAcademy = 'Officer_Academy',
  ParadeGrounds = 'Parade_Grounds',
  RoyalReserve = 'Royal_Reserve',
  School = 'School',
  TradeOffice = 'Trade_Office',
}

export type BuildingTypeInput = {
  equals?: InputMaybe<BuildingType>;
  in?: InputMaybe<Array<BuildingType>>;
  not?: InputMaybe<Array<BuildingType>>;
  notIn?: InputMaybe<Array<BuildingType>>;
};

export type DateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type DateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
};

/** The Desiege Model */
export type Desiege = {
  __typename?: 'Desiege';
  attackedTokens: Scalars['Float'];
  defendedTokens: Scalars['Float'];
  eventIndexed: Scalars['Float'];
  gameId: Scalars['Float'];
  id: Scalars['ID'];
  initialHealth: Scalars['Float'];
  startedOn: Scalars['DateTime'];
  winner: Scalars['Float'];
};

export type Event = {
  __typename?: 'Event';
  blockNumber: Scalars['Int'];
  chainId: Scalars['String'];
  contract: Scalars['String'];
  eventId: Scalars['String'];
  id: Scalars['Int'];
  keys: Array<Scalars['String']>;
  name: Scalars['String'];
  parameters: Array<Scalars['String']>;
  status: Scalars['Int'];
  timestamp: Scalars['DateTime'];
  transactionNumber: Scalars['Int'];
  txHash: Scalars['String'];
};

export type EventAvgAggregate = {
  __typename?: 'EventAvgAggregate';
  blockNumber?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['Float']>;
  transactionNumber?: Maybe<Scalars['Float']>;
};

export type EventAvgOrderByAggregateInput = {
  blockNumber?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
};

export type EventCountAggregate = {
  __typename?: 'EventCountAggregate';
  _all: Scalars['Int'];
  blockNumber: Scalars['Int'];
  chainId: Scalars['Int'];
  contract: Scalars['Int'];
  eventId: Scalars['Int'];
  id: Scalars['Int'];
  keys: Scalars['Int'];
  name: Scalars['Int'];
  parameters: Scalars['Int'];
  status: Scalars['Int'];
  timestamp: Scalars['Int'];
  transactionNumber: Scalars['Int'];
  txHash: Scalars['Int'];
};

export type EventCountOrderByAggregateInput = {
  blockNumber?: InputMaybe<SortOrder>;
  chainId?: InputMaybe<SortOrder>;
  contract?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  keys?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parameters?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
  txHash?: InputMaybe<SortOrder>;
};

export type EventCreateInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId: Scalars['String'];
  contract: Scalars['String'];
  eventId: Scalars['String'];
  keys?: InputMaybe<EventCreatekeysInput>;
  name: Scalars['String'];
  parameters?: InputMaybe<EventCreateparametersInput>;
  status?: InputMaybe<Scalars['Int']>;
  timestamp: Scalars['DateTime'];
  transactionNumber?: InputMaybe<Scalars['Int']>;
  txHash: Scalars['String'];
};

export type EventCreateManyInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId: Scalars['String'];
  contract: Scalars['String'];
  eventId: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<EventCreatekeysInput>;
  name: Scalars['String'];
  parameters?: InputMaybe<EventCreateparametersInput>;
  status?: InputMaybe<Scalars['Int']>;
  timestamp: Scalars['DateTime'];
  transactionNumber?: InputMaybe<Scalars['Int']>;
  txHash: Scalars['String'];
};

export type EventCreatekeysInput = {
  set: Array<Scalars['String']>;
};

export type EventCreateparametersInput = {
  set: Array<Scalars['String']>;
};

export type EventGroupBy = {
  __typename?: 'EventGroupBy';
  _avg?: Maybe<EventAvgAggregate>;
  _count?: Maybe<EventCountAggregate>;
  _max?: Maybe<EventMaxAggregate>;
  _min?: Maybe<EventMinAggregate>;
  _sum?: Maybe<EventSumAggregate>;
  blockNumber: Scalars['Int'];
  chainId: Scalars['String'];
  contract: Scalars['String'];
  eventId: Scalars['String'];
  id: Scalars['Int'];
  keys?: Maybe<Array<Scalars['String']>>;
  name: Scalars['String'];
  parameters?: Maybe<Array<Scalars['String']>>;
  status: Scalars['Int'];
  timestamp: Scalars['DateTime'];
  transactionNumber: Scalars['Int'];
  txHash: Scalars['String'];
};

export type EventMaxAggregate = {
  __typename?: 'EventMaxAggregate';
  blockNumber?: Maybe<Scalars['Int']>;
  chainId?: Maybe<Scalars['String']>;
  contract?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  transactionNumber?: Maybe<Scalars['Int']>;
  txHash?: Maybe<Scalars['String']>;
};

export type EventMaxOrderByAggregateInput = {
  blockNumber?: InputMaybe<SortOrder>;
  chainId?: InputMaybe<SortOrder>;
  contract?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
  txHash?: InputMaybe<SortOrder>;
};

export type EventMinAggregate = {
  __typename?: 'EventMinAggregate';
  blockNumber?: Maybe<Scalars['Int']>;
  chainId?: Maybe<Scalars['String']>;
  contract?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  transactionNumber?: Maybe<Scalars['Int']>;
  txHash?: Maybe<Scalars['String']>;
};

export type EventMinOrderByAggregateInput = {
  blockNumber?: InputMaybe<SortOrder>;
  chainId?: InputMaybe<SortOrder>;
  contract?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
  txHash?: InputMaybe<SortOrder>;
};

export type EventOrderByWithAggregationInput = {
  _avg?: InputMaybe<EventAvgOrderByAggregateInput>;
  _count?: InputMaybe<EventCountOrderByAggregateInput>;
  _max?: InputMaybe<EventMaxOrderByAggregateInput>;
  _min?: InputMaybe<EventMinOrderByAggregateInput>;
  _sum?: InputMaybe<EventSumOrderByAggregateInput>;
  blockNumber?: InputMaybe<SortOrder>;
  chainId?: InputMaybe<SortOrder>;
  contract?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  keys?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parameters?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
  txHash?: InputMaybe<SortOrder>;
};

export type EventOrderByWithRelationInput = {
  blockNumber?: InputMaybe<SortOrder>;
  chainId?: InputMaybe<SortOrder>;
  contract?: InputMaybe<SortOrder>;
  eventId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  keys?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parameters?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
  txHash?: InputMaybe<SortOrder>;
};

export enum EventScalarFieldEnum {
  BlockNumber = 'blockNumber',
  ChainId = 'chainId',
  Contract = 'contract',
  EventId = 'eventId',
  Id = 'id',
  Keys = 'keys',
  Name = 'name',
  Parameters = 'parameters',
  Status = 'status',
  Timestamp = 'timestamp',
  TransactionNumber = 'transactionNumber',
  TxHash = 'txHash',
}

export type EventScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<EventScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<EventScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<EventScalarWhereWithAggregatesInput>>;
  blockNumber?: InputMaybe<IntWithAggregatesFilter>;
  chainId?: InputMaybe<StringWithAggregatesFilter>;
  contract?: InputMaybe<StringWithAggregatesFilter>;
  eventId?: InputMaybe<StringWithAggregatesFilter>;
  id?: InputMaybe<IntWithAggregatesFilter>;
  keys?: InputMaybe<StringNullableListFilter>;
  name?: InputMaybe<StringWithAggregatesFilter>;
  parameters?: InputMaybe<StringNullableListFilter>;
  status?: InputMaybe<IntWithAggregatesFilter>;
  timestamp?: InputMaybe<DateTimeWithAggregatesFilter>;
  transactionNumber?: InputMaybe<IntWithAggregatesFilter>;
  txHash?: InputMaybe<StringWithAggregatesFilter>;
};

export type EventSumAggregate = {
  __typename?: 'EventSumAggregate';
  blockNumber?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  transactionNumber?: Maybe<Scalars['Int']>;
};

export type EventSumOrderByAggregateInput = {
  blockNumber?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  transactionNumber?: InputMaybe<SortOrder>;
};

export type EventUpdateInput = {
  blockNumber?: InputMaybe<IntFieldUpdateOperationsInput>;
  chainId?: InputMaybe<StringFieldUpdateOperationsInput>;
  contract?: InputMaybe<StringFieldUpdateOperationsInput>;
  eventId?: InputMaybe<StringFieldUpdateOperationsInput>;
  keys?: InputMaybe<EventUpdatekeysInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  parameters?: InputMaybe<EventUpdateparametersInput>;
  status?: InputMaybe<IntFieldUpdateOperationsInput>;
  timestamp?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  transactionNumber?: InputMaybe<IntFieldUpdateOperationsInput>;
  txHash?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type EventUpdateManyMutationInput = {
  blockNumber?: InputMaybe<IntFieldUpdateOperationsInput>;
  chainId?: InputMaybe<StringFieldUpdateOperationsInput>;
  contract?: InputMaybe<StringFieldUpdateOperationsInput>;
  eventId?: InputMaybe<StringFieldUpdateOperationsInput>;
  keys?: InputMaybe<EventUpdatekeysInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  parameters?: InputMaybe<EventUpdateparametersInput>;
  status?: InputMaybe<IntFieldUpdateOperationsInput>;
  timestamp?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  transactionNumber?: InputMaybe<IntFieldUpdateOperationsInput>;
  txHash?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type EventUpdatekeysInput = {
  push?: InputMaybe<Array<Scalars['String']>>;
  set?: InputMaybe<Array<Scalars['String']>>;
};

export type EventUpdateparametersInput = {
  push?: InputMaybe<Array<Scalars['String']>>;
  set?: InputMaybe<Array<Scalars['String']>>;
};

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>;
  NOT?: InputMaybe<Array<EventWhereInput>>;
  OR?: InputMaybe<Array<EventWhereInput>>;
  blockNumber?: InputMaybe<IntFilter>;
  chainId?: InputMaybe<StringFilter>;
  contract?: InputMaybe<StringFilter>;
  eventId?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  keys?: InputMaybe<StringNullableListFilter>;
  name?: InputMaybe<StringFilter>;
  parameters?: InputMaybe<StringNullableListFilter>;
  status?: InputMaybe<IntFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
  transactionNumber?: InputMaybe<IntFilter>;
  txHash?: InputMaybe<StringFilter>;
};

export type EventWhereUniqueInput = {
  eventId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};

export type IntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']>;
  divide?: InputMaybe<Scalars['Int']>;
  increment?: InputMaybe<Scalars['Int']>;
  multiply?: InputMaybe<Scalars['Int']>;
  set?: InputMaybe<Scalars['Int']>;
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

export type IntFilterInput = {
  equals?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
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

/** Lore Entity */
export type LoreEntity = {
  __typename?: 'LoreEntity';
  id: Scalars['ID'];
  kind: Scalars['Float'];
  owner: Scalars['String'];
  revisions: Array<LoreEntityRevision>;
};

/** Lore Entity Revision */
export type LoreEntityRevision = {
  __typename?: 'LoreEntityRevision';
  createdAt: Scalars['DateTime'];
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  markdown?: Maybe<Scalars['String']>;
  pois: Array<LorePoisOnEntityRevisions>;
  props: Array<LorePropsOnEntityRevisions>;
  revisionNumber: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
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

/** Lore Entity Revision */
export type LorePropsOnEntityRevisions = {
  __typename?: 'LorePropsOnEntityRevisions';
  entityRevisionId: Scalars['ID'];
  propId: Scalars['ID'];
  value?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  createManyEvent: AffectedRowsOutput;
  createOrUpdateRealm: Realm;
  createOrUpdateRealmTrait: RealmTrait;
  createOrUpdateResources: Resource;
  deleteEvent?: Maybe<Event>;
  deleteManyEvent: AffectedRowsOutput;
  reindexDesiege: Scalars['Boolean'];
  updateEvent?: Maybe<Event>;
  updateManyEvent: AffectedRowsOutput;
  upsertEvent: Event;
};

export type MutationCreateEventArgs = {
  data: EventCreateInput;
};

export type MutationCreateManyEventArgs = {
  data: Array<EventCreateManyInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']>;
};

export type MutationCreateOrUpdateRealmArgs = {
  data: RealmInput;
};

export type MutationCreateOrUpdateRealmTraitArgs = {
  data: RealmTraitInput;
};

export type MutationCreateOrUpdateResourcesArgs = {
  data: ResourceInput;
};

export type MutationDeleteEventArgs = {
  where: EventWhereUniqueInput;
};

export type MutationDeleteManyEventArgs = {
  where?: InputMaybe<EventWhereInput>;
};

export type MutationUpdateEventArgs = {
  data: EventUpdateInput;
  where: EventWhereUniqueInput;
};

export type MutationUpdateManyEventArgs = {
  data: EventUpdateManyMutationInput;
  where?: InputMaybe<EventWhereInput>;
};

export type MutationUpsertEventArgs = {
  create: EventCreateInput;
  update: EventUpdateInput;
  where: EventWhereUniqueInput;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type NestedDateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']>>;
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

export type OrderTypeInput = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<Array<OrderType>>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type Query = {
  __typename?: 'Query';
  aggregateEvent: AggregateEvent;
  event?: Maybe<Event>;
  events: Array<Event>;
  findFirstEvent?: Maybe<Event>;
  getBuilding: Building;
  getBuildingCosts: Array<BuildingCost>;
  getBuildings: Array<Building>;
  getBuildingsByAddress: Array<Building>;
  getBuildingsByRealm: Array<Building>;
  getDesiege: Desiege;
  getDesiegeGames: Array<Desiege>;
  getLoreEntities: Array<LoreEntity>;
  getLoreEntity: LoreEntity;
  getLorePois: Array<LorePoi>;
  getRealm: Realm;
  getRealmTraits: Array<RealmTrait>;
  getRealms: Array<Realm>;
  getResource: Resource;
  getResources: Array<Resource>;
  getResourcesByAddress: Array<Resource>;
  getWallet: Wallet;
  groupByEvent: Array<EventGroupBy>;
};

export type QueryAggregateEventArgs = {
  cursor?: InputMaybe<EventWhereUniqueInput>;
  orderBy?: InputMaybe<Array<EventOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
};

export type QueryEventArgs = {
  where: EventWhereUniqueInput;
};

export type QueryEventsArgs = {
  cursor?: InputMaybe<EventWhereUniqueInput>;
  distinct?: InputMaybe<Array<EventScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<EventOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
};

export type QueryFindFirstEventArgs = {
  cursor?: InputMaybe<EventWhereUniqueInput>;
  distinct?: InputMaybe<Array<EventScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<EventOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
};

export type QueryGetBuildingArgs = {
  id: Scalars['Float'];
};

export type QueryGetBuildingsByAddressArgs = {
  address: Scalars['String'];
};

export type QueryGetBuildingsByRealmArgs = {
  realmId: Scalars['Float'];
};

export type QueryGetDesiegeArgs = {
  id: Scalars['Float'];
};

export type QueryGetLoreEntitiesArgs = {
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

export type QueryGetRealmsArgs = {
  filter?: InputMaybe<RealmFilterInput>;
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

export type QueryGetWalletArgs = {
  address: Scalars['String'];
};

export type QueryGroupByEventArgs = {
  by: Array<EventScalarFieldEnum>;
  having?: InputMaybe<EventScalarWhereWithAggregatesInput>;
  orderBy?: InputMaybe<Array<EventOrderByWithAggregationInput>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventWhereInput>;
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
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  orderType: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  ownerL2?: Maybe<Scalars['String']>;
  rarityRank: Scalars['Int'];
  rarityScore: Scalars['Float'];
  realmId: Scalars['Int'];
  resources?: Maybe<Array<Resource>>;
  settledOwner?: Maybe<Scalars['String']>;
  squads?: Maybe<Array<Squad>>;
  traits?: Maybe<Array<RealmTrait>>;
  wallet?: Maybe<Wallet>;
  wonder?: Maybe<Scalars['String']>;
};

export type RealmFilterInput = {
  AND?: InputMaybe<Array<RealmFilterInput>>;
  NOT?: InputMaybe<Array<RealmFilterInput>>;
  OR?: InputMaybe<Array<RealmFilterInput>>;
  bridgedOwner?: InputMaybe<StringFilterInput>;
  buildingType?: InputMaybe<BuildingTypeInput>;
  name?: InputMaybe<StringFilterInput>;
  orderType?: InputMaybe<OrderTypeInput>;
  owner?: InputMaybe<StringFilterInput>;
  ownerL2?: InputMaybe<StringFilterInput>;
  rarityRank?: InputMaybe<IntFilterInput>;
  rarityScore?: InputMaybe<IntFilterInput>;
  realmId?: InputMaybe<IntFilterInput>;
  resourceType?: InputMaybe<ResourceTypeInput>;
  settledOwner?: InputMaybe<StringFilterInput>;
  squadAction?: InputMaybe<SquadActionInput>;
  squadType?: InputMaybe<SquadTypeInput>;
  trait?: InputMaybe<RealmTraitFilterInput>;
  wonder?: InputMaybe<StringFilterInput>;
};

export type RealmInput = {
  bridgedOwner?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  orderType?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  ownerL2?: InputMaybe<Scalars['String']>;
  rarityRank?: InputMaybe<Scalars['Int']>;
  rarityScore?: InputMaybe<Scalars['Float']>;
  realmId: Scalars['Int'];
  settledOwner?: InputMaybe<Scalars['String']>;
  wonder?: InputMaybe<Scalars['String']>;
};

export type RealmOrderByInput = {
  rarityRank?: InputMaybe<OrderByDirectionInput>;
  rarityScore?: InputMaybe<OrderByDirectionInput>;
  realmId?: InputMaybe<OrderByDirectionInput>;
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

export type RealmTraitFilterInput = {
  qty?: InputMaybe<IntFilterInput>;
  type: RealmTraitType;
};

export type RealmTraitInput = {
  qty: Scalars['Float'];
  realmId: Scalars['Float'];
  type: RealmTraitType;
};

export enum RealmTraitType {
  City = 'City',
  Harbor = 'Harbor',
  Region = 'Region',
  River = 'River',
}

/** The Resource Model */
export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID'];
  level: Scalars['Int'];
  realm: Realm;
  realmId?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
  upgrades: Array<Scalars['String']>;
};

export type ResourceInput = {
  id?: InputMaybe<Scalars['ID']>;
  realmId: Scalars['Float'];
  type: ResourceType;
};

/** ResourceType */
export enum ResourceType {
  Adamantine = 'Adamantine',
  AlchemicalSilver = 'Alchemical_Silver',
  Coal = 'Coal',
  ColdIron = 'Cold_Iron',
  Copper = 'Copper',
  DeepCrystal = 'Deep_Crystal',
  Diamonds = 'Diamonds',
  Dragonhide = 'Dragonhide',
  EtherealSilica = 'Ethereal_Silica',
  Gold = 'Gold',
  Hartwood = 'Hartwood',
  Ignium = 'Ignium',
  Ironwood = 'Ironwood',
  Mithral = 'Mithral',
  Obsidian = 'Obsidian',
  Ruby = 'Ruby',
  Sapphire = 'Sapphire',
  Silver = 'Silver',
  Stone = 'Stone',
  TrueIce = 'True_Ice',
  TwilightQuartz = 'Twilight_Quartz',
  Wood = 'Wood',
}

export type ResourceTypeInput = {
  equals?: InputMaybe<ResourceType>;
  in?: InputMaybe<Array<ResourceType>>;
  not?: InputMaybe<Array<ResourceType>>;
  notIn?: InputMaybe<Array<ResourceType>>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

/** The Squad Model */
export type Squad = {
  __typename?: 'Squad';
  action: Scalars['String'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Int'];
  type: Scalars['String'];
};

export enum SquadAction {
  Defence = 'Defence',
  Offence = 'Offence',
}

export type SquadActionInput = {
  equals?: InputMaybe<SquadAction>;
  in?: InputMaybe<Array<SquadAction>>;
  not?: InputMaybe<Array<SquadAction>>;
  notIn?: InputMaybe<Array<SquadAction>>;
};

export enum SquadType {
  Apprentice = 'Apprentice',
  Arcanist = 'Arcanist',
  Archer = 'Archer',
  Ballista = 'Ballista',
  Catapult = 'Catapult',
  GrandMarshal = 'Grand_Marshal',
  Guard = 'Guard',
  GuardCaptain = 'Guard_Captain',
  Healer = 'Healer',
  Knight = 'Knight',
  KnightCommander = 'Knight_Commander',
  LifeMage = 'Life_Mage',
  Mage = 'Mage',
  Scorpio = 'Scorpio',
  Scout = 'Scout',
  Shaman = 'Shaman',
  Sniper = 'Sniper',
  Squire = 'Squire',
  Watchman = 'Watchman',
}

export type SquadTypeInput = {
  equals?: InputMaybe<SquadType>;
  in?: InputMaybe<Array<SquadType>>;
  not?: InputMaybe<Array<SquadType>>;
  notIn?: InputMaybe<Array<SquadType>>;
};

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']>;
};

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

export type StringFilterInput = {
  contains?: InputMaybe<Array<Scalars['String']>>;
  endsWith?: InputMaybe<Array<Scalars['String']>>;
  equals?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Array<Scalars['String']>>;
  gte?: InputMaybe<Array<Scalars['String']>>;
  in?: InputMaybe<Array<Scalars['String']>>;
  lt?: InputMaybe<Array<Scalars['String']>>;
  lte?: InputMaybe<Array<Scalars['String']>>;
  not?: InputMaybe<Array<Scalars['String']>>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Array<Scalars['String']>>;
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

/** The Wallet Model */
export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  realmsBridgedHeld: Scalars['Int'];
  realmsL1Held: Scalars['Int'];
  realmsL2Held: Scalars['Int'];
  realmsSettledHeld: Scalars['Int'];
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

export type GetLoreEntitiesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetLoreEntitiesQuery = {
  __typename?: 'Query';
  getLoreEntities: Array<{
    __typename?: 'LoreEntity';
    id: string;
    owner: string;
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

export type GetRealmQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetRealmQuery = {
  __typename?: 'Query';
  getRealm: {
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
    resources?: Array<{
      __typename?: 'Resource';
      type: string;
      level: number;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    buildings?: Array<{
      __typename?: 'Building';
      type?: string | null;
      id: string;
    }> | null;
    squads?: Array<{
      __typename?: 'Squad';
      action: string;
      type: string;
    }> | null;
  };
};

export type GetRealmsQueryVariables = Exact<{
  filter?: InputMaybe<RealmFilterInput>;
  orderBy?: InputMaybe<RealmOrderByInput>;
  take?: InputMaybe<Scalars['Float']>;
  skip?: InputMaybe<Scalars['Float']>;
}>;

export type GetRealmsQuery = {
  __typename?: 'Query';
  getRealms: Array<{
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
    resources?: Array<{
      __typename?: 'Resource';
      type: string;
      level: number;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    buildings?: Array<{
      __typename?: 'Building';
      type?: string | null;
      id: string;
    }> | null;
    squads?: Array<{
      __typename?: 'Squad';
      action: string;
      type: string;
    }> | null;
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
  resources?: Array<{
    __typename?: 'Resource';
    type: string;
    level: number;
  }> | null;
  traits?: Array<{
    __typename?: 'RealmTrait';
    type: string;
    qty: number;
  }> | null;
  buildings?: Array<{
    __typename?: 'Building';
    type?: string | null;
    id: string;
  }> | null;
  squads?: Array<{ __typename?: 'Squad'; action: string; type: string }> | null;
};

export type ResourceFragmentFragment = {
  __typename?: 'Resource';
  id: string;
  type: string;
  realmId?: number | null;
};

export type GetWalletQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type GetWalletQuery = {
  __typename?: 'Query';
  getWallet: {
    __typename?: 'Wallet';
    address: string;
    realmsL1Held: number;
    realmsL2Held: number;
    realmsSettledHeld: number;
    realmsBridgedHeld: number;
  };
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
    resources {
      type
      level
    }
    traits {
      type
      qty
    }
    buildings {
      type
      id
    }
    squads {
      action
      type
    }
  }
`;
export const ResourceFragmentFragmentDoc = gql`
  fragment ResourceFragment on Resource {
    id
    type
    realmId
  }
`;
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
export const GetLoreEntitiesDocument = gql`
  query getLoreEntities($take: Float, $skip: Float) @api(name: starkIndexer) {
    getLoreEntities(take: $take, skip: $skip) {
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
export const GetRealmDocument = gql`
  query getRealm($id: Float!) @api(name: starkIndexer) {
    getRealm(realmId: $id) {
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
export const GetRealmsDocument = gql`
  query getRealms(
    $filter: RealmFilterInput
    $orderBy: RealmOrderByInput
    $take: Float
    $skip: Float
  ) @api(name: starkIndexer) {
    getRealms(filter: $filter, orderBy: $orderBy, take: $take, skip: $skip) {
      ...RealmFragment
    }
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
export const GetWalletDocument = gql`
  query getWallet($address: String!) @api(name: starkIndexer) {
    getWallet(address: $address) {
      address
      realmsL1Held
      realmsL2Held
      realmsSettledHeld
      realmsBridgedHeld
    }
  }
`;

/**
 * __useGetWalletQuery__
 *
 * To run a query within a React component, call `useGetWalletQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalletQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalletQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetWalletQuery(
  baseOptions: Apollo.QueryHookOptions<GetWalletQuery, GetWalletQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetWalletQuery, GetWalletQueryVariables>(
    GetWalletDocument,
    options
  );
}
export function useGetWalletLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetWalletQuery,
    GetWalletQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetWalletQuery, GetWalletQueryVariables>(
    GetWalletDocument,
    options
  );
}
export type GetWalletQueryHookResult = ReturnType<typeof useGetWalletQuery>;
export type GetWalletLazyQueryHookResult = ReturnType<
  typeof useGetWalletLazyQuery
>;
export type GetWalletQueryResult = Apollo.QueryResult<
  GetWalletQuery,
  GetWalletQueryVariables
>;
