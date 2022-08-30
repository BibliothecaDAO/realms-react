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
import { LorePanel } from '@/components/panels/LorePanel';
import { BridgeRealmsSideBar } from '@/components/sidebars/BridgeRealmsSideBar';
import { CryptsSideBar } from '@/components/sidebars/CryptsSideBar';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { LoreProvider } from '@/context/LoreContext';

import crypts from '@/geodata/crypts.json';
import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json';
import realms from '@/geodata/realms.json';
import { useAtlasContext } from '@/hooks/useAtlasContext';

// import order_highlights from '@/geodata/order_highlights.json';
// import type { RealmFeatures } from '@/types/index';

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
  const { selectedMenuType } = useAtlasContext();
  const router = useRouter();
  const { id } = router.query;
  const assetSelected = !!id;
  return (
    <>
      {selectedMenuType === 'realm' && assetSelected && (
        <RealmSideBar realmId={id as string} />
      )}
      {selectedMenuType === 'loot' && assetSelected && (
        <LootSideBar lootId={id as string} />
      )}
      {selectedMenuType === 'ga' && assetSelected && (
        <GASideBar gaId={id as string} />
      )}
      {selectedMenuType === 'crypt' && assetSelected && (
        <CryptsSideBar cryptId={id as string} />
      )}
      {selectedMenuType === 'bridgeRealms' && <BridgeRealmsSideBar />}
      {selectedMenuType === 'settleRealms' && <SettleRealmsSideBar />}
    </>
  );
}

function MapModule() {
  const ItemViewLevel = 5;
  const { openDetails, selectedId, coordinates } = useAtlasContext();
  const [resource] = useState<Array<string>>([]);

  /* const filteredData = () => {
    return realms.features.filter((a: RealmFeatures) =>
      a.properties.resources.some((b: string) => resource.includes(b))
    );
  }; */

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

  const cryptsLayer = new ScatterplotLayer({
    id: 'crypts-layer',
    data: crypts.features,
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
      openDetails('crypt', info.object.id);
    },
  });

  const realmsLayer = new ScatterplotLayer({
    id: 'realms-layer',
    data: (realms as any).features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    visible: viewState.zoom < ItemViewLevel ? false : true,
    getPosition: (d: any) => d.coordinates,
    getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 1),
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('realm', info.object.id);
    },
  });

  const lootBagLayer = new ScatterplotLayer({
    id: 'loot-layer',
    data: loot_bags.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    visible: viewState.zoom < ItemViewLevel ? false : true,
    opacity: 1,
    getPosition: (d: any) => d.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [255, 0, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('loot', info.object.id);
    },
  });

  const gaBagLayer = new ScatterplotLayer({
    id: 'ga-layer',
    data: ga_bags.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    visible: viewState.zoom < ItemViewLevel ? false : true,
    opacity: 1,
    getPosition: (d: any) => d.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 255, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('ga', info.object.id);
    },
  });

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
  }, [coordinates]);
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

function LoreModule() {
  return (
    <LoreProvider>
      <LorePanel />
    </LoreProvider>
  );
}
