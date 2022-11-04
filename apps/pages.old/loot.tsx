import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LootPanel } from '@/components/panels/LootPanel';
import { LootProvider } from '@/context/LootContext';
import Layout from '@/components/Layout';

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
