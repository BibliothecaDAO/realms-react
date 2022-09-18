/* eslint-disable @typescript-eslint/naming-convention */

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

export const battalionInformation = [
  {
    id: 1,
    color: Barracks,
    image: '/stableai/knight.jpeg',
    description:
      'Paladins are the most loyal and talented horseback riders that exist. With their superior horsemanship skills, they are able to wield a lance or polearm effectively with just one hand, allowing them to use their other hand to carry a shield or sheathe a weapon. As well as being proficient with most weapons and protective armor, Paladins are also highly skilled at defensive maneuvers while mounted.',
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 2,
    color: Barracks,
    image: image,
    description: '2',
    strength: 'Archers',
    weakness: 'Infantry',
  },
  {
    id: 3,
    color: ArcherTower,
    image: image,
    description: '3',
    strength: 'Magic',
    weakness: 'Calvary',
  },
  {
    id: 4,
    color: ArcherTower,
    image: image,
    description: '4',
    strength: 'Magic',
    weakness: 'Calvary',
  },
  {
    id: 5,
    color: Castle,
    image: image,
    description: '5',
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 6,
    color: Castle,
    image: image,
    description: '6',
    strength: 'Infantry',
    weakness: 'Archers',
  },
  {
    id: 7,
    color: MageTower,
    image: '/stableai/mage.jpeg',
    description: '7',
    strength: 'Calvary',
    weakness: 'Magic',
  },
  {
    id: 8,
    color: MageTower,
    image: '/stableai/apprentice.jpeg',
    description: '8',
    strength: 'Calvary',
    weakness: 'Magic',
  },
];
