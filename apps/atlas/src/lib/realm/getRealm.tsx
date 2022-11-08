import { graphql } from '@/gql/gql';
import { graphqlClient } from '@/lib/graphql-client';

const getRealmDocument = graphql(/* GraphQL */ `
  query getRealm($id: Float!) {
    realm(id: $id) {
      realmId
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
      lastVaultTime
      longitude
      latitude
      resources {
        resourceId
        resourceName
        level
        upgrades
      }
      traits {
        type
        qty
      }
      ...RealmArmies
      relic {
        realmId
        heldByRealm
      }
      relicsOwned {
        realmId
        heldByRealm
      }
    }
  }
`);

export async function getRealm(id) {
  try {
    const { realm } = await graphqlClient().request(getRealmDocument, {
      id: parseFloat(id),
    });
    console.log(realm);
    return realm;
  } catch (e) {
    console.log(e);
  }
}
