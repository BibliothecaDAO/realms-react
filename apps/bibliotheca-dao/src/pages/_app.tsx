import type { AppProps } from 'next/app';
import React from 'react';
import { WalletProvider } from '@/hooks/useWalletContext';
import '../styles/global.css';
/* import PageTransition from '@/components/navigation/PageTransition'; 
import { animated, Transition } from '@react-spring/web'; */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
