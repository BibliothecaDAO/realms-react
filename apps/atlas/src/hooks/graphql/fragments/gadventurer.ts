/* eslint-disable @typescript-eslint/naming-convention */

import { gql } from '@apollo/client';

export const GAdventurerFragment = gql`
  fragment GAdventurerData on GAdventurer {
    id
    head
    neck
    chest
    hand
    ring
    weapon
    waist
    foot
    order
    orderColor
    orderCount
    bagGreatness
    bagLevel
    bagRating
  }
`;
