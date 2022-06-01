import {
  useStarknet,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import type { Contract } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';

import {
  useLordsContract,
  useBuildingContract,
  useExchangeContract,
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
  const { contract: lordsContract } = useLordsContract();
  return useApprovalForContract(lordsContract as Contract);
};