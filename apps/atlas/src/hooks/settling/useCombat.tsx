import { useStarknetInvoke } from '@starknet-react/core';

import { useCombatContract } from '@/hooks/settling/stark-contracts';

type Combat = {
  buildSquad: (
    troop_ids_len: number,
    troop_ids: number[],
    slot: number
  ) => void;
  initiateCombat: (defending_realm_id: number, attack_type: number) => void;
};
type useCombatArgs = {
  token_id?: number;
};

const useCombat = (args: useCombatArgs): Combat => {
  const { contract: combatContract } = useCombatContract();

  const buildSquadAction = useStarknetInvoke({
    contract: combatContract,
    method: 'build_squad_from_troops_in_realm',
  });

  const initiateCombatAction = useStarknetInvoke({
    contract: combatContract,
    method: 'initiate_combat',
  });

  return {
    buildSquad: (troop_ids_len, troop_ids, slot) => {
      buildSquadAction.invoke({
        args: [troop_ids_len, troop_ids, args.token_id, slot],
      });
    },
    initiateCombat: (defending_realm_id, attack_type) => {
      initiateCombatAction.invoke({
        args: [args.token_id, defending_realm_id, attack_type],
      });
    },
  };
};

export default useCombat;
