import type { UseContract } from '@starknet-react/core';
import { useContract } from '@starknet-react/core';
import type { Abi } from 'starknet';

import Settling from '@/abi/settling/L01_Settling.json';
import Resources from '@/abi/settling/L02_Resources.json';
import Building from '@/abi/settling/L03_Building.json';
import Wonder from '@/abi/settling/L05_Wonders.json';
import Combat from '@/abi/settling/L06_Combat.json';
import Resources1155 from '@/abi/settling/Resources_ERC1155_Mintable_Burnable.json';

/**
 * Load the Realms Settling contract.
 * @returns The `Settling` contract or undefined.
 */
export function useSettlingContract(): UseContract {
  return useContract({
    abi: Settling as Abi,
    address:
      '0x062fa531fdfb05032c255431cfc9985e068c3a23fe097d419859013625e7a3ab',
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
      '0x066acbb4b47a627be57fef643b922fdb7522a971a4ce5b902fa6a3b71106869a',
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
      '0x04cca1baec31d699e6c8a84cc1c2ddec98f5c2d6cf2823f5aa13cde7d7df26f4',
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
      '0x0720e3f966182b5d901e562b6f6cac8e404f4701bbd97725db3a5652c0e70376',
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
      '0x0000000000000000000000000000000000000000000000000000000000000000',
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
      '0x073f484a7e9ea443933bb2a2b086f68bd11e4ade422640cebebac5fe3e41e2c9',
  });
}
