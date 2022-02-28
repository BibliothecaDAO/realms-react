import type React from 'react';
export type GameStatus = 'active' | 'completed' | 'expired';

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

export interface Data {
  realm: Realm;
}
export interface CryptData {
  dungeon: Crypt;
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

export interface WalletRealmsData {
  realms: Realm[];
  bridgedRealms: Realm[];
  wallet: Owner;
}

export interface WalletCryptsData {
  dungeons: Crypt[];
}

export interface UiState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface TowerProps {
  gameStatus: GameStatus;
  gameIdx?: number;
  currentBoostBips?: number;
  children?: React.ReactNode[] | React.ReactNode;
}

export interface RealmFilters {
  address?: string;
  resources?: number[];
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
  '2xl': string;
}

export interface CryptFilters {
  address?: string;
  first?: number;
  skip?: number;
}
