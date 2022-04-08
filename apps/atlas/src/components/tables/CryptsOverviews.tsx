import { Button } from '@bibliotheca-dao/ui-lib';
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
        props.dungeons.map((crypt: Crypt, index) => (
          <div
            key={index}
            className="flex w-full h-auto max-w-full mb-4 overflow-x-scroll border border-gray-500 border-double rounded shadow-md justify-evenly"
          >
            <div className="flex w-full p-8 text-gray-800 rounded-l bg-white/70">
              <div className="self-center pl-6">
                <h5 className="text-gray-400">{crypt.id}</h5>
                <h2 className="mb-3">{crypt.name}</h2>
                {!isFavourite(crypt) && (
                  <button onClick={() => actions.addFavouriteCrypt(crypt.id)}>
                    Add
                  </button>
                )}
                {isFavourite(crypt) && (
                  <button
                    onClick={() => actions.removeFavouriteCrypt(crypt.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid items-center justify-between w-full grid-cols-2 p-6 bg-black/70">
              <div className="font-bold">Environment</div>
              <div>{environments[crypt.environment]?.name}</div>
              <div className="font-bold ">Size</div>
              <div>{crypt.size}</div>
              <div className="font-bold">Num Doors</div>
              <div>{crypt.numDoors}</div>
              <div className="font-bold">Num Points</div>
              <div>{crypt.numPoints}</div>
            </div>
            <div className="flex flex-col justify-center w-full p-8 space-y-3 bg-gray-600/70">
              {' '}
              <Button
                onClick={() => {
                  togglePanelType('crypt');
                  gotoAssetId(crypt.id, 'crypt');
                }}
                variant="default"
                className="w-full uppercase"
              >
                fly to
              </Button>
              <Button
                onClick={() => openCryptDetails(crypt.id)}
                variant="default"
                className="w-full uppercase"
              >
                details
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
