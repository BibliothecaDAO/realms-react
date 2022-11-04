import { useRouter } from 'next/router';
import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { RealmDetailsPanel } from '@/components/panels/RealmDetailsPanel';
import Layout from '@/components/Layout';

export default function RealmPage() {
  const router = useRouter();
  const { realmId } = router.query;
  return (
    <Layout>
      <RealmDetailsPanel
        key={realmId as string}
        realmId={parseInt(realmId as string)}
      />
      <ArtBackground background="realm" />
    </Layout>
  );
}
