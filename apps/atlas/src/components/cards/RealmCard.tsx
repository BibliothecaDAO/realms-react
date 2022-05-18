import { OrderIcon, Tabs, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Image from 'next/image';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { RealmBuildings } from '@/components/tables/RealmBuildings';
import { RealmHistory } from '@/components/tables/RealmHistory';
import { RealmResources } from '@/components/tables/RealmResources';
import { RealmTroops } from '@/components/tables/RealmTroops';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useUIContext } from '@/hooks/useUIContext';
import { DownloadAssets } from '@/shared/DownloadAssets';
import { MarketplaceByPanel } from '@/shared/MarketplaceByPanel';
import { findResourceName } from '@/util/resources';
import { Realm } from '../../types';
import type { RealmProps } from '../../types';

type OverviewProps = {
  test: string;
};
const variantMaps: any = {
  small: { heading: 'lg:text-4xl', regions: 'lg:text-xl' },
};

function Overview(props: RealmProps): ReactElement {
  const { gotoAssetId } = useUIContext();

  return (
    <div>
      <div className="p-2">
        <div className="flex justify-between">
          {!props.realm.currentOwner && (
            <div>
              <button
                className={
                  'bg-white/20 rounded px-4 uppercase hover:bg-white/40'
                }
                onClick={() => {
                  gotoAssetId(props.realm.id, 'realm');
                }}
              >
                fly to
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap mb-2 font-semibold tracking-widest uppercase">
        {props.realm.resourceIds.map((re: any, index) => (
          <div key={index} className="flex mb-4 mr-4 text-xl">
            <ResourceIcon
              resource={findResourceName(re)?.trait?.replace(' ', '') || ''}
              size="md"
            />

            <span className="self-center ml-4">
              {findResourceName(re)?.trait}
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
        <div>
          <span>Regions: {props.realm.regions} / 7</span>
          <div className="w-full my-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-amber-700/60 rounded-xl"
              style={{
                width: `${((props.realm.regions as any) / 7) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div>
          <span className="pt-1">Cities: {props.realm.cities} / 21</span>
          <div className="w-full my-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-amber-300/60"
              style={{
                width: `${((props.realm.cities as any) / 21) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div>
          <span className="pt-1">Harbors: {props.realm.harbours} / 35</span>
          <div className="w-full my-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-700/60"
              style={{
                width: `${((props.realm.harbours as any) / 35) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div>
          <span className="pt-1">Rivers: {props.realm.rivers} / 60</span>
          <div className="w-full my-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500/60 "
              style={{
                width: `${((props.realm.rivers as any) / 60) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <MarketplaceByPanel
        id={props.realm.id}
        address="0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"
      />
      <DownloadAssets id={props.realm.id}></DownloadAssets>
    </div>
  );
}

export function RealmCard(props: RealmProps): ReactElement {
  const ensData = useEnsResolver(props.realm.currentOwner.address);

  const tabs = useMemo(
    () => [
      {
        label: 'Overview',
        component: <Overview {...props} />,
      },
      {
        label: 'Resources',
        component: <RealmResources {...props} />,
      },
      // {
      //   label: 'Troops',
      //   component: <RealmTroops />,
      // },
      // {
      //   label: 'Buildings',
      //   component: <RealmBuildings />,
      // },
      // {
      //   label: 'History',
      //   component: <RealmHistory />,
      // },
    ],
    [props.realm?.id]
  );
  return (
    <div className="z-10 w-full h-auto p-1 text-white rounded-xl">
      {props.loading ? (
        <div className="">
          <div className="w-full h-64 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 mb-4 rounded bg-white/40 animate-pulse" />
          <div className="w-full h-32 pt-20 rounded bg-white/40 animate-pulse" />
        </div>
      ) : (
        <div>
          {props.realm?.wonder && (
            <div className="w-full p-4 text-2xl font-semibold text-center text-gray-200 uppercase border-4 border-gray-500 rounded shadow-inner tracking-veryWide bg-white/10">
              {props.realm?.wonder}
            </div>
          )}
          <div className="w-auto">
            <Image
              src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${props.realm.id}.webp`}
              alt="map"
              className="w-full mt-4 rounded-xl -scale-x-100"
              width={500}
              height={320}
              layout={'responsive'}
            />
          </div>
          {/* <p className="text-lg font-semibold text-gray-400">
            {props.realm.id}
          </p> */}
          <div className="flex">
            <OrderIcon size="md" order={props.realm.order.toLowerCase()} />
            <h2
              className={
                `ml-4 self-center` +
                (props.size ? variantMaps[props.size]?.heading : '')
              }
            >
              {props.realm.name}{' '}
            </h2>
            {props.realm.currentOwner && (
              <h3 className="self-center my-2 ml-auto">
                {ensData.displayName}
              </h3>
            )}
          </div>
          <div className="flex flex-col justify-between my-4 rounded sm:flex-row">
            <h4>
              Id: <span className="font-semibold">{props.realm.id}</span>
            </h4>
            <h4>
              Rank:
              <span className="font-semibold">{props.realm.rarityRank}</span>
            </h4>
            <h4>
              Score:
              <span className="font-semibold">{props.realm.rarityScore}</span>
            </h4>
          </div>
          <Tabs variant="primary">
            <Tabs.List className="">
              {tabs.map((tab) => (
                <Tabs.Tab key={tab.label} className="uppercase">
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panels>
              {tabs.map((tab) => (
                <Tabs.Panel key={tab.label}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      )}
    </div>
  );
}
