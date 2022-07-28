import { Button, ImageCarousel } from '@bibliotheca-dao/ui-lib';
import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/bibliotheca-book.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import type { NextPage } from 'next';
import Image from 'next/future/image';
import { useEffect, useState } from 'react';

import { FaqBlock } from '@/components/Faqs';
import { FullPageSlide } from '@/components/FullPageSlide';
import { MainLayout } from '@/components/layout/MainLayout';
import { WithNavMenu } from '@/components/NavMenu';
import { PartnerBanner } from '@/components/PartnerBanner';
const slides = [
  {
    title: '',
    image: 'warRoom',
    link: 'https://atlas.bibliothecadao.xyz/',
    priority: true,
    content: (
      <div className="flex flex-col justify-between h-full px-6 text-center">
        <div className="mb-2 uppercase">
          <h1 className="text-7xl sm:text-9xl">Realms</h1>
          <h1>Imperion</h1>
        </div>
        <div className="text-xl text-gray-900">
          <p>Build empires inside your browser.</p>
          <p className="mb-6">An eternal on-chain game running on StarkNet</p>
          <Button
            className="max-w-xs py-3 mx-auto font-normal tracking-wide text-white normal-case border-0 rounded-lg shadow-lg backdrop-brightness-125 bg-black/50"
            href="https://atlas.bibliothecadao.xyz"
            variant="dao"
            texture={false}
          >
            Explore the Atlas
          </Button>
        </div>
      </div>
    ),
  },
  {
    image: 'eternity',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">An Eternal World</h2>
          <p>
            The Realms are <strong>your</strong> fantasy universe. [GAME NAME]
            is the first module in an infinitely expanding player-owned world.
          </p>
        </div>
      </div>
    ),
  },
  {
    image: 'keyImage',
    link: 'https://scroll.bibliothecadao.xyz/',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">Introducing [GAME NAME]</h2>
          <p>
            A next generation MMO. Raise empires, raid resources, control
            Relics. Maintain your cities and finesse your forces, or fall into
            ruin.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Realm Staking',
    image: 'riches',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto text-gray-900 sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">Player with Freedom</h2>
          <p>
            Dominate the battlefield. Out-smart the market. Exercise diplomacy.
            Take down the powerful or prey on the weak? Your world, your choice.
          </p>
        </div>
      </div>
    ),
  },
  {
    image: 'createOrDestroy',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">The Realms Resist</h2>
          <p>
            It’s not just other Realm Lords to worry about: the Realms are
            fighting back against over-exploitation.
          </p>
        </div>
      </div>
    ),
  },
  {
    image: 'sky',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: 'bottom',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto text-gray-900 sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">Built on StarkNet</h2>
          <p>
            Real-time, deeply strategic gameplay. On-chain and unstoppable.
            Eternal play is made possible by StarkNet and Ethereum.
          </p>
        </div>
      </div>
    ),
  },
  {
    image: 'siege',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2">
        <div>
          <h2 className="mb-4">Your realm is your sovereign empire</h2>
          <p>
            There are 8,000 individual realms which together form the
            territorial base layer of the Realms fantasy universe. Each realm is
            unique. All produce resources. Some host mysterious ‘Wonders’. Each
            belongs to one of 16 powerful Orders. Explore the deeds to these
            sovereign states in the Realm On Chain Universe{' '}
            <a href="https://opensea.io/collection/lootrealms">here</a>.
          </p>
        </div>
      </div>
    ),
  },
];
const mockData = {
  items: [
    {
      title: 'Find me on Twitter',
      link: 'https://twitter.com/kendalmintcode',
      image: 'atlas',
    },
    {
      title: 'Welcome to Ark Labs',
      link: 'https://ark-labs.co.uk',
      image: 'atlas',
    },
    {
      title: 'Some sort of third title',
      link: 'https://twitter.com/kendalmintcode',
      image: 'atlas',
    },
    {
      title: 'A personal site perhaps?',
      link: 'https://robkendal.co.uk',
      image: 'atlas',
    },
    {
      title: 'Super item number five',
      link: 'https://twitter.com/kendalmintcode',
      image: 'atlas',
    },
  ],
};
function Home() {
  const carouselLoader = ({
    src,
    width,
    quality,
  }: {
    src: any;
    width: any;
    quality?: any;
  }) => {
    if (width > 1080) {
      return `/_next/image?url=/${src}-desktop.png&w=${width}&q=${
        quality || 75
      }`;
    } else {
      return `/_next/image?url=/${src}.png&w=${width}&q=${quality || 75}`;
    }
  };
  return (
    <MainLayout>
      <WithNavMenu />
      {slides.slice(0, 5).map((slide) => {
        return (
          <FullPageSlide
            key={slide.image}
            image={slide.image}
            priority={slide.priority}
            content={slide.content}
          />
        );
      })}
      <div className="container relative max-w-xl px-8 py-12 mx-auto sm:px-0">
        <h2 className="mb-10">Settle, Raid, Trade</h2>
        {/* <div className="pl-8 sm:pl-0">
          <ImageCarousel loader={carouselLoader} items={mockData.items} />
    </div> */}
        <p className="pb-12 mx-auto">
          Your realm has unique characteristics which shape its' population and
          production capacities. Build the city that suits the territory, the
          metagame and your playstyle
        </p>
        <h2>Bibliotheca: Stewards of on-chain gaming</h2>
        <BibliothecaBook className="h-48 py-6 mx-auto" />
        <p className="pb-8 mx-auto">
          The Bibliotheca team is a pioneering web3 game studio provoked into
          action by the birth of a composable on-chain hyperverse, Dom Hoffman's
          Loot Project. Bibliotheca's first misssion: build a massively
          multiplayer on-chain gaming ecosystem on StarkNet residing in the Loot
          hyperverse. To date the team have won over the StarkNet and on-chain
          gaming communities by pushing at the boundaries of the bleeding edge
          tech, and with an open source composability focused outlook.
        </p>
        <PartnerBanner />
      </div>
      {/* eslint-disable-next-line sonarjs/no-identical-functions */}
      {slides.slice(5).map((slide) => {
        return (
          <FullPageSlide
            key={slide.image}
            image={slide.image}
            priority={slide.priority}
            content={slide.content}
          />
        );
      })}
      <div className="container px-8 py-5 mx-auto sm:w-1/2 sm:px-0 lg:w-1/4">
        <FaqBlock />
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold font-display lg:text-4xl">
            Stay up to Date
          </h1>
          <p className="py-1">
            Sign up to the newsletter and be the first one to know about new
            developments in the ecosystem.
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex-row w-full mr-12">
              <div className="bg-white rounded-lg">
                <div className="flex justify-between w-full flex-warp md:flex-row">
                  <input
                    type="email"
                    className="p-3 m-1 text-sm font-medium text-gray-700 border-none appearance-none focus:outline-none focus:border-white focus:rounded focus:placeholder-transparent"
                    placeholder="Enter your email"
                    aria-label="Enter your email"
                  />
                  <button className="w-full p-2 m-1 text-sm font-semibold bg-gray-800 rounded-lg lg:w-auto hover:bg-gray-700">
                    Subscribe
                  </button>
                </div>
              </div>
              <p className="mt-2 ml-1 text-sm font-light text-gray-300">
                Unsubscribe at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
