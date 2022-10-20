/* eslint-disable @typescript-eslint/naming-convention */
import type { Army } from '@/generated/graphql';

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
  HeavyCavalry = 2,
  Archer = 3,
  LongBow = 4,
  Mage = 5,
  Archanist = 6,
  LightInfantry = 7,
  HeavyInfantry = 8,
}

export const battalionInformation = [
  {
    id: 1,
    name: 'Cavalry',
    color: Barracks,
    image: '/realm-troops/cavalry.png',
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 2,
    name: 'Knight',
    color: Barracks,
    image: '/realm-troops/knight.png',
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 3,
    name: 'Archer',
    color: ArcherTower,
    image: '/realm-troops/archer.png',
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
  },
  {
    id: 4,
    name: 'Hunter',
    color: ArcherTower,
    image: '/realm-troops/hunter.png',
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
  },
  {
    id: 5,
    name: 'Apprentice',
    color: Castle,
    image: '/realm-troops/apprentice.png',
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 6,
    name: 'Archanist',
    color: Castle,
    image: '/realm-troops/archanist.png',
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 7,
    name: 'Solider',
    color: MageTower,
    image: '/realm-troops/soldier.png',
    description: description,
    strength: 'Cavalry',
    weakness: 'Magic',
  },
  {
    id: 8,
    name: 'Paladin',
    color: MageTower,
    image: '/realm-troops/paladin.png',
    description: description,
    strength: 'Cavalry',
    weakness: 'Magic',
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
    case BattalionIds.LongBow:
      name = 'Hunter';
      break;
    case BattalionIds.Mage:
      name = 'Apprentice';
      break;
    case BattalionIds.Archanist:
      name = 'Archanist';
      break;
    case BattalionIds.LightInfantry:
      name = 'Solider';
      break;
    case BattalionIds.HeavyInfantry:
      name = 'Paladin';
      break;
  }
  return name;
};

export const getUnitImage = (id: number) => {
  return battalionInformation.find((a) => a.id === id)?.image;
};
