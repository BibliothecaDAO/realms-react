import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { LeaderboardPanel } from '@/components/panels/LeaderboardPanel';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';
import { useBreakpoint } from '@/hooks/useBreakPoint';

export default function LeaderboardPage() {
  return (
    <Layout>
      <LeaderboardPanel />
      <ArtBackground background="bank" />
    </Layout>
  );
}
