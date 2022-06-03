import { Button } from '@bibliotheca-dao/ui-lib';
import D12 from '@bibliotheca-dao/ui-lib/icons/D12.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import {
  useGetRealmCombatResultQuery,
  useGetRealmQuery,
} from '@/generated/graphql';
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

  const attackId = attackingRealmId ? attackingRealmId.toString() : '0';
  const defendId = defendingRealmId ? defendingRealmId.toString() : '0';

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
  // const { data: combatResult } = useGetRealmCombatResultQuery({
  //   variables: {
  //     defendRealmId: 1061,
  //     transactionHash:
  //       '0x56aaed97a22b5ac764c7c2e32f1b3a3d0e3721540b326b8a4bf46fa77ed1e38',
  //   },
  // });
  // console.log(combatResult);

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

          <SquadBuilder withPurchase={true} troops={defenseSquad} />
          <Button variant="primary">Attack</Button>
          <SquadBuilder
            flipped={true}
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
          <div className="py-5 mb-4 -mx-4 text-4xl text-center text-white border-4 border-double rounded shadow-xl bg-off-200 font-lords">
            {' '}
            <span>Raidable Vault</span>
          </div>
          <div className="px-4">
            {AttackingRealm && (
              <RealmVault
                realm={AttackingRealm?.getRealm}
                loading={AttackingLoading}
              />
            )}
          </div>
          <div className="py-5 mb-4 -mx-4 text-4xl text-center text-white border-4 border-double rounded shadow-xl bg-off-200 font-lords">
            battle report
          </div>
          <div className="flex flex-wrap px-4">
            {combatItem.map((a, index) => {
              return (
                <BattleReportItem
                  key={index}
                  realm={a.realm}
                  hitPoints={a.hitPoints}
                />
              );
            })}
          </div>
          <div className="py-5 mt-4 -mx-4 text-4xl text-center text-white border-4 border-double rounded shadow-xl bg-off-200 font-lords">
            Outcome
          </div>
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

const combatItem = [
  { realm: '1', hitPoints: '20' },
  { realm: '2', hitPoints: '3' },
  { realm: '1', hitPoints: '3' },
  { realm: '2', hitPoints: '30' },
  { realm: '1', hitPoints: '6' },
];

interface BattleReportItem {
  realm: string;
  hitPoints: number | string;
}

export function BattleReportItem(props: BattleReportItem): ReactElement {
  return (
    <div className="flex justify-between w-full px-4 py-3 my-1 font-semibold uppercase border rounded shadow-inner bg-stone-300 text-stone-400 border-stone-300">
      {' '}
      <span>Realm {props.realm}</span>
      <span>deals </span>
      <span>{props.hitPoints} damage</span>
    </div>
  );
}
