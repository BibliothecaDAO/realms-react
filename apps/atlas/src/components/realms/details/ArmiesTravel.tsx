import { Button, OrderIcon, Table } from '@bibliotheca-dao/ui-lib/base';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';

import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import { useRouter } from 'next/router';
import React from 'react';
import { ArmyCard } from '@/components/armies/armyCard/ArmyCard';
import {
  GetArmyStrength,
  getAttackingArmies,
} from '@/components/armies/ArmyGetters';
import { ArmyToolTip } from '@/components/armies/ArmyToolTip';
import { useAtlasContext } from '@/context/AtlasContext';
import type {
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import {
  getHolderOfRelic,
  getRealmNameById,
  getRealmOrderById,
  getRelicsOwned,
  getTravelTime,
} from '../RealmsGetters';

type Prop = {
  realm: RealmFragmentFragment;
  userRealms?: GetRealmsQuery;
};

export const ArmiesTravel = ({ realm, userRealms }: Prop) => {
  const router = useRouter();
  const {
    travelContext: { travel, setTravelArcs, clearTravelArcs, travelArcs },
    mapContext: { navigateToAsset },
  } = useAtlasContext();

  const allArmies = getAttackingArmies(userRealms?.realms)?.filter(
    (a) => a.orderType != realm.orderType
  );

  const ids = allArmies?.map((a) => a.destinationRealmId) || [];

  const realmsRelics = getRelicsOwned(realm);

  const hasRelicOfRealm = (realmId: number) => {
    return realmsRelics?.find((r) => r.realmId == realmId) ?? false;
  };

  const armyTravelTable = allArmies
    ?.map((army) => {
      const travelInformation = getTravelTime({
        travellerId: army.destinationRealmId || army.realmId,
        destinationId: realm.realmId,
      });
      return {
        details: (
          <span className="flex justify-between">
            <ArmyToolTip army={army} />

            {getRealmOrderById(army.realmId) == realm.orderType && (
              <Helm className={'w-5 h-5 fill-frame-primary'} />
            )}
            {hasRelicOfRealm(army.realmId) && (
              <Relic className={`w-3 fill-yellow-500`} />
            )}
          </span>
        ),
        name: (
          <span className="flex justify-start space-x-2">
            <OrderIcon
              className="mr-2"
              size="sm"
              order={getRealmOrderById(army.realmId) || ''}
            />{' '}
            {getRealmNameById(army.realmId)}
          </span>
        ),
        distance: travelInformation.distance,
        time: <span>{(travelInformation.time / 60 / 60).toFixed(2)} Hrs</span>,
        action: (
          <div className="space-x-2">
            <Button
              onClick={() => travel(army.armyId, army.realmId, realm.realmId)}
              variant="outline"
              size="xs"
            >
              travel
            </Button>
            <Button
              onClick={() => navigateToAsset(army.realmId, 'realm')}
              variant="secondary"
              size="xs"
            >
              Fly
            </Button>
          </div>
        ),
      };
    })
    .sort((a, b) => parseInt(a.distance) - parseInt(b.distance));

  const columns = [
    { Header: 'Name', id: 2, accessor: 'name' },
    { Header: 'Details', id: 1, accessor: 'details' },
    // { Header: 'Distance', id: 3, accessor: 'distance' },
    { Header: 'Time', id: 4, accessor: 'time' },
    { Header: 'Action', id: 5, accessor: 'action' },
  ];
  const tableOptions = { is_striped: false };

  return (
    <div>
      <div className="relative mb-4 overflow-x-auto">
        {armyTravelTable && (
          <Table
            columns={columns}
            data={armyTravelTable}
            options={tableOptions}
          />
        )}
      </div>

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
      {/* <div className="relative grid grid-cols-1 gap-2 mt-4 overflow-x-auto">
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
      </div> */}
    </div>
  );
};
