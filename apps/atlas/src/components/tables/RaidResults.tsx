import { Spinner } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { COMBAT_OUTCOME_ATTACKER_WINS } from '@/constants/army';
import type { RealmHistory, RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { resourcePillaged } from '@/shared/Getters/Realm';
import type { ArmyInterface } from '@/types/index';

interface RaidResultsProps {
  fromAttackRealmId?: number;
  fromDefendRealmId?: number;
  tx?: string;
  data?: RealmHistory;
}

export const RaidResults = (props: RaidResultsProps) => {
  const { gameConstants } = useGameConstants();
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
  });
  useEffect(() => {
    if (!(props.fromAttackRealmId || props.fromDefendRealmId) && props.data) {
      setResult(props.data);
      return;
    }
    console.log('start polling');
    startPolling(2000); // TODO poll interval after transaction accepted on l2
    if (combatResult?.getRealmHistory.length) {
      stopPolling();
      setResult(combatResult?.getRealmHistory[0]);
    }
  }, [combatResult, startPolling, stopPolling]);

  const success = result?.data?.success;

  /* const getFlatHitpoints = result.history
    ? result.history?.slice(1).map((a) => {
        return a.hitPoints;
      })
    : [];

  const combatStart = result.history?.find(
    (a) => a.eventType === 'combat_start'
  );

  const lastEvent = result.history
    ? result.history[
        result.history.length - 1
      ]
    : [];

  const mapped = result.history
    ?.filter((a) => a.eventType === 'combat_step')
    .map((a, i) => {
      return {
        ...a,
        hitPoints: getFlatHitpoints[i],
        realm:
          i % 2 === 0
            ? result.attackRealmId
            : result.defendRealmId,
        unitAttacking: a.attackSquad.find((b) => b.vitality !== 0),
        unitDefending: a.defendSquad.find((b) => b.vitality !== 0),
      };
    }); */

  return (
    <div className="pt-10">
      {result && (
        <h2 className="mb-4 text-center">
          {success ? 'Successful Raid' : 'Raid Defended'}!!
        </h2>
      )}

      <div className="flex flex-wrap justify-between">
        {/* {mapped
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
                      troopsStats={gameConstants?.troopStats}
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
          })} */}
      </div>

      {result ? (
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
                        ? result.defendRealmId
                        : result.attackRealmId
                    }
                    hitPoints={a.hitPoints}
                    result={result}
                  />
                );
              })}
            </div>
          </div> */}
          {(result?.data.relicLost ?? 0) > 0 && (
            <h1>Relic {result.data.relicLost} Captured</h1>
          )}
          {result.data.pillagedResources?.length ? (
            <div className="pt-4">
              <div className="mb-4 text-3xl">
                Successful Raid!! The troops of Realm{' '}
                {result.data.defendRealmId} were slayed and Realm{' '}
                {result.data.attackRealmId} took off with the following
                resources.
                {/* TODO GENERALISE
                 The citizens are trembling and in awe of your victory. */}
              </div>
              <div className="flex justify-center w-72">
                {resourcePillaged(result.data.pillagedResources)}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="text-center lg:px-36">
          <Image
            className="w-full "
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
          <div className="flex justify-center">
            <Spinner scheme="white" variant="circle" size="xl" className="" />
          </div>
        </div>
      )}
    </div>
  );
};

/* interface BattleReportItem {
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
*/
