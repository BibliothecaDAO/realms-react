import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { CreationPanel } from '@/components/panels/CreationPanel';
import { LootProvider } from '@/context/LootContext';

export default function LootPage() {
  return (
    <Layout>
      <LootProvider>
        <CreationPanel />
      </LootProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
