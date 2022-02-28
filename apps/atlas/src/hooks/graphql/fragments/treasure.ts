/* eslint-disable @typescript-eslint/naming-convention */

import { gql, useQuery } from '@apollo/client';

export const TreasureFragment = gql`
  fragment TreasureData on Treasure {
    id
    asset1
    asset2
    asset3
    asset4
    asset5
    asset6
    asset7
    asset8
  }
`;
