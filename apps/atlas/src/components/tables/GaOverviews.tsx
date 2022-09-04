import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { rarityColor } from 'loot-rarity';
import { useState } from 'react';
import { useAtlasContext } from '@/context/AtlasContext';
import { useGaContext } from '@/context/GaContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { LootItemIcon } from '@/shared/LootItemIcon';
import type { GAdventurer } from '@/types/index';
import { GASideBar } from '../sidebars/GASideBar';

interface GaOverviewsProps {
  bags: GAdventurer[];
}

export function GaOverviews(props: GaOverviewsProps) {
  const { account } = useWalletContext();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const {
    state: { favouriteGa },
    actions,
  } = useGaContext();

  const [selectedGAId, setSelectedGAId] = useState('');

  const isYourGA = (ga: GAdventurer) =>
    account && account === ga.currentOwner?.address?.toLowerCase();

  const isFavourite = (ga: GAdventurer) => favouriteGa.indexOf(ga.id) > -1;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {props.bags &&
        props.bags.map((ga: GAdventurer, index) => (
          <div key={index} className="w-full rounded-b">
            <div className="w-full p-2 rounded-t bg-black/70 font-display">
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
                  <div className="flex px-2 my-1 font-bold" key={index}>
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
            <div className="flex flex-wrap w-full p-3 bg-black/60">
              <div className="flex self-center w-full">
                <OrderIcon
                  className="self-center mx-3"
                  size={'md'}
                  order={ga.order.toLowerCase()}
                />
                <h3 className="self-center mb-1 ml-4">GA #{ga.id}</h3>
                <div className="self-center ml-auto tracking-widest uppercase">
                  <div className="ml-auto ">Greatness: {ga.bagGreatness}</div>
                  <div className="ml-auto">Rating: {ga.bagRating}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full p-2 space-x-2 rounded-b bg-gray-600/70">
              {' '}
              <Button
                onClick={() => {
                  navigateToAsset(+ga.id, 'ga');
                }}
                variant="primary"
                className="w-full text-xs"
              >
                fly to
              </Button>
              <Button
                onClick={() => {
                  setSelectedGAId(ga.id);
                }}
                variant="secondary"
                className="w-full text-xs"
              >
                details
              </Button>
              {!isFavourite(ga) && (
                <Button
                  size="sm"
                  className="text-xs"
                  variant="secondary"
                  onClick={() => actions.addFavouriteGa(ga.id)}
                >
                  Add
                </Button>
              )}
              {isFavourite(ga) && (
                <Button
                  size="sm"
                  className="text-xs"
                  variant="secondary"
                  onClick={() => actions.removeFavouriteGa(ga.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

      <GASideBar
        gaId={selectedGAId}
        isOpen={!!selectedGAId}
        onClose={() => {
          setSelectedGAId('');
        }}
      />
    </div>
  );
}
