import React from 'react';
import { CryptsPanel } from '@/components/crypts/CryptsPanel';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
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
