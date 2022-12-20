import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { number, uint256 } from 'starknet';
import { useBankContext } from '@/context/BankContext';
import { useCommandList } from '@/context/CommandListContext';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { soundSelector, useUiSounds } from '../useUiSounds';
import { ModuleAddr } from './stark-contracts';

export const Entrypoints = {
  lords_faucet: 'lords_faucet',
};

export const goblinTownCall: Record<string, (args: any) => CallAndMetadata> = {
  claim: ({ realmId }) => ({
    contractAddress: ModuleAddr.GoblinTown,
    entrypoint: Entrypoints.lords_faucet,
    calldata: uint256ToRawCalldata(uint256.bnToUint256(number.toBN(realmId))),
    metadata: { realmId, action: Entrypoints.lords_faucet },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.lords_faucet]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Attacking Goblins' : 'Attacking'}`,
    description: `Attacking Goblins on #${tx.metadata.realmId}.`,
  }),
};

export const useGoblinTowns = () => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useCommandList();

  return {
    claim: (realmId: number) => {
      play();
      txQueue.add(
        goblinTownCall.claim({
          realmId: realmId,
        })
      );
    },
    loading: false,
  };
};
