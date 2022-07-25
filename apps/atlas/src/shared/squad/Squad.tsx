import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useMemo, useState } from 'react';
import { number } from 'starknet';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { ArmoryBuilder } from '@/components/tables/Armory';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';
import SidebarHeader from '../SidebarHeader';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
  withPurchase?: boolean;
  realmId: number;
  location: number; // 1 attack 2 defence
  troopsStats: any;
}

export const SquadBuilder = (props: SquadProps) => {
  const { buildSquad } = useCombat({ token_id: props.realmId });
  const [toBuy, setToBuy] = useState<TroopInterface[]>([]);

  const { data: troopStatsData } = useGetTroopStatsQuery();

  const troopIdsToPurchase = () => {
    return toBuy.map((a: TroopInterface) => a.troopId);
  };

  const [selectedTroop, setSelectedTroop] = useState<TroopInterface | null>(
    null
  );

  const fillGap = (tier: number, length: number) => {
    const emptyTroop: TroopInterface = {
      troopId: 0,
      index: 0,
      type: 0,
      tier: 0,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
      troopName: '',
    };
    const currentTroops = props.troops.filter((a) => a.tier === tier);
    const temp: TroopInterface[] = [];

    for (let index = 0; index < length - currentTroops.length; index++) {
      emptyTroop['tier'] = tier;
      temp.push(emptyTroop);
    }

    return currentTroops.concat(temp).map((a, index) => {
      return (
        <Troop
          onClick={(val) => setSelectedTroop(val)}
          onSubmit={(value: any) => setToBuy((current) => [...current, value])}
          onRemove={(value: any) => setToBuy((current) => [...current, value])}
          withPurchase={props.withPurchase}
          key={index}
          troop={a}
          troopsStats={props.troopsStats}
        />
      );
    });
  };

  const tier1 = () => {
    return fillGap(1, 16);
  };
  const tier2 = () => {
    return fillGap(2, 8);
  };
  const tier3 = () => {
    return fillGap(3, 1);
  };

  const trimTroopFromSquad = (troop: TroopInterface) => {
    const index = toBuy.findIndex((a) => a.troopId === troop.troopId);

    setToBuy(() => [...toBuy.splice(index, 1)]);
  };

  const stats = () => {
    return {
      agility: props.troops
        .map((troop) => troop.agility)
        .reduce((prev, curr) => prev + curr, 0),
      attack: props.troops
        .map((troop) => troop.attack)
        .reduce((prev, curr) => prev + curr, 0),
      defense: props.troops
        .map((troop) => troop.defense)
        .reduce((prev, curr) => prev + curr, 0),
      vitality: props.troops
        .map((troop) => troop.vitality)
        .reduce((prev, curr) => prev + curr, 0),
      wisdom: props.troops
        .map((troop) => troop.wisdom)
        .reduce((prev, curr) => prev + curr, 0),
    };
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`${
          props.flipped ? 'order-last' : ''
        } flex justify-around w-full my-2`}
      >
        {tier1()}
      </div>
      <div className="flex justify-around w-full my-2 ">{tier2()}</div>
      <div
        className={`${
          props.flipped ? 'order-first' : ''
        } flex justify-around w-full my-2`}
      >
        {tier3()}
      </div>
      <AtlasSidebar isOpen={!!selectedTroop}>
        <SidebarHeader
          onClose={() => setSelectedTroop(null)}
          title={`Train Tier ${selectedTroop?.tier || ' '} Troop`}
        />
        {troopStatsData?.getTroopStats ? (
          <ArmoryBuilder
            statistics={troopStatsData.getTroopStats}
            realmId={props.realmId}
            hideSquadToggle
            filterTier={selectedTroop?.tier}
          />
        ) : null}
      </AtlasSidebar>

      <div className="flex">
        {/* <div className="p-2 text-white uppercase rounded bg-black/30">
          <div>Agility: {stats().agility}</div>
          <div>attack: {stats().attack}</div>
          <div>defense: {stats().defense}</div>
          <div>vitality: {stats().vitality}</div>
          <div>Wisdom: {stats().wisdom}</div>
        </div> */}
        {/* <div>
          <Button
            onClick={() => toggleMenuType('military')}
            className="mt-4"
            variant="primary"
          >
            Add troops
          </Button>
        </div> */}
      </div>
    </div>
  );
};
