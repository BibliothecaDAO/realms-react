import { Button } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    title: 'The Atlas',
    image: '/imperion.jpg',
    link: 'https://atlas.bibliothecadao.xyz/',
    subtitle: 'Explore the Realmverse',
    content: (
      <div>
        <Button
          href="https://atlas.bibliothecadao.xyz/"
          size="sm"
          variant="secondary"
        >
          Explore the Atlas
        </Button>
      </div>
    ),
  },
  // {
  //   title: 'Realms',
  //   image: '/dark.png',
  //   link: '',
  //   subtitle: 'A synopsis of the Realms ecosystem',
  //   content: (
  //     <div>
  //       <Button
  //         href="https://atlas.bibliothecadao.xyz/"
  //         size="sm"
  //         variant="primary"
  //       >
  //         Learn more
  //       </Button>
  //     </div>
  //   ),
  // },
  {
    title: 'DAO Governance',
    image: '/governance-nft.png',
    link: '',
    subtitle: 'Participate in the future of Bibliotheca projects',
    content: (
      <div>
        <Button
          href="https://snapshot.org/#/council.bibliotheca.eth"
          size="sm"
          variant="secondary"
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
          variant="secondary"
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
          variant="secondary"
        >
          Visit Staking Site
        </Button>
      </div>
    ),
  },
];

export const DaoProjects = () => {
  return (
    <div className="relative z-20">
      <div className="featured-game-bg"></div>
      <div className="container mx-auto my-20">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="mb-6 text-center">
              <h1 className="mb-20 uppercase font-lords">DAO Projects</h1>
            </div>
          </div>
        </div>

        <div className="container grid gap-8 px-10 sm:grid-cols-3">
          {projects.map((project, index) => {
            return (
              <div
                key={index}
                className="flex flex-col transition-all duration-150 border rounded border-off-300 group hover:-translate-y-2"
              >
                <img
                  src={project.image}
                  alt=""
                  className="object-cover rounded-t h-96"
                />
                <div className="flex flex-col w-full px-4 py-10 text-center transition-all duration-150 ease-in-out shadow-inner cursor-pointer bottom-2 bg-gray-900/50 group-hover:bg-off-300 group-hover:text-gray-900">
                  <h2 className="mb-2">
                    <Link href={project.link}>{project.title}</Link>
                  </h2>
                  <p className="text-xl">
                    <span>{project.subtitle}</span>
                  </p>
                  <div className="mt-20 group-hover:opacity-100">
                    {project.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
