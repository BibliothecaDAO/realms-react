import React from 'react';
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { getRealm } from '@/lib/realm/getRealm';
import { getStarkNetId } from '@/lib/starknet/getStarkNetId';
import NavigationTabs from './NavigationTabs';
import RealmBannerHeading from './RealmBannerHeading';

export default async function RealmLayout({ children, params }) {
  const { realm } = await getRealm(params.id);

  // TODO move to realmbanner component
  const starknetId = await getStarkNetId(realm?.settledOwner);

  return (
    <>
      <BasePanel open={true} style="lg:w-12/12">
        <RealmBannerHeading
          realm={realm}
          starknetId={starknetId}
          hideSearchFilter
        />
        <NavigationTabs realmId={params.id} />
        <section>{children}</section>
      </BasePanel>
      <ArtBackground background="realm" />
    </>
  );
}
