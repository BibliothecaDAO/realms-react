import { graphql } from '@/gql/gql';

export const RealmBuildingsFragment = graphql(`
  fragment RealmBuildings on Realm {
    buildings {
      buildingId
      buildingName
      buildingIntegrity
      count
      population
      culture
      food
      limitTraitId
      limitTraitName
    }
  }
`);
