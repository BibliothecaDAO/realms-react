import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { BasePanel } from '@/components/panels/BasePanel';
import { getRealm } from '@/lib/realm/getRealm';
import { getStarkNetId } from '@/lib/starknet/getStarkNetId';
import NavigationTabs from './NavigationTabs';
import RealmBannerHeading from './RealmBannerHeading';

export default async function RealmLayout({ children, params }) {
  const { realm } = await getRealm(params.id);
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
