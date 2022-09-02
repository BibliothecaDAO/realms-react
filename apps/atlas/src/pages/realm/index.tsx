import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { RealmProvider } from '@/context/RealmContext';

export default function RealmPage() {
  return (
    <Layout>
      <RealmProvider>
        <RealmsPanel />
      </RealmProvider>
      <ArtBackground background="realm" />
    </Layout>
  );
}
