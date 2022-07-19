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
              on-chain realities a reality.
            </h1>
            {/* <p className="text-3xl leading-relaxed opacity-50 ">
              BibliothecaDAO is a community-owned <br /> on-chain game
              development DAO.
            </p> */}
          </div>
          {/* <div className="w-full sm:w-1/2">
            <Image
              src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/2.webp`}
              alt="map"
              className="w-full mt-4 rounded-xl -scale-x-100"
              width={500}
              height={320}
              layout={'responsive'}
            />
          </div> */}
        </div>
      </div>
      <div className="container relative z-20 flex px-10 py-40 mx-auto border-t">
        <div className="self-center px-10 sm:w-1/2">
          <div className="flex mb-5">
            <StarkNet className="w-12" />
            <h5 className="self-center ml-4 tracking-widest uppercase font-body">
              Running on StarkNet
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
            className="w-full mt-4 rounded-xl"
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
