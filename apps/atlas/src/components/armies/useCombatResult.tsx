import { useEffect, useState } from 'react';
import type { RealmHistory, RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';

interface RaidResultsProps {
  fromAttackRealmId?: number;
  fromDefendRealmId?: number;
  tx?: string;
  event?: RealmHistory;
}

export const useCombatResult = (props: RaidResultsProps) => {
  const [result, setResult] = useState<RealmHistory>();

  const filter: RealmHistoryWhereInput = {
    transactionHash: { equals: props.tx },
  };

  if (props.fromAttackRealmId) {
    filter.realmId = { equals: props.fromAttackRealmId };
    filter.eventType = { in: ['realm_combat_attack'] };
  }
  if (props.fromDefendRealmId) {
    filter.realmId = { equals: props.fromDefendRealmId };
    filter.eventType = { in: ['realm_combat_defend'] };
  }

  const {
    data: combatResult,
    startPolling,
    stopPolling,
    loading,
  } = useGetRealmHistoryQuery({
    variables: {
      filter,
    },
    skip: props.event ? true : false,
  });

  useEffect(() => {
    if (props.event) {
      setResult(props.event);
      return;
    }
    startPolling(2000); // TODO poll interval after transaction accepted on l2
    if (combatResult?.getRealmHistory.length) {
      stopPolling();

      setResult(combatResult?.getRealmHistory[0]);
    }
    console.log('combatResult', combatResult);
  }, [combatResult, props.event, startPolling, stopPolling]);

  return {
    result,
    attackingEndArmy: result?.data?.armiesEnd[0],
    defendingEndArmy: result?.data?.armiesEnd[1],
    success: result?.data?.success,
    loading,
  };
};
