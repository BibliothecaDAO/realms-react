import { Button, Card, CountdownTimer } from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import {
  COMBAT_OUTCOME_ATTACKER_WINS,
  battalionInformation,
  getUnitImage,
} from '@/constants/army';
import type { Army } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';

type Prop = {
  battalion: ArmyAndOrder;
  endBattalion?: Army;
};
interface HealthBarProps {
  health: number;
  troopId: number;
  baseHealth: number;
  endHealth?: number;
}
export const HealthBar = (props: HealthBarProps) => {
  const getVitality = () => {
    return (props.health / props.baseHealth) * 100;
  };

  const getColour = () => {
    const vit = getVitality();
    if (vit > 70) {
      return 'bg-green-800/70 ';
    } else if (vit > 50) {
      return 'bg-yellow-200 ';
    } else if (vit > 25) {
      return 'bg-red-200 ';
    } else {
      return 'bg-red-500 ';
    }
  };

  return (
    <div className="absolute bottom-0 flex h-full transform rotate-180">
      <div
        style={{
          height: `${getVitality()}%`,
        }}
        className={`${getColour()} transform w-2 rounded border border-white/30`}
      ></div>
    </div>
  );
};
export const BattalionImagesCard: React.FC<Prop> = (props) => {
  return (
    <>
      {battalionInformation.map((unit) => {
        return (
          <>
            {props.battalion[unit.name + 'Qty'] > 0 && (
              <div key={unit.id} className="relative h-32">
                <Image
                  src={getUnitImage(unit.id)}
                  layout="fill"
                  objectFit="cover"
                />
                <HealthBar
                  troopId={unit.id}
                  health={props.battalion[unit.name + 'Health']}
                  endHealth={
                    props.endBattalion
                      ? props.endBattalion[unit.name + 'Health']
                      : 0
                  }
                  baseHealth={0} // TODO add base amount of health (unit health * qty)
                />
                <div className="relative flex flex-col justify-end w-full h-full">
                  <div>
                    <span className="bottom-0 mr-2 text-2xl">
                      {props.battalion[unit.name + 'Qty']}x
                    </span>

                    <span>Health: {props.battalion[unit.name + 'Health']}</span>
                    {props.endBattalion && (
                      <span>
                        End Health: {props.endBattalion[unit.name + 'Health']}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })}
    </>
  );
};
