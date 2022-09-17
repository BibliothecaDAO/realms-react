import { Card } from '@bibliotheca-dao/ui-lib/base';
import React, { useState } from 'react';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  army?: Army;
};

type Battalion = {
  id: number;
  name: string;
  quantity: string;
  health: string;
  onMouseEnter?: () => void;
};

export const Battalion: React.FC<Battalion> = (props) => {
  return (
    <Card
      onMouseEnter={props.onMouseEnter}
      key={props.id}
      className="flex-col "
    >
      <h3 className="uppercase">{props.name}</h3>
      <div>Battlions: {props.quantity}</div>
      <div>Battlion Health: {props.health}</div>
    </Card>
  );
};

const blankB = { id: 1, name: 'sss', quantity: '2', health: '100' };

export const ArmyBuilderSideBar: React.FC<Prop> = (props) => {
  const [activeBattalion, setActiveBattalion] = useState<Battalion>(blankB);

  const army = props.army;
  const { armyBattalions } = useArmy();

  return (
    <div className="flex space-x-10">
      <div className="w-2/3">
        <h2 className="mt-4">Realm {army?.realmId}</h2>
        <h2>Current Army #{army?.armyId}</h2>
        {/* <div className="grid w-full grid-cols-2 gap-4">
          {troopList.map((troop, index) => (
            <Battalion
              onMouseEnter={() =>
                setActiveBattalion({
                  id: troop.troopId,
                  name: troop.name,
                  quantity: '2',
                  health: '100',
                })
              }
              key={index}
              id={troop.troopId}
              name={troop.name}
              quantity={army ? army[troop.name + 'Qty'] : ''}
              health={army ? army[troop.name + 'Health'] : ''}
            /> */}
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
      <div className="w-1/3">
        <h3 className="">
          Location:{' '}
          {army?.visitingRealmId != 0 ? army?.visitingRealmId : 'Home'}
        </h3>
        <h2>Recruitment Costs</h2>
        <div className="p-4 border rounded">
          <h2>{activeBattalion.name}</h2>
          <p>
            Description Description Description DescriptionDescriptionDe
            scriptionDescriptionDescriptionDescri ptionDescriptionDescription
            DescriptionDescriptionD scriptionDescriptionD escription
          </p>
        </div>
      </div>
    </div>
  );
};
