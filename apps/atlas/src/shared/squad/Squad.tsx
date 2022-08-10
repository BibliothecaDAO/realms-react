import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { ArmoryBuilder } from '@/components/tables/Armory';
import { Squad } from '@/constants/index';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { GetRealmQuery } from '@/generated/graphql';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import { createCall } from '@/hooks/settling/useCombat';
import useIsOwner from '@/hooks/useIsOwner';
import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';
import { getCostSums } from '@/util/armory';
import { findResourceName } from '@/util/resources';
import SidebarHeader from '../SidebarHeader';
import SquadStatistics from './SquadStatistics';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
  withPurchase?: boolean;
  realm?: GetRealmQuery['realm'];
  troopsStats: any;
  squad: keyof typeof Squad;
}

const EmptyTroopId = 0;

export const SquadBuilder = (props: SquadProps) => {
  const [toBuy, setToBuy] = useState<TroopInterface[]>([]);

  useEffect(() => {
    setToBuy([]);
  }, [props.squad]);

  const { data: troopStatsData } = useGetTroopStatsQuery();

  const isOwner = useIsOwner(props.realm?.settledOwner);

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
            onClick={(val) => {
              if (isOwner || val.troopId != EmptyTroopId) {
                setSelectedTroop(val);
              }
            }}
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
    return fillGap(1, 9);
  };
  const tier2 = () => {
    return fillGap(2, 5);
  };
  const tier3 = () => {
    return fillGap(3, 1);
  };

  const txQueue = useTransactionQueue();

  const selectedTroopIsEmpty =
    selectedTroop && selectedTroop.troopId == EmptyTroopId;

  return (
    <div className="flex flex-col w-full mt-4">
      <div
        className={`${
          props.flipped ? 'order-last' : ''
        } max-w-full flex gap-2 my-2`}
      >
        {tier1()}
      </div>
      <div className="flex justify-around w-full gap-3 mx-auto my-2 sm:w-3/4">
        {tier2()}
      </div>
      <div
        className={`${
          props.flipped ? 'order-first' : ''
        } flex justify-around w-full sm:w-1/2 mx-auto my-2`}
      >
        {tier3()}
      </div>
      <AtlasSidebar isOpen={!!selectedTroop}>
        <SidebarHeader
          onClose={() => setSelectedTroop(null)}
          title={
            selectedTroopIsEmpty
              ? `Train Tier ${selectedTroop?.tier || ' '} Troops`
              : selectedTroop?.troopName || 'Troop'
          }
        />

        {selectedTroopIsEmpty && troopStatsData?.getTroopStats && isOwner && (
          <>
            <ArmoryBuilder
              onBuildTroop={(t) => setToBuy(toBuy.concat(t))}
              squad={props.squad}
              troops={props.troops}
              troopsQueued={toBuy}
              statistics={troopStatsData.getTroopStats}
              realmId={props.realm?.realmId as number}
              hideSquadToggle
              filterTier={selectedTroop?.tier}
            />
            <div className="flex flex-wrap">
              <div className="w-full">
                <h3>Statistics Preview</h3>
                <SquadStatistics troops={props.troops} troopsQueued={toBuy} />
              </div>
              <div className="w-full mt-2">
                <h3>Costs</h3>
                {getCostSums(toBuy).map((a, index) => {
                  return (
                    <div key={index} className="inline-block mb-2">
                      <span className="">
                        <ResourceIcon
                          resource={findResourceName(a.resourceId)?.trait || ''}
                          size="xs"
                          className="self-center mr-4"
                        />
                        <span>{a.amount}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex">
              <Button
                disabled={toBuy.length == 0}
                onClick={() => {
                  txQueue.add(
                    createCall.buildSquad({
                      realmId: props.realm?.realmId,
                      troopIds: toBuy.map((t) => t.troopId),
                      squadSlot: Squad[props.squad],
                    })
                  );
                  setToBuy([]);
                }}
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
              <div className="mx-auto sm:w-1/2">
                <Image
                  src={`/realm-troops/${selectedTroop.troopName}.png`}
                  alt=""
                  width="200"
                  height="200"
                  layout={'responsive'}
                />
              </div>
              <div>Agility: {selectedTroop.agility}</div>
              <div>Attack: {selectedTroop.attack}</div>
              <div>Armor: {selectedTroop.defense}</div>
              <div>Vitality: {selectedTroop.vitality}</div>
              <div>Wisdom: {selectedTroop.wisdom}</div>
            </div>
          </>
        )}
      </AtlasSidebar>
    </div>
  );
};
