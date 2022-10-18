/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client';

export const ManaFragment = gql`
  fragment ManaData on Mana {
    id
    itemName
    suffixId
    inventoryId
  }
`;
