export type GameStatus = "active" | "completed" | "expired";

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
