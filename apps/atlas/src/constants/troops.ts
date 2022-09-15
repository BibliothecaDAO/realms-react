/* eslint-disable @typescript-eslint/naming-convention */

// Baseline square meter for building capacity calculations.
import { RealmBuildingId } from './buildings';

export const COMBAT_OUTCOME_ATTACKER_WINS = 1;
export const COMBAT_OUTCOME_DEFENDER_WINS = 2;

export enum TroopSlot {
  attacking = 1,
  defending = 2,
}

export enum TroopBuildings {
  LightCavalry = RealmBuildingId.Castle,
  HeavyCavalry = RealmBuildingId.Castle,
  Archer = RealmBuildingId.ArcherTower,
  Longbow = RealmBuildingId.ArcherTower,
  Mage = RealmBuildingId.MageTower,
  Arcanist = RealmBuildingId.MageTower,
  LightInfantry = RealmBuildingId.Barracks,
  HeavyInfantry = RealmBuildingId.Barracks,
}

export enum BattalionIds {
  LightCavalry = 1,
  HeavyCavalry = 2,
  Archer = 3,
  Longbow = 4,
  Mage = 5,
  Arcanist = 6,
  LightInfantry = 7,
  HeavyInfantry = 8,
}

const Barracks = 'bg-red-600';
const ArcherTower = 'bg-yellow-600';
const Castle = 'bg-orange-600';
const MageTower = 'bg-purple-600';

export const troopList = [
  {
    name: 'lightCavalry',
    img: 'LightCavalry.png',
    troopId: BattalionIds.LightCavalry,
    colour: ArcherTower,
    agility: 2,
    attack: 7,
    armor: 2,
    vitality: 53,
    wisdom: 2,
    buildingId: TroopBuildings.LightCavalry,
  },
  {
    name: 'heavyCavalry',
    img: 'HeavyCavalry.png',
    troopId: BattalionIds.HeavyCavalry,
    colour: ArcherTower,
    agility: 2,
    attack: 7,
    armor: 2,
    vitality: 53,
    wisdom: 2,
    buildingId: TroopBuildings.HeavyCavalry,
  },
  {
    name: 'archer',
    img: 'Archer.png',
    troopId: BattalionIds.Archer,
    colour: ArcherTower,
    agility: 6,
    attack: 9,
    armor: 4,
    vitality: 53,
    wisdom: 4,
    buildingId: TroopBuildings.Archer,
  },
  {
    name: 'longbow',
    img: 'Longbow.png',
    troopId: BattalionIds.Longbow,
    colour: ArcherTower,
    agility: 4,
    attack: 7,
    armor: 3,
    vitality: 53,
    wisdom: 3,
    buildingId: TroopBuildings.Longbow,
  },
  {
    name: 'mage',
    img: 'Mage.png',
    troopId: BattalionIds.Mage,
    colour: Barracks,
    agility: 7,
    attack: 4,
    armor: 5,
    vitality: 53,
    wisdom: 1,
    buildingId: TroopBuildings.Mage,
  },

  {
    name: 'arcanist',
    img: 'Arcanist.png',
    troopId: BattalionIds.Arcanist,
    colour: Barracks,
    agility: 9,
    attack: 7,
    armor: 8,
    vitality: 79,
    wisdom: 2,
    buildingId: TroopBuildings.Arcanist,
  },
  {
    name: 'lightInfantry',
    img: 'LightInfantry.png',
    troopId: BattalionIds.LightInfantry,
    colour: Barracks,
    agility: 9,
    attack: 9,
    armor: 9,
    vitality: 106,
    wisdom: 3,
    buildingId: TroopBuildings.LightInfantry,
  },
  {
    name: 'heavyInfantry',
    img: 'HeavyInfantry.png',
    troopId: BattalionIds.HeavyInfantry,
    colour: Castle,
    agility: 4,
    attack: 11,
    armor: 4,
    vitality: 53,
    wisdom: 2,
    buildingId: TroopBuildings.HeavyInfantry,
  },
];
