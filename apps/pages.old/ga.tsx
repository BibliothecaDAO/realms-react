import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { GaPanel } from '@/components/panels/GaPanel';
import { GaProvider } from '@/context/GaContext';
import Layout from '@/components/Layout';

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
