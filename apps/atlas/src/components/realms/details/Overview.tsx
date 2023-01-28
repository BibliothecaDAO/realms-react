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
} from '@/components/realms/RealmsGetters';
import { findResourceById } from '@/constants/resources';

import useUsersRealms from '@/hooks/settling/useUsersRealms';

import type { BuildingFootprint, RealmsCardProps } from '@/types/index';

interface RealmOverview {
  availableFood: number | undefined;
  buildingUtilisation: BuildingFootprint | undefined;
}

export function RealmOverview(
  props: RealmsCardProps & RealmOverview
): ReactElement {
  const { address: l1Address } = useL1Account();
  const { address } = useAccount();

  const { userData, userRealms } = useUsersRealms();

  // days accrued
  const cachedDaysAccrued = getDays(props.realm?.lastClaimTime);

  // time until next claim
  const cachedDaysRemained = getRemainingDays(props.realm?.lastClaimTime);

  // vault accrued
  const cachedVaultDaysAccrued = getDays(props.realm?.lastVaultTime);

  return (
    <>
      {/* <div className="flex flex-col justify-between py-2 mt-auto uppercase rounded shadow-inner sm:flex-row font-display">
        <span>
          Rank:
          <span className="">{props.realm.rarityRank}</span>
        </span>
        <span>
          Score:
          <span className="">{props.realm.rarityScore}</span>
        </span>
      </div> */}
      {hasOwnRelic(props.realm) ? (
        <div className="flex px-2 my-4">
          <div className="self-center">
            <img
              src={'/vizirs/mj_military_vizir.png'}
              alt="map"
              className="object-fill w-32 h-32 mr-4 rounded-full shadow-lg shadow-purple-800"
            />
          </div>

          <div className="self-center w-2/3">
            <p className="italic">
              Visir: "Citizens of {props.realm?.name} are living peacefully on
              its lands. The Lord of {props.realm?.name} is keeping them safe
              from Goblins and other warmongering realms."
            </p>
          </div>
        </div>
      ) : (
        <div className="px-2">
          {props.realm?.relic?.map((a, i) => {
            return (
              <div key={i} className="mb-1">
                <h3>Annexed by {getRealmNameById(a.heldByRealm || 0)}</h3>{' '}
                <p className="text-md">
                  {props.realm?.name} has been Conquered by{' '}
                  {getRealmNameById(a.heldByRealm || 0)}. The citizens shake in
                  fear everyday thinking it will be their last... won't someone
                  think of the children!
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
      <div className="flex justify-between">
        <div>
          <div className="p-2">
            <h5 className="italic text-yellow-400 opacity-80">Population</h5>
            <h3>{getPopulation(props.realm)} </h3>
            <span className="text-sm text-gray-700">
              {' '}
              Armies: {getTroopPopulation(props.realm)} | Buildings:{' '}
              {getBuildingPopulation(props.realm)}
            </span>
          </div>
          <div className="p-2">
            <h5 className="italic text-yellow-400 opacity-80">Happiness</h5>
            <h3>
              {getHappiness({ realm: props.realm, food: props.availableFood })}{' '}
              <span className="ml-2">
                {' '}
                {getHappinessIcon({
                  realm: props.realm,
                  food: props.availableFood,
                })}
              </span>
            </h3>
            <span className="text-sm text-gray-700">
              Relic: -{getHappinessHasOwnRelic({ realm: props.realm })} | Food:
              -{getHappinessHasFood({ food: props?.availableFood })} | Defending
              Army: -{getHappinessHasDefendingArmy({ realm: props.realm })}
            </span>
          </div>
          <div className="p-2">
            <h5 className="italic text-yellow-400 opacity-80">Food in Store</h5>
            <h3>
              {props.availableFood?.toLocaleString()}{' '}
              {getFoodIcon(props.availableFood || 0)}
            </h3>
            <span className="text-sm text-gray-700">
              Consuming {getPopulation(props.realm)} food per second
            </span>
          </div>
          <div className="p-2">
            <h5 className="italic text-yellow-400 opacity-80">
              Building Utilisation (sqm)
            </h5>
            <h3>
              {props.buildingUtilisation?.currentSqm} /{' '}
              {props.buildingUtilisation?.maxSqm}{' '}
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
        {props.realm.resources?.map((re, index) => (
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
          (props.size ? variantMaps[props.size]?.regions : '')
        }
      >
        <TraitTable
          trait="Region"
          traitAmount={getTrait(props.realm, 'Region')}
        />
        <TraitTable trait="City" traitAmount={getTrait(props.realm, 'City')} />
        <TraitTable
          trait="Harbor"
          traitAmount={getTrait(props.realm, 'Harbor')}
        />
        <TraitTable
          trait="River"
          traitAmount={getTrait(props.realm, 'River')}
        />
      </div> */}
      <div className="w-full pt-4 shadow-inner bg-gray-1000">
        <div className="flex w-full mt-auto space-x-2">
          {' '}
          {isYourRealm(props.realm, l1Address, address || '') && (
            <div>
              {RealmStatus(props.realm) === 'Layer 1' && (
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
              {RealmStatus(props.realm) === 'Unsettled L2' && (
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
                  `/realm/${props.realm.realmId}?tab=Overview`,
                  undefined,
                  { shallow: true }
                );
                if (isOwner) {
                  setPlaylistState(
                    systemPlaylists[ACCOUNT_PLAYLIST_INDEX],
                    true,
                    props.realm.realmId
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
        id={props.realm.realmId.toString()}
        address={ModuleAddr.StakedRealms}
      /> */}
      {/* <DownloadAssets id={props.realm.realmId}></DownloadAssets> */}
    </>
  );
}
