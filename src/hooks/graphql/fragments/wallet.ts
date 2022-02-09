import { gql, useQuery } from '@apollo/client';
export const WalletFragment = gql`
  fragment WalletData on Wallet {
    realmsHeld
    bagsHeld
    treasuresHeld
    manasHeld
  }
`
