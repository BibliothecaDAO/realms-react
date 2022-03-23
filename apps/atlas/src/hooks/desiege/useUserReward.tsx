import { useContract, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import type { Abi } from 'starknet';
import TowerDefenceStorageContract from '@/abi/minigame/02_TowerDefenceStorage.json';

import { useModuleAddress } from '../useModuleAddress';

const useUserReward = ({
  gameIdx,
  account,
  side,
}: {
  gameIdx?: number;
  account?: string;
  side: string;
}) => {
  const towerDefenceStorageAddr = useModuleAddress('2');

  const { contract } = useContract({
    address: towerDefenceStorageAddr,
    abi: TowerDefenceStorageContract as Abi,
  });

  const getUserReward = useStarknetCall({
    contract,
    method: 'get_user_reward_alloc',
    args:
      gameIdx && towerDefenceStorageAddr
        ? [gameIdx, account, side == 'light' ? 0 : 1]
        : undefined,
  });

  const alloc: BN | undefined = getUserReward.data
    ? getUserReward.data[0]
    : undefined;

  return {
    loading: getUserReward.loading,
    refresh: getUserReward.refresh,
    alloc,
  };
};

export default useUserReward;
