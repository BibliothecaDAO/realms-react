import { useContext, useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { useGetRealmCombatResultQuery } from '@/generated/graphql';

export const RaidResultModal = ({ defendId, tx }) => {
  // Sample combat result query
  const { data: combatResult } = useGetRealmCombatResultQuery({
    variables: {
      defendRealmId: defendId,
      transactionHash: tx,
    },
    pollInterval: 5000,
  });

  /* useEffect(() => {
    startPolling(5000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]); */

  const getCombatSteps = () => {
    return combatResult?.getRealmCombatResult?.history
      ? combatResult?.getRealmCombatResult?.history?.filter((a) => {
          return a.eventType == 'combat_step';
        })
      : [];
  };

  return (
    <div className="flex flex-wrap px-4">
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
