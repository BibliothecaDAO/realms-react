import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { connectWallet, isWalletConnected, walletAddress } from "../src/wallet";

const Home: NextPage = () => {
  const [isConnected, setIsConnected] = useState(isWalletConnected());
  const [l2Address, setL2Address] = useState<string>();

  const handleConnectClick = async () => {
    try {
      await connectWallet();
      setIsConnected(isWalletConnected());
      setL2Address(await walletAddress());
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

      <main className="flex items-center justify-center min-h-screen">
        {isConnected ? (
          <>
            <h3 style={{ margin: 0 }}>
              StarkNet Wallet address: <code>{l2Address}</code>
            </h3>
            {/* Dapp here */}
          </>
        ) : (
          <>
            <button
              className="px-8 py-2 mr-4 border-2 border-black rounded-md bg-gradient-to-b from-yellow-400 to-yellow-500 "
              onClick={handleConnectClick}
            >
              Connect StarkNet Wallet
            </button>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
