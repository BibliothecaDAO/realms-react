import { graphql } from '@/gql/gql';
import { GetRealmsQuery } from '@/gql/graphql';
import { graphqlClient } from '@/lib/graphql-client';

const getRealmsDocument = graphql(/* GraphQL */ `
  query getRealms {
    realms {
      ...RealmList
    }
  }
`);

export async function getRealms(
  filter?: any,
  orderBy?: any,
  take?: number,
  skip?: number
) {
  try {
    const { realms } = await graphqlClient.request(getRealmsDocument);
    console.log('getting realms');
    console.log(realms);
    return realms;
  } catch (e) {
    console.log(e);
  }
}
