import { OrderIcon } from '@bibliotheca-dao/ui-lib';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import React, { useMemo, useState } from 'react';
import type { RealmFragmentFragment } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import { getRealmOrderById } from '../RealmsGetters';
import { ArmiesTravel } from './ArmiesTravel';
type Prop = {
  realm: RealmFragmentFragment;
};

export const Travel = ({ realm }: Prop) => {
  const { userRealms } = useUsersRealms();
  const { play } = useUiSounds(soundSelector.pageTurn);

  return (
    <div className="p-5">
      <div className="mb-4">
        <h1 className="flex">
          {' '}
          <OrderIcon
            className="self-center mx-2"
            size="lg"
            order={getRealmOrderById(realm.realmId) || ''}
          />{' '}
          <span className="self-center">{realm.name}</span>
        </h1>
        <hr />
        <h3 className="mt-3">
          Travel an Army to {realm.name}, then you will be able to Attack.
        </h3>
      </div>

      <ArmiesTravel realm={realm} userRealms={userRealms} />
    </div>
  );
};
