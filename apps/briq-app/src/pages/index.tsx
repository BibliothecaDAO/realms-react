import { Button } from '@bibliotheca-dao/ui-lib';
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
      <div className="relative w-full h-screen bg-center bg-cover bg-hero">
        <div className="z-10 flex justify-center w-full h-full text-3xl text-center align-middle top-16">
          <div className="flex self-center ">
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
          </div>
        </div>
      </div>
      <div className="container px-4 mx-auto">
        <div className="lg:flex lg:gap-x-16">
          <div className="w-full lg:w-5/12 sm:order-last">
            <div className="sticky top-0 w-full pt-16">
              <Image
                className="w-full"
                alt="Vercel logo"
                src="/revillo-wonder.png"
                width={2560}
                height={1545}
              />
            </div>
          </div>
          <div className="w-full lg:w-7/12">
            <WithNavMenu selector="section">
              <section
                data-nav-title="Overview"
                id="section1"
                data-scrollspy
                className="pt-8 text-xl leading-7 prose-xl"
              >
                <ReactMarkdown>{content[0]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="Competition"
                id="section2"
                data-scrollspy
                className="py-8 prose-lg"
              >
                <h2>Competition</h2>
                <ReactMarkdown>{content[1]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="How to Enter"
                id="section3"
                data-scrollspy
                className="py-8 prose"
              >
                <h2>How to Enter</h2>
                <ReactMarkdown>{content[2]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="The Wonders"
                id="section4"
                data-scrollspy
                className="py-8 prose"
              >
                <h2>The Wonders</h2>
                <ReactMarkdown>{content[3]}</ReactMarkdown>
              </section>
              <section
                data-nav-title="Voting & Conditions"
                id="section5"
                data-scrollspy
                className="py-8 prose-lg"
              >
                <h2>Voting & Conditions</h2>
                <ReactMarkdown>{content[4]}</ReactMarkdown>
              </section>
            </WithNavMenu>
          </div>
        </div>
        <div className="pt-8 pb-16">
          {account ? (
            <a
              className="relative inline-flex items-center justify-center px-4 px-8 py-2 font-semibold text-left text-white uppercase transition duration-150 ease-in-out border-2 rounded shadow-md outline-none select-none tracking-veryWide font-body hover:-translate-y-1 active:translate-y-1 active:shadow-inner disabled:opacity-70 disabled:pointer-events-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-offset-white bg-off-200 hover:bg-off-200/80 focus-visible:ring-yellow-700 border-off-200 text-md "
              href={`https://docs.google.com/forms/d/e/1FAIpQLSc66txDM8Ei3w83p3kLJL30VoBS6P7Xep4cIDVACZAbLY05mg/viewform?usp=pp_url&entry.2005620554=${account}`}
            >
              Get briqs
            </a>
          ) : (
            <div>
              <div className="text-2xl">
                {hasStarknet ? (
                  <div>
                    If you haven&apos;t already done so, please
                    <a
                      rel="noreferrer"
                      target="_blank"
                      className="underline"
                      href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                    >
                      download and install
                    </a>
                    the ArgentX extension, available now for the Google Chrome
                    web browser.
                  </div>
                ) : (
                  <div className="p-4 text-red-800 bg-red-100 border-red-700 rounded-md">
                    The ArgentX wallet extension could not be activated. Please
                    <a
                      rel="noreferrer"
                      target="_blank"
                      className="underline"
                      href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
                    >
                      install ArgentX
                    </a>
                    on a supported browser and revisit this page.
                  </div>
                )}
              </div>
              <Button onClick={() => connectBrowserWallet()} className="mt-4">
                Connect to ArgentX
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
