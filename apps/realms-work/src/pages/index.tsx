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
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
    hasStarknet,
  } = useStarknet();

  const [content, setContent] = useState<string[]>([]);

  const time = () => {
    const END = 1651327190000;
    const NOW_IN_MS = new Date().getTime();
    const MS_UNTIL = END - NOW_IN_MS;

    return (NOW_IN_MS + MS_UNTIL).toString();
  };

  const jobs = [
    { location: 'Realms', title: 'Creative Director', skills: ['creative'] },
  ];

  return (
    <Layout>
      <div className="h-full bg-black">
        <div className="relative w-full h-screen-30 bg-cover bg-hero bg-bottom "></div>
        <div className="container flex mx-auto flex-wrap">
          <div className="sm:w-1/2 p-8 sm:py-20">
            <h1>Bibliotheca DAO Jobs</h1>
            <p className="sm:text-2xl mt-8">
              We are building the games on the bleeding edge of technology. We
              look at your past work history. If you like working hard problems
              in a decentralised enviroment.
            </p>
          </div>
        </div>
        <div className="container grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 mx-auto px-4">
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
        </div>
      </div>
    </Layout>
  );
}

export default Home;
