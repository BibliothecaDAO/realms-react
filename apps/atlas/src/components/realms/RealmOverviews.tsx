import React from 'react';
import { RealmCard } from '@/components/realms/RealmCard';
import type { RealmFragmentFragment } from '@/generated/graphql';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isYourRealms?: boolean;
}

export function RealmOverviews(props: RealmOverviewsProps) {
  const filteredRealms = props.realms;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-1 ">
      {props.realms &&
        filteredRealms.map((realm: RealmFragmentFragment, index) => (
          <RealmCard loading={false} key={realm.realmId} realm={realm} />
        ))}
    </div>
  );
}
