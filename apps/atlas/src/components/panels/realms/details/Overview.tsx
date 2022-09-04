import { OrderIcon, Tabs, ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import Image from 'next/image';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { RealmResources } from '@/components/tables/RealmResources';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { DownloadAssets } from '@/shared/DownloadAssets';
import {
  TraitTable,
  squadStats,
  RealmVaultStatus,
  RealmStatus,
  hasOwnRelic,
  RealmCombatStatus,
  getTrait,
} from '@/shared/Getters/Realm';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import type { RealmsCardProps } from '@/types/index';
import { findResourceName } from '@/util/resources';

const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};

export function RealmOverview(props: RealmsCardProps): ReactElement {
  return (
    <div>
      <div className="w-auto my-4">
        <Image
          src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${props.realm.realmId}.webp`}
          alt="map"
          className="w-full mt-4 rounded-xl -scale-x-100"
          width={500}
          height={320}
          layout={'responsive'}
        />
      </div>
      <div className="flex flex-wrap mb-2 tracking-widest uppercase">
        {props.realm.resources?.map((re, index) => (
          <div key={index} className="flex mb-4 mr-4 text-xl">
            <ResourceIcon
              resource={
                findResourceName(re.resourceId)?.trait.replace(' ', '') || ''
              }
              size="md"
            />

            <span className="self-center ml-4">
              {findResourceName(re.resourceId)?.trait}
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
    </div>
  );
}
