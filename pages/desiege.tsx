import type { NextPage } from "next";
import Head from "next/head";
import ShieldGame from "~/components/minigame/ShieldGame";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Desiege S1: Divine Eclipse</title>
        <meta
          name="description"
          content="Tower Defence on-chain NFT game on StarkNet"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inconsolata:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div>
        <ShieldGame />
      </div>
    </div>
  );
};

export default Home;
