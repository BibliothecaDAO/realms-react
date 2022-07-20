import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  return (
    <MainLayout>
      <div className="container px-10 mx-auto">
        <div className="flex h-screen">
          <div className="self-end w-full pb-20 sm:w-1/2">
            <h1 className="mb-10 leading-relaxed font-body">
              We are making <br />
              <span className="underline">on-chain</span> realities <br />
            </h1>
          </div>
        </div>
      </div>
      <FaqBlock faqs={homePage} />
      <PartnerBanner />

      <div className="container relative z-20 flex py-10 mx-auto">
        <div className="self-center px-10 sm:w-1/2">
          <div className="flex mb-5">
            {/* <StarkNet className="w-12" /> */}
            <h5 className="self-center tracking-widest uppercase font-body">
              on-chain manifesto
            </h5>
          </div>

          <h1 className="mb-10">Master Scroll</h1>
          <p>This is our whitepaper of our first game.</p>
          <div className="mt-4">
            <Button size="sm" variant="dao">
              read the scroll
            </Button>
          </div>
        </div>
        <div className="sm:w-1/2">
          {' '}
          <Image
            src={`/lightAndDark_v1.jpg`}
            alt="map"
            className="w-full mt-4"
            width={500}
            height={500}
            layout={'responsive'}
          />
        </div>
      </div>

      <DaoProjects />
    </MainLayout>
  );
}

export default Home;
