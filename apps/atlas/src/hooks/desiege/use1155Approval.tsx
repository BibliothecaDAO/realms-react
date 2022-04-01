import {
  useContract,
  useStarknet,
  useStarknetInvoke,
} from '@starknet-react/core';
import { useCallback, useState, useEffect } from 'react';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import Elements1155Abi from '@/abi/minigame/ERC1155_Mintable_Ownable.json';

import { ELEMENTS_ADDRESS, getIsApprovedForAll } from '@/util/minigameApi';
import { useModuleAddress } from '../useModuleAddress';
import useTxCallback from '../useTxCallback';

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

  const getIsApproved = useCallback(
    async (account: string, operator: string) => {
      try {
        const isApproved = await getIsApprovedForAll(account, operator);
        setIs1155TokenApproved(isApproved ? 'approved' : 'not-approved');
      } catch (e) {
        // TODO: Handle error
        console.error('Error fetching token approval', e);
      }
    },
    [account]
  );

  const approveTracker = useTxCallback(approve1155.data, () => {
    getIsApproved(
      account as string,
      towerDefenceContractAddress.data as string
    );
  });

  useEffect(() => {
    if (
      is1155TokenApproved == undefined &&
      account !== undefined &&
      towerDefenceContractAddress.data !== undefined
    ) {
      getIsApproved(account, towerDefenceContractAddress.data as string);
    }
  }, [account]);

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
