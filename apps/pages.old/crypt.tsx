import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { CryptsPanel } from '@/components/panels/CryptsPanel';
import { CryptProvider } from '@/context/CryptContext';
import Layout from '@/components/Layout';

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
