import { gql, useQuery } from '@apollo/client';
import { GAdventurerFragment } from './fragments/gadventurer';
import { BagFragment, defaultLoot } from './fragments/loot';
import { ManaFragment } from './fragments/mana';
import { RaidResultFragment } from './fragments/raidResults';
import { RealmFragment, SRealmFragment } from './fragments/realmFragments';
import { WalletFragment } from './fragments/wallet';

const getRealmsQuery = gql`
  ${RealmFragment}
  query usersRealms(
    $address: String
    $resources: [Int]
    $orders: [String]
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) @api(name: realms) {
    realms(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        currentOwner_contains: $address
        resourceIds_contains: $resources
        order_in: $orders
      }
    ) {
      ...RealmData
      currentOwner {
        address
        joined
      }
    }
    bridgedRealms: realms(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        bridgedOwner: $address
        resourceIds_contains: $resources
        order_in: $orders
      }
    ) {
      id
      ...RealmData
    }
    wallet(id: $address) {
      realmsHeld
      bridgedRealmsHeld
    }
  }
`;

const getRealmQuery = gql`
  ${RealmFragment}
  query realm($id: String) @api(name: realms) {
    realm(id: $id) {
      ...RealmData
      currentOwner {
        address
        realmsHeld
        bridgedRealmsHeld
      }
    }
  }
`;
const getLootQuery = gql`
  ${BagFragment}
  query loot($id: String) @api(name: ecosystem) {
    bag(id: $id) {
      ...BagData
      currentOwner {
        address
        realmsHeld
        bridgedRealmsHeld
        bagsHeld
      }
    }
  }
`;

const getLootsQuery = gql`
  ${BagFragment}
  query loots($address: String, $first: Int, $skip: Int) @api(name: ecosystem) {
    bags(
      where: { currentOwner_contains: $address }
      first: $first
      skip: $skip
    ) {
      ...BagData
      currentOwner {
        address
        bagsHeld
      }
    }
  }
`;
const getGAQuery = gql`
  ${GAdventurerFragment}
  query GA($id: String) @api(name: ecosystem) {
    gadventurer(id: $id) {
      ...GAdventurerData
      currentOwner {
        address
        realmsHeld
        bridgedRealmsHeld
        bagsHeld
      }
    }
  }
`;

const getGAsQuery = gql`
  ${GAdventurerFragment}
  query GAs($address: String, $first: Int, $skip: Int) @api(name: ecosystem) {
    gadventurers(
      where: { currentOwner_contains: $address }
      first: $first
      skip: $skip
    ) {
      ...GAdventurerData
      currentOwner {
        address
        bagsHeld
      }
    }
  }
`;

const getCryptQuery = gql`
  query dungeon($id: String) @api(name: ecosystem) {
    dungeon(id: $id) {
      size
      id
      environment
      numDoors
      numPoints
      name
      svg
      currentOwner {
        address
        dungeonsHeld
      }
    }
  }
`;

const getCryptsQuery = gql`
  query dungeons($address: String, $first: Int, $skip: Int)
  @api(name: ecosystem) {
    dungeons(
      where: { currentOwner_contains: $address }
      first: $first
      skip: $skip
    ) {
      size
      id
      environment
      numDoors
      numPoints
      name
      svg
      currentOwner {
        address
        dungeonsHeld
      }
    }
  }
`;

const getResourceListQuery = gql`
  query getResourceListQuery @api(name: realms) {
    resources(first: 25) {
      id
      name
      totalRealms
    }
  }
`;
const getResourceBalancesQuery = gql`
  query getResourceBalancesQuery($address: String) {
    accounts(where: { id: $address }) {
      balances {
        token {
          identifier
        }
        value
      }
    }
  }
`;

const getl1Adventurer = gql`
  ${WalletFragment}
  ${BagFragment}
  ${defaultLoot}
  ${ManaFragment}
  ${GAdventurerFragment}

  query getAdventurer($address: String!, $first: Int, $skip: Int)
  @api(name: ecosystem) {
    wallet(id: $address) {
      id
      realmsHeld
      bridgedRealmsHeld
      bridgedRealms(first: 30) {
        id
        tokenURI
      }
      realms(first: 30) {
        id
        tokenURI
      }
      bagsHeld
      bags(first: $first, skip: $skip) {
        ...BagData
      }
      mLootsHeld
      mLoot(first: 30) {
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
      manasHeld
      manas(first: 30) {
        ...ManaData
      }
      gAdventurersHeld
      gAdventurers(first: 30) {
        ...DefaultBagData
        ...GAdventurerData
      }
    }
  }
`;
const getl2Adventurer = gql`
  ${RealmFragment}
  ${SRealmFragment}
  ${RaidResultFragment}
  query adventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      realms(first: 5) {
        ...RealmData
      }
      srealmsHeld
      srealms(first: 3) {
        ...SRealmData
      }
      raiderResults(orderBy: timestamp, orderDirection: desc) {
        ...RaidResultFragment
      }
      defenderResults(orderBy: timestamp, orderDirection: desc) {
        ...RaidResultFragment
      }
    }
  }
`;

const mintedRealmsQuery = gql`
  query mintedRealmsQuery($lastID: String) {
    realms(
      first: 1000
      where: { id_gt: $lastID }
      orderBy: id
      orderDirection: asc
    ) {
      id
    }
  }
`;

const lpPositionQuery = gql`
  query lpPositionQuery($address: String) {
    positions(where: { owner: $address }) {
      id
      tokenId
      owner
      staked
      oldOwner
      incentivePositions {
        id
        active
      }
    }
    depositedPositions: positions(where: { oldOwner: $address }) {
      id
      tokenId
      owner
      staked
      oldOwner
      incentivePositions {
        id
        active
      }
    }
  }
`;
const lpIncentivesQuery = gql`
  query lpIncentivesQuery($address: String) {
    incentives(where: { pool: $address }, orderBy: "startTime") {
      id
      startTime
      endTime
      reward
      ended
    }
  }
`;
export {
  getRealmQuery,
  getRealmsQuery,
  getLootQuery,
  getLootsQuery,
  getGAQuery,
  getGAsQuery,
  getCryptQuery,
  getCryptsQuery,
  mintedRealmsQuery,
  getl1Adventurer,
  getl2Adventurer,
  getResourceListQuery,
  getResourceBalancesQuery,
  lpPositionQuery,
  lpIncentivesQuery,
};
