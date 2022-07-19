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
import MobiusModel from '@/components/MobiusModel';
import { WithNavMenu } from '@/components/NavMenu';
import { PartnerBanner } from '@/components/PartnerBanner';

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
              <span className="underline">on-chain</span> realities <br /> a
              reality.
            </h1>
          </div>
        </div>
      </div>
      <div className="container relative z-20 flex mx-auto border-t">
        <div className="self-center px-10 sm:w-1/2">
          <div className="flex mb-5">
            {/* <StarkNet className="w-12" /> */}
            <h5 className="self-center tracking-widest uppercase font-body">
              on-chain manifesto
            </h5>
          </div>

          <h1 className="mb-10">Master Scroll</h1>
          <p>
            Eternal games, as the name suggests, are ever-lasting. They will
            exist for as long as the network they are deployed upon exists. They
            are both persistent and ephemeral, and they are a new paradigm in
            game design.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="primary">
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
      <div className="container relative z-20 flex mx-auto border-t">
        <div className="self-center px-10 sm:w-1/2">
          <div className="flex mb-5">
            <StarkNet className="w-12" />
            <h5 className="self-center ml-4 tracking-widest uppercase font-body">
              Game Running on StarkNet
            </h5>
          </div>

          <h1 className="mb-10">Eternal Reign</h1>
          <p>
            "Empires rise and fall in the quest for control of Resources and
            Ancient Relics within an eternal world. Maintain and defend your
            empire or it will fall into disarray and be consumed by enemies."
          </p>
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
      <PartnerBanner />
      <DaoProjects />
    </MainLayout>
  );
}

export default Home;
