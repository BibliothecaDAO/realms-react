import { useContract } from '@starknet-react/core';

import type { Abi } from 'starknet';
import {
  Account,
  Contract,
  defaultProvider,
  ec,
  json,
  number,
  RpcProvider,
} from 'starknet';
import Nexus from '@/abi/nexus/SingleSidedStaking.json';
import Splitter from '@/abi/nexus/Splitter.json';
import Combat from '@/abi/settling/Combat.json';
import Exchange from '@/abi/settling/Exchange_ERC20_1155.json';
import Food from '@/abi/settling/Food.json';
import GoblinTown from '@/abi/settling/GoblinTown.json';
import Settling from '@/abi/settling/L01_Settling.json';
import Resources from '@/abi/settling/L02_Resources.json';
import Building from '@/abi/settling/L03_Building.json';
import Calculator from '@/abi/settling/L04_Calculator.json';
import Wonder from '@/abi/settling/L05_Wonders.json';
import Lords from '@/abi/settling/Lords_ERC20_Mintable.json';
import Realms721 from '@/abi/settling/Realms_ERC721_Mintable.json';
import Relics from '@/abi/settling/Relics.json';
import Resources1155 from '@/abi/settling/Resources_ERC1155_Mintable_Burnable.json';
import Travel from '@/abi/settling/Travel.json';

// Note: Can use process.env | static definition if needed
// Lords: process.env.LORDS_ADDR | "0x..."
export const ModuleAddr = {
  Lords: '0x0371e76cc9dc2cf151201e3fff62dc816636fe918e4c90604e9ed1369b7d1d5e',
  ResourceGame:
    '0x058d3a1a5fe490cdbfbb14c7a648142b3b7debb65747450b76f604c3c39f4cfe',
  Realms: '0x02ab849a3eaf4fd54f80e6dbe7a8d182646ec41684d1f1a4f718623bd8cb0695',
  StakedRealms:
    '0x016a1b978c62be5c30faa565f2086336126db3f120fbe61f368d8e07f289ef03',
  Settling:
    '0x007a29730cfaed96839660577c3b3019038862187b0865280b79e944c66ac215',
  Exchange:
    '0x042bf805eb946855cc55b1321a86cd4ece9904b2d15f50c47439af3166c7c5e2',
  ResourcesToken:
    '0x07080e87497f82ac814c6eaf91d66ac93672927a8c019014f05eb6d688ebd0fc',
  Building:
    '0x01c7a86cea8febe69d688dd5ffa361e7924f851db730f4256ed67fd805ea8aa7',
  Combat: '0x039f40b33de4d22b2c140fccbcf2092ccc24ebdb7ed985716b93f763ae5607e8',
  Wonder: '0x0096cae38dd01a1e381c9e57db09669298fa079cfdb45e1a429c4020a6515549',
  Nexus: '0x0259f9adda2c8a7e651d03472cb603ef2c69ae9a64fd3a553415d082ddbb3061',
  Splitter:
    '0x06a60b479e9fe080fd8e0a8c4965040a25e276889c2de0cf105c410d0ac81436',
  Food: '0x02d73a83afeaf5927c2dfb51b2412ea9dfe1fb6cd41b1b702607e7345ce47d09',
  Relics: '0x06052bf4631585f7074a118543121561d12cc910e0ab95b48039eab587e078d2',
  Calculator:
    '0x04f65c9451f333e0fbe33f912f470da360cf959ea0cefb85f0abef54fd3bb76c',
  Travel: '0x0415bda0925437cee1cd70c5782c65a5b1f5c72945c5204dbba71c6d69c8575a',
  StarkEthereum:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  GoblinTown:
    '0x00c358a31b8722845d44c98e428bd751f0d769bdaf14a3cb490c61dfd93e59fc',
};

/**
 * Load the Stark Ethereum Contract. This is an ERC20 Contract.
 * @returns The `StarkEthereum` contract or undefined.
 */
export function useGoblinTown() {
  return useContract({
    abi: GoblinTown as Abi,
    address: ModuleAddr.GoblinTown,
  });
}

/**
 * Load the Stark Ethereum Contract. This is an ERC20 Contract.
 * @returns The `StarkEthereum` contract or undefined.
 */
export function useStarkEthereum() {
  return useContract({
    abi: Lords as Abi,
    address: ModuleAddr.StarkEthereum,
  });
}

/**
 * Load the Travel contract.
 * @returns The `Travel` contract or undefined.
 */
export function useTravelContract() {
  return useContract({
    abi: Travel as Abi,
    address: ModuleAddr.Travel,
  });
}

/**
 * Load the Calculator contract.
 * @returns The `Calculator` contract or undefined.
 */
export function useCalculatorContract() {
  return useContract({
    abi: Calculator as Abi,
    address: ModuleAddr.Calculator,
  });
}

/**
 * Load the Food contract.
 * @returns The `Food` contract or undefined.
 */
export function useFoodContract() {
  return useContract({
    abi: Food as Abi,
    address: ModuleAddr.Food,
  });
}

/**
 * Load the Relic contract.
 * @returns The `Relic` contract or undefined.
 */
export function useRelicContract() {
  return useContract({
    abi: Relics as Abi,
    address: ModuleAddr.Relics,
  });
}

/**
 * Load the Nexus contract.
 * @returns The `Settling` contract or undefined.
 */
export function useNexusContract() {
  return useContract({
    abi: Nexus as Abi,
    address: ModuleAddr.Nexus,
  });
}

/**
 * Load the Splitter contract.
 * @returns The `Settling` contract or undefined.
 */
export function useSplitterContract() {
  return useContract({
    abi: Splitter as Abi,
    address: ModuleAddr.Splitter,
  });
}
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

const provider = new RpcProvider({
  nodeUrl: `https://starknet-goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
});

export function useJsonRpc() {
  const FoodContract = new Contract(Food as Abi, ModuleAddr.Food, provider);
  const CalculatorContract = new Contract(
    Calculator as Abi,
    ModuleAddr.Calculator,
    provider
  );

  return {
    FoodContract,
    CalculatorContract,
  };
}
