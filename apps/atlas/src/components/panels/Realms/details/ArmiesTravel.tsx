import { Button, OrderIcon, Table } from '@bibliotheca-dao/ui-lib/base';
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
import { useArmy } from '@/hooks/settling/useArmy';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useIsOwner from '@/hooks/useIsOwner';
import { GetTravelTime } from '@/shared/Getters/Realm';

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
    const travel_information = GetTravelTime({
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
      <div className="relative mt-4 overflow-x-auto">
        {userRealms?.realms && (
          <Table
            columns={columns}
            data={travelTableFiltered}
            options={tableOptions}
          />
        )}
      </div>
      <div className="relative grid grid-cols-2 gap-4 mt-4 overflow-x-auto">
        {allArmies?.map((army, index) => {
          return (
            <ArmyCard
              key={index}
              army={army}
              selectedRealm={realm.realmId}
              onTravel={() => travel(army.armyId, army.realmId, realm.realmId)}
            />
          );
        })}
      </div>
    </div>
  );
};
