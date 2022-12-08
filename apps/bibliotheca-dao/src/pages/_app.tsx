import { ConnectKitProvider } from 'connectkit';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/global.css';
import { WagmiConfig } from 'wagmi';
import { WalletProvider } from '@/hooks/useWalletContext';
import { wagmiClient } from '@/util/wagmi';

/* import PageTransition from '@/components/navigation/PageTransition'; 
import { animated, Transition } from '@react-spring/web'; */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider theme="midnight">
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
