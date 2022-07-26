import { Button } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    title: '',
    image: '/realms-art/warRoom-desktop.png',
    link: 'https://atlas.bibliothecadao.xyz/',
    content: (
      <div className="flex flex-col justify-between h-full text-center">
        <div className="mb-2 uppercase">
          <h1 className="text-9xl">Realms</h1>
          <h1>Imperion</h1>
        </div>
        <div className="text-xl text-gray-900">
          <p>Build empires inside your browser.</p>
          <p className="mb-6">An eternal on-chain game running on StarkNet</p>
          <Button href="https://atlas.bibliothecadao.xyz" variant="secondary">
            Explore the Atlas
          </Button>
        </div>
      </div>
    ),
  },
  {
    image: '/realms-art/eternity-desktop.png',
    imagePosition: '50% 70%',
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
    image: '/realms-art/keyImage-desktop.png',
    link: 'https://scroll.bibliothecadao.xyz/',
    imagePosition: 'center',
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
    image: '/realms-art/riches-desktop.png',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: 'center',
    content: (
      <div className="flex flex-col justify-end h-full px-4 mx-auto text-gray-900 sm:w-1/2">
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
    image: '/realms-art/createOrDestroy-desktop.png',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: 'center',
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
    image: '/realms-art/sky-desktop.png',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: '50% 65%',
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
    image: '/realms-art/siege-desktop.png',
    link: 'https://staking.bibliothecadao.xyz/',
    imagePosition: '50% 65%',
    content: (
      <div className="flex flex-col justify-end h-full px-4 mx-auto sm:w-1/2">
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

export const FullPageSlides = () => {
  return (
    <div className="flex flex-col">
      {slides.map((slide, index) => {
        return (
          <div key={index} className="relative w-full h-screen">
            <Image
              className="w-full h-full"
              alt=""
              src={slide.image}
              layout="fill"
              objectFit="cover"
              objectPosition={slide.imagePosition || 'top'}
            />
            <div className="container relative h-full py-16 mx-auto">
              {slide.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
