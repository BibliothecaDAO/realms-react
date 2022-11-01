import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { CryptsPanel } from '@/components/panels/CryptsPanel';
import { CryptProvider } from '@/context/CryptContext';

export default function RealmPage() {
  return (
    <Layout>
      <CryptProvider>
        <CryptsPanel />
      </CryptProvider>
      <ArtBackground background="crypt" />
    </Layout>
  );
}
