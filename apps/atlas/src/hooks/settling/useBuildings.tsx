import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useBuildingContract } from '@/hooks/settling/stark-contracts';

type Building = {
  build: (building_id: number) => void;
  realmBuildings: any;
  loading: boolean;
};
type useBuildingArgs = {
  token_id: number;
};

const useBuildings = (args: useBuildingArgs): Building => {
  const { contract: buildingContract } = useBuildingContract();

  const buildAction = useStarknetInvoke({
    contract: buildingContract,
    method: 'build',
  });

  const { data, loading, error } = useStarknetCall({
    contract: buildingContract,
    method: 'fetch_buildings_by_type',
    args: [bnToUint256(toBN(args.token_id))],
  });

  let realmBuildings: any = undefined;
  if (data != undefined) {
    realmBuildings = data;
  }

  return {
    build: (building_id: number) => {
      buildAction.invoke({
        args: [bnToUint256(toBN(args.token_id)), building_id],
      });
    },
    realmBuildings,
    loading,
  };
};

export default useBuildings;
