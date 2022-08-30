import React from 'react';
import Layout from '@/components/Layout';
import { LorePanel } from '@/components/panels/LorePanel';
import { LoreProvider } from '@/context/LoreContext';

export default function RealmPage() {
  return (
    <Layout>
      <LoreProvider>
        <LorePanel />
      </LoreProvider>
    </Layout>
  );
}
