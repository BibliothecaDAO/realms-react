import { graphql } from '@/gql/gql';
import { graphqlClient } from '@/lib/graphql-client';

const getRealmsDocument = graphql(/* GraphQL */ `
  query getRealms(
    $filter: RealmWhereInput
    $orderBy: RealmOrderByWithRelationInput
    $take: Float
    $skip: Float
  ) {
    realms(filter: $filter, orderBy: $orderBy, take: $take, skip: $skip) {
      ...RealmCard
      ...RealmOverview
      ...RealmResources
    }
  }
`);

export async function getRealms(variables) {
  try {
    const { realms } = await graphqlClient().request(
      getRealmsDocument,
      variables
    );
    return realms;
  } catch (e) {
    console.log(e);
  }
}
