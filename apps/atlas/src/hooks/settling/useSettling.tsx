import {
  useStarknet,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import {
  useSettlingContract,
  useRealms721Contract,
  ModuleAddr,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall, RealmsTransactionRenderConfig } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

type Settling = {
  isRealmsApproved: 'approved' | 'not-approved' | undefined;
  approveRealms: () => void;
  settleRealm: (tokenId: number) => void;
  unsettleRealm: (tokenId: number) => void;
  mintRealm: (tokenId: number) => void;
};

export const Entrypoints = {
  settle: 'settle',
  unsettle: 'unsettle',
  mint: 'mint',
};

export const createSettlingCall: Record<string, (args: any) => RealmsCall> = {
  settle: ({ realmId }) => ({
    contractAddress: ModuleAddr.Settling,
    entrypoint: Entrypoints.settle,
    calldata: uint256ToRawCalldata(bnToUint256(realmId)),
    metadata: { realmId, action: Entrypoints.settle },
  }),
  mint: ({ account, realmId }) => ({
    contractAddress: ModuleAddr.Realms,
    entrypoint: Entrypoints.mint,
    calldata: [account, ...uint256ToRawCalldata(bnToUint256(realmId))],
    metadata: { realmId, action: Entrypoints.mint },
  }),
  unsettle: ({ realmId }) => ({
    contractAddress: ModuleAddr.Settling,
    entrypoint: Entrypoints.unsettle,
    calldata: uint256ToRawCalldata(bnToUint256(realmId)),
    metadata: { realmId, action: Entrypoints.unsettle },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  mint: (tx, ctx) => ({
    title: 'Minting',
    description: `Terraforming Realm #${tx.metadata.realmId}.`,
  }),
  settle: (tx, ctx) => ({
    title: 'Settling',
    description: `Realm #${tx.metadata.realmId} is being populated.`,
  }),
  unsettle: (tx, ctx) => ({
    title: 'Unsettling',
    description: `Abandoning Realm #${tx.metadata.realmId}.`,
  }),
};

const useSettling = (): Settling => {
  const { contract: settlingContract } = useSettlingContract();
  const { contract: realmsContract } = useRealms721Contract();
  const { account } = useStarknet();
  const [isRealmsApproved, setIsRealmsApproved] = useState<
    'approved' | 'not-approved'
  >();

  const approve721 = useStarknetInvoke({
    contract: realmsContract,
    method: 'setApprovalForAll',
  });

  const {
    data: realmsApprovalData,
    loading,
    error,
  } = useStarknetCall({
    contract: realmsContract,
    method: 'isApprovedForAll',
    args: [
      toBN(account as string).toString(),
      toBN(settlingContract?.address as string).toString(),
    ],
  });

  const txQueue = useTransactionQueue();

  useEffect(() => {
    if (realmsApprovalData !== undefined && account !== undefined) {
      // console.log(realmsApprovalData.toString());
      setIsRealmsApproved(
        realmsApprovalData.toString() === '1' ? 'approved' : 'not-approved'
      );
    }
  }, [realmsApprovalData, account]);

  return {
    settleRealm: (realmId: number) => {
      txQueue.add(
        createSettlingCall.settle({
          realmId: realmId,
        })
      );
    },
    unsettleRealm: (realmId: number) => {
      txQueue.add(
        createSettlingCall.unsettle({
          realmId: realmId,
        })
      );
    },
    mintRealm: (realmId: number) => {
      txQueue.add(
        createSettlingCall.mint({
          account: toBN(account as string).toString(),
          realmId: realmId,
        })
      );
    },
    isRealmsApproved,
    approveRealms: () => {
      approve721.invoke({
        args: [toBN(settlingContract?.address as string).toString(), '1'],
      });
    },
  };
};

export default useSettling;
