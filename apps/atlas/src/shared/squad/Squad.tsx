import { Troop } from '@/shared/squad/Troops';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
}

interface TroopInterface {
  troopId: number;
  index: number;
  type: number;
  tier: number;
  agility: number;
  attack: number;
  defense: number;
  vitality: number;
  wisdom: number;
  squadSlot: number;
}

export const SquadBuilder = (props: SquadProps) => {
  const getTier = (tier: number) => {
    return props.troops.filter((a) => a.tier === tier);
  };
  return (
    <div
      className={`flex flex-wrap p-4 text-gray-600 bg-white rounded shadow-sm bg-opacity-30 ${props.className}`}
    >
      <div className="flex justify-around w-full my-2">
        {getTier(1).map((a, index) => {
          return (
            <Troop
              key={index}
              vitality={a.vitality}
              tier={'t1'}
              troopId={a.troopId}
            />
          );
        })}
      </div>
      <div className="flex justify-around w-full my-2 ">
        {getTier(2).map((a, index) => {
          return (
            <Troop
              key={index}
              vitality={a.vitality}
              tier={'t2'}
              troopId={a.troopId}
            />
          );
        })}
      </div>
      <div className="flex justify-around w-full my-2">
        {getTier(3).map((a, index) => {
          return (
            <Troop
              key={index}
              vitality={a.vitality}
              tier={'t3'}
              troopId={a.troopId}
            />
          );
        })}
      </div>
    </div>
  );
};
