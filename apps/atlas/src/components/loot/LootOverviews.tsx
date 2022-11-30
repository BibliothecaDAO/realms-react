import { Button, Card } from '@bibliotheca-dao/ui-lib';
import { rarityColor } from 'loot-rarity';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { LootItemIcon } from '@/components/loot/LootItemIcon';
import { useAtlasContext } from '@/context/AtlasContext';
import { useLootContext } from '@/context/LootContext';
import type { Loot } from '@/types/index';
import { LootSideBar } from '../loot/LootSideBar';

interface LootOverviewsProps {
  bags: Loot[];
}

export function LootOverviews(props: LootOverviewsProps) {
  const { address: l1Address } = useL1Account();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const [selectedLootId, setSelectedLootId] = useState('');
  const {
    state: { favouriteLoot },
    actions,
  } = useLootContext();

  const isYourLoot = (loot: Loot) =>
    l1Address && l1Address === loot.currentOwner?.address?.toLowerCase();

  const isFavourite = (loot: Loot) => favouriteLoot.indexOf(loot.id) > -1;

  return (
    <div className="grid gap-6 p-3 sm:p-6 md:grid-cols-2 xl:grid-cols-4">
      {props.bags &&
        props.bags.map((loot: Loot, index) => (
          <Card key={index} className="rounded paper">
            <div className="flex w-full mt-3">
              <div className="flex self-center w-full">
                <h2 className="ml-4 ">Bag #{loot.id}</h2>
              </div>
            </div>
            <div className="w-full p-2 rounded-t font-display">
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
                        'mt-1 flex self-center ml-4 text-md font-display text-[' +
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
                  setSelectedLootId(loot.id);
                }}
                variant="outline"
                size="xs"
              >
                details
              </Button>
              {!isFavourite(loot) && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => actions.addFavouriteLoot(loot.id)}
                >
                  add
                </Button>
              )}
              {isFavourite(loot) && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => actions.removeFavouriteLoot(loot.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </Card>
        ))}
      <LootSideBar
        lootId={selectedLootId}
        isOpen={!!selectedLootId}
        onClose={() => {
          setSelectedLootId('');
        }}
      />
    </div>
  );
}
