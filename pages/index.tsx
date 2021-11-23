import type { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"

import {
  connectWallet,
  isWalletConnected,
  walletAddress,
} from "../src/wallet";
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const [isConnected, setIsConnected] = useState(isWalletConnected())
  const [address, setAddress] = useState<string>()

  const handleConnectClick = async () => {
    try{
      await connectWallet()
      setIsConnected(isWalletConnected())
      setAddress(await walletAddress())
    } catch(e){
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Realms Minigame</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isConnected ? (
          <>
            <h3 style={{ margin: 0 }}>
              Wallet address: <code>{address}</code>
            </h3>
            {/* Dapp here */}
          </>
        ) : (
          <>
            <button className={styles.connect} onClick={handleConnectClick}>
              Connect Wallet
            </button>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  )
}

export default Home