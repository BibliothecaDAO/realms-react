import { ResourceIcon, Button, Menu } from '@bibliotheca-dao/ui-lib';

import { Transition } from '@headlessui/react';
import { useStarknet } from '@starknet-react/core';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { DownloadAssets } from '@/shared/DownloadAssets';
import {
  TraitTable,
  getTrait,
  isYourRealm,
  RealmStatus,
} from '@/shared/Getters/Realm';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import TerrainLayer from '@/shared/Terrain';
import type { RealmsCardProps } from '@/types/index';

const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};
const menuItems = ['3D', 'Render', 'SVG'];

export function RealmOverview(props: RealmsCardProps): ReactElement {
  const router = useRouter();
  const { account } = useWalletContext();
  const { account: starkAccount } = useStarknet();
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const [imageView, setImageView] = useState(menuItems[1]);
  return (
    <>
      <div className="relative w-auto h-96">
        <Menu className="!absolute z-10 !w-auto right-1 top-1">
          <Menu.Button
            variant="outline"
            className={clsx(imageView === '3D' && 'text-red-600/60')}
            size="xs"
          >
            View
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="right-0 w-48 bg-white border border-cta-100/60">
              <Menu.Group className="flex">
                {menuItems.map((menuItem) => {
                  return (
                    <Menu.Item key={menuItem}>
                      {({ active }) => (
                        <Button
                          variant="unstyled"
                          size="xs"
                          className={clsx(
                            'block flex-1',
                            active ? 'text-red-900' : 'text-gray-500',
                            imageView === menuItem && 'text-red-500/60'
                          )}
                          fullWidth
                          onClick={() => setImageView(menuItem)}
                        >
                          {menuItem}
                        </Button>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Group>
            </Menu.Items>
          </Transition>
        </Menu>
        {imageView === '3D' && <TerrainLayer />}

        {imageView === 'Render' && (
          <Image
            src={`https://realms-assets.s3.eu-west-3.amazonaws.com/renders/${props.realm.realmId}.webp`}
            alt="map"
            className="w-full mt-4 rounded-xl -scale-x-100"
            width={500}
            height={320}
            layout={'responsive'}
          />
        )}
      </div>
      <div className="flex flex-col justify-between py-2 uppercase rounded shadow-inner sm:flex-row font-display">
        <span>
          Rank:
          <span className="">{props.realm.rarityRank}</span>
        </span>
        <span>
          Score:
          <span className="">{props.realm.rarityScore}</span>
        </span>
      </div>
      <div className="flex flex-wrap py-2 mb-2 border-t border-b font-display border-white/30">
        {props.realm.resources?.map((re, index) => (
          <div
            key={index}
            className="z-10 flex px-2 mb-1 mr-4 text-lg uppercase rounded bg-gray-1000"
          >
            <ResourceIcon
              resource={
                findResourceById(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="xs"
            />

            <span className="self-center ml-2">
              {findResourceById(re.resourceId)?.trait}
            </span>
          </div>
        ))}
      </div>

      <div
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
      </div>
      <div className="w-full pt-4 mt-auto bg-black shadow-inner">
        <div className="flex w-full mt-auto space-x-2">
          {' '}
          {isYourRealm(props.realm, account, starkAccount || '') && (
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
          <div className="w-full">
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
              {isYourRealm(props.realm, account, starkAccount || '')
                ? 'manage'
                : 'details'}
            </Button>
          </div>
          <div className="flex self-center space-x-2">
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
          </div>
        </div>
      </div>
      {/* <MarketplaceByPanel
        id={props.realm.realmId.toString()}
        address="0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"
      />
      <DownloadAssets id={props.realm.realmId}></DownloadAssets> */}
    </>
  );
}
