import { useContract, useStarknetCall } from '@starknet-react/core';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import TowerDefenceStorage from '@/abi/minigame/02_TowerDefenceStorage.json';
import ElementsBalancer from '@/abi/minigame/04_Elements.json';
import { ElementToken } from '@/constants/index';
import {
  EFFECT_BASE_FACTOR,
  TOKEN_INDEX_OFFSET_BASE,
} from '@/util/minigameApi';

const useGameStats = (gameIdx: number, towerDefenceStorageAddr: string) => {
  const { contract: elementsContract } = useContract({
    abi: ElementsBalancer as Abi,
    address:
      // TODO(uni): Don't hard code this
      '0x38266cfd0a725682e5ad0a60abd038f3e9df45cbafbe452d6e6b1ac7c96e7b6',
  });

  const { contract: towerDefenceStorage } = useContract({
    abi: TowerDefenceStorage as Abi,
    address: towerDefenceStorageAddr,
  });

  const lightTokenId = (
    gameIdx * TOKEN_INDEX_OFFSET_BASE +
    ElementToken.Light
  ).toString();

  const darkTokenId = (
    gameIdx * TOKEN_INDEX_OFFSET_BASE +
    ElementToken.Dark
  ).toString();

  const totalLight = useStarknetCall<string[]>({
    contract: elementsContract,
    method: 'get_total_minted',
    args: [lightTokenId],
  });

  const totalLightUtilized = useStarknetCall<string[]>({
    contract: towerDefenceStorage,
    method: 'get_token_reward_pool',
    args: [gameIdx.toString(), lightTokenId],
  });

  const totalDark = useStarknetCall<string[]>({
    contract: elementsContract,
    method: 'get_total_minted',
    args: [darkTokenId],
  });

  const totalDarkUtilized = useStarknetCall<string[]>({
    contract: towerDefenceStorage,
    method: 'get_token_reward_pool',
    args: [gameIdx.toString(), darkTokenId],
  });

  const light = totalLight.data ? totalLight.data[0] : undefined;
  const dark = totalDark.data ? totalDark.data[0] : undefined;

  return {
    light: light ? toBN(light).toNumber() / EFFECT_BASE_FACTOR : undefined,
    lightUsed: totalLightUtilized.data
      ? toBN(totalLightUtilized.data[0]).toNumber()
      : undefined,
    dark: dark ? toBN(dark).toNumber() / EFFECT_BASE_FACTOR : undefined,
    darkUsed: totalDarkUtilized.data
      ? toBN(totalDarkUtilized.data[0]).toNumber()
      : undefined,
    loading: totalLight.loading || totalDark.loading,
  };
};

export default useGameStats;
