import {
  useContract,
  useStarknet,
  useStarknetInvoke,
} from '@starknet-react/core';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import Elements1155Abi from '@/abi/minigame/ERC1155_Mintable_Ownable.json';

import { ELEMENTS_ADDRESS, getIsApprovedForAll } from '@/util/minigameApi';
import { useModuleAddress } from '../useModuleAddress';
import useTxCallback from '../useTxCallback';

export const queryKeys = {
  isApproved: (operator: any) => ['desiege', 'token-approval', operator],
};

const use1155Approval = () => {
  const { account } = useStarknet();

  const [is1155TokenApproved, setIs1155TokenApproved] = useState<
    'approved' | 'not-approved'
  >();
  const towerDefenceContractAddress = useModuleAddress('1');

  const { contract: elementsContract } = useContract({
    abi: Elements1155Abi as Abi,
    address: ELEMENTS_ADDRESS,
  });
  const approve1155 = useStarknetInvoke({
    contract: elementsContract,
    method: 'setApprovalForAll',
  });

  const approval = useQuery(
    queryKeys.isApproved(towerDefenceContractAddress.data as string),
    () => {
      return getIsApprovedForAll(
        account as string,
        towerDefenceContractAddress.data as string
      );
    },
    {
      enabled:
        towerDefenceContractAddress.data !== undefined && account !== undefined,
      staleTime: Infinity, // never consider this stale
    }
  );

  useEffect(() => {
    if (approval.data !== undefined && account !== undefined) {
      setIs1155TokenApproved(approval.data ? 'approved' : 'not-approved');
    }
  }, [approval.data]);

  const queryClient = useQueryClient();

  const approveTracker = useTxCallback(approve1155.data, () => {
    queryClient.invalidateQueries(
      queryKeys.isApproved(towerDefenceContractAddress.data)
    );
  });

  return {
    approvalStatus: is1155TokenApproved,
    isApproving: approveTracker.loading,
    invoke: () => {
      approve1155.invoke({
        args: [
          toBN(towerDefenceContractAddress.data as string).toString(),
          '1',
        ],
      });
    },
  };
};

export default use1155Approval;
