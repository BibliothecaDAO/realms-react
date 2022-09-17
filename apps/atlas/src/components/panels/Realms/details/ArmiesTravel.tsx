import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { ArmyCard } from '@/components/cards/realms/ArmyCard';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, STORE_HOUSE_SIZE } from '@/constants/buildings';
import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useIsOwner from '@/hooks/useIsOwner';
import { GetTravelTime } from '@/shared/Getters/Realm';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const ArmiesTravel = ({ realm, userRealms }: Prop) => {
  const router = useRouter();
  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();
  const allArmies = userRealms?.realms.flatMap(({ ownArmies }) =>
    ownArmies.length ? ownArmies.filter((army) => army.armyId != 0) : []
  );

  const travelTable = userRealms?.realms.map((a) => {
    const travel_information = GetTravelTime({
      travellerId: realm.realmId,
      destinationId: a.realmId,
    });
    return {
      name: (
        <span className="flex space-x-2 text-lg font-display">
          <OrderIcon
            className="mr-2"
            size="sm"
            order={a.orderType.toLowerCase()}
          />{' '}
          {a.name}
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
          View Realm
        </Button>
      ),
    };
  });

  const travelTableFiltered = travelTable?.sort(
    (a, b) => parseInt(a.distance) - parseInt(b.distance)
  );
  const columns = [
    { Header: 'Name', id: 1, accessor: 'name' },
    { Header: 'Distance', id: 2, accessor: 'distance' },
    { Header: 'Time', id: 3, accessor: 'time' },
    { Header: 'Action', id: 4, accessor: 'action' },
  ];
  const tableOptions = { is_striped: true };

  const ids = allArmies?.map((a) => a.realmId) || [];

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
      <div className="relative grid grid-cols-2 gap-4 mt-4 overflow-x-auto">
        {allArmies?.map((army) => {
          return (
            <ArmyCard
              key={army.armyId}
              army={army}
              onTravel={() => travel(army.armyId, army.realmId, realm.realmId)}
            />
          );
        })}
      </div>
    </div>
  );
};
