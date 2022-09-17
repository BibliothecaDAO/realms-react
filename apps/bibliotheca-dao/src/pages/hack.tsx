import { Button, CountdownTimer } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { FaqBlock } from '@/components/Faqs';

import { MainLayout } from '@/components/layout/MainLayout';
import Tourus from '@/components/Tourus';
import { hackPage } from '@/data/Information';

function Hack() {
  const { account, error: starknetConnectionError } = useStarknet();

  const [content, setContent] = useState<string[]>([]);

  const time = () => {
    const END = 1664418839000;
    const NOW_IN_MS = new Date().getTime();
    const MS_UNTIL = END - NOW_IN_MS;

    return (NOW_IN_MS + MS_UNTIL).toString();
  };

  const items = [
    {
      title: 'Realms Gaming Ecosystem',
      description:
        'For the past 9 months we have been laying the foundation for an ever expanding on-chain gaming reality. We have built the tools and tooling to allow developers to jump in and start building games. Now it is time for you to build.',
    },
    {
      title: 'On-chain games',
      description:
        'All state and logic exist on the blockchain. There is no central server where game information is stored. Players, developers and producers become one in a permissionless game environment. These are ‘eternal games’ that will last for the length of the blockchain itself.   Interoperability at the function level.',
    },
    {
      title: 'Build "Real" web3 games',
      description:
        'Most web3 games are rubbish. Hardly fun and barely on-chain. Join our hack and help us build rich and enjoyable on-chain games. Games that push the boundaries of the new design space opened by ZK-Rollups and STARK proofs.',
    },

    {
      title: 'Why StarkNet?',
      description:
        'The EVM is a limiting factor for game design.  Fun games require rich computation.  For true on-chain realities and worlds to emerge we require a new technology, and we believe that STARKS show the greatest promise to achieve this.',
    },
  ];

  return (
    <MainLayout>
      <div className="relative z-20 ">
        <div className="container flex flex-wrap justify-center mx-auto text-center">
          <div className="w-full px-10 pt-40 sm:w-2/3 sm:py-40 sm:pb-20">
            <h4 className="font-semibold ">on-chain gaming Hackathon</h4>
            <h1>
              Build the next generation <br /> of web3 games with <br /> a
              $20,000 bounty.
            </h1>
            <p className="mt-8 font-display sm:text-2xl">
              On-chain and eternal.
            </p>
            <div className="mx-auto mt-8">
              <Button
                href="https://docs.google.com/forms/d/e/1FAIpQLSeYhpcC65RbSxqKnjGEXiIkdoI_F5_HUFHxlJqlv8CN--wejg/viewform"
                variant="dao"
              >
                Do you commit to this challenge?
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="container flex flex-wrap py-20 mx-auto text-center">
        <ProjectBlock />
      </div> */}

        <div className="container flex flex-wrap p-10 mx-auto sm:p-20">
          <div className="w-full sm:w-2/3">
            <div className="mb-20">
              <h4 className="mb-8 text-green-200">
                Choose one of these paths in the hack
              </h4>
              <ol className="text-3xl leading-10 list-decimal list-inside sm:text-4xl font-display ">
                <li>
                  Build a game forked from, or interacting with, the existing
                  Realms game modules.
                  <p className="mt-4 text-xl text-gray-400">
                    There are two Realms games (details of Realms: ETERNUM and
                    Realms: ADVENTURERS below). You can add a module that calls
                    these contracts, adding a new game mode. Or you can fork
                    these contracts and create a new game from them.
                  </p>
                </li>
                <hr />
                <li>
                  Create a tool to help gamers play one of the Realms games.
                  <p className="mt-4 text-xl text-gray-400">
                    The Realms games are complex and involve deep interaction
                    with the blockchain. Perhaps you can design and build a
                    module to reduce friction, increase enjoyability or give
                    players an edge.
                  </p>
                </li>
                <hr />
                <li>
                  Create an on-chain game.{' '}
                  <p className="mt-4 text-xl text-gray-400">
                    Any mini-game you want. Perhaps a PVP auto battler? Or an
                    ephemeral conquest game.
                  </p>
                </li>
                <hr />
                <li>
                  Create primitive tools on your choice (anything that be used
                  anyhow in a game).{' '}
                </li>
              </ol>
            </div>

            <div className="flex mt-8 space-x-3">
              <Button
                href="https://scroll.bibliothecadao.xyz"
                variant="dao"
                size="sm"
              >
                white paper
              </Button>
              <Button
                href="https://scroll.bibliothecadao.xyz/docs/technology/the-stack"
                variant="dao"
                size="sm"
              >
                see our tech stack
              </Button>
              <Button
                href="https://github.com/BibliothecaForAdventurers"
                variant="dao"
                size="sm"
              >
                github
              </Button>
            </div>
            <hr />
            <Image
              width="300"
              height="170"
              alt=""
              layout={'responsive'}
              src="/promo_card.png"
            />

            {items.map((a, index) => {
              return (
                <div key={index} className="my-20">
                  <h2 className="mb-8">{a.title}</h2>
                  <p className="mb-8 text-3xl sm:text-2xl font-display">
                    {a.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="w-full px-8 sm:w-1/3 sm:px-12">
            <div className="sticky top-32">
              <h4>Time left to start</h4>
              <CountdownTimer date={time()} />
              <div className="mt-8">
                <Button
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeYhpcC65RbSxqKnjGEXiIkdoI_F5_HUFHxlJqlv8CN--wejg/viewform"
                  variant="dao"
                >
                  sign up to hack
                </Button>
              </div>
            </div>
          </div>
        </div>

        <FaqBlock heading="FAQS" faqs={hackPage} />
      </div>
    </MainLayout>
  );
}

export default Hack;
