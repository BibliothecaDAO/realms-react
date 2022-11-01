import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LootPanel } from '@/components/panels/LootPanel';
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
