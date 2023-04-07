import { Button } from '@bibliotheca-dao/ui-lib';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import Image from 'next/image';
import { useState } from 'react';
import Typist from 'react-typist-component';
import { ArticlePreview } from '@/components/articles/ArticlePreview';
import { FaqBlock } from '@/components/Faqs';
import { MainLayout } from '@/components/layout/MainLayout';
import { PartnerBanner } from '@/components/PartnerBanner';
import { homePage } from '@/data/Information';
import { getSortedArticlesData } from '@/hooks/articles';

export async function getStaticProps() {
  const allArticlesData = getSortedArticlesData();
  return {
    props: {
      allArticlesData,
    },
  };
}

function Home({ allArticlesData }: any) {
  const [key, setKey] = useState(1);
  return (
    <MainLayout>
      <div className="container px-10 mx-auto">
        <div className="flex h-screen">
          <div className="self-end w-full pb-20 sm:w-1/2">
            <h1 className="mb-10 leading-relaxed font-body">
              We are making <br />
              <Typist
                typingDelay={100}
                cursor={<span className="no-underline cursor">|</span>}
                restartKey={key}
                loop={true}
              >
                <span>
                  onchain
                  <Typist.Delay ms={1500} />
                  <Typist.Backspace count={8} />
                  <Typist.Delay ms={1500} />
                  eternal gaming
                  <Typist.Delay ms={1500} />
                  <Typist.Backspace count={14} />
                  <Typist.Delay ms={1500} />
                  composable
                  <Typist.Delay ms={4000} />
                </span>
              </Typist>
              <br />
              realities.
            </h1>
          </div>
        </div>
      </div>

      <FaqBlock heading="Bibliotheca DAO" faqs={homePage} />
      <PartnerBanner />
      <div className="w-full bg-white/10">
        <div className="max-w-2xl px-6 py-20 mx-auto">
          <h3 className="mb-8">Articles</h3>
          <div className="flex flex-col w-full space-y-3">
            {allArticlesData?.map((a: any, index: any) => {
              return <ArticlePreview key={index} {...a} />;
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 flex py-10 text-center bg-white/20">
        <div className="container mx-auto ">
          <div className="self-center px-10 mx-auto sm:w-1/2">
            {/* <div className="flex justify-center mb-5">
              <StarkNet className="w-8 mr-4" />
              <h5 className="self-center tracking-widest uppercase font-body">
                a StarkNet autonomous world
              </h5>
            </div> */}

            <h4 className="mb-10">📜 Master Scroll (litepaper)</h4>
            <div className="mt-4">
              <Button
                href="https://scroll.bibliothecadao.xyz/"
                size="sm"
                variant="dao"
              >
                read the Master Scroll
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container relative z-20 flex flex-wrap px-10 py-10 mx-auto my-40">
        <div className="self-center p-4 sm:w-1/2">
          <div className="flex mb-5">
            <h5 className="self-center tracking-widest uppercase font-body">
              8000 generative maps
            </h5>
          </div>

          <h1 className="mb-10">Loot Realms</h1>
          <p>
            The 8000 Realms were procedurally generated as black and white SVG
            files, but have since then begun their transition into high-fidelity
            3D renders using height maps.
          </p>
          <div className="flex mt-4 space-x-2">
            <Button
              href="https://opensea.io/collection/lootrealms"
              size="sm"
              variant="dao"
            >
              opensea
            </Button>
            <Button
              href="https://atlas.bibliothecadao.xyz/"
              size="sm"
              variant="dao"
            >
              explore the atlas
            </Button>
          </div>
        </div>
        <div className="sm:w-1/2">
          {' '}
          <Image
            src={`https://openseauserdata.com/files/769284da4198c2651e371ecec7b8bf73.svg`}
            alt="map"
            className="w-full p-2 mt-4 rounded-3xl bg-black/10"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
