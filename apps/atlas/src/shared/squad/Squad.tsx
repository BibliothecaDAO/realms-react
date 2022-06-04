import { Button } from '@bibliotheca-dao/ui-lib/base';
import { number } from 'starknet';
import useCombat from '@/hooks/settling/useCombat';
import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
  flipped?: boolean;
  withPurchase?: boolean;
  realmId: number;
  location: number; // 1 attack 2 defence
}

export const SquadBuilder = (props: SquadProps) => {
  const { buildSquad } = useCombat({ token_id: props.realmId });

  const troopsToPurchase = [
    {
      troopId: 1,
      index: 1,
      type: 1,
      tier: 1,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
    },
    {
      troopId: 1,
      index: 1,
      type: 1,
      tier: 1,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
    },
    {
      troopId: 1,
      index: 1,
      type: 1,
      tier: 1,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
    },
    {
      troopId: 2,
      index: 2,
      type: 2,
      tier: 2,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
    },
    {
      troopId: 3,
      index: 3,
      type: 2,
      tier: 3,
      agility: 0,
      attack: 0,
      defense: 0,
      vitality: 0,
      wisdom: 0,
      squadSlot: 0,
    },
  ];

  const troopIdsToPurchase = () => {
    return troopsToPurchase.map((a) => a.troopId);
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

  const tier1 = () => {
    return fillGap(1, 16);
  };
  const tier2 = () => {
    return fillGap(2, 8);
  };
  const tier3 = () => {
    return fillGap(3, 1);
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
      {props.withPurchase && (
        <div className="w-full p-8 rounded bg-white/20">
          <h4>buy troops</h4>{' '}
          <div className="flex space-x-2">
            {troopsToPurchase.map((a, index) => {
              return <Troop withPurchase={false} key={index} troop={a} />;
            })}
          </div>
          <Button
            onClick={() => buildSquad(troopIdsToPurchase(), props.location)}
            className="mt-4"
            variant="primary"
          >
            Purchase
          </Button>
        </div>
      )}
    </div>
  );
};
