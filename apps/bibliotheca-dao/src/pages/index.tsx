import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Typist from 'react-typist-component';
import { DaoProjects } from '@/components/DaoProjects';
import { FaqBlock } from '@/components/Faqs';

import { JobCard } from '@/components/JobCard';
import { MainLayout } from '@/components/layout/MainLayout';
import { PartnerBanner } from '@/components/PartnerBanner';

import { homePage } from '@/data/Information';

function Home() {
  const jobs = [
    { location: 'Realms', title: 'Creative Director', skills: ['creative'] },
  ];
  const [count, setCount] = useState(0);
  const [key, setKey] = useState(1);
  return (
    <MainLayout>
      <div className="container px-10 mx-auto">
        <div className="flex h-screen">
          <div className="self-end w-full pb-20 sm:w-1/2">
            <h1 className="mb-10 leading-relaxed font-body">
              We are making <br />
              <Typist
                typingDelay={100}
                cursor={<span className="no-underline cursor">|</span>}
                restartKey={key}
                loop={true}
              >
                <span>
                  on-chain
                  <Typist.Delay ms={1500} />
                  <Typist.Backspace count={8} />
                  <Typist.Delay ms={1500} />
                  MMO
                  <Typist.Delay ms={1500} />
                  <Typist.Backspace count={3} />
                  <Typist.Delay ms={1500} />
                  composable
                  <Typist.Delay ms={4000} />
                </span>
                {/* <Typist.Paste>
                  <div>
                    use
                    <div>deeper div</div>
                  </div>
                </Typist.Paste> */}
              </Typist>
              <br />
              realities.
            </h1>
          </div>
        </div>
      </div>

      <FaqBlock heading="Bibliotheca DAO" faqs={homePage} />
      <PartnerBanner />

      <div className="container relative z-20 flex py-10 mx-auto my-40 text-center ">
        <div className="self-center px-10 mx-auto sm:w-1/2">
          <div className="flex justify-center mb-5">
            <StarkNet className="w-12 mr-4" />
            <h5 className="self-center tracking-widest uppercase font-body">
              a StarkNet on-chain eternal game
            </h5>
          </div>

          <h1 className="mb-10">Master Scroll</h1>
          <p className="sm:text-2xl">Our litepaper on eternal games.</p>
          <div className="mt-4">
            <Button
              href="https://scroll.bibliothecadao.xyz/"
              size="sm"
              variant="dao"
            >
              read the scroll
            </Button>
          </div>
        </div>
      </div>
      <div className="container relative z-20 flex flex-wrap px-10 py-10 mx-auto my-40 border-t ">
        <div className="self-center sm:w-1/2">
          <div className="flex mb-5">
            <h5 className="self-center tracking-widest uppercase font-body">
              8000 generative maps
            </h5>
          </div>

          <h1 className="mb-10">Loot Realms</h1>
          <p>
            The 8000 Realms were procedurally generated as black and white SVG
            files, but have since then begun their transition into high-fidelity
            3D renders using height maps.
          </p>
          <div className="flex mt-4 space-x-2">
            <Button
              href="https://opensea.io/collection/lootrealms"
              size="sm"
              variant="dao"
            >
              opensea
            </Button>
            <Button
              href="https://atlas.bibliothecadao.xyz/"
              size="sm"
              variant="dao"
            >
              explore on the atlas
            </Button>
          </div>
        </div>
        <div className="sm:w-1/2">
          {' '}
          <img
            src={`https://openseauserdata.com/files/769284da4198c2651e371ecec7b8bf73.svg`}
            alt="map"
            className="w-full mt-4"
          />
        </div>
      </div>
      <DaoProjects />
    </MainLayout>
  );
}

export default Home;
