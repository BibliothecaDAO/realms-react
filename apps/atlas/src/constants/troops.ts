/* eslint-disable @typescript-eslint/naming-convention */

// Baseline square meter for building capacity calculations.
import { RealmBuildingId } from './buildings';

export const COMBAT_OUTCOME_ATTACKER_WINS = 1;
export const COMBAT_OUTCOME_DEFENDER_WINS = 2;

export enum TroopSlot {
  attacking = 1,
  defending = 2,
}

export enum Tiers {
  One = 1,
  Two = 2,
  Three = 3,
}

export enum TroopBuildings {
  Skirmisher = RealmBuildingId.ArcherTower,
  Pikeman = RealmBuildingId.Barracks,
  Ballista = RealmBuildingId.Castle,
  Apprentice = RealmBuildingId.MageTower,
  Longbow = RealmBuildingId.ArcherTower,
  Knight = RealmBuildingId.Barracks,
  Mangonel = RealmBuildingId.Castle,
  Mage = RealmBuildingId.MageTower,
  Crossbow = RealmBuildingId.ArcherTower,
  Paladin = RealmBuildingId.Barracks,
  Trebuchet = RealmBuildingId.Castle,
  Arcanist = RealmBuildingId.MageTower,
}

export enum TroopTier {
  Skirmisher = Tiers.One,
  Pikeman = Tiers.One,
  Ballista = Tiers.One,
  Apprentice = Tiers.One,
  Longbow = Tiers.Two,
  Knight = Tiers.Two,
  Mangonel = Tiers.Two,
  Mage = Tiers.Two,
  Crossbow = Tiers.Three,
  Paladin = Tiers.Three,
  Trebuchet = Tiers.Three,
  Arcanist = Tiers.Three,
}

export enum TroopIds {
  Skirmisher = 1,
  Pikeman = 4,
  Ballista = 7,
  Apprentice = 10,
  Longbow = 2,
  Knight = 5,
  Mangonel = 8,
  Mage = 11,
  Crossbow = 3,
  Paladin = 6,
  Trebuchet = 9,
  Arcanist = 12,
}

const Barracks = 'bg-red-600';
const ArcherTower = 'bg-yellow-600';
const Castle = 'bg-orange-600';
const MageTower = 'bg-purple-600';

export const troopList = [
  {
    name: 'Skirmisher',
    type: 'ranged',
    img: 'Skirmisher.png',
    troopId: TroopIds.Skirmisher,
    colour: ArcherTower,
    tier: TroopTier.Skirmisher,
    agility: 2,
    attack: 7,
    armor: 2,
    vitality: 53,
    wisdom: 2,
    buildingId: TroopBuildings.Skirmisher,
  },
  {
    name: 'Longbow',
    type: 'ranged',
    img: 'Longbow.png',
    tier: TroopTier.Longbow,
    troopId: TroopIds.Longbow,
    colour: ArcherTower,
    agility: 4,
    attack: 7,
    armor: 3,
    vitality: 53,
    wisdom: 3,
    buildingId: TroopBuildings.Longbow,
  },
  {
    name: 'Crossbow',
    type: 'ranged',
    img: 'Crossbow.png',
    tier: TroopTier.Crossbow,
    troopId: TroopIds.Crossbow,
    colour: ArcherTower,
    agility: 6,
    attack: 9,
    armor: 4,
    vitality: 53,
    wisdom: 4,
    buildingId: TroopBuildings.Crossbow,
  },
  {
    name: 'Pikeman',
    type: 'melee',
    img: 'Pikeman.png',
    tier: TroopTier.Pikeman,
    troopId: TroopIds.Pikeman,
    colour: Barracks,
    agility: 7,
    attack: 4,
    armor: 5,
    vitality: 53,
    wisdom: 1,
    buildingId: TroopBuildings.Pikeman,
  },

  {
    name: 'Knight',
    type: 'melee',
    img: 'Knight.png',
    tier: TroopTier.Knight,
    troopId: TroopIds.Knight,
    colour: Barracks,
    agility: 9,
    attack: 7,
    armor: 8,
    vitality: 79,
    wisdom: 2,
    buildingId: TroopBuildings.Knight,
  },
  {
    name: 'Paladin',
    type: 'melee',
    img: 'Paladin.png',
    tier: TroopTier.Paladin,
    troopId: TroopIds.Paladin,
    colour: Barracks,
    agility: 9,
    attack: 9,
    armor: 9,
    vitality: 106,
    wisdom: 3,
    buildingId: TroopBuildings.Paladin,
  },
  {
    name: 'Ballista',
    type: 'siege',
    img: 'Ballista.png',
    tier: TroopTier.Ballista,
    troopId: TroopIds.Ballista,
    colour: Castle,
    agility: 4,
    attack: 11,
    armor: 4,
    vitality: 53,
    wisdom: 2,
    buildingId: TroopBuildings.Ballista,
  },
  {
    name: 'Mangonel',
    type: 'siege',
    img: 'Mangonel.png',
    tier: TroopTier.Mangonel,
    troopId: TroopIds.Mangonel,
    colour: Castle,
    agility: 4,
    attack: 10,
    armor: 5,
    vitality: 53,
    wisdom: 3,
    buildingId: TroopBuildings.Mangonel,
  },
  {
    name: 'Trebuchet',
    type: 'siege',
    img: 'Trebuchet.png',
    tier: TroopTier.Trebuchet,
    troopId: TroopIds.Trebuchet,
    colour: Castle,
    agility: 4,
    attack: 12,
    armor: 6,
    vitality: 53,
    wisdom: 4,
    buildingId: TroopBuildings.Trebuchet,
  },
  {
    name: 'Apprentice',
    type: 'magic',
    img: 'Apprentice.png',
    tier: TroopTier.Apprentice,
    troopId: TroopIds.Apprentice,
    colour: MageTower,
    agility: 7,
    attack: 7,
    armor: 2,
    vitality: 53,
    wisdom: 8,
    buildingId: TroopBuildings.Apprentice,
  },
  {
    name: 'Mage',
    type: 'magic',
    img: 'Mage.png',
    tier: TroopTier.Mage,
    troopId: TroopIds.Mage,
    colour: MageTower,
    agility: 7,
    attack: 9,
    armor: 2,
    vitality: 53,
    wisdom: 9,
    buildingId: TroopBuildings.Mage,
  },
  {
    name: 'Arcanist',
    type: 'magic',
    img: 'Arcanist.png',
    tier: TroopTier.Arcanist,
    troopId: TroopIds.Arcanist,
    colour: MageTower,
    agility: 7,
    attack: 11,
    armor: 2,
    vitality: 53,
    wisdom: 10,
    buildingId: TroopBuildings.Arcanist,
  },
];
