import { Button, ImageCarousel } from '@bibliotheca-dao/ui-lib';
import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/bibliotheca-book.svg';
import Eternum from '@bibliotheca-dao/ui-lib/icons/eternum-lockup.svg';

import LooksRare from '@bibliotheca-dao/ui-lib/icons/social/looks-rare.svg';
import OpenSea from '@bibliotheca-dao/ui-lib/icons/social/open-sea.svg';
import ReactFullpage from '@fullpage/react-fullpage';
import { useEffect } from 'react';
import { FaqBlock } from '@/components/Faqs';
import { FullPageSlide } from '@/components/FullPageSlide';
import { MainFooter } from '@/components/layout/MainFooter';
import { MainLayout } from '@/components/layout/MainLayout';
import { WithNavMenu } from '@/components/NavMenu';
import { PartnerBanner } from '@/components/PartnerBanner';
import Tourus from '@/components/Tourus';
import { ScrollSpy } from '@/util/ScrollSpy';

const slides = [
  {
    title: '',
    image: 'warRoom',
    link: 'https://atlas.bibliothecadao.xyz/',
    priority: true,
    imagePosition: 'top',
    content: (
      <div className="flex flex-col justify-between h-full px-6 text-center">
        <div className="mt-20 text-center lg:mt-28" data-content>
          <Eternum className="w-1/2 mx-auto fill-current lg:w-1/3" />
        </div>
        <div className="text-gray-900 " data-content>
          <p className="duration-700 delay-200 opacity-0 sm:text-5xl">
            Build empires inside your browser
          </p>
          <p className="pb-6 duration-700 delay-500 opacity-0 sm:text-3xl ">
            An eternal on-chain game running on StarkNet
          </p>
          <div className="flex justify-center space-x-2 duration-700 delay-700 opacity-0">
            <Button
              className="py-3 font-normal tracking-wide text-white normal-case border-0 rounded-lg shadow-lg backdrop-brightness-125 bg-black/50"
              href="https://atlas.bibliothecadao.xyz"
              variant="dao"
              texture={false}
            >
              Explore the Atlas
            </Button>
            <Button
              className="py-3 font-normal tracking-wide text-white normal-case border-0 rounded-lg shadow-lg backdrop-brightness-125 bg-black/50"
              variant="dao"
              texture={false}
            >
              View More
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    image: 'eternity',
    priority: true,
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-8 duration-700 opacity-0 delay-0">
          An Eternal World
        </h2>
        <p className="duration-700 delay-300 opacity-50 sm:text-3xl text-white/80">
          The Realms are your fantasy universe. <br /> Realms: ETERNUM is the
          first module in an infinitely expanding player-owned game world.
        </p>
      </div>
    ),
  },
  {
    image: 'keyImage',
    link: 'https://scroll.bibliothecadao.xyz/',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto text-center sm:px-0 sm:w-1/2"
        data-content
      >
        {/* <h2 className="duration-700 opacity-0 delay-0">Introducing</h2> */}
        <div className="text-center duration-700 delay-150 " data-content>
          <Eternum className="w-1/2 mx-auto fill-current" />
        </div>
        <p className="duration-700 delay-300 opacity-0 sm:text-3xl text-white/80">
          A next generation MMO. <br /> Raise empires, raid resources, control
          relics. <br /> Maintain your cities and finesse <br />
          your forces, or fall into ruin.
        </p>
      </div>
    ),
  },
  {
    title: 'Realm Staking',
    image: 'riches',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto text-gray-900 sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          Play with Freedom
        </h2>
        <p className="duration-700 delay-300 opacity-0 sm:text-3xl text-black/80">
          Dominate the battlefield. Out-smart the market. Exercise diplomacy.
          Take down the powerful or prey on the weak? <br /> Your world, your
          choice.
        </p>
      </div>
    ),
  },
  {
    image: 'createOrDestroy',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          The Realms Resist
        </h2>
        <p className="duration-700 delay-300 opacity-0 sm:text-3xl text-white/80">
          It’s not just the other Lords you need to conquer: the Realms are home
          to powerful environmental entities seeking to drag your empire into
          decay.
        </p>
      </div>
    ),
  },
  {
    image: 'sky',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: 'bottom',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto text-gray-900 sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          Built on StarkNet
        </h2>
        <p className="duration-700 delay-300 opacity-0 sm:text-3xl text-black/80">
          Real-time, deeply strategic gameplay. On-chain and unstoppable.
          Eternal play is made possible by StarkNet and Ethereum.
        </p>
      </div>
    ),
  },
  {
    image: 'siege',
    link: 'https://staking.bibliothecadao.xyz/',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto text-center sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          Your Sovereign Empire
        </h2>
        <span className="inline duration-700 delay-300 opacity-0 sm:text-3xl text-white/80">
          Each Realm is a unique and powerful state, capable of producing
          resources and raising armies. There are 8,000 Realms.
          <div className="flex justify-center mt-8">
            <a
              className="inline-block ml-4 mr-2 align-middle"
              href="https://opensea.io/collection/lootrealms"
            >
              <OpenSea className="w-12 fill-current hover:opacity-70" />
            </a>
            <a
              className="inline-block align-middle"
              href="https://looksrare.org/collections/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"
            >
              <LooksRare className="w-12 fill-current hover:opacity-70" />
            </a>
          </div>
        </span>
      </div>
    ),
  },
];

function Home() {
  useEffect(() => {
    if (window.scrollTo) {
      window.scrollTo(0, 1);
    }
  });
  const onScrollUpdate = (entry: any, isInVewPort: any) => {
    const { target, boundingClientRect } = entry;
    const menuItem = document.querySelector(
      `[data-scrollspy-id="${target.id}"]`
    );
    if (entry.intersectionRatio >= 0.75) {
      menuItem?.classList.add('active');
    } else {
      if (menuItem?.classList.contains('active')) {
        menuItem?.classList.remove('active');
      }
    }
  };
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
      <ReactFullpage
        // fullpage options
        licenseKey={'gplv3-license'}
        scrollingSpeed={1000} /* Options here */
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <WithNavMenu />

              <ScrollSpy handleScroll={onScrollUpdate} />

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
              <section
                fp-auto-height
                className="w-full min-h-screen overflow-y-scroll section"
              >
                <div className="fixed w-screen h-screen ">
                  <Tourus />
                </div>
                <div className="relative flex flex-col justify-center min-h-screen px-8 py-16 mx-auto sm:px-0 align-center">
                  {/* <h2 className="mb-10">Settle, Raid, Trade</h2>
                        <div className="pl-8 sm:pl-0">
                          <ImageCarousel loader={carouselLoader} items={mockData.items} />
                    </div> 
                        <p className="pb-12 mx-auto">
                          Your realm has unique characteristics which shape its' population and
                          production capacities. Build the city that suits the territory, the
                          metagame and your playstyle
                        </p> */}
                  <div className="container mx-auto text-center">
                    <div className="w-48 h-48 mx-auto mt-6">
                      <BibliothecaBook className="fill-current " />
                    </div>
                    <h2>
                      Bibliotheca DAO
                      <br /> Stewards of on-chain gaming
                    </h2>
                    <div className="w-1/2 mx-auto">
                      {' '}
                      <p className="pt-4 mb-4 sm:text-2xl">
                        Bibliotheca DAO is a pioneering web3 game studio <br />
                        building eternal games on StarkNet.
                      </p>
                      {/* <p className="hidden pb-4 text-2xl sm:block">
                        We are making games for gamers. <br />
                        We are open source. <br /> We are community funded.{' '}
                        <br /> We are StarkNet Hackathon winners. <br />
                        We are winners of the Game7 Gitcoin Grant. We are proud
                        recipients of the Loot Ecosystem Grant. <br />
                        We are proud to have received grants and investment from
                        StarkWare.{' '}
                      </p> */}
                      {/* <p className="pb-4 text-2xl">
                        Our first mission: build a massively multiplayer
                        on-chain gaming universe, leveraging the composability
                        of the Loot hyperverse.
                      </p> */}
                      <Button
                        className="py-2 mx-auto my-3 text-base font-normal tracking-wide normal-case border border-black rounded-lg shadow-xl w-36 bg-white/50"
                        href="https://bibliothecadao.xyz"
                        target="_blank"
                        variant="dao"
                        texture={false}
                      >
                        Visit Us{' '}
                      </Button>
                    </div>
                  </div>

                  <PartnerBanner />
                </div>
              </section>
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
              <div className="min-h-screen section">
                <div className="container relative px-8 py-5 mx-auto sm:w-1/2 sm:px-0 lg:w-1/2">
                  <FaqBlock />
                  <div className="mx-auto ">
                    <h1 className="text-xl font-semibold font-display lg:text-4xl">
                      Stay up to Date
                    </h1>
                    <p className="py-1">
                      Sign up to the newsletter and be the first one to know
                      about new developments in the ecosystem.
                    </p>
                    <div className="flex justify-center mt-6">
                      <div className="flex-row w-full">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between w-full flex-warp md:flex-row">
                            <input
                              type="email"
                              className="p-3 m-1 text-sm font-medium text-gray-700 border-none appearance-none focus:outline-none focus:border-white focus:rounded focus:placeholder-transparent"
                              placeholder="Enter your email"
                              aria-label="Enter your email"
                            />
                            <button className="right-0 w-full p-2 m-1 text-sm font-semibold bg-gray-800 rounded-lg lg:w-auto hover:bg-gray-700">
                              Subscribe
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 ml-1 text-sm font-light text-gray-300">
                          Unsubscribe at any time
                        </p>
                      </div>
                    </div>
                    <MainFooter />
                  </div>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </MainLayout>
  );
}

export default Home;
