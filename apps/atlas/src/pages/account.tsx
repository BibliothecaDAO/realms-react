import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { AccountPanel } from '@/components/panels/AccountPanel';

export default function AccountPage() {
  return (
    <Layout>
      <AccountPanel />
      <ArtBackground background="hero" />
    </Layout>
  );
}
