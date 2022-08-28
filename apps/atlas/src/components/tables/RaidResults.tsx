import { Spinner } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { COMBAT_OUTCOME_ATTACKER_WINS, troopList } from '@/constants/troops';
import type { GetRealmCombatResultQuery } from '@/generated/graphql';
import { useGetRealmCombatResultQuery } from '@/generated/graphql';
import { useCosts } from '@/hooks/costs/useCosts';
import useTxCallback from '@/hooks/useTxCallback';
import { resourcePillaged } from '@/shared/Getters/Realm';
import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';

export const CombatTroop = (props: TroopInterface) => {
  return <div>{props.vitality}</div>;
};

export const RaidResults = ({ defendId, tx }) => {
  const { costs } = useCosts();
  const [result, setResult] =
    useState<GetRealmCombatResultQuery['getRealmCombatResult']>();
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
      setResult(combatResult?.getRealmCombatResult);
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

  const success =
    combatResult?.getRealmCombatResult.outcome === COMBAT_OUTCOME_ATTACKER_WINS;

  const getFlatHitpoints = combatResult?.getRealmCombatResult.history
    ? combatResult?.getRealmCombatResult.history?.slice(1).map((a) => {
        return a.hitPoints;
      })
    : [];

  const combatStart = combatResult?.getRealmCombatResult.history?.find(
    (a) => a.eventType === 'combat_start'
  );

  const lastEvent = combatResult?.getRealmCombatResult.history
    ? combatResult?.getRealmCombatResult.history[
        combatResult?.getRealmCombatResult.history.length - 1
      ]
    : [];

  console.log(combatStart);

  const mapped = combatResult?.getRealmCombatResult.history
    ?.filter((a) => a.eventType === 'combat_step')
    .map((a, i) => {
      return {
        ...a,
        hitPoints: getFlatHitpoints[i],
        realm:
          i % 2 === 0
            ? combatResult?.getRealmCombatResult.attackRealmId
            : combatResult?.getRealmCombatResult.defendRealmId,
        unitAttacking: a.attackSquad.find((b) => b.vitality !== 0),
        unitDefending: a.defendSquad.find((b) => b.vitality !== 0),
      };
    });
  console.log(combatResult?.getRealmCombatResult, 'hh');
  console.log(mapped);

  return (
    <div className="pt-10">
      {combatResult?.getRealmCombatResult && (
        <h2 className="mb-4 text-center">
          {success ? 'Successful' : 'Unsuccessful'} Raid!!
        </h2>
      )}

      <div className="flex flex-wrap justify-between">
        {mapped
          ?.filter((b) => b.outcome !== 1)
          .filter((b) => b.unitDefending)
          .map((a, i) => {
            return (
              <div
                className="w-full p-4 mb-2 text-center border-4 border-double rounded-xl border-white/20"
                key={i}
              >
                <h3>
                  [{i + 1}] Attacking Realm # {a.realm}
                </h3>

                <div className="flex justify-around mt-10 space-x-2">
                  <div>
                    <Troop
                      className="w-48 h-64"
                      troopsStats={costs?.troopStats}
                      troop={a.unitAttacking}
                    />
                    <div className="flex flex-wrap w-full mx-auto mt-2">
                      {a.attackSquad.map((b: TroopInterface, i) => {
                        return <TroopIcon key={i} vitality={b.vitality} />;
                      })}
                    </div>
                  </div>

                  <div className="self-center w-12">
                    <h1>{a.hitPoints}</h1>
                    <h3>hits</h3>
                  </div>

                  <div>
                    <Troop
                      className="w-48 h-64"
                      troopsStats={costs?.troopStats}
                      troop={a.unitDefending}
                    />
                    <div className="flex flex-wrap w-full mx-auto mt-2">
                      {a.defendSquad.map((b: TroopInterface, i) => {
                        return <TroopIcon key={i} vitality={b.vitality} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {combatResult?.getRealmCombatResult ? (
        <div className="mt-5">
          {/* <div className="relative flex flex-wrap ">
            <div className="w-full">
              {getCombatSteps().map((a, index) => {
                return (
                  <BattleReportItem
                    key={index}
                    index={index}
                    realm={
                      index & 1
                        ? combatResult?.getRealmCombatResult.defendRealmId
                        : combatResult?.getRealmCombatResult.attackRealmId
                    }
                    hitPoints={a.hitPoints}
                    result={combatResult?.getRealmCombatResult}
                  />
                );
              })}
            </div>
          </div> */}
          {(combatResult?.getRealmCombatResult?.relicLost ?? 0) > 0 && (
            <h1>
              Relic {combatResult?.getRealmCombatResult.relicLost} Captured
            </h1>
          )}
          {combatResult?.getRealmCombatResult.resourcesPillaged?.length ? (
            <div className="pt-4">
              <div className="mb-4 text-3xl">
                Successful Raid!! Hurray!! You slayed all of Realm{' '}
                {combatResult?.getRealmCombatResult.defendRealmId} troops and
                took off with the following resources. The citizens are
                trembling and in awe of your victory.
              </div>
              <div className="flex justify-center w-72">
                {resourcePillaged(
                  combatResult?.getRealmCombatResult.resourcesPillaged
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="text-center">
          <Image
            className="w-full rounded-full"
            width={500}
            objectFit={'cover'}
            layout="responsive"
            height={250}
            src="/createOrDestroy-desktop.webp"
          />
          <div className="mt-4 text-3xl">
            Running on-chain battle simulation...
          </div>

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
  realm: number;
  index: number;
  hitPoints: number | null | undefined;
  result: GetRealmCombatResultQuery['getRealmCombatResult'];
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  const isOwnRealm = props.index & 1 ? false : true;

  return (
    <div
      className={`flex justify-between w-full px-4 py-1 my-1 text-2xl border-4 border-double rounded shadow-inner border-white/30 font-display ${
        isOwnRealm ? 'bg-green-900' : 'bg-red-900'
      }`}
    >
      {' '}
      <span>
        <span>
          {props.index + 1}. Your troops {isOwnRealm ? 'dealt' : 'took'}{' '}
          <span className="font-semibold">{props.hitPoints}</span> damage
        </span>
      </span>
    </div>
  );
}

interface BattleTroopItem {
  vitality: number;
  troopId: number;
  hitsTaken: number | null | undefined;
}

export function BattleTroop(props: BattleTroopItem): ReactElement {
  return (
    <div className="w-24">
      {' '}
      <span>
        <span>
          ID: {props.troopId} {props.vitality} {props.hitsTaken}
        </span>
      </span>
    </div>
  );
}

export function TroopIcon({ vitality }): ReactElement {
  return (
    <div className="m-1">
      {' '}
      <div
        className={`w-1 h-1 ${
          vitality === 0
            ? 'bg-gray-500'
            : 'bg-green-800 shadow-green-200 shadow-lg'
        } rounded-full`}
      ></div>
    </div>
  );
}
