/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlyToInterpolator } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { UserAgent } from '@quentin-sommer/react-useragent';
import type { UserAgentProps } from '@quentin-sommer/react-useragent/dist/UserAgent';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import Layout from '@/components/Layout';
import { CryptSideBar } from '@/components/sidebars/CryptsSideBar';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';

import crypts from '@/geodata/crypts.json';
import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json';
import realms from '@/geodata/realms.json';
import type { AssetType } from '@/hooks/useAtlas';
import { useAtlas } from '@/hooks/useAtlas';

export default function AtlasPage() {
  return (
    <Layout>
      <UserAgent>
        {(ua: UserAgentProps) => (
          <>
            {!ua.mobile ? (
              <MapModule />
            ) : (
              <div className="object-cover object-right w-full h-full bg-center bg-fill bg-warRoom" />
            )}
            <AtlasSidebars />
          </>
        )}
      </UserAgent>
    </Layout>
  );
}

function AtlasSidebars() {
  const { selectedAsset } = useAtlas();
  const router = useRouter();
  return (
    <>
      <RealmSideBar
        realmId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'realm'}
        onClose={() => {
          router.push('/');
        }}
      />
      <LootSideBar
        lootId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'loot'}
        onClose={() => {
          router.push('/');
        }}
      />
      <CryptSideBar
        cryptId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'crypt'}
        onClose={() => {
          router.push('/');
        }}
      />
      <GASideBar
        gaId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'ga'}
        onClose={() => {
          router.push('/');
        }}
      />
    </>
  );
}

function MapModule() {
  const ItemViewLevel = 5;
  const { navigateToAsset, coordinates, selectedAsset } = useAtlas();

  const selectedId = selectedAsset?.id ?? '0';

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 4,
    pitch: 55,
    bearing: 0,
    bounds: [
      [-180, -60], // Southwest coordinates
      [180, 60], // Northeast coordinates
    ],
    transitionDuration: 0,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const createScatterPlot = (assetType: AssetType, data: any[]) =>
    new ScatterplotLayer({
      id: `${assetType}-layer`,
      data,
      stroked: true,
      filled: true,
      extruded: true,
      pickable: true,
      opacity: 1,
      visible: viewState.zoom < ItemViewLevel ? false : true,
      getPosition: (d: any) => d.coordinates,
      getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 100),
      getElevation: 10000,
      lineWidthMinPixels: 1,
      getFillColor: [0, 0, 0, 0],
      updateTriggers: {
        getRadius: parseInt(selectedId),
        getVisible: viewState,
      },
      onClick: (info: any) => {
        navigateToAsset(info.object.id, assetType);
      },
    });

  const cryptsLayer = createScatterPlot('crypt', crypts.features);
  const realmsLayer = createScatterPlot('realm', (realms as any).features);
  const lootBagLayer = createScatterPlot('loot', loot_bags.features);
  const gaBagLayer = createScatterPlot('ga', ga_bags.features);

  /* const iconMapping = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };

   const resourceLayer = new IconLayer({
    id: 'icon-layer',
    data: filteredData(),
    pickable: false,
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping: iconMapping,
    getIcon: () => 'marker',
    sizeScale: 5,
    getPosition: (d: any) => d.coordinates,
    getSize: () => 5,
    getColor: () => [255, 255, 255],
  }); */

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    setViewState({
      ...coordinates,
      zoom: 8,
      pitch: 20,
      bearing: 0,
      bounds: [
        [-180, -60], // Southwest coordinates
        [180, 60], // Northeast coordinates
      ],
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, [coordinates?.latitude, coordinates?.latitude]);
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <DeckGL
      getCursor={({ isHovering }) => {
        return isHovering ? 'pointer' : 'grabbing';
      }}
      pickingRadius={25}
      viewState={viewState}
      controller={true}
      // onLoad={() => setLoaded(true)}
      onViewStateChange={(e) => setViewState(e.viewState)}
      layers={[realmsLayer, cryptsLayer, lootBagLayer, gaBagLayer]}
    >
      {!loaded ? (
        <div className="fixed z-50 flex justify-center w-screen h-screen bg-gray-1000">
          {' '}
          <h1 className="self-center">loading Atlas...</h1>{' '}
        </div>
      ) : (
        ''
      )}
      <Map
        attributionControl={false}
        onLoad={() => setLoaded(true)}
        mapStyle="mapbox://styles/ponderingdemocritus/ckzjumbjo000914ogvsqzcjd2/draft"
        mapboxAccessToken={
          'pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A'
        }
      >
        <FullscreenControl position="bottom-right" />
      </Map>
    </DeckGL>
  );
}
