import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import CountdownTimer from '@/components/CountDown';
import { EntryCTA } from '@/components/EntryCTA';
import { FaqBlock } from '@/components/Faqs';
import { FooterBlock } from '@/components/FooterBlock';
import { Head } from '@/components/Head';
import { WithNavMenu } from '@/components/NavMenu';
import { ProjectBlock } from '@/components/ProjectBlock';
import Tourus from '@/components/Tourus';
import { WonderBlock } from '@/components/WonderBlock';
import { wonders } from '@/data/Orders';
function Home() {
  const { account, error: starknetConnectionError } = useStarknet();

  const [content, setContent] = useState<string[]>([]);

  const time = () => {
    const END = 1651327190000;
    const NOW_IN_MS = new Date().getTime();
    const MS_UNTIL = END - NOW_IN_MS;

    return (NOW_IN_MS + MS_UNTIL).toString();
  };

  return (
    <div className="h-full bg-black">
      <div className="fixed z-0 w-screen h-screen">
        <Tourus />
      </div>
      <Head />
      <div className="relative z-20">
        {/* <div className="relative w-full bg-bottom bg-cover h-screen-30 bg-hero "></div> */}
        <div className="container flex flex-wrap justify-center mx-auto text-center">
          <div className="w-full p-8 sm:w-1/2 sm:py-20">
            <h4 className="font-semibold text-green-200">
              on-chain gaming Hackathon
            </h4>
            <h1>Build a the future of Gaming.</h1>
            <p className="mt-8 font-display sm:text-2xl">
              Hack the planet... One game at a time.
            </p>
          </div>
        </div>

        {/* <div className="container flex flex-wrap py-20 mx-auto text-center">
        <ProjectBlock />
      </div> */}

        <div className="container flex flex-wrap p-10 mx-auto sm:p-20">
          <div className="w-full sm:w-1/2">
            <div className="mb-20">
              <h4 className="mb-8 text-green-200">
                the hack: Choose your adventurer
              </h4>
              <ol className="text-3xl list-decimal list-inside sm:text-5xl font-display">
                <li>Build a module</li>
                <li>Build an adventurer</li>
                <li>Build a tool</li>
              </ol>
            </div>
            <hr />
            <div className="my-20">
              <h4 className="mb-8">what is an on-chain game?</h4>
              <p className="mb-8 text-3xl sm:text-5xl font-display">
                On-chain games run for the life of a blockchain. Yes, literally
                forever.
              </p>
            </div>
            <hr />
            <div className="my-20">
              <h4 className="mb-8">Calling all builders & artists</h4>
              <p className="mb-8 text-3xl sm:text-5xl font-display">
                BibliothecaDAO is developing the next generation of on-chain
                gaming running on StarkNet.
              </p>
            </div>
            <hr />
            <div className="my-20">
              <h4 className="mb-8">Build on top of our modular game.</h4>
              <p className="mb-8 text-3xl sm:text-5xl font-display">
                Submissions close on the 30th of April at midnight,then the 16
                winners will be chosen by Realm Holders via quadratic voting.
              </p>
            </div>
            <hr />
            <div className="my-20">
              <h4 className="mb-8">Prizes</h4>
              <p className="mb-8 text-3xl sm:text-5xl font-display">
                Bounty of LORDS for all that enter and score over a certain
                amount.
              </p>
              <p className="mb-4 sm:text-2xl">
                Bibliotheca DAO will award 3000 $LORDS and StarkWare 0.1 eth to
                each of the winners. The winning NFTs will be minted on StarkNet
                mainnet and transferred to the winners free of cost. There are
                no prerequisites; everyone is welcome to participate.
              </p>
            </div>
          </div>
          {/* <div className="w-full px-8 sm:w-1/2 sm:px-12">
          <div className="sticky top-10">
            <h4>
              Time left in <br /> competition submission
            </h4>
            <CountdownTimer date={time()} />
            <EntryCTA />
          </div>
        </div> */}
        </div>
        {/* <div className="flex w-full h-auto py-8 bg-green-700 shadow-inner">
          <h4 className="mx-auto tracking-widest uppercase">how to enter</h4>
        </div> */}
        {/* <div className="container justify-center mx-auto">
        <div className="self-start p-16 mx-auto sm:w-2/3">
          <ol className="space-y-4 text-xl leading-loose list-decimal list-inside sm:text-3xl font-display">
            <li>
              Connect your Argent X StarkNet Wallet <br />{' '}
              <span className="text-lg text-gray-700 sm:text-2xl">
                (create one{' '}
                <a
                  className="hover:underline"
                  href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                >
                  here
                </a>{' '}
                if you don’t have one and install the browser extension)
              </span>
            </li>
            <li>
              Complete the form <br />{' '}
              <span className="text-lg text-gray-700 sm:text-2xl">
                {account ? (
                  <a
                    target={'_blank'}
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSc66txDM8Ei3w83p3kLJL30VoBS6P7Xep4cIDVACZAbLY05mg/viewform?usp=pp_url&entry.2005620554=${account}`}
                    className=" hover:underline"
                    rel="noreferrer"
                  >
                    Sign up and & build
                  </a>
                ) : (
                  <a
                    rel="noreferrer"
                    target="_blank"
                    className="hover:underline"
                    href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                  >
                    First download and install Argent
                  </a>
                )}
              </span>
            </li>
            <li>
              20k Briqs will be airdropped to your address (within 24 hours)
            </li>
            <li>
              Choose one of the{' '}
              <a className="underline" href="#wonders">
                16 Wonders
              </a>{' '}
            </li>
            <li>
              Head to{' '}
              <a
                className="hover:underline text-[#eb5600]"
                href="https://realms.briq.construction/"
              >
                briq
              </a>{' '}
            </li>
            <li>
              Build your chosen Wonder with briqs <br />
              <a
                className="text-lg text-gray-700 hover:underline sm:text-2xl"
                target={'_blank'}
                href="https://briqnft.notion.site/Help-center-4a4958337970483dbfc2c1184290b42f"
                rel="noreferrer"
              >
                (how to build guide)
              </a>{' '}
            </li>
            <li>Mint your masterpiece on briq (no fees)</li>
            <li>
              Tweet your masterpiece with the following text: <br />{' '}
              <div className="py-8">
                "I built the @lootrealms Wonder [NAME] with @briqNFT. We’re
                trailblazing the way to layer 2 #StarkNet @starkwareLTD. View it
                on @PlayOasisXYZ.”
              </div>
            </li>
            <li> View your entry on PlayOasis</li>
          </ol>
          <hr className="my-10" />
          <h3 className="my-4">Voting</h3>
          <ul>
            <li>
              Voting will be done via a quadratic snapshot vote by the Realm
              holders
            </li>
            <li>
              There will be a snapshot per 16 submissions (one from each Order)
            </li>
            <li>Voting will be open for 7 days</li>
          </ul>
          <h3 className="my-4">Conditions</h3>
          <ul>
            <li>Open to everyone</li>
            <li>Should you need more briqs send a DM to the team</li>
            <li>Unlimited entries</li>
            <li>One creator can win more than once with multiple entries</li>
          </ul>
        </div>
      </div> */}

        <FaqBlock />
        <hr className="mt-10" />
        <FooterBlock />
        <div className="relative w-full bg-bottom bg-cover h-screen-30 bg-hero "></div>
      </div>
    </div>
  );
}

export default Home;
