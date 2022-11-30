import React from 'react';
import { GaPanel } from '@/components/ga/GaPanel';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
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
