/* eslint-disable @typescript-eslint/naming-convention */

export const COMBAT_OUTCOME_ATTACKER_WINS = 1;
export const COMBAT_OUTCOME_DEFENDER_WINS = 2;

export enum TroopSlot {
  attacking = 1,
  defending = 2,
}

const Barracks = 'bg-red-600';
const ArcherTower = 'bg-yellow-600';
const Castle = 'bg-orange-600';
const MageTower = 'bg-purple-600';

const image = '/stableai/paladin.jpeg';

export const battalionInformation = [
  {
    id: 1,
    color: Barracks,
    image: image,
    description: '1',
    strength: '',
  },
  {
    id: 2,
    color: Barracks,
    image: image,
    description: '2',
  },
  {
    id: 3,
    color: ArcherTower,
    image: image,
    description: '3',
  },
  {
    id: 4,
    color: ArcherTower,
    image: image,
    description: '4',
  },
  {
    id: 5,
    color: Castle,
    image: image,
    description: '5',
  },
  {
    id: 6,
    color: Castle,
    image: image,
    description: '6',
  },
  {
    id: 7,
    color: MageTower,
    image: image,
    description: '7',
  },
  {
    id: 8,
    color: MageTower,
    image: image,
    description: '8',
  },
];
