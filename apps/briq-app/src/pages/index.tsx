import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import CountdownTimer from '@/components/CountDown';
import { Head } from '@/components/Head';
import { WithNavMenu } from '@/components/NavMenu';

const Home: NextPage = () => {
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
    hasStarknet,
  } = useStarknet();

  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    connectBrowserWallet(); // on mount
  }, []);
  useEffect(() => {
    Promise.all([
      fetch('Overview.md'),
      fetch('Competition.md'),
      fetch('HowToEnter.md'),
      fetch('Wonders.md'),
      fetch('Voting.md'),
    ])
      .then((results) => Promise.all(results.map((result) => result.text())))
      .then((text) => setContent(text));
  }, []);
  const THREE_DAYS_IN_MS = 1692378 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;
  return (
    <div className="h-full bg-black">
      <Head />
      <div className="relative w-full h-screen-30 bg-cover bg-hero bg-bottom ">
        <div className="z-10 flex justify-center w-fulltext-3xl text-center align-middle top-16">
          {/* <div className="flex self-center ">
              <Image
                className="rounded"
                alt="Vercel logo"
                src="/realms-logo.jpg"
                width={180}
                height={80}
              />
              <h1 className="mx-8">&</h1>

              <Image
                className="rounded-full"
                alt="Vercel logo"
                src="/briq.jpg"
                width={80}
                height={80}
              />
            </div> */}
        </div>
      </div>
      <div className="container flex mx-auto">
        <div className="w-1/2 p-8 py-20">
          <h4>A starknet nft competition</h4>
          <h1>Build a Wonder & Win</h1>
          <p className="font-display sm:text-2xl mt-8">
            Realms, Briq, PlayOasis & StarkWare present to you the first
            cross-project, on-chain, collaborative competition for builders and
            artists on StarkNet.
          </p>
        </div>
        <div className="w-1/2 text-center p-10 bg-gray-800/10 rounded self-center">
          <h2>
            16 Winners <br /> 48k $LORDS <br />& 1.6 ETH in prizes
          </h2>
        </div>
      </div>
      <div className="w-full h-auto bg-off-200 py-8 flex shadow-inner">
        <h3 className="mx-auto uppercase">
          the lore, the builder, the marketplace, the chain
        </h3>
      </div>
      <div className="container mx-auto flex flex-wrap text-center py-20">
        <div className="w-1/2 p-10 px-14">
          <h3>Realms</h3>
          <p>
            8000 procedurally generated maps with unique names, resources and
            geographical traits. 50 ultra rare Realms contain a unique Wonder.
          </p>
          <div className="flex mx-auto gap-2 w-full justify-center my-4">
            <Button
              size="sm"
              href="https://atlas.bibliothecadao.xyz"
              variant="secondary"
            >
              Atlas
            </Button>
            <Button
              size="sm"
              href="https://atlas.bibliothecadao.xyz"
              variant="secondary"
            >
              Discord
            </Button>
          </div>
        </div>
        <div className="w-1/2 p-10 px-14">
          <h3>Realms</h3>
          <p>
            8000 procedurally generated maps with unique names, resources and
            geographical traits. 50 ultra rare Realms contain a unique Wonder.
          </p>
        </div>
        <div className="w-1/2 p-10 px-14">
          <h3>Realms</h3>
          <p>
            8000 procedurally generated maps with unique names, resources and
            geographical traits. 50 ultra rare Realms contain a unique Wonder.
          </p>
        </div>
        <div className="w-1/2 p-10 px-14">
          <h3>Realms</h3>
          <p>
            8000 procedurally generated maps with unique names, resources and
            geographical traits. 50 ultra rare Realms contain a unique Wonder.
          </p>
        </div>
      </div>
      <iframe
        src="https://test-realms.briq.construction/share?set_id=0x35ee90ec08fa17ab562a06406fc391f574e2a94805403b84000000000000000&network=testnet&version=2&embed=1"
        className="h-screen-65 w-full"
        title="Briqs"
      ></iframe>
      <div className="container py-20 mx-auto px-20 flex flex-wrap">
        <div className="w-2/3">
          <div className="mb-20">
            <h4 className="mb-8">the competition</h4>
            <ol className="text-5xl font-display list-decimal list-inside">
              <li>Pick a Wonder</li>
              <li>Build and mint it with briqs</li>
              <li>Showcase it on PlayOasis</li>
            </ol>
          </div>
          <hr />
          <div className="my-20">
            <h4 className="mb-8">what is a wondeR?</h4>
            <p className="text-5xl font-display mb-8">
              Wonders are mythical structures, both man-made and naturally
              formed, scattered throughout the Realmverse.
            </p>
            <p className="sm:text-2xl">
              While they have been admired and worshipped for eons, their true
              beauty and image have never been transcribed to share with the
              wider world.{' '}
            </p>
          </div>
          <hr />
          <div className="my-20">
            <h4 className="mb-8">Calling all builders & artists</h4>
            <p className="text-5xl font-display mb-8">
              We are calling on all builders, artists and layer 2 trailblazers
              to create their own visual representation of these sacred sites
              with briqs, directly on StarkNet.
            </p>
            <p className="sm:text-2xl">
              Of the 50 Wonders, there will be 16 to choose from to build: one
              from each of the Orders.
              <br />
              All creations will be displayed on PlayOasis in a special Realms
              category for all to see and worship.
            </p>
          </div>
          <hr />
          <div className="my-20">
            <h4 className="mb-8">Prizes</h4>
            <p className="text-5xl font-display mb-8">
              After two weeks of submissions, the 16 winners will be chosen by
              Realm Holders via quadratic voting.
            </p>
            <p className="sm:text-2xl">
              There will be 16 separate snapshots to decide the winner from each
              of the Orders.
            </p>
          </div>
          <hr />
          <div className="my-20">
            <h4 className="mb-8">Prizes</h4>
            <p className="text-5xl font-display mb-8">
              There is a total prize pool of 48k $LORDS and 1.6 ETH split evenly
              across the 16 winners.
            </p>
            <p className="sm:text-2xl">
              Bibliotheca DAO will award 3000 $LORDS and StarkNet 0.1 eth to
              each of the winners. There are no prerequisites; everyone is
              welcome to participate. <br /> You can submit as many as you like
              and, if voted by the DAO, can win multiple across the different
              Wonders of the Orders.
            </p>
          </div>
        </div>
        <div className="w-1/3 px-20">
          <div className=" sticky top-10">
            <h4>Time left in competition</h4>
            <CountdownTimer date={dateTimeAfterThreeDays} />
            <Button className="mt-8" variant="primary">
              Enlist to Build
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="container px-4 mx-auto">
        <div className="lg:flex lg:gap-x-16">
          <div className="w-full lg:w-5/12 sm:order-last">
            <div className="sticky top-0 w-full pt-16 flex flex-wrap">
              <Ethereum className="w-12 mx-4" />
              <StarkNet className="w-12 mr-2" />
              {/* <Image
                className="rounded"
                alt="Vercel logo"
                src="/realms-logo.jpg"
                width={180}
                height={80}
              />

              <Image
                className="rounded-full"
                alt="Vercel logo"
                src="/briq.jpg"
                width={80}
                height={80}
              /> */}
      {/* <Image
                className="w-full"
                alt="Vercel logo"
                src="/revillo-wonder.png"
                width={2560}
                height={1545}
              />
            </div>
          </div>
          <div className="w-full lg:w-9/12 ">
            <WithNavMenu selector="section">
              <section
                data-nav-title="Overview"
                id="section1"
                data-scrollspy
                className="pt-8 text-xl leading-7 prose"
              >
                <ReactMarkdown>{content[0]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="Competition"
                id="section2"
                data-scrollspy
                className="py-8 prose text-xl "
              >
                <h1>The Competition</h1>
                <ReactMarkdown>{content[1]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="How to Enter"
                id="section3"
                data-scrollspy
                className="py-8 prose"
              >
                <h1>How to Enter</h1>
                <ReactMarkdown className="text-xl font-semibold">
                  {content[2]}
                </ReactMarkdown>
              </section>
              <section
                data-nav-title="The Wonders"
                id="section4"
                data-scrollspy
                className="py-8 prose"
              >
                <h1>The Wonders</h1>
                <ReactMarkdown>{content[3]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="Voting & Conditions"
                id="section5"
                data-scrollspy
                className="py-8 prose"
              >
                <h1>Voting & Conditions</h1>
                <ReactMarkdown className="text-2xl">{content[4]}</ReactMarkdown>
              </section>
            </WithNavMenu>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
