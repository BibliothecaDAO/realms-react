import { graphql } from '@/gql/gql';

const getRealmsQueryDocument = graphql(`
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
`);

export async function getRealms(
  filter?: any,
  orderBy?: any,
  take?: number,
  skip?: number
) {
  try {
    const res = await fetch(
      'https://dev-indexer-gu226.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: getRealmsQueryDocument,
          variables: { filter, orderBy, take, skip },
        }),
      }
    );
    const response = await res.json();
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
