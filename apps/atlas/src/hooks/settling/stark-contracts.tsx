import type { UseContract } from '@starknet-react/core';
import { useContract } from '@starknet-react/core';
import type { Abi } from 'starknet';

import Settling from '@/abi/settling/L01_Settling.json';
import Resources from '@/abi/settling/L02_Resources.json';
import Building from '@/abi/settling/L03_Building.json';
import Wonder from '@/abi/settling/L05_Wonders.json';
import Combat from '@/abi/settling/L06_Combat.json';
import Realms721 from '@/abi/settling/Realms_ERC721_Mintable.json';
import Resources1155 from '@/abi/settling/Resources_ERC1155_Mintable_Burnable.json';

/**
 * Load the Realms Settling contract.
 * @returns The `Settling` contract or undefined.
 */
export function useSettlingContract(): UseContract {
  return useContract({
    abi: Settling as Abi,
    address:
      '0x077b2a96db5fb49200f11155f6c2b1f5c0e697fb62d6b2c290592a1cb0ad0356',
  });
}
/**
 * Load the Realms Resources contract.
 * @returns The `Resources` contract or undefined.
 */
export function useResourcesContract(): UseContract {
  return useContract({
    abi: Resources as Abi,
    address:
      '0x04a29535b95b85aca744a0b1bcc2faa1972f0769db1ec10780bb7c01ce3fe8fd',
  });
}

/**
 * Load the Realms Buildings contract.
 * @returns The `Buildings` contract or undefined.
 */
export function useBuildingContract(): UseContract {
  return useContract({
    abi: Building as Abi,
    address:
      '0x04d2078fade1855b48ad11d711d11afa107f050637572eecbab244a4cd7f35cc',
  });
}

/**
 * Load the Realms Wonder contract.
 * @returns The `Wonder` contract or undefined.
 */
export function useWonderContract(): UseContract {
  return useContract({
    abi: Wonder as Abi,
    address:
      '0x05c292e4f4ea5ab160647ef2ce002e702f149af7370774839c0822a6c9b29361',
  });
}

/**
 * Load the Realms Combat contract.
 * @returns The `Combat` contract or undefined.
 */
export function useCombatContract(): UseContract {
  return useContract({
    abi: Combat as Abi,
    address:
      '0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9',
  });
}

/**
 * Load the Realms Resources 1155 contract.
 * @returns The `Resources` contract or undefined.
 */
export function useResources1155Contract(): UseContract {
  return useContract({
    abi: Resources1155 as Abi,
    address:
      '0x043f4c6a92250cda1e297988840dff5506d8f8cef4cabe2e48bd4b4718bf4a70',
  });
}
/**
 * Load the Realms Resources 721 contract.
 * @returns The `Realms` contract or undefined.
 */
export function useRealms721Contract(): UseContract {
  return useContract({
    abi: Realms721 as Abi,
    address:
      '0x0741568eef7e69072fac5ac490ef2dca278fe75898814326fc37b0c6b36e94e0',
  });
}
