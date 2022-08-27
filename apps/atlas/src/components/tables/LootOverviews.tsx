import { Button, Card } from '@bibliotheca-dao/ui-lib';
import { rarityColor } from 'loot-rarity';
import { useLootContext } from '@/context/LootContext';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { LootItemIcon } from '@/shared/LootItemIcon';
import type { Loot } from '@/types/index';

interface LootOverviewsProps {
  bags: Loot[];
}

export function LootOverviews(props: LootOverviewsProps) {
  const { account } = useWalletContext();
  const { openDetails, gotoAssetId, togglePanelType } = useAtlasContext();
  const {
    state: { favouriteLoot },
    actions,
  } = useLootContext();

  const isYourLoot = (loot: Loot) =>
    account && account === loot.currentOwner?.address?.toLowerCase();

  const isFavourite = (loot: Loot) => favouriteLoot.indexOf(loot.id) > -1;

  return (
    <div className="grid grid-cols-1 gap-2 px-2 rounded sm:grid-cols-2">
      {props.bags &&
        props.bags.map((loot: Loot, index) => (
          <Card key={index} className="w-full rounded">
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
                  <div className="flex px-2 my-1 uppercase" key={index}>
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
            <div className="flex w-full p-3 py-2 ">
              <div className="flex self-center w-full">
                <h3 className="mb-3 ml-4">Bag #{loot.id}</h3>
                <div className="ml-auto"></div>
              </div>
            </div>
            <div className="flex justify-center w-full p-2 space-x-2 rounded-b">
              {' '}
              <Button
                onClick={() => {
                  togglePanelType('loot');
                  gotoAssetId(loot.id, 'loot');
                }}
                variant="primary"
                size="xs"
                className="w-full uppercase"
              >
                fly to
              </Button>
              <Button
                onClick={() => openDetails('loot', loot.id)}
                variant="secondary"
                size="xs"
                className="w-full uppercase"
              >
                details
              </Button>
              {!isFavourite(loot) && (
                <Button
                  className="text-xs"
                  variant="secondary"
                  size="xs"
                  onClick={() => actions.addFavouriteLoot(loot.id)}
                >
                  add
                </Button>
              )}
              {isFavourite(loot) && (
                <Button
                  className="text-xs"
                  variant="secondary"
                  size="xs"
                  onClick={() => actions.removeFavouriteLoot(loot.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </Card>
        ))}
    </div>
  );
}
