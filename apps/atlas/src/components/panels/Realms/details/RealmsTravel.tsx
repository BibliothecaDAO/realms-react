import { Button, Table, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import { useRouter } from 'next/router';
import React from 'react';

import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';

import { getTravelTime } from '@/shared/Getters/Realm';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const RealmsTravel = ({ realm, userRealms }: Prop) => {
  const ids = userRealms?.realms.map((a) => a.realmId) || [];
  const router = useRouter();
  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();
  const travelTable = userRealms?.realms.map((a) => {
    const travel_information = getTravelTime({
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
      time: <span>{(travel_information.time / 60 / 60).toFixed(2)} Hrs</span>,
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

  return (
    <div>
      <h3>Your realms</h3>
      <Button
        onClick={() => setTravelArcs(realm.realmId, ids)}
        variant="primary"
        size="xs"
      >
        show travel distance to realms
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
    </div>
  );
};
