import {
  useAccount,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toFelt } from 'starknet/utils/number';
import { useCommandList } from '@/context/CommandListContext';
import {
  useSettlingContract,
  useRealms721Contract,
  ModuleAddr,
} from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
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
  approve: 'approve',
};

export const createSettlingCall: Record<
  string,
  (args: any) => CallAndMetadata
> = {
  settle: ({ realmId }) => ({
    contractAddress: ModuleAddr.Settling,
    entrypoint: Entrypoints.settle,
    calldata: uint256ToRawCalldata(bnToUint256(realmId)),
    metadata: { realmId, action: Entrypoints.settle },
  }),
  approve: ({ quantity }) => ({
    contractAddress: ModuleAddr.StarkEthereum,
    entrypoint: Entrypoints.approve,
    calldata: [toBN(ModuleAddr.Realms).toString(), quantity, 0],
    metadata: { quantity, action: Entrypoints.approve },
  }),
  mint: ({ account }) => ({
    contractAddress: ModuleAddr.Realms,
    entrypoint: Entrypoints.mint,
    calldata: [account],
    metadata: { action: Entrypoints.mint },
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
    description: `Minting Realms.`,
  }),
  approve: (tx, ctx) => ({
    title: 'Approving Eth for Sale',
    description: `Approving Eth for Sale`,
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
  const { address } = useAccount();
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
      toBN(address as string).toString(),
      toBN(settlingContract?.address as string).toString(),
    ],
  });

  const txQueue = useCommandList();

  useEffect(() => {
    if (realmsApprovalData !== undefined && address !== undefined) {
      // console.log(realmsApprovalData.toString());
      setIsRealmsApproved(
        realmsApprovalData.toString() === '1' ? 'approved' : 'not-approved'
      );
    }
  }, [realmsApprovalData, address]);

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
    mintRealm: (quantity: number) => {
      txQueue.add(
        createSettlingCall.approve({
          quantity: (quantity * 10000000000000000).toString(),
        })
      );
      // loop through and mint
      for (let i = 0; i < quantity; i++) {
        txQueue.add(
          createSettlingCall.mint({
            account: toBN(address as string).toString(),
          })
        );
      }
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
