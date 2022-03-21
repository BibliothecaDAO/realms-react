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
};

/** The Buildings Model */
export type Buildings = {
  __typename?: 'Buildings';
  barracks?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  realmId: Scalars['Float'];
};

export type BuildingsInput = {
  barracks: Scalars['Float'];
  realmId: Scalars['Float'];
};

/** The Desiege Model */
export type Desiege = {
  __typename?: 'Desiege';
  attackedTokens: Scalars['Float'];
  blockIndexed: Scalars['Float'];
  defendedTokens: Scalars['Float'];
  gameId: Scalars['Float'];
  id: Scalars['ID'];
  winner: Scalars['Float'];
};

export type DesiegeInput = {
  attackedTokens: Scalars['Float'];
  blockIndexed: Scalars['Float'];
  defendedTokens: Scalars['Float'];
  gameId: Scalars['Float'];
  winner: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrUpdateBuildings: Buildings;
  createOrUpdateDesiege: Desiege;
  createOrUpdateRealm: Realm;
  createOrUpdateResources: Resource;
  createOrUpdateWallet: Wallet;
  reindexDesiege: Scalars['Boolean'];
};

export type MutationCreateOrUpdateBuildingsArgs = {
  data: BuildingsInput;
};

export type MutationCreateOrUpdateDesiegeArgs = {
  data: DesiegeInput;
};

export type MutationCreateOrUpdateRealmArgs = {
  data: RealmInput;
};

export type MutationCreateOrUpdateResourcesArgs = {
  data: ResourceInput;
};

export type MutationCreateOrUpdateWalletArgs = {
  data: WalletInput;
};

export type Query = {
  __typename?: 'Query';
  getAllBuildings: Array<Buildings>;
  getAllResources: Array<Resource>;
  getBuildings: Buildings;
  getDesiege: Desiege;
  getDesiegeGames: Array<Desiege>;
  getRealm: Realm;
  getRealms: Array<Realm>;
  getResource: Resource;
  getWallet: Wallet;
  getWallets: Array<Wallet>;
};

export type QueryGetBuildingsArgs = {
  id: Scalars['Float'];
};

export type QueryGetDesiegeArgs = {
  id: Scalars['Float'];
};

export type QueryGetRealmArgs = {
  id: Scalars['Float'];
};

export type QueryGetResourceArgs = {
  resourceId: Scalars['Float'];
};

export type QueryGetWalletArgs = {
  address: Scalars['String'];
};

/** The Realm Model */
export type Realm = {
  __typename?: 'Realm';
  buildings?: Maybe<Buildings>;
  defenceSquad?: Maybe<Squad>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  offenceSquad?: Maybe<Squad>;
  owner?: Maybe<Scalars['String']>;
  realmId?: Maybe<Scalars['Float']>;
  resources?: Maybe<Array<Resource>>;
  wallet: Wallet;
};

export type RealmInput = {
  name: Scalars['String'];
  owner: Scalars['String'];
  realmId: Scalars['Float'];
};

/** The Resource Model */
export type Resource = {
  __typename?: 'Resource';
  id: Scalars['ID'];
  realmId: Scalars['Float'];
  resourceId?: Maybe<Scalars['Float']>;
  resourceName?: Maybe<Scalars['String']>;
};

export type ResourceInput = {
  realmId: Scalars['Float'];
  resourceId?: InputMaybe<Scalars['Float']>;
  resourceName?: InputMaybe<Scalars['String']>;
};

/** The Squad Model */
export type Squad = {
  __typename?: 'Squad';
  id: Scalars['ID'];
  realmId: Scalars['Float'];
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

export type GetRealmQueryVariables = Exact<{
  id: Scalars['Float'];
}>;

export type GetRealmQuery = {
  __typename?: 'Query';
  getRealm: { __typename?: 'Realm'; id: string; realmId?: number | null };
};

export const GetRealmDocument = gql`
  query GetRealm($id: Float!) @api(name: starkIndexer) {
    getRealm(id: $id) {
      id
      realmId
    }
  }
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
