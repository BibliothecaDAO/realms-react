import { Button, Card, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { environments, findEnvironment } from '@/constants/cryptsEnvironments';
import { useAtlasContext } from '@/context/AtlasContext';
import { useCryptContext } from '@/context/CryptContext';
import type { Crypt } from '@/types/index';
import { CryptSideBar } from '../crypts/CryptsSideBar';

interface CryptOverviewsProps {
  dungeons: Crypt[];
}

export function CryptsOverviews(props: CryptOverviewsProps) {
  const { address: l1Address } = useL1Account();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const {
    state: { favouriteCrypt },
    actions,
  } = useCryptContext();
  const [selectedCryptId, setSelectedCryptId] = useState('');

  const isYourCrypt = (crypt: Crypt) =>
    l1Address && l1Address === crypt.currentOwner?.address?.toLowerCase();

  const isFavourite = (crypt: Crypt) => favouriteCrypt.indexOf(crypt.id) > -1;

  return (
    <div className="grid grid-cols-12 gap-6 px-3">
      {props.dungeons &&
        props.dungeons.map((crypt: Crypt, index) => (
          <Card
            key={index}
            className="flex flex-wrap w-full h-auto max-w-full col-span-12 mb-4 overflow-x-auto rounded sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-3 justify-evenly paper"
          >
            <div className="w-full ">
              <Image
                src={`data:image/svg+xml;base64,${btoa(crypt.svg as string)}`}
                alt=""
                width="900"
                height="900"
                layout={'responsive'}
                className={'rounded-md'}
              />
            </div>
            <div className="flex w-full bg-gray-1000">
              <div className="flex self-center w-full pt-4 pb-2 border-b border-white/20">
                <h3 className={`px-2 rounded py-1`}>
                  <span>{crypt.id}</span> | {crypt.name}
                </h3>
              </div>
            </div>
            <div className="flex w-full px-2 py-2 bg-gray-1000 border-b border-white/20">
              <div className="flex self-center my-1">
                <ResourceIcon
                  resource={environments[crypt.environment]?.name}
                  size="md"
                  label
                />{' '}
                <span className="self-center"> (soon)</span>
              </div>
            </div>
            <div className="grid items-center justify-between w-full grid-cols-2 px-2 pt-4 tracking-wide uppercase bg-gray-1000">
              <div className="my-1">Environment</div>
              <div
                className={`px-2 rounded font-display uppercase text-xs py-1 text-black border border-white/20 ${
                  findEnvironment(crypt.environment)?.colourClass.main
                }`}
              >
                {' '}
                {findEnvironment(crypt.environment)?.name}
              </div>
              <div className="my-1 ">Size</div>
              <div>
                {crypt.size} x {crypt.size}
              </div>
              <div className="my-1 ">Doors</div>
              <div>{crypt.numPoints}</div>
              <div className="my-1">Points</div>
              <div>{crypt.numDoors}</div>
              {/* <div className="my-1 font-bold">Legendary</div>
              <div>{crypt}</div> */}
            </div>
            <div className="flex justify-between w-full mt-4 space-x-2">
              <Button
                onClick={() => {
                  navigateToAsset(+crypt.id, 'crypt');
                }}
                variant="primary"
                size="xs"
                className="w-full"
              >
                fly to
              </Button>
              <Button
                onClick={() => {
                  setSelectedCryptId(crypt.id);
                }}
                variant="outline"
                size="xs"
                className=""
              >
                details
              </Button>
              {!isFavourite(crypt) && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => actions.addFavouriteCrypt(crypt.id)}
                >
                  +
                </Button>
              )}
              {isFavourite(crypt) && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => actions.removeFavouriteCrypt(crypt.id)}
                >
                  -
                </Button>
              )}
            </div>
          </Card>
        ))}
      <CryptSideBar
        cryptId={selectedCryptId}
        isOpen={!!selectedCryptId}
        onClose={() => {
          setSelectedCryptId('');
        }}
      />
    </div>
  );
}
