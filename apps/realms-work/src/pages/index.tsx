import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';

import { FaqBlock } from '@/components/Faqs';
import { FooterBlock } from '@/components/FooterBlock';
import { Head } from '@/components/Head';
import { JobCard } from '@/components/JobCard';
import Layout from '@/components/Layout';
import { WithNavMenu } from '@/components/NavMenu';
function Home() {
  const jobs = [
    { location: 'Realms', title: 'Creative Director', skills: ['creative'] },
  ];

  return (
    <Layout>
      <div className="h-full bg-black">
        <div className="relative w-full h-screen bg-bottom bg-cover bg-hero ">
          {' '}
          <div className="container flex flex-col justify-center h-full mx-auto ">
            <div className="self-center p-8 mt-auto text-center sm:w-1/2 sm:py-20">
              <h1 className="mb-10 font-lords">Realms</h1>
              <div className="space-x-4">
                <Button size="sm" variant="primary">
                  the atlas
                </Button>
                <Button size="sm" variant="primary">
                  the discord
                </Button>
              </div>
            </div>
            <div className="py-20 mx-auto mt-auto">
              <Button size="sm" variant="secondary">
                discover
              </Button>
            </div>
          </div>
        </div>
        <div className="container px-10 py-20 mx-auto">
          <div className="flex">
            <div className="self-center w-1/2">
              <h1 className="font-lords">
                founded in Loot, <br></br> a vision beyond{' '}
              </h1>
              <p className="mt-10 text-2xl">
                8000 procedurally generated maps with unique names, resources
                and geographical traits. 50 ultra rare Realms contain a unique
                Wonder.
              </p>
              <div className="mt-10 space-x-4">
                <Button size="sm" variant="primary">
                  the atlas
                </Button>
                <Button size="sm" variant="primary">
                  the discord
                </Button>
              </div>
            </div>
            <div className="w-1/2">
              <Image
                src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/2.webp`}
                alt="map"
                className="w-full mt-4 rounded-xl -scale-x-100"
                width={500}
                height={320}
                layout={'responsive'}
              />
            </div>
          </div>
        </div>
        <div className="container px-10 py-20 mx-auto">
          <div className="flex">
            <div className="self-center w-1/2 ">
              <h1 className="font-lords">
                DAO owned & <br></br> open source
              </h1>
              <p className="mt-10 text-2xl">
                8000 procedurally generated maps with unique names, resources
                and geographical traits. 50 ultra rare Realms contain a unique
                Wonder.
              </p>
              <div className="mt-10 space-x-4">
                <Button size="sm" variant="primary">
                  the atlas
                </Button>
                <Button size="sm" variant="primary">
                  the discord
                </Button>
              </div>
            </div>
            <div className="w-1/2">
              <Image
                src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/2.webp`}
                alt="map"
                className="w-full mt-4 rounded-xl -scale-x-100"
                width={500}
                height={320}
                layout={'responsive'}
              />
            </div>
          </div>
        </div>
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
      </div>
    </Layout>
  );
}

export default Home;
