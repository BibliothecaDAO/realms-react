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
import Bastions from '@/abi/settling/Bastions.json';
import Combat from '@/abi/settling/Combat.json';
import Exchange from '@/abi/settling/Exchange_ERC20_1155.json';
import Food from '@/abi/settling/Food.json';
import GoblinTown from '@/abi/settling/GoblinTown.json';
import Settling from '@/abi/settling/L01_Settling.json';
import Resources from '@/abi/settling/L02_Resources.json';
import Building from '@/abi/settling/L03_Building.json';
import Calculator from '@/abi/settling/L04_Calculator.json';
import Wonder from '@/abi/settling/L05_Wonders.json';
import Labor from '@/abi/settling/Labor.json';
import Lords from '@/abi/settling/Lords_ERC20_Mintable.json';
import Realms721 from '@/abi/settling/Realms_ERC721_Mintable.json';
import Relics from '@/abi/settling/Relics.json';
import Resources1155 from '@/abi/settling/Resources_ERC1155_Mintable_Burnable.json';
import Travel from '@/abi/settling/Travel.json';
// Note: Can use process.env | static definition if needed
// Lords: process.env.LORDS_ADDR | "0x..."
export const ModuleAddr = {
  Lords: '0x0012c7b2514421e3c7c215287b7338fd6c59ae64d7b0be64a7887b9641f78c8f',
  ResourceGame:
    '0x054d2bdfd40648d6ee9b069a3cfeda69c76758f0f9f403bc8ce721ea2f0656df',
  Realms: '0x0797b22f293f1392eb03105f9d24df29212627c29abaaa3dc90856f02f437238',
  StakedRealms:
    '0x051aa62ad1adbfb44eddcd5901379cd383cbcbaa4fc403634603c4badf1105e1',
  Settling:
    '0x05db01dca6c5986b10b079b39b44ac312eb213d8081a29d83556cf93f98a0872',
  Exchange:
    '0x04c906be925dac8f1accbbd074adf9f7d23cfe208ca326bc9c05cf4a664bfee2',
  ResourcesToken:
    '0x0004d3180171dc5dd583762aaad99e50c17e27bf73a3e949a89a0db5bb628e40',
  Building:
    '0x02061529fcb9e9a1b2aa59b3b1f55f6e13b26643df76a865f00ad029e2c8afdf',
  Bastions:
    '0x01c21c4d9e15918f9585ccf02640ad2a86c0bc60c64771f6afb727c553ab417b',
  Combat: '0x07692e8a91e525e31b3fc8a7fc23bb0523a7dd401a72163ec5de8d5457b51d77',
  Wonder: '0x0096cae38dd01a1e381c9e57db09669298fa079cfdb45e1a429c4020a6515549',
  Nexus: '0x0259f9adda2c8a7e651d03472cb603ef2c69ae9a64fd3a553415d082ddbb3061',
  Splitter:
    '0x06a60b479e9fe080fd8e0a8c4965040a25e276889c2de0cf105c410d0ac81436',
  Food: '0x070548b78f808b68a5372b78dae2dc2570e1691fbf474bd3359d2c7731f2f901',
  Relics: '0x037fe6e8c6a10c56c451df766e5d89d9a539620f35d435ca8b5ba85f0a28333b',
  Calculator:
    '0x04d0973873380a3d92a3f65e2b649ac78e9afd7457ee033cbcb4e1eeaefc8ab8',
  Travel: '0x0593c3cf5559886c7243107581f0a67c083128c04532c51e75c74eafa78a0479',
  StarkEthereum:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  GoblinTown:
    '0x00c358a31b8722845d44c98e428bd751f0d769bdaf14a3cb490c61dfd93e59fc',
  Labor: '0x00c2a68871aa763c7827cbc8f3457f80fd4e27ddc7da3bc574f04a0342446216',
};

/**
 * Load the Labor Ethereum Contract. This is an ERC20 Contract.
 * @returns The `StarkEthereum` contract or undefined.
 */
export function useLabor() {
  return useContract({
    abi: Labor as Abi,
    address: ModuleAddr.Labor,
  });
}

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
 * Load the Realms Bastions contract.
 * @returns The `Bastions` contract or undefined.
 */
export function useBastionsContract() {
  return useContract({
    abi: Bastions as Abi,
    address: ModuleAddr.Bastions,
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

export async function getBlockNumber() {
  return provider.getBlockNumber();
}

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
