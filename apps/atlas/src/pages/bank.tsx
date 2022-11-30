import React, { useState } from 'react';
import { BankPanel } from '@/components/bank/BankPanel';
import { ResourceSwapSideBar } from '@/components/bank/ResourceSwapSideBar';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { useBreakpoint } from '@/hooks/useBreakPoint';

export default function RealmPage() {
  const [showSwap, setShowSwap] = useState(false);
  const breakpoints: any = useBreakpoint();
  const isSwapOpen = breakpoints.lg || showSwap;
  const onCloseClick = breakpoints.lg
    ? undefined
    : () => {
        setShowSwap(false);
      };

  return (
    <Layout>
      <BankPanel
        onOpenSwap={() => {
          setShowSwap(true);
        }}
      />
      <ResourceSwapSideBar isOpen={isSwapOpen} onClose={onCloseClick} />
    </Layout>
  );
}
