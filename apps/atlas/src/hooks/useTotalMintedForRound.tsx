import { useContract, useStarknetCall } from '@starknet-react/core';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import ElementsBalancer from '@/abi/minigame/04_Elements.json';
import { ElementToken } from '@/constants/index';
import {
  EFFECT_BASE_FACTOR,
  TOKEN_INDEX_OFFSET_BASE,
} from '@/util/minigameApi';

const useTotalMintedForRound = (gameIdx: number) => {
  const { contract: elementsContract } = useContract({
    abi: ElementsBalancer.abi as Abi[],
    address:
      '0x26fb3d6ae270ee3c2fedd8d6d0576b15edd6abe6afa93c9e847a306648e9e95',
  });
  const totalLight = useStarknetCall({
    contract: elementsContract,
    method: 'get_total_minted',
    args: {
      token_id: (
        gameIdx * TOKEN_INDEX_OFFSET_BASE +
        ElementToken.Light
      ).toString(),
    },
  });

  const totalDark = useStarknetCall({
    contract: elementsContract,
    method: 'get_total_minted',
    args: {
      token_id: (
        gameIdx * TOKEN_INDEX_OFFSET_BASE +
        ElementToken.Dark
      ).toString(),
    },
  });

  const light = totalLight.data
    ? (totalLight.data['total'] as string)
    : undefined;
  const dark = totalDark.data ? (totalDark.data['total'] as string) : undefined;

  return {
    light: light ? toBN(light).toNumber() / EFFECT_BASE_FACTOR : undefined,
    dark: dark ? toBN(dark).toNumber() / EFFECT_BASE_FACTOR : undefined,
    loading: totalLight.loading || totalDark.loading,
  };
};

export default useTotalMintedForRound;
