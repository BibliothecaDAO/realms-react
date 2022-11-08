import { graphql } from '@/gql/gql';
import { graphqlClient } from '@/lib/graphql-client';

/* const getCryptsDocument =
  graphql(GraphQL  `
  query getCrypts($where: JsonFilter, $first: Int, $skip: Int) {
    dungeons(where: $where, first: $first, skip: $skip) {
      size
      id
      environment
      numDoors
      numPoints
      name
      svg
      currentOwner {
        address
        dungeonsHeld
      }
    }
  }
`);

export async function getCrypts(variables) {
  try {
    const { realms } = await graphqlClient().request(
      getCryptsDocument,
      variables
    );
    return realms;
  } catch (e) {
    console.log(e);
  }
} */
