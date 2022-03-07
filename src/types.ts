import React from "react";
import { MouseEventHandler } from "react";
export type GameStatus = "active" | "completed" | "expired";

interface Owner {
  address: string;
  realmsHeld: number;
  bridgedRealmsHeld: number;
}

export interface Realm {
  id: string;
  resourceIds: Array<string>;
  order: string;
  wonder: string;
  cities: number;
  harbours: number;
  rivers: number;
  regions: number;
  name: string;
  rarityScore: number;
  rarityRank: number;
  currentOwner: Owner;
}

export interface Crypt {
  id: string;
  size: number;
  environment: number;
  numDoors: number;
  numPoints: number;
  name: string;
  svg: string;
  currentOwner: Owner;
}
export interface Loot {
  id: string;
  chest: string;
  foot: string;
  hand: string;
  head: string;
  neck: string;
  ring: string;
  waist: string;
  weapon: string;
  chestSuffixId: number;
  footSuffixId: number;
  handSuffixId: number;
  headSuffixId: number;
  neckSuffixId: number;
  ringSuffixId: number;
  waistSuffixId: number;
  weaponSuffixId: number;
  currentOwner: Owner;
  minted: number;
  manasClaimed: number;
  itemsClaimed: Boolean;
}
export interface Data {
  realm: Realm;
}
export interface CryptData {
  dungeon: Crypt;
}
export interface LootData {
  bag: Loot;
}
export interface RealmProps {
  realm: Realm;
  loading: boolean;
  size?: any;
  onClick?: (event: any, id: number) => void;
}
export interface CryptProps {
  crypt: Crypt;
  loading: boolean;
  size?: any;
  onClick?: (event: any, id: number) => void;
  flyto?: boolean;
}
export interface LootProps {
  loot: Loot;
  loading: boolean;
  size?: any;
  onClick?: (event: any, id: number) => void;
  flyto?: boolean;
}

export interface WalletRealmsData {
  realms: Realm[];
  bridgedRealms: Realm[]
  wallet: Owner;
}

export interface WalletCryptsData {
  dungeons: Crypt[]
}

export interface UiState {
  isMenuOpen: boolean;
  toggleMenu: Function;
}

export interface RealmFilters {
  address?: string;
  resources?: number[]
  orders?: string[];
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: string;
}

export interface Queries {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface CryptFilters {
  address?: string;
  first?: number;
  skip?: number;
}