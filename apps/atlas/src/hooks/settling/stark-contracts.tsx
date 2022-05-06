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
      '0x07416e6b5d7470a75ffe1eb7a3b6aa6174a4bec2d8598cddfc3a9c7d2d9457bc',
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
      '0x04603ff9190233c0b7b52844b31c5f3f028dd906f5be1bab164d8d7ca144aa9a',
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
      '0x07f2efce72148758611e132e72f3ba36b5be28081d7f742df96f1d0295e3fa29',
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
      '0x061a93b3e16efee381e7cd1532893bf79c4812d217548576900bb236a182b539',
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
      '0x01f1a7ce51bfd55b74c00cab5113a70f673c5a5cd47e6bc60a8879e69ec8ea1c',
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
