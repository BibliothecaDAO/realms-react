import { Button } from '@bibliotheca-dao/ui-lib/base';
import React, { useState } from 'react';
import { ArmyCard } from '@/components/armies/card/ArmyCard';
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

  const [buildingArmy, setBuildingArmy] = useState<boolean>(false);

  const blankArmy =
    props.realm.ownArmies.find((a) => a.armyId === 0) || defaultArmy;

  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 gap-4 my-4">
        <div>
          <h2 className="mb-3">Defending Army</h2>
          <p className="text-xl text-gray-700 ">
            This Army will defend your Realm from threats. Make sure to keep it
            fed.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setBuildingArmy(!buildingArmy)}
            >
              Toggle Army Builder
            </Button>
          </div>
        </div>

        <ArmyCard selectedRealm={realm.realmId} army={blankArmy} />
      </div>

      {buildings && buildingArmy && (
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
