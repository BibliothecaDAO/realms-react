import { Button } from '@bibliotheca-dao/ui-lib/base/button';
import Image from 'next/image';
import { projects } from '@/data/Projects';
export const ProjectBlock = () => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 sm:text-2xl">
      <div className="p-10 px-14">
        <Image
          className="rounded mb-10"
          alt="Vercel logo"
          src="/realms-logo.jpg"
          width={180}
          height={80}
        />
        <p>
          8000 procedurally generated maps with unique names, resources and
          geographical traits. 50 ultra rare Realms contain a unique Wonder.
        </p>
        <div className="flex mx-auto gap-2 w-full justify-center my-4">
          <Button size="sm" href={projects[0].website} variant="secondary">
            Atlas
          </Button>
          <Button size="sm" href={projects[0].discord} variant="secondary">
            Discord
          </Button>
        </div>
      </div>
      <div className="p-10 px-14">
        <Image
          className="rounded mb-10"
          alt="Vercel logo"
          src="/briq.jpg"
          width={80}
          height={80}
        />
        <p>
          NFT building protocol based on fundamental particles called briqs that
          can be assembled to create NFTs. briq is NFT matter.
        </p>
        <div className="flex mx-auto gap-2 w-full justify-center my-4">
          <Button size="sm" href={projects[1].website} variant="secondary">
            website
          </Button>
          <Button size="sm" href={projects[1].discord} variant="secondary">
            Discord
          </Button>
        </div>
      </div>
      <div className="p-10 px-14">
        <Image
          className="rounded mb-10"
          alt="Vercel logo"
          src="/oasis.svg"
          width={80}
          height={80}
        />
        <p>
          PlayOasis is a general-purpose NFT marketplace powered by StarkNet.
          Make offers and list NFTs with near-zero gas fees.
        </p>
        <div className="flex mx-auto gap-2 w-full justify-center my-4">
          <Button size="sm" href={projects[2].website} variant="secondary">
            website
          </Button>
          <Button size="sm" href={projects[2].discord} variant="secondary">
            Discord
          </Button>
        </div>
      </div>
      <div className="p-10 px-14">
        <Image
          className="rounded mb-10"
          alt="Vercel logo"
          src="/starknet.svg"
          width={180}
          height={80}
        />
        <p>
          StarkNet is a permissionless decentralized ZK-Rollup. It operates as
          an L2 network over Ethereum, enabling any dApp to achieve unlimited
          scale for its computation – without compromising Ethereum's
          composability and security.
        </p>
        <div className="flex mx-auto gap-2 w-full justify-center my-4">
          <Button size="sm" href={projects[3].website} variant="secondary">
            website
          </Button>
          <Button size="sm" href={projects[3].discord} variant="secondary">
            Discord
          </Button>
        </div>
      </div>
    </div>
  );
};
