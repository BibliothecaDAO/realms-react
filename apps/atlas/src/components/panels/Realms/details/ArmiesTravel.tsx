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

  const travelTable = allArmies?.map((a) => {
    const travel_information = getTravelTime({
      travellerId: realm.realmId,
      destinationId: a.destinationRealmId,
    });

    return {
      name: (
        <span className="flex space-x-2 text-lg font-display">
          {/* <OrderIcon
            className="mr-2"
            size="sm"
            order={a.orderType.toLowerCase()}
          />{' '} */}
          {a.realmId} | {a.armyId}
        </span>
      ),
      distance: travel_information.distance,
      time: <span>{travel_information.time / 60} min</span>,
      action: (
        <Button
          onClick={() => {
            router.push(`/realm/${a.realmId}?tab=Overview`, undefined, {
              shallow: true,
            });
          }}
          variant="outline"
          size="xs"
        >
          Armies Realm
        </Button>
      ),
    };
  });

  const ids = allArmies?.map((a) => a.destinationRealmId) || [];

  return (
    <div>
      <h3>Your armies</h3>
      <Button
        onClick={() => setTravelArcs(realm.realmId, ids)}
        variant="primary"
        size="xs"
      >
        show armies distance on atlas
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
