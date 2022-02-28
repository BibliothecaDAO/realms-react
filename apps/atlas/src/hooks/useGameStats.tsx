import { useContract, useStarknetCall } from '@starknet-react/core';
import { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import ElementsBalancer from '~/abi/minigame/04_Elements.json';
import TowerDefenceStorage from '~/abi/minigame/02_TowerDefenceStorage.json';
import { ElementToken } from '~/constants';
import {
  EFFECT_BASE_FACTOR,
  TOKEN_INDEX_OFFSET_BASE,
} from '~/util/minigameApi';

const useGameStats = (gameIdx: number, towerDefenceStorageAddr: string) => {
  const { contract: elementsContract } = useContract({
    abi: ElementsBalancer.abi as Abi[],
    address:
      '0x26fb3d6ae270ee3c2fedd8d6d0576b15edd6abe6afa93c9e847a306648e9e95',
  });

  const { contract: towerDefenceStorage } = useContract({
    abi: TowerDefenceStorage.abi as Abi[],
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

  const totalLight = useStarknetCall({
    contract: elementsContract,
    method: 'get_total_minted',
    args: {
      token_id: lightTokenId,
    },
  });

  const totalLightUtilized = useStarknetCall({
    contract: towerDefenceStorage,
    method: 'get_token_reward_pool',
    args: {
      game_idx: gameIdx.toString(),
      token_id: lightTokenId,
    },
  });

  const totalDark = useStarknetCall({
    contract: elementsContract,
    method: 'get_total_minted',
    args: {
      token_id: darkTokenId,
    },
  });

  const totalDarkUtilized = useStarknetCall({
    contract: towerDefenceStorage,
    method: 'get_token_reward_pool',
    args: {
      game_idx: gameIdx.toString(),
      token_id: darkTokenId,
    },
  });

  const light = totalLight.data
    ? (totalLight.data['total'] as string)
    : undefined;
  const dark = totalDark.data ? (totalDark.data['total'] as string) : undefined;

  return {
    light: light ? toBN(light).toNumber() / EFFECT_BASE_FACTOR : undefined,
    lightUsed: totalLightUtilized.data
      ? toBN(totalLightUtilized.data['value'] as string).toNumber()
      : undefined,
    dark: dark ? toBN(dark).toNumber() / EFFECT_BASE_FACTOR : undefined,
    darkUsed: totalDarkUtilized.data
      ? toBN(totalDarkUtilized.data['value'] as string).toNumber()
      : undefined,
    loading: totalLight.loading || totalDark.loading,
  };
};

export default useGameStats;
