import React from 'react';
import { troopList } from '@/constants/troops';
import type { Army } from '@/generated/graphql';

import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  army?: Army;
};

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
  const army = props.army;

  return (
    <div className="flex">
      <div className="w-2/3">
        <h2 className="mt-4">Realm {army?.realmId}</h2>
        <h2>Current Army #{army?.armyId}</h2>
        <div className="grid w-full grid-cols-4 gap-4">
          {troopList.map((troop) => (
            <div key={troop.troopId} className="flex-col p-4 border">
              {troop.name}
              {army && (
                <div>
                  Qty: {army[troop.name + 'Qty']}
                  Health: {army[troop.name + 'Health']}
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
