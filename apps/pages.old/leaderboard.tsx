import React from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LeaderboardPanel } from '@/components/panels/LeaderboardPanel';
import Layout from '@/components/Layout';

export default function LeaderboardPage() {
  return (
    <Layout>
      <LeaderboardPanel />
      <ArtBackground background="realm" />
    </Layout>
  );
}
