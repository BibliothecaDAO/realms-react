import { gql, useQuery } from '@apollo/client';

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
  }
`
