import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { useStarknet } from '@starknet-react/core';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

  return (
    <div className="h-full bg-gray-900">
      <Head />
      <iframe
        src="https://test-realms.briq.construction/share?set_id=0x35ee90ec08fa17ab562a06406fc391f574e2a94805403b84000000000000000&network=testnet&version=2&embed=1"
        className="h-screen-65 w-full"
        title="Briqs"
      ></iframe>

      <div className="container px-4 mx-auto">
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
              /> */}
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
                <ReactMarkdown>{content[4]}</ReactMarkdown>
              </section>
            </WithNavMenu>
          </div>
        </div>
      </div>
      <div className="relative w-full h-screen bg-center bg-cover bg-hero">
        <div className="z-10 flex justify-center w-full h-full text-3xl text-center align-middle top-16">
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
    </div>
  );
};

export default Home;
