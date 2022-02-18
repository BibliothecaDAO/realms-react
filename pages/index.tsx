import type { NextPage } from "next";
import Link from "next/link";
import { Head } from "~/components/Head";
import ShieldGame from "~/components/minigame/ShieldGame";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head />
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
