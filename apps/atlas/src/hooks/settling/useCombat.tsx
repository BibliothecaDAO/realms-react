import { useStarknetInvoke } from '@starknet-react/core';

import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useCombatContract } from '@/hooks/settling/stark-contracts';

type Combat = {
  buildSquad: (troop_ids: number[], slot: number) => void;
  initiateCombat: (defending_realm_id: number, attack_type: number) => void;
  combatData: any;
};
type useCombatArgs = {
  token_id: number;
};

const useCombat = (args: useCombatArgs): Combat => {
  const { contract: combatContract } = useCombatContract();

  const buildSquadAction = useStarknetInvoke({
    contract: combatContract,
    method: 'build_squad_from_troops_in_realm',
  });

  const {
    data: combatData,
    loading: combatLoading,
    invoke: combatInvoke,
  } = useStarknetInvoke({
    contract: combatContract,
    method: 'initiate_combat',
  });

  return {
    buildSquad: (troop_ids, slot) => {
      console.log(buildSquadAction.error);
      console.log(troop_ids);
      buildSquadAction.invoke({
        args: [troop_ids, bnToUint256(toBN(args.token_id)), slot],
      });
    },
    initiateCombat: (defending_realm_id, attack_type) => {
      console.log(combatInvoke.error);
      combatInvoke({
        args: [
          bnToUint256(toBN(args.token_id)),
          bnToUint256(toBN(defending_realm_id)),
          attack_type,
        ],
      });
    },
    combatData: combatData,
  };
};

export default useCombat;
