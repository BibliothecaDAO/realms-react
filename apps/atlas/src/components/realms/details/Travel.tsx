import { OrderIcon } from '@bibliotheca-dao/ui-lib';
import React from 'react';
import type { RealmFragmentFragment } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { getRealmOrderById } from '../RealmsGetters';
import { ArmiesTravel } from './ArmiesTravel';
type Prop = {
  realm: RealmFragmentFragment;
};

export const Travel = ({ realm }: Prop) => {
  const { userRealms } = useUsersRealms();

  return (
    <div className="min-h-full p-5 overflow-scroll">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="self-center w-full text-center">{realm.name}</h1>
          <OrderIcon
            className="self-center"
            size="md"
            order={getRealmOrderById(realm.realmId) || ''}
          />{' '}
        </div>

        <hr />
        <h3 className="mt-3">
          Travel an Army to {realm.name}, then you will be able to Attack.
        </h3>
      </div>

      <ArmiesTravel realm={realm} userRealms={userRealms} />
    </div>
  );
};
