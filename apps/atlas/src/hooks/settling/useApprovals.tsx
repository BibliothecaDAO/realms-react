import {
  useStarknet,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import type { Contract } from 'starknet';
import { toBN, toFelt } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import {
  useLordsContract,
  useBuildingContract,
  useExchangeContract,
  useResources1155Contract,
  ModuleAddr as CM,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall } from '@/types/index';

export const queryKeys = {
  isApproved: (operator: any) => ['desiege', 'token-approval', operator],
};

const ALLOWANCE_AMOUNT = ethers.utils.parseUnits('999999999999999', 18);
const MIN_ALLOWANCE_AMOUNT = ethers.utils.parseUnits('1000', 18);

const createApprovalParams = (contractAddress: string) => {
  return {
    args: [
      toBN(contractAddress).toString(),
      bnToUint256(ALLOWANCE_AMOUNT.toString()),
    ],
  };
};

const createStarknetAllowanceCall = (
  lordsContract: any,
  account: string,
  contractAddress: string
) => {
  return {
    contract: lordsContract,
    method: 'allowance',
    args: [toBN(account).toString(), toBN(contractAddress).toString()],
    options: { watch: false },
  };
};

const useApprovalForContract = (contract: Contract) => {
  const { account } = useStarknet();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { contract: lordsContract } = useLordsContract();
  const approveLordsAction = useStarknetInvoke({
    contract: lordsContract,
    method: 'approve',
  });

  const {
    data: outputResult,
    loading: outputLoading,
    error: outputError,
    refresh: refreshApproval,
  } = useStarknetCall(
    createStarknetAllowanceCall(
      lordsContract,
      account as string,
      contract?.address as string
    )
  );

  useEffect(() => {
    if (!outputResult) return;
    setIsApproved(
      uint256ToBN(outputResult['remaining']) >=
        toBN(MIN_ALLOWANCE_AMOUNT.toString())
    );
  }, [outputResult]);

  return {
    isApproved,
    approveLords: () => {
      approveLordsAction.invoke(
        createApprovalParams(contract?.address as string)
      );
    },
  };
};

export const useApproveLordsForBuilding = () => {
  const { contract: buildingContract } = useBuildingContract();
  return useApprovalForContract(buildingContract as Contract);
};

export const useApproveLordsForExchange = () => {
  const { contract: exchangeContract } = useExchangeContract();
  return useApprovalForContract(exchangeContract as Contract);
};

export const useApproveResourcesForExchange = () => {
  const { account } = useStarknet();
  const { contract: exchangeContract } = useExchangeContract();
  const { contract: resourcesContract } = useResources1155Contract();
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const approveResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: 'setApprovalForAll',
  });

  const {
    data: outputResult,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'isApprovedForAll',
    args: [account as string, exchangeContract?.address.toString()],
  });

  useEffect(() => {
    if (!outputResult) return;
    setIsApproved(outputResult.toString() == '1');
  }, [outputResult]);

  const approveResources = () => {
    console.log(approveResourcesAction.error);
    approveResourcesAction.invoke({
      args: [toBN(exchangeContract?.address as string).toString(), toFelt(1)],
    });
  };

  return { isApproved, approveResources };
};

export const getApproveAllGameContracts = () => {
  const txs: RealmsCall[] = [];

  // Exchange approvals

  txs.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.Exchange).toString(), toFelt(1)],
    metadata: {
      title: 'Realm Resources Contract',
      description: 'Approve spending by Realms Exchange module',
    },
  });

  txs.push({
    contractAddress: CM.Lords,
    entrypoint: 'approve',
    calldata: [
      toBN(CM.Exchange).toString(),
      ALLOWANCE_AMOUNT.toString(),
      0, // Extra felt for uint256
    ],
    metadata: {
      title: 'Lords Contract',
      description: 'Approve spending by Realms Exchange module',
    },
  });

  txs.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.ResourceGame).toString(), toFelt(1)],
    metadata: {
      title: 'Realms Resources',
      description: 'Approve spending by Resource Game module',
    },
  });

  // Settling

  txs.push({
    contractAddress: CM.Realms,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.Settling).toString(), toFelt(1)],
    metadata: {
      title: 'Realms NFT',
      description: 'Approve spending by Settling module',
    },
  });

  // Buildings
  txs.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.Building).toString(), toFelt(1)],
    metadata: {
      title: 'Realms Resources Contract',
      description: 'Approve spending by Building module',
    },
  });

  // Combat

  txs.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.Combat).toString(), toFelt(1)],
    metadata: {
      title: 'Realm Resources Contract',
      description: 'Approve spending by Combat module',
    },
  });

  // Combat

  txs.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(CM.Food).toString(), toFelt(1)],
    metadata: {
      title: 'Food approval',
      description: 'Approve spending by Food Module',
    },
  });
  return txs;
};
