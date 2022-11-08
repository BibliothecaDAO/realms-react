import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useRouter } from 'next/router';
import React from 'react';
import { ArmyCard } from '@/components/cards/realms/ArmyCard';

import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';

import { getTravelTime } from '@/shared/Getters/Realm';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const ArmiesTravel = ({ realm, userRealms }: Prop) => {
  const router = useRouter();
  const { findRealmsAttackingArmies } = useArmy();
  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();

  const allArmies = findRealmsAttackingArmies(userRealms?.realms);

  const ids = allArmies?.map((a) => a.destinationRealmId) || [];

  return (
    <div>
      <h3>Your Armies</h3>
      <Button
        onClick={() => setTravelArcs(realm.realmId, ids)}
        variant="primary"
        size="xs"
      >
        show armies distance
      </Button>
      <div className="relative grid grid-cols-2 gap-2 mt-4 overflow-x-auto">
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
