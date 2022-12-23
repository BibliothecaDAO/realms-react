import React from 'react';
import { defaultArmy } from '@/constants/army';
import type { GetRealmQuery } from '@/generated/graphql';
import { ArmyBuilder } from '../RealmArmyBuilder';

type Props = {
  realm: GetRealmQuery['realm'];
  buildings?: number[];
  availableFood: number | undefined;
  defendHistory: any;
};

export const DefendingArmy = (props: Props) => {
  const { realm, buildings, availableFood } = props;

  const blankArmy =
    props.realm.ownArmies.find((a) => a.armyId === 0) || defaultArmy;

  return (
    <div className="mt-3">
      <div className="justify-between col-span-12 my-4">
        <h2>Defending Army</h2>
        <p className="text-lg text-gray-700">
          This Army will defend your Realm from threats. Make sure to keep it
          fed.
        </p>
      </div>
      {buildings && (
        <ArmyBuilder
          realm={realm}
          armyId={0}
          army={blankArmy}
          buildings={buildings}
          availableFood={availableFood}
          defendHistory={props.defendHistory}
        />
      )}
    </div>
  );
};
