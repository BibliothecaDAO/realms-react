import type { NextPage } from "next";
import Head from "next/head";
import Bridge from "../src/Bridge";

const Home: NextPage = () => {
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

      <main className="flex flex-col items-center justify-center min-h-screen gap-2">
        <Bridge />
      </main>
    </div>
  );
};

export default Home;
