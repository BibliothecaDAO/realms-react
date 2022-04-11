import { Button } from '@bibliotheca-dao/ui-lib/base/button';
import Image from 'next/image';
export const ProjectBlock = () => {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
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
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
            Atlas
          </Button>
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
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
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
            Atlas
          </Button>
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
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
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
            Atlas
          </Button>
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
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
          8000 procedurally generated maps with unique names, resources and
          geographical traits. 50 ultra rare Realms contain a unique Wonder.
        </p>
        <div className="flex mx-auto gap-2 w-full justify-center my-4">
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
            Atlas
          </Button>
          <Button
            size="sm"
            href="https://atlas.bibliothecadao.xyz"
            variant="secondary"
          >
            Discord
          </Button>
        </div>
      </div>
    </div>
  );
};
