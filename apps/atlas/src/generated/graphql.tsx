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

export type BuildingCostInput = {
  buildingType: Scalars['String'];
  qty: Scalars['Float'];
  resourceType: Scalars['String'];
};

export type BuildingInput = {
  id?: InputMaybe<Scalars['ID']>;
  realmId: Scalars['Float'];
  type: Scalars['String'];
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

/** StarkNet Event Model */
export type Event = {
  __typename?: 'Event';
  chainId: Scalars['String'];
  contract: Scalars['String'];
  eventId: Scalars['Float'];
  id: Scalars['ID'];
  name: Scalars['String'];
  parameters: Array<Scalars['Float']>;
  timestamp: Scalars['DateTime'];
  txHash: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrUpdateBuildingCost: BuildingCost;
  createOrUpdateBuildings: Building;
  createOrUpdateRealm: Realm;
  createOrUpdateRealmTrait: RealmTrait;
  createOrUpdateResources: Resource;
  createOrUpdateWallet: Wallet;
  reindexDesiege: Scalars['Boolean'];
};

export type MutationCreateOrUpdateBuildingCostArgs = {
  data: BuildingCostInput;
};

export type MutationCreateOrUpdateBuildingsArgs = {
  data: BuildingInput;
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

export type MutationCreateOrUpdateWalletArgs = {
  data: WalletInput;
};

export type Query = {
  __typename?: 'Query';
  getBuilding: Building;
  getBuildingCosts: Array<BuildingCost>;
  getBuildings: Array<Building>;
  getBuildingsByAddress: Array<Building>;
  getBuildingsByRealm: Array<Building>;
  getDesiege: Desiege;
  getDesiegeGames: Array<Desiege>;
  getEvent: Event;
  getEvents: Array<Event>;
  getRealm: Realm;
  getRealmTraits: Array<RealmTrait>;
  getRealms: Array<Realm>;
  getRealmsByAddress: Array<Realm>;
  getResource: Resource;
  getResources: Array<Resource>;
  getResourcesByAddress: Array<Resource>;
  getWallet: Wallet;
  getWallets: Array<Wallet>;
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

export type QueryGetEventArgs = {
  id: Scalars['Float'];
};

export type QueryGetRealmArgs = {
  realmId: Scalars['Float'];
};

export type QueryGetRealmsByAddressArgs = {
  address: Scalars['String'];
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

/** The Realm Model */
export type Realm = {
  __typename?: 'Realm';
  buildings?: Maybe<Array<Building>>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  orderType: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  rarityRank: Scalars['Int'];
  rarityScore: Scalars['Float'];
  realmId: Scalars['Int'];
  resources?: Maybe<Array<Resource>>;
  squads?: Maybe<Array<Squad>>;
  traits?: Maybe<Array<RealmTrait>>;
  wallet?: Maybe<Wallet>;
};

export type RealmInput = {
  imageUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  orderType?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  rarityRank?: InputMaybe<Scalars['Int']>;
  rarityScore?: InputMaybe<Scalars['Float']>;
  realmId: Scalars['Int'];
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

export type RealmTraitInput = {
  qty: Scalars['Float'];
  realmId: Scalars['Float'];
  type: Scalars['String'];
};

/** The Resource Model */
export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID'];
  realm: Realm;
  realmId?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
};

export type ResourceInput = {
  id?: InputMaybe<Scalars['ID']>;
  realmId: Scalars['Float'];
  type: Scalars['String'];
};

/** The Squad Model */
export type Squad = {
  __typename?: 'Squad';
  action: Scalars['String'];
  realm?: Maybe<Realm>;
  realmId: Scalars['Int'];
  type: Scalars['String'];
};

/** The Wallet Model */
export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  id: Scalars['ID'];
  realms: Array<Realm>;
};

export type WalletInput = {
  address: Scalars['String'];
  realms?: InputMaybe<RealmInput>;
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

export type GetRealmQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetRealmQuery = {
  __typename?: 'Query';
  getRealm: {
    __typename?: 'Realm';
    realmId: number;
    owner?: string | null;
    name?: string | null;
    rarityRank: number;
    rarityScore: number;
    orderType: string;
    resources?: Array<{ __typename?: 'Resource'; type: string }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    buildings?: Array<{ __typename?: 'Building'; type?: string | null }> | null;
    squads?: Array<{
      __typename?: 'Squad';
      action: string;
      type: string;
    }> | null;
  };
};

export type GetRealmsQueryVariables = Exact<{ [key: string]: never }>;

export type GetRealmsQuery = {
  __typename?: 'Query';
  getRealms: Array<{
    __typename?: 'Realm';
    realmId: number;
    owner?: string | null;
    name?: string | null;
    rarityRank: number;
    rarityScore: number;
    orderType: string;
    resources?: Array<{ __typename?: 'Resource'; type: string }> | null;
    traits?: Array<{
      __typename?: 'RealmTrait';
      type: string;
      qty: number;
    }> | null;
    buildings?: Array<{ __typename?: 'Building'; type?: string | null }> | null;
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
  name?: string | null;
  rarityRank: number;
  rarityScore: number;
  orderType: string;
  resources?: Array<{ __typename?: 'Resource'; type: string }> | null;
  traits?: Array<{
    __typename?: 'RealmTrait';
    type: string;
    qty: number;
  }> | null;
  buildings?: Array<{ __typename?: 'Building'; type?: string | null }> | null;
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
    id: string;
    realms: Array<{
      __typename?: 'Realm';
      realmId: number;
      owner?: string | null;
      name?: string | null;
      rarityRank: number;
      rarityScore: number;
      orderType: string;
      resources?: Array<{ __typename?: 'Resource'; type: string }> | null;
      traits?: Array<{
        __typename?: 'RealmTrait';
        type: string;
        qty: number;
      }> | null;
      buildings?: Array<{
        __typename?: 'Building';
        type?: string | null;
      }> | null;
      squads?: Array<{
        __typename?: 'Squad';
        action: string;
        type: string;
      }> | null;
    }>;
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
export const RealmFragmentFragmentDoc = gql`
  fragment RealmFragment on Realm {
    realmId
    owner
    name
    rarityRank
    rarityScore
    orderType
    resources {
      type
    }
    traits {
      type
      qty
    }
    buildings {
      type
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
  query GetDesiege($id: Float!) @api(name: starkIndexer) {
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
export const GetRealmDocument = gql`
  query GetRealm($id: Float!) @api(name: starkIndexer) {
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
  query GetRealms @api(name: starkIndexer) {
    getRealms {
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
  query GetWallet($address: String!) @api(name: starkIndexer) {
    getWallet(address: $address) {
      id
      realms {
        ...RealmFragment
      }
    }
  }
  ${RealmFragmentFragmentDoc}
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
