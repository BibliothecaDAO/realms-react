import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmsPanel } from '@/components/realms/RealmsPanel';
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
