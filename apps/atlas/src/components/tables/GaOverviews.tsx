import { Button, Card, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { rarityColor } from 'loot-rarity';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { useAtlasContext } from '@/context/AtlasContext';
import { useGaContext } from '@/context/GaContext';
import { LootItemIcon } from '@/shared/LootItemIcon';
import type { GAdventurer } from '@/types/index';
import { GASideBar } from '../sidebars/GASideBar';

interface GaOverviewsProps {
  bags: GAdventurer[];
}

export function GaOverviews(props: GaOverviewsProps) {
  const { address: l1Address } = useL1Account();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const {
    state: { favouriteGa },
    actions,
  } = useGaContext();

  const [selectedGAId, setSelectedGAId] = useState('');

  const isYourGA = (ga: GAdventurer) =>
    l1Address && l1Address === ga.currentOwner?.address?.toLowerCase();

  const isFavourite = (ga: GAdventurer) => favouriteGa.indexOf(ga.id) > -1;

  return (
    <div className="grid gap-6 p-3 sm:p-6 md:grid-cols-2 xl:grid-cols-4">
      {props.bags &&
        props.bags.map((ga: GAdventurer, index) => (
          <Card key={index} className="w-full paper">
            <div className="flex flex-wrap w-full p-3 ">
              <div className="flex self-center w-full">
                <OrderIcon
                  className="self-center mx-3"
                  size={'md'}
                  order={ga.order.toLowerCase()}
                />
                <h3 className="self-center mb-1 ml-4">GA #{ga.id}</h3>
              </div>
              <div className="self-center w-full mt-4 ml-auto tracking-widest uppercase font-display">
                <div className="ml-auto ">Greatness: {ga.bagGreatness}</div>
                <div className="ml-auto">Rating: {ga.bagRating}</div>
              </div>
            </div>
            <div className="w-full p-2 rounded-t font-display">
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
                  <div
                    className="flex px-2 my-1 uppercase border-b border-white/20"
                    key={index}
                  >
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

            <div className="flex justify-center w-full p-2 space-x-2">
              <Button
                onClick={() => {
                  setSelectedGAId(ga.id);
                }}
                variant="outline"
                size="xs"
              >
                details
              </Button>
              {!isFavourite(ga) && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => actions.addFavouriteGa(ga.id)}
                >
                  +
                </Button>
              )}
              {isFavourite(ga) && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => actions.removeFavouriteGa(ga.id)}
                >
                  -
                </Button>
              )}
            </div>
          </Card>
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
