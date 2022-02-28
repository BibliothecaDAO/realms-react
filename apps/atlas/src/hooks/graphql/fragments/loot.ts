/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client';

export const defaultLoot = gql`
  fragment DefaultBagData on Bag {
    id
    head
    neck
    chest
    hand
    ring
    weapon
    waist
    foot
  }
`;

export const BagFragment = gql`
  ${defaultLoot}

  fragment BagData on Bag {
    ...DefaultBagData
    chestSuffixId
    footSuffixId
    handSuffixId
    headSuffixId
    neckSuffixId
    ringSuffixId
    waistSuffixId
    weaponSuffixId
    manasClaimed
  }
`;
