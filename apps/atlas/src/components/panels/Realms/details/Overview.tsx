import { ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';

import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React from 'react';
import { useAccount as useL1Account } from 'wagmi';
import {
  systemPlaylists,
  ACCOUNT_PLAYLIST_INDEX,
} from '@/components/sidebars/RealmsPlaylistSideBar';
import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useRealmPlaylist from '@/hooks/settling/useRealmsPlaylist';
import useIsOwner from '@/hooks/useIsOwner';
import {
  TraitTable,
  getTrait,
  isYourRealm,
  RealmStatus,
  getDays,
  getRemainingDays,
  vaultResources,
  daysAccrued,
  maxClaimableResources,
  getHappiness,
} from '@/shared/Getters/Realm';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import type { RealmFoodDetails, RealmsCardProps } from '@/types/index';
import { RealmImage } from './Image';

interface RealmOverview {
  realmFoodDetails: RealmFoodDetails;
  availableFood: number | undefined;
}

export function RealmOverview(
  props: RealmsCardProps & RealmOverview
): ReactElement {
  const router = useRouter();
  const { address: l1Address } = useL1Account();
  const { address } = useAccount();
  const isOwner = useIsOwner(props?.realm?.settledOwner);
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const { setPlaylistState } = useRealmPlaylist({});

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
      <div className="flex justify-between">
        <div>
          <div className="p-2">
            <h5 className="opacity-80 text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Population
            </h5>
            <h3>{props.realmFoodDetails.population} </h3>
          </div>
          <div className="p-2">
            <h5 className="opacity-80 text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Happiness
            </h5>
            <h3>
              {getHappiness({ realm: props.realm, food: props.availableFood })}
            </h3>
          </div>
          <div className="p-2">
            <h5 className="opacity-80 text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Food in Store
            </h5>
            <h3>{props.availableFood?.toLocaleString()} </h3>
          </div>
        </div>
        <div>
          <div className="p-2">
            <h5 className="opacity-80 text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Resources
            </h5>
            <h2>
              {maxClaimableResources(cachedDaysAccrued)}
              <span className="text-green-800 text-xl">
                {daysAccrued(cachedDaysAccrued)}/3{' '}
              </span>
            </h2>
          </div>
          <div className="p-2">
            <h5 className="opacity-80  text-yellow-400 text-shadow-[0_2px_6px_#6366f1] italic">
              Vault
            </h5>
            <h2>{vaultResources(cachedVaultDaysAccrued)} </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-4">
        {props.realm.resources?.map((re, index) => (
          <div key={index} className="flex p-2 flex-col justify-center">
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
      <div className="w-full pt-4 bg-black shadow-inner">
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
          {/* <div className="flex self-center space-x-2">
            <div>
              <Button
                onClick={() => {
                  navigateToAsset(props.realm.realmId, 'realm');
                }}
                variant="outline"
                size="xs"
                className="w-full uppercase"
              >
                fly
              </Button>
            </div>
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
