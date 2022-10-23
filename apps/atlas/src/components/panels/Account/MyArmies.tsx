import { useRouter } from 'next/router';
import React from 'react';
import { ArmyCard } from '@/components/cards/realms/ArmyCard';
import useUsersRealms from '@/hooks/settling/useUsersRealms';

export const MyArmies = () => {
  const { userData } = useUsersRealms();
  const router = useRouter();

  return (
    <div className="px-4 mt-4 ">
      <h2>Your armies</h2>
      <div className="relative grid gap-4 overflow-x-auto sm:grid-cols-4">
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
