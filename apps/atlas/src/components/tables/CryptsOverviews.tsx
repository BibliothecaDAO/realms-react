import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { useCryptContext } from '@/context/CryptContext';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Crypt } from '@/types/index';
import { environments } from '@/util/cryptsEnvironments';

interface CryptOverviewsProps {
  dungeons: Crypt[];
}

export function CryptsOverviews(props: CryptOverviewsProps) {
  const { account } = useWalletContext();
  const {
    toggleMenuType,
    selectedMenuType,
    setSelectedId,
    gotoAssetId,
    togglePanelType,
  } = useUIContext();
  const {
    state: { favouriteCrypt },
    actions,
  } = useCryptContext();

  const isYourCrypt = (crypt: Crypt) =>
    account && account === crypt.currentOwner?.address?.toLowerCase();

  const openCryptDetails = (id: string) => {
    setSelectedId(id);
    if (selectedMenuType !== 'crypt') {
      toggleMenuType('crypt');
    }
  };

  const isFavourite = (crypt: Crypt) => favouriteCrypt.indexOf(crypt.id) > -1;

  return (
    <div>
      {props.dungeons &&
        props.dungeons.slice(0, 10).map((crypt: Crypt, index) => (
          <div
            key={index}
            className="flex flex-wrap w-full h-auto max-w-full mb-4 overflow-x-auto rounded justify-evenly"
          >
            <div className="flex w-full p-2  bg-black/50">
              <div className="self-center flex w-full">
                <h3 className=" ml-4">
                  <span className="text-gray-400">{crypt.id}</span> |{' '}
                  {crypt.name}
                </h3>
                <div className="ml-auto">
                  {!isFavourite(crypt) && (
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => actions.addFavouriteCrypt(crypt.id)}
                    >
                      Add
                    </Button>
                  )}
                  {isFavourite(crypt) && (
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => actions.removeFavouriteCrypt(crypt.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-2/3 grid items-center justify-between w-full grid-cols-2 p-6 bg-black/70">
              <div className="font-bold my-1">Environment</div>
              <div className="flex my-1">
                {' '}
                {environments[crypt.environment]?.name}
              </div>
              <div className="font-bold my-1">Resource</div>
              <div className="flex my-1">
                <ResourceIcon
                  resource={environments[crypt.environment]?.name
                    .replace(' ', '')
                    .replace("'", '')}
                  size="sm"
                />{' '}
              </div>
              <div className="font-bold  my-1">Size</div>
              <div>{crypt.size}</div>
              <div className="font-bold my-1">Doors</div>
              <div>{crypt.numDoors}</div>
              <div className="font-bold my-1">Points</div>
              <div>{crypt.numPoints}</div>
            </div>
            <div className="flex flex-col justify-center w-1/3 p-8 space-y-3 bg-gray-600/70">
              {' '}
              <Button
                onClick={() => {
                  togglePanelType('crypt');
                  gotoAssetId(crypt.id, 'crypt');
                }}
                variant="primary"
                size="sm"
                className="w-full uppercase text-xs"
              >
                fly to
              </Button>
              <Button
                onClick={() => openCryptDetails(crypt.id)}
                variant="default"
                size="sm"
                className="w-full uppercase text-xs"
              >
                details
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
