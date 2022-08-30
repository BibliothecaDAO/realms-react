import React from 'react';
import Layout from '@/components/Layout';
import { LootPanel } from '@/components/panels/LootPanel';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { LootProvider } from '@/context/LootContext';

export default function RealmPage() {
  return (
    <Layout>
      <LootProvider>
        <LootPanel />
        <LootSideBar />
      </LootProvider>
    </Layout>
  );
}
