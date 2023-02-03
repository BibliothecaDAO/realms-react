/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Layout from '@/components/Layout';
import { AtlasSidebars } from '@/components/map/AtlasSidebars';
import { MapModule } from '@/components/map/MapModule';
import { ThreeCanvas } from '@/components/map/three/Canvas';

import { RealmProvider } from '@/context/RealmContext';

export default function AtlasPage() {
  return (
    <Layout>
      <RealmProvider>
        <ThreeCanvas />
        {/* <MapModule /> */}
        <AtlasSidebars />
      </RealmProvider>
    </Layout>
  );
}
