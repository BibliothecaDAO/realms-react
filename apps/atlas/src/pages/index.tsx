/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Layout from '@/components/Layout';
import { AtlasSidebars } from '@/components/map/AtlasSidebars';
import { ThreeCanvas } from '@/components/map/three/Canvas';
import { MapCanvas } from '@/components/map/three/Map';

import { RealmProvider } from '@/context/RealmContext';

export default function AtlasPage() {
  return (
    <Layout>
      <RealmProvider>
        <MapCanvas />
        <AtlasSidebars />
      </RealmProvider>
    </Layout>
  );
}
