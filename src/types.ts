export type GameStatus = "active" | "completed" | "expired";

interface Owner {
    address: string;
    realmsHeld: Number;
    bridgedRealmsHeld: Number;
}

export interface Realm {
    id: String;
    resourceIds: Array<String>;
    order: String;
    wonder: String;
    cities: Number;
    harbours: Number;
    rivers: Number;
    regions: Number;
    name: String;
    rarityScore: Number;
    rarityRank: Number;
    currentOwner: Owner;
}

export interface Data {
    realm: Realm;
}

export interface RealmProps {
    data: Data;
    loading: boolean;
}

export interface UiState {
    isMenuOpen: boolean;
    toggleMenu: Function;
  }

export interface TowerProps {
    gameStatus: GameStatus;
    gameIdx?: number;
    currentBoostBips?: number;
  }
  