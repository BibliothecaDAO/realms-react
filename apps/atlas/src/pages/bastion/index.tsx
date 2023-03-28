import React from 'react';
import { BastionPanel } from '@/components/bastions/BastionPanel';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { TransactionCartSideBar } from '@/components/ui/transactions/TransactionCartSideBar';
import { BastionProvider } from '@/context/BastionContext';
import { useUIContext } from '@/context/UIContext';

export default function BastionPage() {
  const { transactionCart, toggleTransactionCart } = useUIContext();
  return (
    <Layout>
      <BastionProvider>
        <BastionPanel></BastionPanel>
      </BastionProvider>
      <TransactionCartSideBar
        isOpen={transactionCart}
        onClose={toggleTransactionCart}
      />
      <ArtBackground background="realm" />
    </Layout>
  );
}
