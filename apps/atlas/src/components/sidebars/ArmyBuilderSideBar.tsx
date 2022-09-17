import React from 'react';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  army?: Army;
};

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
  const army = props.army;
  const { armyBattalions } = useArmy();

  return (
    <div className="flex">
      <div className="w-2/3">
        <h2 className="mt-4">Realm {army?.realmId}</h2>
        <h2>Current Army #{army?.armyId}</h2>
        <div className="grid w-full grid-cols-4 gap-4">
          {armyBattalions?.map((battalion) => (
            <div key={battalion.battalionId} className="flex-col p-4 border">
              {battalion.battalionName}
              {army && (
                <div>
                  Qty: {army[battalion.battalionName + 'Qty']}
                  Health: {army[battalion.battalionName + 'Health']}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 -mt-12">
        <h3 className="">
          Location:{' '}
          {army?.visitingRealmId != 0 ? army?.visitingRealmId : 'Home'}
        </h3>
        <h2>Recruitment Costs</h2>
      </div>
    </div>
  );
};
