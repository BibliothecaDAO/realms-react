import { graphql } from '@/gql/gql';

export const RealmItemFragment = graphql(`
  fragment RealmItem on Realm {
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
    relic {
      realmId
      heldByRealm
    }
    relicsOwned {
      realmId
      heldByRealm
    }
  }
`);
