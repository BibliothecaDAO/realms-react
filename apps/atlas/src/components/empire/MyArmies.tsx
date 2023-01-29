import { useRouter } from 'next/router';
import React from 'react';
import { ArmyCard } from '@/components/armies/card/ArmyCard';
import useUsersRealms from '@/hooks/settling/useUsersRealms';

export const MyArmies = () => {
  const { userData } = useUsersRealms();
  const router = useRouter();

  return (
    <div className="px-4 mt-4 ">
      <h2 className="mb-4">Your Armies</h2>
      <div className="relative grid gap-4 sm:grid-cols-2">
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
