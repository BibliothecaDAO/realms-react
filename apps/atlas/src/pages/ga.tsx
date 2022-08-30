import React from 'react';
import Layout from '@/components/Layout';
// import { GASideBar } from '@/components/sidebars/GASideBar';
import { GaPanel } from '@/components/panels/GaPanel';
import { GaProvider } from '@/context/GaContext';

export default function RealmPage() {
  return (
    <Layout>
      <GaProvider>
        <GaPanel />
        {/* <GASideBar /> */}
      </GaProvider>
    </Layout>
  );
}
