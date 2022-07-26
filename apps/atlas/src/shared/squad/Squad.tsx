import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useMemo, useState } from 'react';
import { number } from 'starknet';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { ArmoryBuilder } from '@/components/tables/Armory';
import type { Squad } from '@/constants/index';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';
import SidebarHeader from '../SidebarHeader';
import SquadStatistics from './SquadStatistics';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
  withPurchase?: boolean;
  realmId: number;
  troopsStats: any;
  squad: keyof typeof Squad;
}

const EmptyTroopId = 0;

export const SquadBuilder = (props: SquadProps) => {
  const { buildSquad } = useCombat({ token_id: props.realmId });
  const [toBuy, setToBuy] = useState<TroopInterface[]>([]);

  const { data: troopStatsData } = useGetTroopStatsQuery();

  const [selectedTroop, setSelectedTroop] = useState<TroopInterface | null>(
    null
  );

  const fillGap = (tier: number, length: number) => {
    const emptyTroop: TroopInterface = {
      troopId: EmptyTroopId,
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

    const queuedTroops = toBuy.filter((t) => t.tier == tier);

    const temp: TroopInterface[] = [];

    for (
      let index = 0;
      index < length - currentTroops.length - queuedTroops.length;
      index++
    ) {
      emptyTroop['tier'] = tier;
      temp.push(emptyTroop);
    }

    return currentTroops
      .concat(queuedTroops)
      .concat(temp)
      .map((a, index) => {
        return (
          <Troop
            onClick={(val) => setSelectedTroop(val)}
            onSubmit={(value: any) =>
              setToBuy((current) => [...current, value])
            }
            onRemove={(value: any) =>
              setToBuy((current) => [...current, value])
            }
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

  const selectedTroopIsEmpty =
    selectedTroop && selectedTroop.troopId == EmptyTroopId;

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
          title={
            selectedTroopIsEmpty
              ? `Train Tier ${selectedTroop?.tier || ' '} Troop`
              : selectedTroop?.troopName
          }
        />

        {selectedTroopIsEmpty && troopStatsData?.getTroopStats && (
          <>
            <ArmoryBuilder
              onBuildTroop={(t) => setToBuy(toBuy.concat(t))}
              squad={props.squad}
              troops={props.troops}
              troopsQueued={toBuy}
              statistics={troopStatsData.getTroopStats}
              realmId={props.realmId}
              hideSquadToggle
              filterTier={selectedTroop?.tier}
            />
            <div className="grid grid-cols-2 gap-12 my-4">
              <div className="col-start-1 col-end-2">
                <h3>Statistics Preview</h3>
                <SquadStatistics troops={props.troops} troopsQueued={toBuy} />
              </div>
              <div className="col-start-2 col-end-3">
                <h3>Costs</h3>
                <p>TODO</p>
              </div>
            </div>

            <div className="flex">
              <Button
                disabled={toBuy.length == 0}
                variant="primary"
                className="flex-1 w-full mr-2"
              >
                {toBuy.length == 0
                  ? 'Select Troops to Train'
                  : `Train ${toBuy.length} Troops`}
              </Button>
              <Button
                onClick={() => setToBuy([])}
                disabled={toBuy.length == 0}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </>
        )}

        {selectedTroop && !selectedTroopIsEmpty && (
          <>
            <div className="p-2 text-white uppercase rounded bg-black/30">
              <div>Agility: {selectedTroop.agility}</div>
              <div>attack: {selectedTroop.attack}</div>
              <div>defense: {selectedTroop.defense}</div>
              <div>vitality: {selectedTroop.vitality}</div>
              <div>Wisdom: {selectedTroop.wisdom}</div>
            </div>
          </>
        )}
      </AtlasSidebar>
    </div>
  );
};
