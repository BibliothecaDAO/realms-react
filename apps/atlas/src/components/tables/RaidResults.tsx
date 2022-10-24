import { Spinner } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BattalionImagesCard } from '@/components/cards/realms/BattalionImagesCard';
import type { RealmHistory, RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { fetchRealmNameById, resourcePillaged } from '@/shared/Getters/Realm';

interface RaidResultsProps {
  fromAttackRealmId?: number;
  fromDefendRealmId?: number;
  tx?: string;
  event?: RealmHistory;
}

export const RaidResults = (props: RaidResultsProps) => {
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
  }, [combatResult, props.event, startPolling, stopPolling]);

  const success = result?.data?.success;

  const attackingStartArmy = result?.data?.armiesStart[0];
  const defendingStartArmy = result?.data?.armiesStart[1];

  console.log('attackingStartArmy', result?.data);

  const { starknetId } = useStarkNetId(
    result?.data?.attackRealmOwner.account || ''
  );

  return (
    <div className="pt-10 text-center">
      {result ? (
        <div>
          <h2 className="mb-4 text-center">
            {result.eventType == 'realm_combat_attack' &&
              (success ? 'Successful Raid' : 'Raid Defended')}
            {result.eventType == 'realm_combat_defend' &&
              (success ? 'Raid Defended' : 'Realm Pillaged')}
          </h2>
          <div className="flex gap-6">
            <div className="w-1/2">
              <h6>{starknetId ?? starknetId}</h6>
              <h3>Attacker</h3>
              <h2> {fetchRealmNameById(result.data?.attackRealmId)}</h2>
              <div className="grid grid-cols-4 gap-4">
                {attackingStartArmy && (
                  <BattalionImagesCard
                    battalion={attackingStartArmy}
                    endBattalion={result?.data?.armiesEnd[0]}
                  />
                )}
              </div>
            </div>
            <div className="w-1/2 text-center">
              <h5>Defender</h5>
              <h2> {fetchRealmNameById(result.data?.defendRealmId)}</h2>
              <div className="grid grid-cols-4 gap-4">
                {defendingStartArmy && (
                  <BattalionImagesCard battalion={defendingStartArmy} />
                )}
              </div>
            </div>
          </div>
          <div className="mt-5">
            {(result?.data?.relicLost ?? 0) > 0 && (
              <h1>Relic {result.data.relicLost} Captured</h1>
            )}
            {result.data?.pillagedResources?.length && (
              <div className="pt-4">
                <div className="mb-4 text-3xl">
                  Successful Raid!! The troops of Realm{' '}
                  {fetchRealmNameById(result.data?.defendRealmId)} were slayed
                  and Realm {fetchRealmNameById(result.data?.attackRealmId)}{' '}
                  took off with the following resources
                  {/* TODO GENERALISE
                 The citizens are trembling and in awe of your victory. */}
                </div>
                <div className="mx-auto">
                  {result.data?.pillagedResources && (
                    <div className="flex">
                      {resourcePillaged(result.data?.pillagedResources)}
                    </div>
                  )}
                </div>
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
            very soon
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
