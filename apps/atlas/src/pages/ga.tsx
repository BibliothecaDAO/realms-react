import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { GaPanel } from '@/components/panels/GaPanel';
import { GaProvider } from '@/context/GaContext';

export default function GAPage() {
  return (
    <Layout>
      <GaProvider>
        <GaPanel />
      </GaProvider>
      <ArtBackground background="warRoom" />
    </Layout>
  );
}
