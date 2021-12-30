import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import "tailwindcss/tailwind.css";

function getLibrary(provider: any, connector: any) {
  return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
