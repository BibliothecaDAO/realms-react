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
        <div className="text-xl text-slate-800">
          <p>Build Empires inside your browser.</p>
          <p className="mb-6">
            An eternal on-chain reality, powered by Starknet
          </p>
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
      <div className="flex flex-col justify-end h-full mx-auto sm:w-1/2">
        <div>
          <h2>Realms</h2>
          <h2>The Eternal</h2>
          <h2>Gaming Universe</h2>
          <p>
            Stride forth into your fantasy Universe. An eternal, on-chain
            reality. The Realms is more than the land beneath your feet; it is
            the grand stage for undending games and player-led experiences. This
            is the Realms On-Chain Universe (ROCU)
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
      <div className="flex flex-col justify-end h-full mx-auto sm:w-1/2">
        <div>
          <h2>Behold Imperion</h2>
          <p>
            Stride forth into your fantasy Universe. An eternal, on-chain
            reality. The Realms is more than the land beneath your feet; it is
            the grand stage for undending games and player-led experiences. This
            is the Realms On-Chain Universe (ROCU)
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
      <div className="flex flex-col justify-end h-full mx-auto text-slate-700 sm:w-1/2">
        <div>
          <h2>Player of Games</h2>
          <p>
            In the Realms On-Chain Universe you have unlimited agency to play
            the way you wish. Take to the battlefield and show your prowess as a
            general or soldier. Collude with members of your Order to take down
            the powerful or prey on the weak. Dominate the markets with your eye
            for an opportunity. In this on-chain civilization, no one can tell
            you what to do. As you play, you create value in assets the you
            fully own.
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
      <div className="flex flex-col justify-end h-full mx-auto sm:w-1/2">
        <div>
          <h2>Create or Destroy</h2>
          <p>
            Imperion is a persistent game of strategy, resource management,
            trading, building and battling, set in the ROCU. Fine tuen the
            composition of your empire's buildings and your military forces.
            Produce what you need, or raid to take what you require to maintain
            and grow your empire. Ward of parasitic goblins. Launch grand
            expeditions to control the Relics of competing Orders, and fight
            tooth and nail to defend your own.
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
      <div className="flex flex-col justify-end h-full mx-auto text-slate-700 sm:w-1/2">
        <div>
          <h2>Built on StarkNet</h2>
          <p>
            The potential of gaming on the Ethereum blockchain can be fully
            realised with StarkNet scaling technology. Many Layer 2 solutions
            exist, but none offer the same advantages to game developers
            creating rich and immersive gameplay involving thousands of
            transactions per second. StarkNet are strategic partners and
            investors in Bilbiotheca, the Web3 gaming studio building the Realms
            On-Chain Universe.
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
      <div className="flex flex-col justify-end h-full mx-auto sm:w-1/2">
        <div>
          <h2>Realms,</h2>
          <h2>Eternal Metaverse</h2>
          <p>
            Stride forth into your fantasy Universe. An eternal, on-chain
            reality. The Realms is more than the land beneath your feet; it is
            the grand stage for undending games and player-led experiences. This
            is the Realms On-Chain Universe (ROCU)
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
            <div className="container relative h-full py-10 mx-auto">
              {slide.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
