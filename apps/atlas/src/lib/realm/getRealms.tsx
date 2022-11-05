import { graphql } from '@/gql/gql';
import { GetRealmsQuery } from '@/gql/graphql';
import { graphqlClient } from '@/lib/graphql-client';

const getRealmsDocument = graphql(/* GraphQL */ `
  query getRealms($take: Float) {
    realms(take: $take) {
      ...RealmCard
      ...RealmOverview
    }
  }
`);

export async function getRealms(
  filter?: any,
  orderBy?: any,
  take?: number,
  skip?: number
) {
  console.log(take);
  try {
    const { realms } = await graphqlClient.request(getRealmsDocument, { take });
    return realms;
  } catch (e) {
    console.log(e);
  }
}
