import { Button } from '@bibliotheca-dao/ui-lib';
import D12 from '@bibliotheca-dao/ui-lib/icons/D12.svg';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useGetRealmQuery } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';
import { RealmVault } from '../tables/RealmVault';
import { BasePanel } from './BasePanel';
export function CombatPanel(): ReactElement {
  const { selectedPanel } = useAtlasContext();

  const { data: AttackingRealm, loading: AttackingLoading } = useGetRealmQuery({
    variables: {
      id: parseInt('3'),
    },
    skip: false,
  });

  const { data: DefendingRealm, loading: DefendingLoading } = useGetRealmQuery({
    variables: {
      id: parseInt('4'),
    },
    skip: false,
  });

  return (
    <BasePanel open={selectedPanel === 'combat'}>
      <div className="relative grid h-full grid-cols-8 gap-12">
        <div className="flex flex-col justify-around h-full col-start-1 col-end-7">
          <RealmBannerHeading realmId={1} order="the fox" title="Funfun" />
          <SquadBuilder
            withPurchase={false}
            flipped={true}
            troops={dummySquad}
          />
          <Button variant="primary">Attack</Button>
          <SquadBuilder withPurchase={true} troops={dummySquad} />
          <RealmBannerHeading realmId={2} order="power" title="Shuahd" />
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
