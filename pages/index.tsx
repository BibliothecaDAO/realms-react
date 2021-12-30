import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  connectWallet,
  isWalletConnected,
  walletAddress,
} from "../src/l2wallet";
import Button from "../src/shared/Button";
import { walletconnect } from "../src/connectors";

const Home: NextPage = () => {
  const [isL2Connected, setIsL2Connected] = useState(isWalletConnected());
  const [l2Address, setL2Address] = useState<string>();

  const web3React = useWeb3React();

  const handleL2ConnectClick = async () => {
    try {
      await connectWallet();
      setIsL2Connected(isWalletConnected());
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

      <main className="flex flex-col items-center justify-center min-h-screen gap-2">
        {web3React.active ? (
          <p>{web3React.account}</p>
        ) : (
          <Button
            onClick={() => {
              web3React.activate(walletconnect);
            }}
          >
            Connect with Ethereum
          </Button>
        )}

        {isL2Connected ? (
          <>
            <h3 style={{ margin: 0 }}>
              StarkNet Wallet address: <code>{l2Address}</code>
            </h3>
            {/* Dapp here */}
          </>
        ) : (
          <>
            <Button onClick={handleL2ConnectClick}>Connect to StarkNet</Button>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
