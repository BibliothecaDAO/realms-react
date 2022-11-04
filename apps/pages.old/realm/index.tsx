import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { RealmProvider } from '@/context/RealmContext';
import Layout from '@/components/Layout';

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
