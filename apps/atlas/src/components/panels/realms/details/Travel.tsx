import {
  Card,
  CardTitle,
  CardStats,
  CardBody,
  Button,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmBuildingId, STORE_HOUSE_SIZE } from '@/constants/buildings';
import type { GetRealmQuery, RealmFragmentFragment } from '@/generated/graphql';
import type { Subview } from '@/hooks/settling/useRealmDetailHotkeys';
import useTravel from '@/hooks/settling/useTravel';
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
  const { travel } = useTravel();
  return (
    <div>
      <h3>Your realms</h3>
      {userRealms?.realms.map((a, index) => {
        const travel_information = GetTravelTime({
          travellerId: realm.realmId,
          destinationId: a.realmId,
        });
        return (
          <div key={index} className="my-1">
            {a.name} - {travel_information.distance}km -{' '}
            {travel_information.time / 60} minutes travel time
            <Button
              onClick={() => travel(a.realmId, realm.realmId)}
              variant="outline"
              size="sm"
            >
              Travel{' '}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
