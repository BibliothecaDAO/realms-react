import { ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';

import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import {
  TraitTable,
  getTrait,
  isYourRealm,
  RealmStatus,
} from '@/shared/Getters/Realm';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import type { RealmsCardProps } from '@/types/index';
import { RealmImage } from './Image';

const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};

export function RealmOverview(props: RealmsCardProps): ReactElement {
  const router = useRouter();
  const { address: l1Address } = useL1Account();
  const { address } = useAccount();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();

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
      <div className="flex flex-wrap">
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
              }}
              variant="primary"
              size="xs"
              className="w-full"
            >
              {isYourRealm(props.realm, l1Address, address || '')
                ? 'manage'
                : 'details'}
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
