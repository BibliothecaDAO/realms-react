import {
  Card,
  CardTitle,
  CardStats,
  CardBody,
  Button,
  CountdownTimer,
  Table,
  OrderIcon,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, STORE_HOUSE_SIZE } from '@/constants/buildings';
import { useAtlasContext } from '@/context/AtlasContext';
import type { GetRealmQuery, RealmFragmentFragment } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import useIsOwner from '@/hooks/useIsOwner';
import {
  TraitTable,
  squadStats,
  RealmVaultStatus,
  hasOwnRelic,
  RealmCombatStatus,
  getTrait,
  GetTravelTime,
} from '@/shared/Getters/Realm';
import type {
  BuildingDetail,
  RealmFoodDetails,
  BuildingFootprint,
  AvailableResources,
} from '@/types/index';
import { BaseRealmDetailPanel } from '../BaseRealmDetailPanel';

type Prop = {
  realm: RealmFragmentFragment;
};

export const RealmTravel = ({ realm }: Prop) => {
  const { userRealms } = useUsersRealms();
  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();

  const ids = userRealms?.realms.map((a) => a.realmId) || [];

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
          onClick={() => travel(a.realmId, realm.realmId)}
          variant="outline"
          size="xs"
        >
          Move Army{' '}
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
