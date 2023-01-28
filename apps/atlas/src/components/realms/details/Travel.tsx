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
    <div className="p-5 overflow-scroll">
      <div className="mb-4">
        <div className="flex justify-between">
          <h1 className="self-center">{realm.name}</h1>
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
