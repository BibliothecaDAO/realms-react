import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { BankPanel } from '@/components/panels/BankPanel';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';

export default function RealmPage() {
  return (
    <Layout>
      <BankPanel />
      <ResourceSwapSideBar isOpen={true} />
      <ArtBackground background="bank" />
    </Layout>
  );
}
