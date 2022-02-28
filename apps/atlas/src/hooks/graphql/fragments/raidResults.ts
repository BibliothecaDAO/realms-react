/* eslint-disable @typescript-eslint/naming-convention */
import { gql, useQuery } from '@apollo/client';

export const RaidResultFragment = gql`
  fragment RaidResultFragment on RaidResult {
    id
    result
    raider {
      id
    }
    defender {
      id
    }
    raiderRealm {
      id
    }
    defenderRealm {
      id
    }
    raiderUnitsLost
    defenderUnitsLost
    resourcesPillaged {
      id
    }
    resourcesValuesPillaged
    unitsCaptured
    timestamp
  }
`;
