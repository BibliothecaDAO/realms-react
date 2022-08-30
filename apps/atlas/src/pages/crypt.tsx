import React from 'react';
import Layout from '@/components/Layout';
import { CryptsPanel } from '@/components/panels/CryptsPanel';
import { CryptProvider } from '@/context/CryptContext';
// import { CryptsSideBar } from '@/components/sidebars/CryptsSideBar';

export default function RealmPage() {
  return (
    <Layout>
      <CryptProvider>
        <CryptsPanel />
        {/* <CryptsSideBar /> */}
      </CryptProvider>
    </Layout>
  );
}
