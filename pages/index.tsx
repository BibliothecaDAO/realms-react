import type { NextPage } from "next";
import Link from "next/link";
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
      <div className="relative bg-hero bg-cover h-screen w-screen bg-center">
        <div className="z-10 top-16 w-full text-center text-3xl flex h-full justify-center align-middle">
          <div className="self-center">
            <Link href="/lootverse">
              <a className="bg-white/50 transition-all p-4 z-10 rounded hover:bg-white/70 font-display">
                Explore Lootverse
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
