/* eslint-disable @typescript-eslint/naming-convention */

import { gql } from '@apollo/client';

export const RealmFragment = gql`
  fragment RealmData on Realm {
    id
    resourceIds
    order
    wonder
    cities
    harbours
    rivers
    regions
    name
    rarityScore
    rarityRank
  }
`;
export const SRealmFragment = gql`
  fragment SRealmData on SRealm {
    id
    ageSettled
    ageClaimed
    name
    resources {
      id
      level
      resourceUpgrades {
        id
      }
    }
    traits {
      name
      value
      buildings {
        name
        value
        buildingUpgrades {
          id
          address {
            id
          }
        }
      }
    }
    wonder
    order
    currentOwner {
      address
    }
  }
`;
