import type { NextPage } from 'next';
import Link from 'next/link';
import { Head } from '@/components/Head';

const Home: NextPage = () => {
  return (
    <div className="">
      <Head />
      <div className="relative w-screen h-screen bg-center bg-cover bg-hero">
        <div className="z-10 flex justify-center w-full h-full text-3xl text-center align-middle top-16">
          <div className="self-center">
            <Link href="/lootverse">
              <a className="z-10 p-4 transition-all rounded bg-white/50 hover:bg-white/70 font-display">
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
