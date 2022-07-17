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
      {/* <div className="h-96">
        <MobiusModel />
      </div> */}
      <div className="container px-10 mx-auto">
        <div className="flex h-screen">
          <div className="self-end w-full pb-20 sm:w-1/2">
            <h1 className="mb-10 leading-relaxed font-body">
              We are making <br />
              on-chain realities a reality.
            </h1>
            <p className="text-3xl leading-relaxed opacity-50 ">
              BibliothecaDAO is a community-owned <br /> on-chain game
              development DAO.
            </p>
            {/* <p className="mt-10 text-2xl">
              A community-owned On-Chain Game Development DAO terraforming the
              Lootverse
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
      <PartnerBanner />
      <DaoProjects />
      {/* <div className="container grid grid-cols-2 gap-2 px-4 mx-auto sm:gap-4 sm:grid-cols-3">
          {jobs.map((a, index) => {
            return (
              <JobCard
                key={index}
                location={a.location}
                title={a.title}
                skills={a.skills}
              />
            );
          })}
        </div> */}
    </MainLayout>
  );
}

export default Home;
