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

const image = '/stableai/paladin.jpeg';

const description =
  'Paladins are the most loyal and talented horseback riders that exist. With their superior horsemanship skills, they are able to wield a lance or polearm effectively with just one hand, allowing them to use their other hand to carry a shield or sheathe a weapon.';

export const battalionInformation = [
  {
    id: 1,
    color: Barracks,
    image: '/stableai/knight.jpeg',
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 2,
    color: Barracks,
    image: image,
    description: description,
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 3,
    color: ArcherTower,
    image: '/stableai/archer.jpeg',
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
  },
  {
    id: 4,
    color: ArcherTower,
    image: '/stableai/archer.jpeg',
    description: description,
    strength: 'Magic',
    weakness: 'Cavalary',
  },
  {
    id: 5,
    color: Castle,
    image: '/stableai/apprentice.png',
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 6,
    color: Castle,
    image: '/stableai/archanist.png',
    description: description,
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 7,
    color: MageTower,
    image: '/stableai/light-infantry.png',
    description: description,
    strength: 'Cavalary',
    weakness: 'Magic',
  },
  {
    id: 8,
    color: MageTower,
    image: '/stableai/light-infantry.png',
    description: description,
    strength: 'Cavalary',
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
