import React from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LeaderboardPanel } from '@/components/panels/LeaderboardPanel';

export default function LeaderboardPage() {
  return (
    <Layout>
      <LeaderboardPanel />
      <ArtBackground background="realm" />
    </Layout>
  );
}
