import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
}

export const SquadBuilder = (props: SquadProps) => {
  const getTier = (tier: number) => {
    return props.troops.filter((a) => a.tier === tier);
  };

  const fillGap = (tier: number, length: number) => {
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

    const currentTroops = getTier(tier);

    for (let index = 0; index <= length - currentTroops.length; index++) {
      emptyTroop['tier'] = tier;
      currentTroops.push(emptyTroop);
    }

    return currentTroops;
  };
  return (
    <div className="flex flex-col">
      <div
        className={`${
          props.flipped ? 'order-last' : ''
        } flex justify-around w-full my-2`}
      >
        {fillGap(1, 16).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
      <div className="flex justify-around w-full my-2 ">
        {fillGap(2, 8).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
      <div
        className={`${
          props.flipped ? 'order-first' : ''
        } flex justify-around w-full my-2`}
      >
        {fillGap(3, 1).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
    </div>
  );
};
