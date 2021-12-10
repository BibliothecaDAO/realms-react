import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { connectWallet, isWalletConnected, walletAddress } from "../src/wallet";

const Home: NextPage = () => {
  const [isConnected, setIsConnected] = useState(isWalletConnected());
  const [address, setAddress] = useState<string>();

  const handleConnectClick = async () => {
    try {
      await connectWallet();
      setIsConnected(isWalletConnected());
      setAddress(await walletAddress());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="">
      <Head>
        <title>Realms Conquest</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex justify-center items-center">
        {isConnected ? (
          <>
            <h3 style={{ margin: 0 }}>
              Wallet address: <code>{address}</code>
            </h3>
            {/* Dapp here */}
          </>
        ) : (
          <>
            <button
              className="mr-4 bg-gradient-to-b from-yellow-400 to-yellow-500 px-8 py-2 border-2 border-black rounded-md "
              onClick={handleConnectClick}
            >
              Connect Wallet
            </button>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
