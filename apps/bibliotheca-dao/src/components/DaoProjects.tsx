import { Button } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    title: 'The Atlas',
    image: '/imperion.jpg',
    link: 'https://atlas.bibliothecadao.xyz/',
    subtitle: 'Play the MMOCG Realms Game',
    content: (
      <div>
        <Button
          href="https://atlas.bibliothecadao.xyz/"
          size="sm"
          variant="primary"
        >
          Explore the Atlas
        </Button>
      </div>
    ),
  },
  {
    title: 'Realms Information',
    image: '/dark.png',
    link: '',
    subtitle: 'A synopsis of the Realms ecosystem',
    content: (
      <div>
        <Button
          href="https://atlas.bibliothecadao.xyz/"
          size="sm"
          variant="primary"
        >
          Learn more
        </Button>
      </div>
    ),
  },
  {
    title: 'DAO Governance',
    image: '/governance-nft.png',
    link: '',
    subtitle: 'Participate in the future of Bibliotheca projects',
    content: (
      <div>
        <Link href={'/treasury'}>
          <Button size="sm" className="mr-2" variant="primary">
            Treasury
          </Button>
        </Link>

        <Button
          href="https://snapshot.org/#/council.bibliotheca.eth"
          size="sm"
          variant="primary"
        >
          Voting
        </Button>
      </div>
    ),
  },
  {
    title: 'The Master Scroll',
    image: '/mobius.jpeg',
    link: 'https://scroll.bibliothecadao.xyz/',
    subtitle: 'The whitepaper of the Bibliotheca Realms and Lootverse',
    content: (
      <div>
        <Button
          href="https://scroll.bibliothecadao.xyz/"
          size="sm"
          variant="primary"
        >
          Read the Scroll
        </Button>
      </div>
    ),
  },
  {
    title: 'Realm Staking',
    image: '/governance-nft.png',
    link: 'https://staking.bibliothecadao.xyz/',
    subtitle: 'Join the journey to L2 and earn $LORDS',
    content: (
      <div>
        <Button
          href="https://staking.bibliothecadao.xyz/"
          size="sm"
          variant="primary"
        >
          Visit Staking Site
        </Button>
      </div>
    ),
  },
];

export const DaoProjects = () => {
  return (
    <div>
      <div className="featured-game-bg"></div>
      <div className="container mx-auto">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="mb-6 text-center">
              <h2 className="uppercase">
                Our <span>Projects</span>
              </h2>
              <p>
                DAO developed range of games, docs, tooling, and contribution
                guidelines
              </p>
            </div>
          </div>
        </div>

        <div className="container grid gap-8 sm:grid-cols-2 ">
          {projects.map((project, index) => {
            return (
              <div
                key={index}
                className="relative group h-96 mb-30 bg-clip-content"
              >
                <Image
                  className="transition-all duration-500 ease-in-out rounded-xl hover:bg-clip-border group-hover:scale-125"
                  alt="Vercel logo"
                  src={project.image}
                  layout={'fill'}
                  objectPosition={'center'}
                  objectFit={'cover'}
                />
                <div className="absolute transition-all duration-500 ease-in-out group-hover:h-1/2 h-24 w-full py-2.5 bottom-2 inset-x-0 bg-gray-700/80 text-white text-xs text-center leading-4">
                  <h4>
                    <Link href={project.link}>{project.title}</Link>
                  </h4>
                  <div className="game-meta">
                    <span>{project.subtitle}</span>
                  </div>
                  <div className="mt-4 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    {project.content}
                  </div>
                </div>
                {/* <div className="featured-game-content featured-game-overlay-content">
                  <div className="featured-game-icon">
                    <img src="assets/img/icon/featured_game_icon.png" alt="" />
                  </div>
                  <h4>
                    <a href="/">
                      JUST FOR <span>GAMERS</span>
                    </a>
                  </h4>
                  <div className="featured-game-meta">
                    <i className="fas fa-bell"></i>
                    <span>Playstation 5 , Xbox</span>
                  </div>
            </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
