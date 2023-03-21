import React from 'react';
import { BastionPanel } from '@/components/bastions/BastionPanel';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { BastionProvider } from '@/context/BastionContext';

export default function BastionPage() {
  return (
    <Layout>
      <BastionProvider>
        <BastionPanel></BastionPanel>
      </BastionProvider>
      <ArtBackground background="realm" />
    </Layout>
  );
}
