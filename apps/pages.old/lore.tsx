import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LorePanel } from '@/components/panels/LorePanel';
import { LoreProvider } from '@/context/LoreContext';
import Layout from '@/components/Layout';

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
