import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useRouter } from 'next/router';
import React from 'react';

import { ArmyCard } from '@/components/armies/armyCard/ArmyCard';
import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const ArmiesTravel = ({ realm, userRealms }: Prop) => {
  const router = useRouter();
  const { findRealmsAttackingArmies } = useArmy();
  const {
    travelContext: { travel, setTravelArcs, clearTravelArcs, travelArcs },
    mapContext: { navigateToAsset },
  } = useAtlasContext();

  const allArmies = findRealmsAttackingArmies(userRealms?.realms);

  const ids = allArmies?.map((a) => a.destinationRealmId) || [];

  return (
    <div>
      <h3>Your Armies</h3>
      <Button
        onClick={() => {
          if (travelArcs?.length) {
            clearTravelArcs();
            return;
          }
          setTravelArcs(realm.realmId, ids);
          navigateToAsset(realm.realmId, 'realm');
        }}
        variant="primary"
        size="xs"
      >
        {travelArcs?.length ? 'Hide ' : 'Show '}
        armies distance
      </Button>
      <div className="relative grid grid-cols-1 gap-2 mt-4 overflow-x-auto">
        {allArmies?.map((army, index) => {
          return (
            <ArmyCard
              key={index}
              army={army}
              selectedRealm={realm.realmId}
              onTravel={() => travel(army.armyId, army.realmId, realm.realmId)}
              onBuildArmy={() => {
                router.push(`/realm/${realm.realmId}?tab=Army`, undefined, {
                  shallow: true,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
