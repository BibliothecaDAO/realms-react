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
  buildingId?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Float'];
};

/** Building Cost Model */
export type BuildingCost = {
  __typename?: 'BuildingCost';
  buildingId: Scalars['Int'];
  qty: Scalars['Float'];
  resourceId: Scalars['Int'];
};

export type BuildingListRelationFilter = {
  every?: InputMaybe<BuildingWhereInput>;
  none?: InputMaybe<BuildingWhereInput>;
  some?: InputMaybe<BuildingWhereInput>;
};

export type BuildingWhereInput = {
  AND?: InputMaybe<Array<BuildingWhereInput>>;
  NOT?: InputMaybe<Array<BuildingWhereInput>>;
  OR?: InputMaybe<Array<BuildingWhereInput>>;
  buildingId?: InputMaybe<IntFilter>;
  eventId?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  realm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntNullableFilter>;
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

export type EnumOrderTypeNullableFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type EnumRealmTraitTypeFilter = {
  equals?: InputMaybe<RealmTraitType>;
  in?: InputMaybe<Array<RealmTraitType>>;
  not?: InputMaybe<NestedEnumRealmTraitTypeFilter>;
  notIn?: InputMaybe<Array<RealmTraitType>>;
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

export type NestedEnumOrderTypeNullableFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeNullableFilter>;
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
  attackTroopIds: Array<Scalars['String']>;
  bridgedOwner?: Maybe<Scalars['String']>;
  buildings?: Maybe<Array<Building>>;
  defendTroopIds: Array<Scalars['String']>;
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
  traits?: Maybe<Array<RealmTrait>>;
  wallet?: Maybe<Wallet>;
  wonder?: Maybe<Scalars['String']>;
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
  attackTroopIds?: InputMaybe<StringNullableListFilter>;
  bridgedOwner?: InputMaybe<StringNullableFilter>;
  buildings?: InputMaybe<BuildingListRelationFilter>;
  defendTroopIds?: InputMaybe<StringNullableListFilter>;
  id?: InputMaybe<IntFilter>;
  imageUrl?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringNullableFilter>;
  orderType?: InputMaybe<EnumOrderTypeNullableFilter>;
  owner?: InputMaybe<StringNullableFilter>;
  ownerL2?: InputMaybe<StringNullableFilter>;
  rarityRank?: InputMaybe<IntFilter>;
  rarityScore?: InputMaybe<FloatFilter>;
  realmId?: InputMaybe<IntFilter>;
  resources?: InputMaybe<ResourceListRelationFilter>;
  settledOwner?: InputMaybe<StringNullableFilter>;
  traits?: InputMaybe<RealmTraitListRelationFilter>;
  wallet?: InputMaybe<WalletRelationFilter>;
  wonder?: InputMaybe<StringNullableFilter>;
};

/** The Resource Model */
export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID'];
  level: Scalars['Int'];
  realm: Realm;
  realmId?: Maybe<Scalars['Float']>;
  resourceId: Scalars['Int'];
  upgrades: Array<Scalars['String']>;
};

export type ResourceInput = {
  id?: InputMaybe<Scalars['ID']>;
  realmId: Scalars['Float'];
  resourceId: Scalars['Int'];
};

export type ResourceListRelationFilter = {
  every?: InputMaybe<ResourceWhereInput>;
  none?: InputMaybe<ResourceWhereInput>;
  some?: InputMaybe<ResourceWhereInput>;
};

export type ResourceTokenListRelationFilter = {
  every?: InputMaybe<ResourceTokenWhereInput>;
  none?: InputMaybe<ResourceTokenWhereInput>;
  some?: InputMaybe<ResourceTokenWhereInput>;
};

export type ResourceTokenWhereInput = {
  AND?: InputMaybe<Array<ResourceTokenWhereInput>>;
  NOT?: InputMaybe<Array<ResourceTokenWhereInput>>;
  OR?: InputMaybe<Array<ResourceTokenWhereInput>>;
  address?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  qty?: InputMaybe<IntFilter>;
  resourceId?: InputMaybe<IntFilter>;
  wallet?: InputMaybe<WalletRelationFilter>;
};

export type ResourceWhereInput = {
  AND?: InputMaybe<Array<ResourceWhereInput>>;
  NOT?: InputMaybe<Array<ResourceWhereInput>>;
  OR?: InputMaybe<Array<ResourceWhereInput>>;
  id?: InputMaybe<IntFilter>;
  level?: InputMaybe<IntFilter>;
  realm?: InputMaybe<RealmRelationFilter>;
  realmId?: InputMaybe<IntNullableFilter>;
  resourceId?: InputMaybe<IntFilter>;
  upgrades?: InputMaybe<StringNullableListFilter>;
};

export type SRealmListRelationFilter = {
  every?: InputMaybe<SRealmWhereInput>;
  none?: InputMaybe<SRealmWhereInput>;
  some?: InputMaybe<SRealmWhereInput>;
};

export type SRealmWhereInput = {
  AND?: InputMaybe<Array<SRealmWhereInput>>;
  NOT?: InputMaybe<Array<SRealmWhereInput>>;
  OR?: InputMaybe<Array<SRealmWhereInput>>;
  id?: InputMaybe<IntFilter>;
  owner?: InputMaybe<StringNullableFilter>;
  realmId?: InputMaybe<IntFilter>;
  wallet?: InputMaybe<WalletRelationFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

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

/** The Wallet Model */
export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  realmsBridgedHeld: Scalars['Int'];
  realmsL1Held: Scalars['Int'];
  realmsL2Held: Scalars['Int'];
  realmsSettledHeld: Scalars['Int'];
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
  realms?: InputMaybe<RealmListRelationFilter>;
  sRealms?: InputMaybe<SRealmListRelationFilter>;
  tokens?: InputMaybe<ResourceTokenListRelationFilter>;
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
    attackTroopIds: Array<string>;
    defendTroopIds: Array<string>;
    resources?: Array<{
      __typename?: 'Resource';
      resourceId: number;
      level: number;
      upgrades: Array<string>;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
  };
};

export type GetRealmsQueryVariables = Exact<{
  filter?: InputMaybe<RealmWhereInput>;
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
    attackTroopIds: Array<string>;
    defendTroopIds: Array<string>;
    resources?: Array<{
      __typename?: 'Resource';
      resourceId: number;
      level: number;
      upgrades: Array<string>;
    }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
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
  attackTroopIds: Array<string>;
  defendTroopIds: Array<string>;
  resources?: Array<{
    __typename?: 'Resource';
    resourceId: number;
    level: number;
    upgrades: Array<string>;
  }> | null;
  traits?: Array<{
    __typename?: 'RealmTrait';
    type: string;
    qty: number;
  }> | null;
};

export type ResourceFragmentFragment = {
  __typename?: 'Resource';
  id: string;
  resourceId: number;
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
      resourceId
      level
      upgrades
    }
    traits {
      type
      qty
    }
    attackTroopIds
    defendTroopIds
  }
`;
export const ResourceFragmentFragmentDoc = gql`
  fragment ResourceFragment on Resource {
    id
    resourceId
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
    $filter: RealmWhereInput
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
