import { Button } from '@bibliotheca-dao/ui-lib';
import { useLootContext } from '@/context/LootContext';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Loot } from '@/types/index';

interface LootOverviewsProps {
  bags: Loot[];
}

export function LootOverviews(props: LootOverviewsProps) {
  const { account } = useWalletContext();
  const { toggleMenuType, selectedMenuType, setSelectedId } = useUIContext();
  const {
    state: { favouriteLoot },
    actions,
  } = useLootContext();

  const isYourLoot = (loot: Loot) =>
    account && account === loot.currentOwner?.address?.toLowerCase();

  const openLootDetails = (id: string) => {
    setSelectedId(id);
    if (selectedMenuType !== 'loot') {
      toggleMenuType('loot');
    }
  };

  const isFavourite = (loot: Loot) => favouriteLoot.indexOf(loot.id) > -1;

  return (
    <div>
      {props.bags &&
        props.bags.slice(0, 10).map((loot: Loot, index) => (
          <div
            key={index}
            className="flex w-full h-auto max-w-full mb-4 overflow-x-scroll border border-gray-500 border-double rounded shadow-md justify-evenly"
          >
            <div className="flex w-full p-8 text-gray-800 rounded-l bg-white/70">
              <div className="self-center pl-6">
                <h5 className="text-gray-400">{loot.id}</h5>
                {!isFavourite(loot) && (
                  <button onClick={() => actions.addFavouriteLoot(loot.id)}>
                    Add
                  </button>
                )}
                {isFavourite(loot) && (
                  <button onClick={() => actions.removeFavouriteLoot(loot.id)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="w-full p-6 bg-black/70">
              {[
                loot.weapon,
                loot.chest,
                loot.head,
                loot.waist,
                loot.foot,
                loot.hand,
                loot.neck,
                loot.ring,
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
                onClick={() => openLootDetails(loot.id)}
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
