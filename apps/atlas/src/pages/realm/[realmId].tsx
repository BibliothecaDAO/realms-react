import { useRouter } from 'next/router';
import React from 'react';
import Layout from '@/components/Layout';
import { RealmDetailsPanel } from '@/components/panels/RealmDetailsPanel';

export default function RealmPage() {
  const router = useRouter();
  const { realmId } = router.query;
  console.log(router.query);
  return (
    <Layout>
      <RealmDetailsPanel
        key={realmId as string}
        realmId={parseInt(realmId as string)}
      />
    </Layout>
  );
}
