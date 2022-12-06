import { ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';

import { useAccount } from '@starknet-react/core';

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
  fetchRealmNameById,
  hasOwnRelic,
  getHappinessIcon,
  getPopulation,
  getTroopPopulation,
  getBuildingPopulation,
  getHappinessHasOwnRelic,
  getHappinessHasDefendingArmy,
  getHappinessHasFood,
  getFoodIcon,
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
      {hasOwnRelic(realm) ? (
        <div className="flex px-2 my-4">
          <div className="self-center">
            <img
              src={'/realm-troops/vizir.png'}
              alt="map"
              className="w-56 h-56 mr-10 rounded-full shadow-lg shadow-purple-800"
            />
          </div>

          <div className="self-center w-2/3">
            <p className="text-3xl italic">
              "Citizens of {realm?.name} are living peacefully on its lands. The
              Lord of {realm?.name} is keeping them safe from Goblins and other
              warmongering realms."
            </p>
          </div>
        </div>
      ) : (
        <div className="px-2">
          {realm?.relic?.map((a, i) => {
            return (
              <div key={i} className="mb-1">
                <h3>Annexed by {fetchRealmNameById(a.heldByRealm || 0)}</h3>{' '}
                <p className="text-md">
                  {realm?.name} has been Conquered by{' '}
                  {fetchRealmNameById(a.heldByRealm || 0)}. The citizens shake
                  in fear everyday thinking it will be their last... won't
                  someone think of the children!
                </p>
                <div className="mt-4">
                  <Button
                    href={'/?asset=realm' + a.heldByRealm}
                    variant="outline"
                    size="sm"
                  >
                    Fly To {fetchRealmNameById(a.heldByRealm || 0)}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RealmImage id={realm.realmId} />
      <div className="flex justify-between">
        <div>
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
                {' '}
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
              {availableFood?.toLocaleString()}{' '}
              {getFoodIcon(availableFood || 0)}
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
          </div>
        </div>
        <div>
          <div className="p-2">
            <h5 className="italic text-yellow-400 opacity-80">Resources</h5>
            <h3>{maxClaimableResources(cachedDaysAccrued)}</h3>
            <span className="text-sm text-gray-700">
              {' '}
              {daysAccrued(cachedDaysAccrued)}/3 max days accrued
            </span>
          </div>
          <div className="p-2">
            <h5 className="opacity-80  text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Vault
            </h5>
            <h2>{vaultResources(cachedVaultDaysAccrued)} </h2>
            <span className="text-sm text-gray-700">
              {' '}
              {cachedVaultDaysAccrued}/7 days until claimable
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-4">
        {realm.resources?.map((re, index) => (
          <div key={index} className="flex flex-col justify-center p-2">
            <ResourceIcon
              resource={
                findResourceById(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="sm"
            />

            <span className="self-center mt-2">
              {findResourceById(re.resourceId)?.trait}
            </span>
          </div>
        ))}
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
