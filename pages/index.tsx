import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import BridgeModal from "components/bridge/Modal";

const Home: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="">
      <Head>
        <title>Realms Tower Defence</title>
        <meta
          name="description"
          content="Tower Defence on-chain NFT game on StarkNet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BridgeModal isOpen={modalOpen} toggle={() => setModalOpen(false)} />
      <button
        onClick={() => setModalOpen(true)}
        className="fixed px-4 py-2 bg-gray-400 rounded-md top-2 left-2"
      >
        Show Modal
      </button>
    </div>
  );
};

export default Home;
