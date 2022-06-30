import {
  useStarknet,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import type { Call, Contract } from 'starknet';
import { toBN, toFelt } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';

import { useTransactionQueue } from '@/context/TransactionQueueContext';
import {
  useLordsContract,
  useBuildingContract,
  useExchangeContract,
  useResources1155Contract,
  useSettlingContract,
  useRealms721Contract,
  LordsContractAddress,
  RealmsContractAddress,
  ExchangeContractAddress,
  Resources1155ContractAddress,
  BuildingContractAddress,
  ResourceGameContractAddress,
  SettlingContractAddress,
  CombatContractAddress,
  StakedRealmsContractAddress,
} from '@/hooks/settling/stark-contracts';

export const queryKeys = {
  isApproved: (operator: any) => ['desiege', 'token-approval', operator],
};

const ALLOWANCE_AMOUNT = ethers.utils.parseUnits('999999999999999', 18);

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
  } = useStarknetCall(
    createStarknetAllowanceCall(
      lordsContract,
      account as string,
      contract?.address as string
    )
  );

  useEffect(() => {
    if (!outputResult) return;
    console.log(outputResult);
    setIsApproved(
      uint256ToBN(outputResult['remaining']) >=
        toBN(ALLOWANCE_AMOUNT.toString())
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
    console.log(outputResult.toString() == '1');
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
  const txs: Call[] = [];

  // ERC-20 approvals
  txs.push({
    contractAddress: LordsContractAddress,
    entrypoint: 'approve',
    calldata: [
      toBN(BuildingContractAddress).toString(),
      ALLOWANCE_AMOUNT.toString(),
      0, // Extra felt for uint256
    ],
  });
  txs.push({
    contractAddress: LordsContractAddress,
    entrypoint: 'approve',
    calldata: [
      toBN(ExchangeContractAddress).toString(),
      ALLOWANCE_AMOUNT.toString(),
      0, // Extra felt for uint256
    ],
  });

  // ERC-1155 approvals

  txs.push({
    contractAddress: Resources1155ContractAddress,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(ExchangeContractAddress).toString(), toFelt(1)],
  });

  // Game approvals
  txs.push({
    contractAddress: RealmsContractAddress,
    entrypoint: 'setApprovalForAll',
    calldata: [toBN(SettlingContractAddress).toString(), toFelt(1)],
  });

  return txs;
};
