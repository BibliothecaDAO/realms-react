import { useContract } from '@starknet-react/core';
import type { Abi } from 'starknet';

import Exchange from '@/abi/settling/Exchange_ERC20_1155.json';
import Settling from '@/abi/settling/L01_Settling.json';
import Resources from '@/abi/settling/L02_Resources.json';
import Building from '@/abi/settling/L03_Building.json';
import Wonder from '@/abi/settling/L05_Wonders.json';
import Combat from '@/abi/settling/L06_Combat.json';
import Lords from '@/abi/settling/Lords_ERC20_Mintable.json';
import Realms721 from '@/abi/settling/Realms_ERC721_Mintable.json';
import Resources1155 from '@/abi/settling/Resources_ERC1155_Mintable_Burnable.json';

// Note: Can use process.env | static definition if needed
// Lords: process.env.LORDS_ADDR | "0x..."
export const ModuleAddr = {
  Lords: '0x0448549cccff35dc6d5df90efceda3123e4cec9fa2faff21d392c4a92e95493c',
  ResourceGame:
    '0x04a29535b95b85aca744a0b1bcc2faa1972f0769db1ec10780bb7c01ce3fe8fd',
  Realms: '0x0741568eef7e69072fac5ac490ef2dca278fe75898814326fc37b0c6b36e94e0',
  StakedRealms:
    '0x007235420ad11fa85b9e9837fb03a0b42a56cc930dd51a9aadbb5ad229eabe77',
  Settling:
    '0x077b2a96db5fb49200f11155f6c2b1f5c0e697fb62d6b2c290592a1cb0ad0356',
  Exchange:
    '0x015eba242880374267dc54900b7d569a964fcd8d251a2edfb66a4ec9a78eaedc',
  ResourcesToken:
    '0x07144f39e676656e81d482dc2cc9f68c98d768fe1beaad28438b43142cc9ff9e',
  Building:
    '0x04d2078fade1855b48ad11d711d11afa107f050637572eecbab244a4cd7f35cc',
  Combat: '0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9',
  Wonder: '0x05c292e4f4ea5ab160647ef2ce002e702f149af7370774839c0822a6c9b29361',
};

/**
 * Load the Realms Settling contract.
 * @returns The `Settling` contract or undefined.
 */
export function useSettlingContract() {
  return useContract({
    abi: Settling as Abi,
    address: ModuleAddr.Settling,
  });
}
/**
 * Load the Realms Resources contract.
 * @returns The `Resources` contract or undefined.
 */
export function useResourcesContract() {
  return useContract({
    abi: Resources as Abi,
    address: ModuleAddr.ResourceGame,
  });
}

/**
 * Load the Realms Buildings contract.
 * @returns The `Buildings` contract or undefined.
 */
export function useBuildingContract() {
  return useContract({
    abi: Building as Abi,
    address: ModuleAddr.Building,
  });
}

/**
 * Load the Realms Wonder contract.
 * @returns The `Wonder` contract or undefined.
 */
export function useWonderContract() {
  return useContract({
    abi: Wonder as Abi,
    address: ModuleAddr.Wonder,
  });
}

/**
 * Load the Realms Combat contract.
 * @returns The `Combat` contract or undefined.
 */
export function useCombatContract() {
  return useContract({
    abi: Combat as Abi,
    address: ModuleAddr.Combat,
  });
}

/**
 * Load the Realms Resources ERC1155 contract.
 * @returns The `Resources` contract or undefined.
 */
export function useResources1155Contract() {
  return useContract({
    abi: Resources1155 as Abi,
    address: ModuleAddr.ResourcesToken,
  });
}

/**
 * Load the Lords ERC20 contract.
 * @returns The `Resources` contract or undefined.
 */
export function useLordsContract() {
  return useContract({
    abi: Lords as Abi,
    address: ModuleAddr.Lords,
  });
}
/**
 * Load the Realms Resources ERC721 contract.
 * @returns The `Realms` contract or undefined.
 */
export function useRealms721Contract() {
  return useContract({
    abi: Realms721 as Abi,
    address: ModuleAddr.Realms,
  });
}

/**
 * Load the Exchange ERC20_1155 contract.
 * @returns The `Exchange` contract or undefined.
 */
export function useExchangeContract() {
  return useContract({
    abi: Exchange as Abi,
    address: ModuleAddr.Exchange,
  });
}
