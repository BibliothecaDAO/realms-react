import { ResourceIcon, Button, Menu } from '@bibliotheca-dao/ui-lib';

import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import { findResourceById } from '@/constants/resources';
import { DownloadAssets } from '@/shared/DownloadAssets';
import { TraitTable, getTrait } from '@/shared/Getters/Realm';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import TerrainLayer from '@/shared/Terrain';
import type { RealmsCardProps } from '@/types/index';

const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};
const menuItems = ['3D', 'Render', 'SVG'];

export function RealmOverview(props: RealmsCardProps): ReactElement {
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
            <Menu.Items className="right-0 w-48 border bg-white/0 border-cta-100/60">
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
            src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${props.realm.realmId}.webp`}
            alt="map"
            className="w-full mt-4 rounded-xl -scale-x-100"
            width={500}
            height={320}
            layout={'responsive'}
          />
        )}
      </div>
      <div className="flex flex-wrap mb-2 tracking-widest uppercase">
        {props.realm.resources?.map((re, index) => (
          <div key={index} className="z-10 flex mb-4 mr-4 text-xl">
            <ResourceIcon
              resource={
                findResourceById(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="md"
            />

            <span className="self-center ml-4">
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
      <MarketplaceByPanel
        id={props.realm.realmId.toString()}
        address="0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"
      />
      <DownloadAssets id={props.realm.realmId}></DownloadAssets>
    </>
  );
}
