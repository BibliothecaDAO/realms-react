import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
  withPurchase?: boolean;
}

export const SquadBuilder = (props: SquadProps) => {
  const emptyTroop = {
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
  };

  const fillGap = (tier: number, length: number) => {
    const currentTroops = props.troops.filter((a) => a.tier === tier);
    const temp: TroopInterface[] = [];

    for (let index = 0; index < length - currentTroops.length; index++) {
      emptyTroop['tier'] = tier;
      temp.push(emptyTroop);
    }

    return currentTroops.concat(temp).map((a, index) => {
      return <Troop withPurchase={props.withPurchase} key={index} troop={a} />;
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`${
          props.flipped ? 'order-last' : ''
        } flex justify-around w-full my-2`}
      >
        {fillGap(1, 16)}
      </div>
      <div className="flex justify-around w-full my-2 ">{fillGap(2, 8)}</div>
      <div
        className={`${
          props.flipped ? 'order-first' : ''
        } flex justify-around w-full my-2`}
      >
        {fillGap(3, 1)}
      </div>
    </div>
  );
};
