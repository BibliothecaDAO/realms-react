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
    <div className="pt-10 text-center">
      {result ? (
        <div>
          <h2 className="mb-4 text-center">
            {success ? 'Successful Raid' : 'Raid Defended'}!!
          </h2>
          <div className="flex">
            <div className="w-1/2">
              <h3>Attacker</h3>
              {result.data.attackRealmId}
            </div>
            <div className="w-1/2 text-center">
              <h3>Defender</h3>
            </div>
          </div>
          <div className="mt-5">
            {(result?.data.relicLost ?? 0) > 0 && (
              <h1>Relic {result.data.relicLost} Captured</h1>
            )}
            {result.data.pillagedResources?.length && (
              <div className="pt-4">
                <div className="mb-4 text-3xl">
                  Successful Raid!! The troops of Realm{' '}
                  {result.data.defendRealmId} were slayed and Realm{' '}
                  {result.data.attackRealmId} took off with the following
                  resources.
                  {/* TODO GENERALISE
                 The citizens are trembling and in awe of your victory. */}
                </div>
                {result.data.pillagedResources && (
                  <div className="flex justify-center w-72">
                    {resourcePillaged(result.data.pillagedResources)}
                  </div>
                )}
              </div>
            )}
          </div>
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
/*
interface BattleTroopItem {
  vitality: number;
  troopId: number;
  hitsTaken: number | null | undefined;
}
*/
