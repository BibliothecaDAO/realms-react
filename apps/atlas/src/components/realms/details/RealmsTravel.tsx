import { Button, Table, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import React from 'react';
import { getTravelTime } from '@/components/realms/RealmsGetters';
import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const RealmsTravel = ({ realm, userRealms }: Prop) => {
  const ids = userRealms?.realms.map((a) => a.realmId) || [];

  const {
    travelContext: { setTravelArcs },
    mapContext: { navigateToAsset },
  } = useAtlasContext();

  const travelTable = userRealms?.realms.map((a) => {
    const travelInformation = getTravelTime({
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
      distance: travelInformation.distance,
      time: <span>{(travelInformation.time / 60 / 60).toFixed(2)} Hrs</span>,
      action: (
        <Button
          onClick={() => navigateToAsset(a.realmId, 'realm')}
          variant="outline"
          size="xs"
        >
          view
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
      <div className="relative mt-4 overflow-x-auto">
        {userRealms?.realms && (
          <Table
            columns={columns}
            data={travelTableFiltered}
            options={tableOptions}
          />
        )}
      </div>
      <div className="mt-2">
        <Button
          onClick={() => setTravelArcs(realm.realmId, ids)}
          variant="primary"
          size="xs"
        >
          travel distance to realms
        </Button>
      </div>
    </div>
  );
};
