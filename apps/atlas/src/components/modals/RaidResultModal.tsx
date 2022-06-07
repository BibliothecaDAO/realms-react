import { useContext, useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { useGetRealmCombatResultQuery } from '@/generated/graphql';

export const RaidResultModal = ({ defendId, tx }) => {
  // Sample combat result query
  const [pollInterval, setPollInterval] = useState(5000);
  const {
    data: combatResult,
    startPolling,
    stopPolling,
  } = useGetRealmCombatResultQuery({
    variables: {
      defendRealmId: defendId,
      transactionHash: tx,
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    startPolling(5000); // TODO poll interval after transaction accepted on l2
    if (combatResult?.getRealmCombatResult) {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [combatResult]);

  const getCombatSteps = () => {
    return combatResult?.getRealmCombatResult?.history
      ? combatResult?.getRealmCombatResult?.history?.filter((a) => {
          return a.eventType == 'combat_step';
        })
      : [];
  };

  return (
    <div className="flex flex-wrap px-4 bg-gray/800">
      {getCombatSteps().map((a, index) => {
        return (
          <BattleReportItem key={index} realm={'1'} hitPoints={a.hitPoints} />
        );
      })}
    </div>
  );
};

interface BattleReportItem {
  realm: string;
  hitPoints: number | null | undefined;
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  return (
    <div className="flex justify-between w-full px-4 py-3 my-1 text-white uppercase border rounded shadow-inner bg-order-fox">
      {' '}
      <span>Realm {props.realm}</span>
      <span>deals </span>
      <span>{props.hitPoints} damage</span>
    </div>
  );
}
