import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { rarityColor } from 'loot-rarity';
import { useGaContext } from '@/context/GaContext';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { LootItemIcon } from '@/shared/LootItemIcon';
import type { GAdventurer } from '@/types/index';

interface GaOverviewsProps {
  bags: GAdventurer[];
}

export function GaOverviews(props: GaOverviewsProps) {
  const { account } = useWalletContext();
  const {
    toggleMenuType,
    selectedMenuType,
    setSelectedId,
    gotoAssetId,
    togglePanelType,
  } = useUIContext();
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
    <div className="flex flex-wrap">
      {props.bags &&
        props.bags.slice(0, 10).map((ga: GAdventurer, index) => (
          <div
            key={index}
            className="flex flex-wrap sm:w-1/2 h-auto justify-evenly rounded"
          >
            <div className="p-2 w-full rounded">
              <div className="w-full p-2 bg-black/70 font-display">
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
                    <div className="flex my-1 font-bold px-2" key={index}>
                      <LootItemIcon
                        className="self-center"
                        size="sm"
                        item={index.toString()}
                      />{' '}
                      <span
                        className={
                          'mt-1 flex self-center ml-4  font-display text-[' +
                          rarityColor(itemName) +
                          ']'
                        }
                      >
                        {itemName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex w-full p-3 text-white bg-black/60">
                <div className="self-center flex w-full">
                  <OrderIcon
                    className="self-center mx-3"
                    size={'md'}
                    order={ga.order.toLowerCase()}
                  />
                  <h3 className="mb-1 self-center ml-4">GA #{ga.id}</h3>
                  <div className="ml-auto self-center">
                    {!isFavourite(ga) && (
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => actions.addFavouriteGa(ga.id)}
                      >
                        Add
                      </Button>
                    )}
                    {isFavourite(ga) && (
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => actions.removeFavouriteGa(ga.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full p-8 space-y-3 bg-gray-600/70">
                {' '}
                <Button
                  onClick={() => {
                    togglePanelType('ga');
                    gotoAssetId(ga.id, 'ga');
                  }}
                  variant="primary"
                  className="w-full uppercase"
                >
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
          </div>
        ))}
    </div>
  );
}
