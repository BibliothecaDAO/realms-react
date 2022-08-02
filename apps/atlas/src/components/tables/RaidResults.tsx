import { Spinner } from '@bibliotheca-dao/ui-lib';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useGetRealmCombatResultQuery } from '@/generated/graphql';
import useTxCallback from '@/hooks/useTxCallback';

export const RaidResults = ({ defendId, tx }) => {
  const { tx: txCallback, loading } = useTxCallback(tx, (status) => {
    // Update state changes?
    console.log(loading);
    console.log(status);
    console.log(txCallback);
    if (status !== 'REJECTED') {
      console.log('rejected');
    }
  });
  // Sample combat result query
  const {
    data: combatResult,
    startPolling,
    stopPolling,
  } = useGetRealmCombatResultQuery({
    variables: {
      defendRealmId: defendId,
      transactionHash: tx,
    },
  });
  useEffect(() => {
    startPolling(5000); // TODO poll interval after transaction accepted on l2
    if (combatResult?.getRealmCombatResult) {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [combatResult, startPolling, stopPolling]);

  const getCombatSteps = () => {
    return combatResult?.getRealmCombatResult?.history
      ? combatResult?.getRealmCombatResult?.history?.filter((a) => {
          return a.eventType == 'combat_step';
        })
      : [];
  };

  return (
    <div className="relative flex flex-wrap px-40">
      {combatResult?.getRealmCombatResult ? (
        <div>
          {getCombatSteps().map((a, index) => {
            return (
              <BattleReportItem
                key={index}
                realm={'1'}
                hitPoints={a.hitPoints}
              />
            );
          })}
        </div>
      ) : (
        <Spinner size="md" scheme="white" variant="bricks" />
      )}
    </div>
  );
};

interface BattleReportItem {
  realm: string;
  hitPoints: number | null | undefined;
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  return (
    <div className="flex justify-between w-full px-4 py-3 my-1 text-black uppercase bg-white border rounded shadow-inner">
      {' '}
      <span>Realm {props.realm}</span>
      <span>deals </span>
      <span>{props.hitPoints} damage</span>
    </div>
  );
}
