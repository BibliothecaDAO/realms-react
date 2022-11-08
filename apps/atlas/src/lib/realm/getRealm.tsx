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
      ownArmies {
        armyId
        realmId
        xp
        destinationRealmId
        destinationArrivalTime
        armyPacked
        lastAttacked
        xp
        level
        callSign

        lightCavalryQty
        lightCavalryHealth
        heavyCavalryQty
        heavyCavalryHealth
        archerQty
        archerHealth
        longbowQty
        longbowHealth
        mageQty
        mageHealth
        arcanistQty
        arcanistHealth
        lightInfantryQty
        lightInfantryHealth
        heavyInfantryQty
        heavyInfantryHealth
      }
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
    return realm;
  } catch (e) {
    console.log(e);
  }
}
