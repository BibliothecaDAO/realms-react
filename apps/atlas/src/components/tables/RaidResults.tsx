import { Spinner } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BattalionImagesCard } from '@/components/cards/realms/BattalionImagesCard';
import type { RealmHistory, RealmHistoryWhereInput } from '@/generated/graphql';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { fetchRealmNameById, resourcePillaged } from '@/shared/Getters/Realm';
import { shortenAddress } from '@/util/formatters';

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

  const defendingRealmId = result?.data?.defendRealmId || result?.realmId;
  const attackingRealmId = result?.data?.attackRealmId || result?.realmId;
  const defendingRealmOwner =
    result?.data?.defendRealmOwner || result?.realmOwner;
  const attackingRealmOwner =
    result?.data?.attackRealmOwner?.account || result?.realmOwner;
  const attackingStartArmy = result?.data?.armiesStart[0];
  const defendingStartArmy = result?.data?.armiesStart[1];

  const { starknetId } = useStarkNetId(attackingRealmOwner);
  const { starknetId: defenderStarknetId } = useStarkNetId(defendingRealmOwner);

  return (
    <div className="text-center">
      {result ? (
        <div>
          <h2 className="mb-4 text-center">
            {result.eventType == 'realm_combat_attack' &&
              (success ? 'Successful Raid' : 'Raid Failed')}
            {result.eventType == 'realm_combat_defend' &&
              (success ? 'Raid Defended' : 'Defeat!')}
          </h2>
          <div className="flex gap-6">
            <div className="w-1/2">
              <h6>
                Attacker: {starknetId ?? shortenAddress(attackingRealmOwner)}
              </h6>

              <h2> {fetchRealmNameById(attackingRealmId)}</h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {attackingStartArmy && (
                  <BattalionImagesCard
                    battalion={attackingStartArmy}
                    endBattalion={result?.data?.armiesEnd[0]}
                  />
                )}
              </div>
            </div>
            <div className="w-1/2 text-center">
              <h6>
                Defender:{' '}
                {defenderStarknetId ?? shortenAddress(defendingRealmOwner)}
              </h6>

              <h2> {fetchRealmNameById(defendingRealmId)}</h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
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
              <div>
                <hr className="my-3 border border-white/30" />
                <div className="mx-auto mt-4 text-2xl italic sm:w-1/2">
                  Successful Raid!! The army of{' '}
                  {fetchRealmNameById(defendingRealmId)} was defeated and{' '}
                  {fetchRealmNameById(attackingRealmId)}'s battalions took off
                  with the following resources!
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
          <hr className="mt-3 border border-white/30" />
          <div className="mt-5">
            <div className="flex gap-6">
              <div className="w-1/2">
                {result?.data?.armiesEnd[0] && (
                  <div className="grid grid-cols-3 gap-4">
                    <BattalionImagesCard
                      battalion={result?.data?.armiesEnd[0]}
                    />
                  </div>
                )}
              </div>
              <div className="w-1/2">
                {result?.data?.armiesEnd[1] && (
                  <div className="grid grid-cols-3 gap-4">
                    <BattalionImagesCard
                      battalion={result?.data?.armiesEnd[1]}
                    />
                  </div>
                )}
              </div>
            </div>
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
