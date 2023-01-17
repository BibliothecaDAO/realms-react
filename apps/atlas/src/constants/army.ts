/* eslint-disable @typescript-eslint/naming-convention */
import type { Army } from '@/generated/graphql';
import { RealmBuildingId } from './globals';

export const COMBAT_OUTCOME_ATTACKER_WINS = 1;
export const COMBAT_OUTCOME_DEFENDER_WINS = 2;

export enum TroopSlot {
  attacking = 1,
  defending = 2,
}

const Barracks = 'bg-red-600/20';
const ArcherTower = 'bg-yellow-600/20';
const Castle = 'bg-orange-600/20';
const MageTower = 'bg-purple-600/20';

const description =
  'Paladins are the most loyal and talented horseback riders that exist. With their superior horsemanship skills, they are able to wield a lance or polearm effectively with just one hand, allowing them to use their other hand to carry a shield or sheathe a weapon.';

export enum BattalionIds {
  LightCavalry = 1,
  HeavyCavalry,
  Archer,
  Longbow,
  Mage,
  Arcanist,
  LightInfantry,
  HeavyInfantry,
}

export const battalionInformation = [
  {
    id: BattalionIds.LightCavalry,
    name: 'lightCavalry',
    color: Barracks,
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
    image: 'mj_scout.png',
    buildingId: RealmBuildingId.Castle,
  },
  {
    id: BattalionIds.HeavyCavalry,
    name: 'heavyCavalry',
    color: Barracks,
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
    image: 'mj_knight.png',
    buildingId: RealmBuildingId.Castle,
  },
  {
    id: BattalionIds.Archer,
    name: 'archer',
    color: ArcherTower,
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
    image: 'mj_longbow.png',
    buildingId: RealmBuildingId.ArcherTower,
  },
  {
    id: BattalionIds.Longbow,
    name: 'longbow',
    color: ArcherTower,
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
    image: 'mj_hunter.png',
    buildingId: RealmBuildingId.ArcherTower,
  },
  {
    id: BattalionIds.Mage,
    name: 'mage',
    color: Castle,
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
    image: 'mj_apprentice.png',
    buildingId: RealmBuildingId.MageTower,
  },
  {
    id: BattalionIds.Arcanist,
    name: 'arcanist',
    color: Castle,
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
    image: 'mj_mage.png',
    buildingId: RealmBuildingId.MageTower,
  },
  {
    id: BattalionIds.LightInfantry,
    name: 'lightInfantry',
    color: MageTower,
    description: description,
    strength: 'Cavalry',
    weakness: 'Magic',
    image: 'mj_lightInfantry.png',
    buildingId: RealmBuildingId.Barracks,
  },
  {
    id: BattalionIds.HeavyInfantry,
    name: 'heavyInfantry',
    color: MageTower,
    description: description,
    strength: 'Cavalry',
    weakness: 'Magic',
    image: 'mj_heavyInfantry.png',
    buildingId: RealmBuildingId.Barracks,
  },
];

export const defaultArmy: Army = {
  arcanistHealth: 0,
  arcanistQty: 0,
  archerHealth: 0,
  archerQty: 0,
  armyId: 0,
  armyPacked: 0,
  callSign: 0,
  destinationRealmId: 0,
  heavyCavalryHealth: 0,
  heavyCavalryQty: 0,
  heavyInfantryHealth: 0,
  heavyInfantryQty: 0,
  lastAttacked: 0,
  level: 0,
  lightCavalryHealth: 0,
  lightCavalryQty: 0,
  lightInfantryHealth: 0,
  lightInfantryQty: 0,
  longbowHealth: 0,
  longbowQty: 0,
  mageHealth: 0,
  mageQty: 0,
  realmId: 0,
  xp: 0,
};

export const battalionIdToString = (id: BattalionIds) => {
  let name = 'n/a';
  switch (id) {
    case BattalionIds.LightCavalry:
      name = 'Cavalry';
      break;
    case BattalionIds.HeavyCavalry:
      name = 'Knight';
      break;
    case BattalionIds.Archer:
      name = 'Archer';
      break;
    case BattalionIds.Longbow:
      name = 'Hunter';
      break;
    case BattalionIds.Mage:
      name = 'Apprentice';
      break;
    case BattalionIds.Arcanist:
      name = 'Arcanist';
      break;
    case BattalionIds.LightInfantry:
      name = 'Soldier';
      break;
    case BattalionIds.HeavyInfantry:
      name = 'Paladin';
      break;
  }
  return name;
};

export const getUnitImage = (id: BattalionIds) => {
  return (
    '/realm-troops/' + battalionInformation.find((a) => a.id === id)?.image
  );
};

// dirty hack to get the id from the name
export const trueNameFromRawString = (name: string) => {
  return battalionIdToString(
    battalionInformation.find((a) => a.name === name)?.id || 0
  );
};
