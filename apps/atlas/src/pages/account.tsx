import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { AccountPanel } from '@/components/panels/AccountPanel';
import { RealmProvider } from '@/context/RealmContext';

export default function AccountPage() {
  return (
    <Layout>
      <RealmProvider>
        <AccountPanel />
      </RealmProvider>
      <ArtBackground background="hero" />
    </Layout>
  );
}
