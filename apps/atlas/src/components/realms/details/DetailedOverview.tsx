import { Button } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import React from 'react';
import {
  getHappiness,
  getRealmNameById,
  getHappinessIcon,
  getPopulation,
  getTroopPopulation,
  getBuildingPopulation,
  getHappinessHasOwnRelic,
  getHappinessHasDefendingArmy,
  getHappinessHasFood,
  getFoodIcon,
  getNumberOfTicks,
  getTimeSinceLastTick,
  getIsRealmAnnexed,
} from '@/components/realms/RealmsGetters';
import { STORE_HOUSE_SIZE } from '@/constants/globals';

import type {
  BuildingFootprint,
  RealmFoodDetails,
  RealmsCardProps,
} from '@/types/index';
import { RealmImage } from './Image';
import { LaborTable } from './LaborTable';

interface RealmOverview {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
  defendHistory?: any;
}

export function DetailedOverview(
  props: RealmsCardProps & RealmOverview
): ReactElement {
  const { realm, availableFood, buildingUtilisation } = props;

  const usedStorehouseSpace = availableFood
    ? availableFood / STORE_HOUSE_SIZE
    : 0;

  const trueUsedSpace = buildingUtilisation?.currentSqm
    ? buildingUtilisation?.currentSqm + usedStorehouseSpace
    : usedStorehouseSpace;

  const dataCards = [
    {
      title: 'Since Last update',
      value: <span> {getTimeSinceLastTick(realm)} hrs</span>,
      subTitle: (
        <span>
          ({getNumberOfTicks(realm)} cycles ticked) | Every 12hrs your Realm
          undergoes a cycle.
          {/* If you do not manage your Realm correctly (keep
          happiness), your Armies will desert. */}
        </span>
      ),
      icon: '/icons/loot/loot.svg',
      img: '/realm-buildings/mj_castle.png',
    },
    {
      title: 'Population',
      value: getPopulation(realm),
      subTitle: (
        <span>
          {' '}
          Armies: {getTroopPopulation(realm)} | Buildings:{' '}
          {getBuildingPopulation(realm)}
        </span>
      ),
      icon: '/icons/loot/loot.svg',
      img: '/realm-buildings/mj_fishing_village.png',
    },
    {
      title: 'Happiness',
      value: (
        <span>
          {getHappiness({ realm: realm, food: availableFood })}{' '}
          <span className="ml-2">
            {getHappinessIcon({
              realm: realm,
              food: availableFood,
            })}
          </span>
        </span>
      ),
      subTitle: (
        <span>
          Relic: -{getHappinessHasOwnRelic({ realm: realm })} | Food: -
          {getHappinessHasFood({ food: props?.availableFood })} | Defending
          Army: -{getHappinessHasDefendingArmy({ realm: realm })}
        </span>
      ),
      icon: '/icons/loot/loot.svg',
      img: '/realm-buildings/mj_barracks.png',
    },
    {
      title: 'Food in Store',
      value: (
        <span>
          {availableFood?.toLocaleString()} {getFoodIcon(availableFood || 0)}
        </span>
      ),
      subTitle: <span>Consuming {getPopulation(realm)} food per second</span>,
      icon: '/icons/loot/loot.svg',
      img: '/realm-buildings/mj_storehouse.png',
    },
    {
      title: 'Utilisation',
      value: (
        <span>
          {trueUsedSpace.toFixed(0)} / {buildingUtilisation?.maxSqm}{' '}
        </span>
      ),
      subTitle: <span>Total Space used</span>,
      icon: '/icons/loot/loot.svg',
      img: '/vizirs/mj_builder.png',
    },
  ];

  return (
    <>
      <div className="flex">
        {getIsRealmAnnexed(realm) ? (
          <div className="flex w-full px-2 my-4">
            <div className="self-center">
              <img
                src={'/vizirs/mj_military_vizir.png'}
                alt="map"
                className="w-32 h-32 mr-10 border rounded-full shadow-inner border-yellow-800/40"
              />
            </div>

            <div className="self-center w-2/3">
              <p className="text-2xl">
                "Citizens of {realm?.name} are living peacefully on its lands.
                The Lord of {realm?.name} is keeping them safe from Goblins and
                other warmongering realms."
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full px-2">
            {realm?.relic?.map((a, i) => {
              return (
                <div key={i} className="p-8 mb-1">
                  <p className="text-2xl">
                    {realm?.name} has been Conquered by{' '}
                    {getRealmNameById(a.heldByRealm || 0)}! The citizens shake
                    in fear everyday thinking it will be their last... won't
                    someone think of the children!
                  </p>
                  <p>This is effecting the Happiness on your Realm.</p>
                  <div className="mt-4">
                    <Button
                      href={'/?asset=realm' + a.heldByRealm}
                      variant="outline"
                      size="sm"
                    >
                      Get Relic Back {getRealmNameById(a.heldByRealm || 0)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* <div className="w-1/2">
          <RealmImage id={realm.realmId} />
        </div> */}
      </div>
      {/* <div className="flex flex-col">
        <div className="flex flex-wrap mt-4">
          {realm.resources?.map((re, index) => (
            <div key={index} className="flex flex-col justify-center p-2">
              <Image
                src={'/resources/' + re.resourceId + '.jpg'}
                alt="map"
                width={150}
                height={150}
                className="border-4 rounded-full rounded-2xl border-yellow-800/40"
              />

              <span className="self-center mt-2 text-3xl">
                {findResourceById(re.resourceId)?.trait}
              </span>
            </div>
          ))}
        </div>
      </div> */}
      <div className="flex flex-wrap w-full">
        {dataCards.map((card, i) => {
          return (
            <div key={i} className="flex w-1/3 h-full">
              <div className="flex flex-grow m-2 border rounded-2xl border-yellow-800/40">
                <img
                  className="object-cover w-24 rounded-l-2xl"
                  src={card.img}
                  alt=""
                />
                <div className="p-6">
                  <h5 className="text-gray-600">{card.title}</h5>
                  <div className="my-3 text-3xl">{card.value} </div>
                  <p className="text-xs text-gray-700">{card.subTitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div
        className={
          `grid grid-cols-2 gap-4  w-full uppercase font-display ` +
          (size ? variantMaps[size]?.regions : '')
        }
      >
        <TraitTable
          trait="Region"
          traitAmount={getTrait(realm, 'Region')}
        />
        <TraitTable trait="City" traitAmount={getTrait(realm, 'City')} />
        <TraitTable
          trait="Harbor"
          traitAmount={getTrait(realm, 'Harbor')}
        />
        <TraitTable
          trait="River"
          traitAmount={getTrait(realm, 'River')}
        />
      </div> */}
      {/* <div className="w-full pt-4 shadow-inner bg-gray-1000"> */}
      {/* <div className="flex w-full mt-auto space-x-2">
          {' '}
          {isYourRealm(realm, l1Address, address || '') && (
            <div>
              {RealmStatus(realm) === 'Layer 1' && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="w-full uppercase"
                  onClick={() => {
                    // TODO: Re-enable
                    // toggleMenuType('bridgeRealms');
                  }}
                >
                  Bridge Realm
                </Button>
              )}
              {RealmStatus(realm) === 'Unsettled L2' && (
                <Button
                  size="xs"
                  variant="secondary"
                  className="w-full uppercase"
                  onClick={() => {
                    // TODO: Re-enable
                    // toggleMenuType('settleRealms');
                  }}
                >
                  Settle Realm
                </Button>
              )}
            </div>
          )} */}
      {/* <div className="w-full">
            <Button
              onClick={() => {
                router.push(
                  `/realm/${realm.realmId}?tab=Overview`,
                  undefined,
                  { shallow: true }
                );
                if (isOwner) {
                  setPlaylistState(
                    systemPlaylists[ACCOUNT_PLAYLIST_INDEX],
                    true,
                    realm.realmId
                  );
                }
              }}
              variant="primary"
              size="xs"
              className="w-full"
            >
              {isOwner ? 'manage' : 'details'}
            </Button>
          </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* <MarketplaceByPanel
        id={realm.realmId.toString()}
        address={ModuleAddr.StakedRealms}
      /> */}
      {/* <DownloadAssets id={realm.realmId}></DownloadAssets> */}
    </>
  );
}
