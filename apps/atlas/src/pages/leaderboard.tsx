import React from 'react';
import Layout from '@/components/Layout';
import { LeaderboardPanel } from '@/components/leaderboard/LeaderboardPanel';
import { ArtBackground } from '@/components/map/ArtBackground';

export default function LeaderboardPage() {
  return (
    <Layout>
      <LeaderboardPanel />
      <ArtBackground background="realm" />
    </Layout>
  );
}
