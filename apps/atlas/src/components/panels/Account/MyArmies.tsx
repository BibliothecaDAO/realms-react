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
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import useIsOwner from '@/hooks/useIsOwner';
import { getTravelTime } from '@/shared/Getters/Realm';

export const MyArmies = () => {
  const { userData } = useUsersRealms();

  const router = useRouter();
  const { findRealmsAttackingArmies } = useArmy();
  const {
    travelContext: { travel, setTravelArcs },
  } = useAtlasContext();

  return (
    <div className="px-4 mt-4 ">
      <h3>Your armies</h3>
      <div className="relative grid grid-cols-6 gap-4 overflow-x-auto">
        {userData.attackingArmies?.map((army, index) => {
          return (
            <ArmyCard
              key={index}
              army={army}
              onBuildArmy={() => {
                router.push(`/realm/${army.realmId}?tab=Army`, undefined, {
                  shallow: true,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
