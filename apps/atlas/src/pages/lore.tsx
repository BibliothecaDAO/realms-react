import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LorePanel } from '@/components/panels/LorePanel';
import { LoreProvider } from '@/context/LoreContext';

export default function LorePage() {
  return (
    <Layout>
      <LoreProvider>
        <LorePanel />
      </LoreProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
