import type { NextPage } from "next";
import Head from "next/head";
import ShieldGame from "~/components/minigame/ShieldGame";

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
      <div className="p-4">
        <ShieldGame />
      </div>
    </div>
  );
};

export default Home;
