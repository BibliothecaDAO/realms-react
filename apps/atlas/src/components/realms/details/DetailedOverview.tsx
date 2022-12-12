import { ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';
import Sword from '@bibliotheca-dao/ui-lib/icons/loot/sword.svg';

import { useAccount } from '@starknet-react/core';

import Image from 'next/image';
import type { ReactElement } from 'react';
import React from 'react';
import { useAccount as useL1Account } from 'wagmi';
import {
  isYourRealm,
  RealmStatus,
  getDays,
  getRemainingDays,
  vaultResources,
  daysAccrued,
  maxClaimableResources,
  getHappiness,
  getRealmNameById,
  hasOwnRelic,
  getHappinessIcon,
  getPopulation,
  getTroopPopulation,
  getBuildingPopulation,
  getHappinessHasOwnRelic,
  getHappinessHasDefendingArmy,
  getHappinessHasFood,
  getFoodIcon,
  resourcePillaged,
} from '@/components/realms/RealmsGetters';
import { findResourceById } from '@/constants/resources';

import useUsersRealms from '@/hooks/settling/useUsersRealms';

import type {
  BuildingFootprint,
  RealmFoodDetails,
  RealmsCardProps,
} from '@/types/index';
import { RealmImage } from './Image';

interface RealmOverview {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
  defendHistory?: any;
}

export function DetailedOverview(
  props: RealmsCardProps & RealmOverview
): ReactElement {
  const { realm, realmFoodDetails, availableFood, buildingUtilisation } = props;

  const { address: l1Address } = useL1Account();
  const { address } = useAccount();

  const { userData, userRealms } = useUsersRealms();

  // days accrued
  const cachedDaysAccrued = getDays(realm?.lastClaimTime);

  // time until next claim
  const cachedDaysRemained = getRemainingDays(realm?.lastClaimTime);

  // vault accrued
  const cachedVaultDaysAccrued = getDays(realm?.lastVaultTime);

  return (
    <>
      <div className="flex">
        {hasOwnRelic(realm) ? (
          <div className="flex px-2 my-4">
            <div className="self-center">
              <img
                src={'/vizirs/mj_military_vizir.png'}
                alt="map"
                className="w-56 h-56 mr-10 rounded-full shadow-lg shadow-purple-800"
              />
            </div>

            <div className="self-center w-2/3">
              <p className="text-3xl italic">
                "Citizens of {realm?.name} are living peacefully on its lands.
                The Lord of {realm?.name} is keeping them safe from Goblins and
                other warmongering realms."
              </p>
            </div>
          </div>
        ) : (
          <div className="px-2">
            {realm?.relic?.map((a, i) => {
              return (
                <div key={i} className="mb-1">
                  <p className="text-3xl italic">
                    {realm?.name} has been Conquered by{' '}
                    {getRealmNameById(a.heldByRealm || 0)}. The citizens shake
                    in fear everyday thinking it will be their last... won't
                    someone think of the children!
                  </p>
                  <div className="mt-4">
                    <Button
                      href={'/?asset=realm' + a.heldByRealm}
                      variant="outline"
                      size="sm"
                    >
                      Fly To {getRealmNameById(a.heldByRealm || 0)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="w-1/3 h-full">
          <RealmImage id={realm.realmId} />
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">Population</h5>
          <h3>{getPopulation(realm)} </h3>
          <span className="text-sm text-gray-700">
            {' '}
            Armies: {getTroopPopulation(realm)} | Buildings:{' '}
            {getBuildingPopulation(realm)}
          </span>
        </div>
        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">Happiness</h5>
          <h3>
            {getHappiness({ realm: realm, food: availableFood })}{' '}
            <span className="ml-2">
              {getHappinessIcon({
                realm: realm,
                food: availableFood,
              })}
            </span>
          </h3>
          <span className="text-sm text-gray-700">
            Relic: -{getHappinessHasOwnRelic({ realm: realm })} | Food: -
            {getHappinessHasFood({ food: props?.availableFood })} | Defending
            Army: -{getHappinessHasDefendingArmy({ realm: realm })}
          </span>
        </div>
        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">Food in Store</h5>
          <h3>
            {availableFood?.toLocaleString()} {getFoodIcon(availableFood || 0)}
          </h3>
          <span className="text-sm text-gray-700">
            Consuming {getPopulation(realm)} food per second
          </span>
        </div>
        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">
            Building Utilisation (sqm)
          </h5>
          <h3>
            {buildingUtilisation?.currentSqm} / {buildingUtilisation?.maxSqm}{' '}
          </h3>
          <span className="text-sm text-gray-700"> Total Space used</span>
        </div>

        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">Resources</h5>
          <h3>{maxClaimableResources(cachedDaysAccrued)}</h3>
          <span className="text-sm text-gray-700">
            {' '}
            {daysAccrued(cachedDaysAccrued)}/3 max days accrued
          </span>
        </div>
        <div className="p-2">
          <h5 className="italic text-yellow-400 opacity-80">Vault</h5>
          <h2>{vaultResources(cachedVaultDaysAccrued)} </h2>
          <span className="text-sm text-gray-700">
            {' '}
            {cachedVaultDaysAccrued}/7 days until claimable
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <h3 className="text-2xl font-bold">Resources</h3>
        <div className="flex flex-wrap mt-4">
          {realm.resources?.map((re, index) => (
            <div key={index} className="flex flex-col justify-center p-2">
              <Image
                src={'/resources/' + re.resourceId + '.jpg'}
                alt="map"
                width={100}
                height={100}
                className="rounded"
              />

              <span className="self-center mt-2">
                {findResourceById(re.resourceId)?.trait}
              </span>
            </div>
          ))}
        </div>
      </div>
      {props.defendHistory?.length && (
        <div className="flex flex-col mt-8">
          <h3 className="flex">
            <Sword className="w-4 h-4 my-auto mr-4" />
            Last Defended Against
          </h3>
          <p>
            <span className="font-lords uppercase">
              {props.defendHistory[0].data.attackRealmName}
            </span>
            <span className="text-gray-700">
              #{props.defendHistory[0].data.attackRealmId}
            </span>
          </p>
          <p>
            <h4>Resources Lost:</h4>
            {resourcePillaged(props.defendHistory[0].data.pillagedResources)}
          </p>
        </div>
      )}
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
      <div className="w-full pt-4 shadow-inner bg-gray-1000">
        <div className="flex w-full mt-auto space-x-2">
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
          )}
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
        </div>
      </div>
      {/* <MarketplaceByPanel
        id={realm.realmId.toString()}
        address={ModuleAddr.StakedRealms}
      /> */}
      {/* <DownloadAssets id={realm.realmId}></DownloadAssets> */}
    </>
  );
}
