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
  getHolderOfRelic,
} from '@/components/realms/RealmsGetters';
import {
  buildingImageById,
  RealmBuildingId,
  STORE_HOUSE_SIZE,
} from '@/constants/globals';
import type {
  BuildingFootprint,
  RealmFoodDetails,
  RealmsCardProps,
} from '@/types/index';
import { RealmsFood } from './Food';

interface RealmOverview {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
  defendHistory?: any;
}

export function DetailedOverview(
  props: RealmsCardProps & RealmOverview
): ReactElement {
  const { realm, availableFood, buildingUtilisation, realmFoodDetails } = props;

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
      img: buildingImageById(RealmBuildingId.Castle),
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
      img: buildingImageById(RealmBuildingId.Castle),
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
      img: buildingImageById(RealmBuildingId.Barracks),
    },
    // {
    //   title: 'Food in Store',
    //   value: (
    //     <span>
    //       {availableFood?.toLocaleString()} {getFoodIcon(availableFood || 0)}
    //     </span>
    //   ),
    //   subTitle: <span>Consuming {getPopulation(realm)} food per second</span>,
    //   icon: '/icons/loot/loot.svg',
    //   img: buildingImageById(RealmBuildingId.StoreHouse),
    // },
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
        <div className="flex w-full px-2 my-4">
          <div className="self-center">
            <img
              src={'/vizirs/mj_military_vizir.png'}
              alt="map"
              className="object-cover w-48 h-48 mr-10 border rounded shadow-inner border-yellow-800/40"
            />
          </div>

          <div className="self-center w-2/3 text-2xl">
            {getIsRealmAnnexed(realm) ? (
              <div>
                "Citizens of {realm?.name} are living peacefully on its lands.
                The Lord of {realm?.name} is keeping them safe from Goblins and
                other warmongering realms."
              </div>
            ) : (
              <div>
                {realm?.name} has been Conquered by{' '}
                {getRealmNameById(getHolderOfRelic(realm) || 0)}! The citizens
                shake in fear everyday thinking it will be their last... won't
                someone think of the children!
                <div className="mt-4">
                  <Button
                    href={'/?asset=realm' + getHolderOfRelic(realm)}
                    variant="outline"
                    size="sm"
                  >
                    Get Relic Back{' '}
                    {getRealmNameById(getHolderOfRelic(realm) || 0)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

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
      <div className="flex w-full">
        <div className="w-1/2">
          <RealmsFood
            realmFoodDetails={realmFoodDetails}
            availableFood={availableFood}
            realm={realm}
            loading={false}
          />
        </div>

        <div className="w-1/2">
          {dataCards.map((card, i) => {
            return (
              <div key={i} className="flex w-full">
                <div className="flex flex-grow mx-2 mb-2 border rounded-xl border-yellow-800/40">
                  <img
                    className="object-cover w-24 rounded-xl"
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
