import React from 'react';
import Layout from '@/components/Layout';
import { LorePanel } from '@/components/lore/LorePanel';
import { ArtBackground } from '@/components/map/ArtBackground';
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
