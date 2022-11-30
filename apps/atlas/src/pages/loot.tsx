import React from 'react';
import Layout from '@/components/Layout';
import { LootPanel } from '@/components/loot/LootPanel';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LootProvider } from '@/context/LootContext';

export default function LootPage() {
  return (
    <Layout>
      <LootProvider>
        <LootPanel />
      </LootProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
