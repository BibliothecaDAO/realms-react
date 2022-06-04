import { Button } from '@bibliotheca-dao/ui-lib';
import D12 from '@bibliotheca-dao/ui-lib/icons/D12.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import {
  useGetRealmCombatResultQuery,
  useGetRealmQuery,
} from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { getOrder } from '@/shared/Getters/Realm';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';
import { RealmVault } from '../tables/RealmVault';
import { BasePanel } from './BasePanel';

export function CombatPanel(): ReactElement {
  const { selectedPanel } = useAtlasContext();
  const router = useRouter();
  const { attackingRealmId, defendingRealmId } = router.query;

  const attackId = attackingRealmId ? attackingRealmId.toString() : '3';
  const defendId = defendingRealmId ? defendingRealmId.toString() : '1061';

  const { initiateCombat } = useCombat({ token_id: parseInt(attackId) });

  const { data: AttackingRealm, loading: AttackingLoading } = useGetRealmQuery({
    variables: {
      id: parseInt(attackId),
    },
    skip: false,
  });

  const { data: DefendingRealm, loading: DefendingLoading } = useGetRealmQuery({
    variables: {
      id: parseInt(defendId),
    },
    skip: false,
  });

  const attackSquad =
    AttackingRealm?.getRealm?.squad?.filter((squad) => squad.squadSlot === 1) ??
    [];
  const defenseSquad =
    AttackingRealm?.getRealm?.squad?.filter((squad) => squad.squadSlot === 2) ??
    [];

  // Sample combat result query
  const { data: combatResult } = useGetRealmCombatResultQuery({
    variables: {
      defendRealmId: 1061,
      transactionHash:
        '0x56aaed97a22b5ac764c7c2e32f1b3a3d0e3721540b326b8a4bf46fa77ed1e38',
    },
  });
  console.log(combatResult);
  const getCombatSteps = () => {
    return combatResult?.getRealmCombatResult?.history
      ? combatResult?.getRealmCombatResult?.history?.filter((a) => {
          return a.eventType == 'combat_step';
        })
      : [];
  };

  const bannerClasses =
    'py-5 mb-4 -mx-4 text-4xl text-center text-white border-4 border-double rounded shadow-xl bg-off-200 font-lords transition-all duration-300';

  return (
    <BasePanel open={selectedPanel === 'combat'}>
      <div className="relative grid h-full grid-cols-8 gap-12">
        <div className="flex flex-col justify-around h-full col-start-1 col-end-7">
          {DefendingRealm?.getRealm?.name && (
            <RealmBannerHeading
              realmId={parseInt(defendId)}
              order={getOrder(DefendingRealm?.getRealm)}
              title={DefendingRealm?.getRealm?.name}
            />
          )}

          <SquadBuilder
            location={2}
            flipped={true}
            realmId={parseInt(defendId)}
            withPurchase={false}
            troops={defenseSquad}
          />

          {/* <Button variant="primary">Attack</Button> */}

          <SquadBuilder
            location={1}
            realmId={parseInt(attackId)}
            withPurchase={true}
            troops={attackSquad}
          />

          {AttackingRealm?.getRealm?.name && (
            <RealmBannerHeading
              realmId={parseInt(attackId)}
              order={getOrder(AttackingRealm?.getRealm)}
              title={AttackingRealm?.getRealm?.name}
            />
          )}
        </div>
        <div className="col-start-7 col-end-9 pt-4 pb-4 border-4 rounded-md rounded-b-full shadow-2xl bg-stone-400 borer-double">
          <div className={bannerClasses}>
            {' '}
            <span>Raidable Vault</span>
          </div>
          <div className="px-4">
            {DefendingRealm && !DefendingLoading && (
              <RealmVault
                realm={DefendingRealm?.getRealm}
                loading={AttackingLoading}
              />
            )}
          </div>
          <div className="w-full px-4 mb-4">
            <Button
              onClick={() => initiateCombat(parseInt(defendId), 1)}
              className="w-full"
              variant="attack"
            >
              Raid Vault
            </Button>
          </div>

          <div className={bannerClasses}>battle report</div>
          <div className="flex flex-wrap px-4">
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
          {/* <div className="px-4">
            {DefendingRealm && !DefendingLoading && (
              <RealmVault
                realm={DefendingRealm?.getRealm}
                loading={AttackingLoading}
              />
            )}
          </div> */}
          {/* <div className="flex w-full px-4 pt-10">
            <Button variant="primary" className="w-full">
              Success
            </Button>
          </div> */}
        </div>
      </div>
    </BasePanel>
  );
}

interface BattleReportItem {
  realm: string;
  hitPoints: number | null | undefined;
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  return (
    <div className="flex justify-between w-full px-4 py-3 my-1 text-white uppercase border rounded shadow-inner border-stone-300 bg-order-fox">
      {' '}
      <span>Realm {props.realm}</span>
      <span>deals </span>
      <span>{props.hitPoints} damage</span>
    </div>
  );
}
