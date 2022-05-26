import {
  useStarknet,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';

import {
  useResources1155Contract,
  useLordsContract,
  useBuildingContract,
} from '@/hooks/settling/stark-contracts';

export const queryKeys = {
  isApproved: (operator: any) => ['desiege', 'token-approval', operator],
};

const useApprovals = () => {
  const { account } = useStarknet();

  const [is1155TokenApproved, setIs1155TokenApproved] = useState<
    'approved' | 'not-approved'
  >();

  const { contract: lordsContract } = useLordsContract();
  const { contract: buildingContract } = useBuildingContract();

  const approveLordsAction = useStarknetInvoke({
    contract: lordsContract,
    method: 'approve',
  });

  const {
    data: lordsData,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: lordsContract,
    method: 'allowance',
    args: [
      toBN(account as string).toString(),
      toBN(buildingContract?.address as string).toString(),
    ],
  });

  return {
    approvalStatus: is1155TokenApproved,
    lordsApproval:
      lordsData &&
      uint256ToBN(lordsData['remaining']) >=
        toBN(ethers.utils.parseUnits('999999999999999', 18).toString())
        ? 'approved'
        : 'not-approved',
    approveLords: () => {
      approveLordsAction.invoke({
        args: [
          toBN(buildingContract?.address as string).toString(),
          bnToUint256(
            ethers.utils.parseUnits('999999999999999', 18).toString()
          ),
        ],
      });
    },
  };
};

export default useApprovals;
