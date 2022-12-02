import { BattalionWithImage } from '@/components/armies/squad/BattalionWithImage';
import type { Army } from '@/generated/graphql';
import { nameArray, useArmy } from '@/hooks/settling/useArmy';
import { ArmyStatisticsTable } from './ArmyStatisticsTable';

export interface ArmyAndOrder extends Army {
  orderType?: string;
}

type Prop = {
  army: ArmyAndOrder;
};

export const ArmyStatistics: React.FC<Prop> = (props) => {
  const army = props.army;
  const { battalions } = useArmy();
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 p-2 ">
        {battalions?.map((battalion, index) => {
          return (
            <>
              {army && army[nameArray[index] + 'Qty'] > 0 && (
                <BattalionWithImage
                  key={index}
                  {...battalion}
                  quantity={army ? army[nameArray[index] + 'Qty'] : ''}
                  health={army ? army[nameArray[index] + 'Health'] : ''}
                />
              )}
            </>
          );
        })}
      </div>
      <ArmyStatisticsTable army={army} />
    </div>
  );
};
