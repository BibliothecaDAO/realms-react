import { Disclosure } from '@headlessui/react';

const faqs = [
  {
    title: 'What will I need to play?',
    text: (
      <>
        To play the Realms: Eternum game you will require a{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/game/realms"
        >
          Realms NFT
        </a>{' '}
        (available to own from{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://opensea.io/collection/lootrealms"
        >
          Opensea
        </a>{' '}
        or{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://looksrare.org/collections/0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d?queryID=c5282ffb63e69a2dd46d47160669cf2b"
        >
          LooksRare
        </a>
        ). The 'Adventurers' game expansions in the roadmap will provide a low
        cost way to play in the Realms universe.
      </>
    ),
  },
  {
    title: 'Why StarkNet?',
    text: (
      <>
        We picked StarkNet for its superior computational capacity and
        scalability. You could say we are STARK maxis. Read why we believe
        Starknet will change blockchain gaming{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/technology/starknet"
        >
          here.
        </a>
      </>
    ),
  },
  {
    title: 'What’s an on-chain game?  An eternal game?',
    text: (
      <>
        An on-chain game has game-logic and game-state immutably stored
        on-chain. Once deployed it will run forever. Our game will not have an
        end state. It will be a perpetual, player-owned reality. Made possible
        by StarkNet’s scaling of computation and Ethereum’s network security.{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/intro"
        >
          Read more..
        </a>
      </>
    ),
  },
  {
    title: 'Wen game?',
    text: 'The team is testing internally.  Private/Public Alpha on Starknet Alpha  is imminent (late Q3 2022).  There might be several Alpha tests before a production version is deployed. We will tune the gameplay in Alpha with a view on long term enjoyment and sustainability of our eternal game.',
  },
  {
    title: 'Building in public',
    text: (
      <>
        Traditional game studios build behind closed doors, occasionally
        releasing trailers. We are building in the open. Everything is exposed
        to community members. This means some scoping and exploration activities
        reach dead ends, others bear fruit and expand. The same will be true of
        testing. We have a core product, in the{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/"
        >
          Master Scroll
        </a>
        , but you can see what else is being considered in the{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://discord.com/invite/uQnjZhZPfu"
        >
          discord
        </a>
        .
      </>
    ),
  },
  {
    title: 'Wen Starknet?',
    text: (
      <>
        StarkNet is in Alpha. StarkWare anticipates the network being in a good
        state for gameplay before the end of 2022. We speak to the leadership
        team at StarkNet regularly and update our{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/game/roadmap"
        >
          roadmap
        </a>{' '}
        accordingly.
      </>
    ),
  },
  {
    title: 'What does the $LORDS token do?',
    text: (
      <>
        The $LORDS token is central to the game economy. It is emitted by Realms
        based upon gameplay choices, and used for trading in the resource
        marketplace. Read more on the tokens and economy{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/category/-economics"
        >
          here.
        </a>
      </>
    ),
  },
  {
    title: 'What other assets are there?',
    text: (
      <>
        {' '}
        Read about resources and other tokens{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/economics/tokens"
        >
          here.
        </a>
      </>
    ),
  },
  {
    title: 'Who is building this?',
    text: (
      <>
        Bibliotheca DAO, a web3 gaming DAO. We are the sum of contributions of
        10 Core Lords and 10,000 community members. Visit the DAO on{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://discord.com/invite/uQnjZhZPfu"
        >
          discord
        </a>
        , or visit the{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://bibliothecadao.xyz/"
        >
          Bibliotheca page
        </a>
        . Follow us on{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://twitter.com/LootRealms"
        >
          Twitter
        </a>
        .
      </>
    ),
  },
  {
    title: 'Will I earn when I play?',
    text: 'We are making games for gamers. We are building a real time strategy game that is challenging and enjoyable to play. You build and produce things. You own the value that you create.',
  },
  {
    title: 'Who owns this?',
    text: 'We are open source.  We are, to date, community funded. It is a player-owned ecosystem and will remain so.',
  },
  {
    title: 'How is game development funded?',
    text: (
      <>
        The community bought Realms NFTs from the DAO which started the
        treasury. The community voted for us to be awarded grants (Game7 Gitcoin
        Grant, the Loot Ecosystem Grant). We won the inaugural StarkNet
        Hackathon, and have been awarded a grant from StarkWare. You can see our
        treasury{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://bibliothecadao.xyz/treasury"
        >
          here
        </a>
        . We are exploring funding options after Alpha testnet release, however
        this will have to be approved via the DAO.
      </>
    ),
  },
  {
    title: 'How can I contribute?',
    text: (
      <>
        We are a DAO. Our members have contributed immensely in terms of code,
        lore, art, ideas, music and passion for the plan. Most Core Lords are
        recruited from the community. Come to the{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://discord.com/invite/uQnjZhZPfu"
        >
          discord
        </a>{' '}
        and tell us how you want to contribute. We can offer builders grants
        after proof of concept.
      </>
    ),
  },
  {
    title: 'How does the Realms universe link to Loot?',
    text: (
      <>
        The composability of the Loot NFT changed the game. As did the CC0
        revolution. The Realms are the provinces of the Loot hyperverse. The OG
        Loot bags will play a vital{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/docs/adventurers/loot-fountains"
        >
          role
        </a>{' '}
        in the Adventurers game, and other Loot projects are integral to the
        Realms universe.
      </>
    ),
  },
  {
    title: 'Got a whitepaper?',
    text: (
      <>
        'Behold, the{' '}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://scroll.bibliothecadao.xyz/"
        >
          Master Scroll!
        </a>
      </>
    ),
  },
];

export const FaqBlock = () => {
  return (
    <div className="mx-auto my-20 ">
      <h2 className="mb-8">Frequently Asked Questions</h2>

      {faqs.map((a, index) => {
        return (
          <Disclosure key={index}>
            <Disclosure.Button className="w-full px-8 py-2 my-2 text-left normal-case transition-all duration-300 rounded bg-gray-1000 hover:bg-gray-900">
              {a.title}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 py-4 text-gray-200">
              {a.text}
            </Disclosure.Panel>
          </Disclosure>
        );
      })}
    </div>
  );
};
