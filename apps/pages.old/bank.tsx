import React, { useState } from 'react';
import { ArtBackground } from '@/components/map/ArtBackground';
import { BankPanel } from '@/components/panels/BankPanel';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';
import { useBreakpoint } from '@/hooks/useBreakPoint';
import Layout from '@/components/Layout';

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
      <ArtBackground background="bank" />
    </Layout>
  );
}
