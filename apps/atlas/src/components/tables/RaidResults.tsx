import { Spinner } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { COMBAT_OUTCOME_ATTACKER_WINS } from '@/constants/troops';
import type { GetRealmCombatResultQuery } from '@/generated/graphql';
import { useGetRealmCombatResultQuery } from '@/generated/graphql';
import useTxCallback from '@/hooks/useTxCallback';
import { resourcePillaged } from '@/shared/Getters/Realm';

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
    startPolling(2000); // TODO poll interval after transaction accepted on l2
    if (combatResult?.getRealmCombatResult) {
      stopPolling();
    }
    console.log(combatResult);
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

  const success =
    combatResult?.getRealmCombatResult.outcome === COMBAT_OUTCOME_ATTACKER_WINS;

  return (
    <div className="pt-10">
      <Image
        className="w-full rounded"
        width={500}
        objectFit={'cover'}
        layout="responsive"
        height={250}
        src="/createOrDestroy-desktop.webp"
      />
      {combatResult?.getRealmCombatResult ? (
        <div className="mt-5">
          <h2 className="mb-4">
            {success ? 'Successful' : 'Unsuccessful'} Raid
          </h2>
          <h3>Combat outcome</h3>
          <div className="relative flex flex-wrap ">
            <div className="w-full">
              {getCombatSteps().map((a, index) => {
                return (
                  <BattleReportItem
                    key={index}
                    realm={'1'}
                    hitPoints={a.hitPoints}
                    result={combatResult?.getRealmCombatResult}
                  />
                );
              })}
            </div>
          </div>
          <div className="pt-4">
            <h3>Pillaged Resources</h3>
            {resourcePillaged(
              combatResult?.getRealmCombatResult.resourcesPillaged
            )}
          </div>
        </div>
      ) : (
        <div className="my-10">
          <div className="text-3xl ">Running on-chain battle simulation...</div>

          <p className="mt-2 text-xl">
            Your army is on route to the enemy and your general will report back
            very soon.
          </p>
        </div>
      )}
    </div>
  );
};

interface BattleReportItem {
  realm: string;
  hitPoints: number | null | undefined;
  result: GetRealmCombatResultQuery['getRealmCombatResult'];
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  return (
    <div className="flex justify-between w-full px-4 py-3 my-1 text-2xl uppercase bg-red-800 border-4 border-double rounded shadow-inner border-white/30">
      {' '}
      <span>Realm {props.result.attackRealmId}</span>
      <span className="font-semibold">dealt </span>
      <span>{props.hitPoints} damage</span>
    </div>
  );
}
