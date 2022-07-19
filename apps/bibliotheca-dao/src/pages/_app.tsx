import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/global.css';
/* import PageTransition from '@/components/navigation/PageTransition'; 
import { animated, Transition } from '@react-spring/web'; */

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
