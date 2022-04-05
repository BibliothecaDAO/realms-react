import { Button } from '@bibliotheca-dao/ui-lib';
import { useGaContext } from '@/context/GaContext';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { GAdventurer } from '@/types/index';

interface LootOverviewsProps {
  bags: GAdventurer[];
}

export function GaOverviews(props: LootOverviewsProps) {
  const { account } = useWalletContext();
  const { toggleMenuType, selectedMenuType, setSelectedId } = useUIContext();
  const {
    state: { favouriteGa },
    actions,
  } = useGaContext();

  const isYourGA = (ga: GAdventurer) =>
    account && account === ga.currentOwner?.address?.toLowerCase();

  const openGaDetails = (id: string) => {
    setSelectedId(id);
    if (selectedMenuType !== 'ga') {
      toggleMenuType('ga');
    }
  };

  const isFavourite = (ga: GAdventurer) => favouriteGa.indexOf(ga.id) > -1;

  return (
    <div>
      {props.bags &&
        props.bags.slice(0, 10).map((ga: GAdventurer, index) => (
          <div
            key={index}
            className="flex w-full h-auto max-w-full mb-4 overflow-x-scroll border border-gray-500 border-double rounded shadow-md justify-evenly"
          >
            <div className="flex w-full p-8 text-gray-800 rounded-l bg-white/70">
              <div className="self-center pl-6">
                <h5 className="text-gray-400">{ga.id}</h5>
                {!isFavourite(ga) && (
                  <button onClick={() => actions.addFavouriteGa(ga.id)}>
                    Add
                  </button>
                )}
                {isFavourite(ga) && (
                  <button onClick={() => actions.removeFavouriteGa(ga.id)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="w-full p-6 bg-black/70">
              {[
                ga.weapon,
                ga.chest,
                ga.head,
                ga.waist,
                ga.foot,
                ga.hand,
                ga.neck,
                ga.ring,
              ]?.map((itemName, index) => {
                return (
                  <div className="flex my-4 font-bold " key={index}>
                    <span className="ml-4">{itemName}</span>
                  </div>
                );
              })}
            </div>
            <div className="w-full p-8 bg-gray-800/70"></div>
            <div className="w-full p-8 bg-gray-700/70"></div>
            <div className="flex flex-col justify-center w-full p-8 space-y-3 bg-gray-600/70">
              {' '}
              <Button variant="default" className="w-full uppercase">
                fly to
              </Button>
              <Button
                onClick={() => openGaDetails(ga.id)}
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
