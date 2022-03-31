import { useContract, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import TowerDefenceStorageContract from '@/abi/minigame/02_TowerDefenceStorage.json';

import { useModuleAddress } from '../useModuleAddress';

const useUserReward = ({
  gameIdx,
  account,
}: {
  gameIdx?: number;
  account?: string;
}) => {
  const towerDefenceStorageAddr = useModuleAddress('2');

  const { contract } = useContract({
    address: towerDefenceStorageAddr,
    abi: TowerDefenceStorageContract as Abi,
  });

  const getMainHealth = useStarknetCall({
    contract,
    method: 'get_main_health',
    args: gameIdx !== undefined ? [gameIdx] : undefined,
  });

  const gameFinalHealth: BN | undefined = getMainHealth.data
    ? getMainHealth.data[0]
    : undefined;
  let gameWinningSide: string | undefined;
  if (gameFinalHealth && gameFinalHealth.toNumber() > 0) {
    gameWinningSide = 'light';
  } else {
    gameWinningSide = 'dark';
  }

  const getUserReward = useStarknetCall({
    contract,
    method: 'get_user_reward_alloc',
    args:
      gameIdx !== undefined &&
      account &&
      towerDefenceStorageAddr &&
      gameWinningSide
        ? [gameIdx, account, gameWinningSide == 'light' ? 0 : 1]
        : undefined,
  });

  const alloc: BN | undefined = getUserReward.data
    ? getUserReward.data[0]
    : undefined;

  return {
    loading: getUserReward.loading || getMainHealth.loading,
    alloc,
  };
};

export default useUserReward;
