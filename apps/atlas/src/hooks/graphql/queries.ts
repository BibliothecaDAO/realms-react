import { gql } from '@apollo/client';
import { GAdventurerFragment } from './fragments/gadventurer';
import { BagFragment } from './fragments/loot';
import { RealmFragment } from './fragments/realmFragments';

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
  query loots(
    $where: Bag_filter
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) @api(name: ecosystem) {
    bags(
      where: $where
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
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
  query GAs(
    $where: GAdventurer_filter
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) @api(name: ecosystem) {
    gadventurers(
      where: $where
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
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
  query dungeons($where: Dungeon_filter, $first: Int, $skip: Int)
  @api(name: ecosystem) {
    dungeons(where: $where, first: $first, first: $first, skip: $skip) {
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

export {
  getRealmQuery,
  getRealmsQuery,
  getLootQuery,
  getLootsQuery,
  getGAQuery,
  getGAsQuery,
  getCryptQuery,
  getCryptsQuery,
};
