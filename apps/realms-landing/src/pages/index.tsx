import { Button, ImageCarousel } from '@bibliotheca-dao/ui-lib';
import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/bibliotheca-book.svg';
import LooksRare from '@bibliotheca-dao/ui-lib/icons/social/looks-rare.svg';
import OpenSea from '@bibliotheca-dao/ui-lib/icons/social/open-sea.svg';
import { useEffect } from 'react';
import { FaqBlock } from '@/components/Faqs';
import { FullPageSlide } from '@/components/FullPageSlide';
import { MainFooter } from '@/components/layout/MainFooter';
import { MainLayout } from '@/components/layout/MainLayout';
import { WithNavMenu } from '@/components/NavMenu';
import { PartnerBanner } from '@/components/PartnerBanner';
import { ScrollSpy } from '@/util/ScrollSpy';
const slides = [
  {
    title: '',
    image: 'warRoom',
    link: 'https://atlas.bibliothecadao.xyz/',
    priority: true,
    content: (
      <div className="flex flex-col justify-between h-full px-6 text-center">
        <div className="mt-32 uppercase" data-content>
          <h1 className="duration-700 opacity-0 text-7xl sm:text-9xl">
            Realms
          </h1>
          <h1 className="duration-700 delay-100 opacity-0">Imperion</h1>
        </div>
        <div className="text-xl text-gray-900" data-content>
          <p className="duration-700 delay-200 opacity-0">
            Build empires inside your browser.
          </p>
          <p className="pb-6 duration-700 delay-500 opacity-0">
            An eternal on-chain game running on StarkNet
          </p>
          <div className="duration-700 delay-700 opacity-0">
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
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          An Eternal World
        </h2>
        <p className="duration-700 delay-300 opacity-0">
          The Realms are your fantasy universe. [GAME NAME] is the first module
          in an infinitely expanding player-owned game world.
        </p>
      </div>
    ),
  },
  {
    image: 'keyImage',
    link: 'https://scroll.bibliothecadao.xyz/',
    content: (
      <div
        className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2 "
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          Introducing [GAME NAME]
        </h2>
        <p className="duration-700 delay-300 opacity-0">
          A next generation MMO. Raise empires, raid resources, control Relics.
          Maintain your cities and finesse your forces, or fall into ruin.
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
        <p className="duration-700 delay-300 opacity-0">
          Dominate the battlefield. Out-smart the market. Exercise diplomacy.
          Take down the powerful or prey on the weak? Your world, your choice.
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
        <p className="duration-700 delay-300 opacity-0">
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
        <p className="duration-700 delay-300 opacity-0">
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
        className="flex flex-col justify-end h-full px-8 mx-auto sm:px-0 sm:w-1/2"
        data-content
      >
        <h2 className="mb-4 duration-700 opacity-0 delay-0">
          Your sovereign empire
        </h2>
        <span className="inline duration-700 delay-300 opacity-0">
          Each Realm is a unique and powerful state, capable of producing
          resources and raising armies. There are 8,000 Realms.
          <span className="inline-block">
            <a
              className="inline-block ml-4 mr-2 align-middle"
              href="https://opensea.io/collection/lootrealms"
            >
              <OpenSea className="w-8 fill-current hover:animate-bounce" />
            </a>
            <a
              className="inline-block align-middle"
              href="https://looksrare.org/collections/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"
            >
              <LooksRare className="w-8 fill-current hover:animate-bounce" />
            </a>
          </span>
        </span>
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
      <section className="container relative flex flex-col justify-center max-w-xl min-h-full px-8 pt-20 pb-24 mx-auto sm:px-0 snap-start align-center">
        {/* <h2 className="mb-10">Settle, Raid, Trade</h2>
        <div className="pl-8 sm:pl-0">
          <ImageCarousel loader={carouselLoader} items={mockData.items} />
    </div> 
        <p className="pb-12 mx-auto">
          Your realm has unique characteristics which shape its' population and
          production capacities. Build the city that suits the territory, the
          metagame and your playstyle
        </p> */}
        <h2>Bibliotheca: Stewards of on-chain gaming</h2>
        <BibliothecaBook className="h-48 py-6 mx-auto" />
        <p className="pb-4">
          Bibliotheca DAO is a pioneering web3 game studio building eternal
          games on Starknet.
        </p>
        <p className="hidden pb-4 sm:block">
          We are making games for gamers. We are open source. We are community
          funded. We are Starknet Hackathon winners. We are winners of the Game7
          Gitcoin Grant. We are proud recipients of the Loot Ecosystem Grant. We
          are proud to have received grants and investment from StarkWare.{' '}
        </p>
        <p className="pb-4">
          Our first mission: build a massively multiplayer on-chain gaming
          universe, leveraging the composability of the Loot hyperverse.
        </p>
        <Button
          className="py-2 mx-auto my-3 text-base font-normal tracking-wide text-white normal-case border border-black rounded-lg shadow-xl w-36 bg-white/50"
          href="https://bibliothecadao.xyz"
          variant="dao"
          texture={false}
        >
          Visit Us{' '}
        </Button>
        <PartnerBanner />
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
      <div className="container px-8 py-5 mx-auto snap-start sm:w-1/2 sm:px-0 lg:w-1/4">
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
    </MainLayout>
  );
}

export default Home;
