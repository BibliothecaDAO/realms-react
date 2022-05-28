import { Troop } from '@/shared/squad/Troops';
import type { TroopInterface } from '@/types/index';

interface SquadProps {
  className?: string;
  troops: Array<TroopInterface>;
}

export const SquadBuilder = (props: SquadProps) => {
  const getTier = (tier: number) => {
    return props.troops.filter((a) => a.tier === tier);
  };
  return (
    <>
      <div className="flex justify-around w-full my-2">
        {getTier(1).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
      <div className="flex justify-around w-full my-2 ">
        {getTier(2).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
      <div className="flex justify-around w-full my-2">
        {getTier(3).map((a, index) => {
          return <Troop key={index} troop={a} />;
        })}
      </div>
    </>
  );
};
