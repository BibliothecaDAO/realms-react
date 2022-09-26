/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScatterplotLayer, ArcLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { UserAgent } from '@quentin-sommer/react-useragent';
import type { UserAgentProps } from '@quentin-sommer/react-useragent/dist/UserAgent';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import Layout from '@/components/Layout';
import { CryptSideBar } from '@/components/sidebars/CryptsSideBar';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';

import { useAtlasContext } from '@/context/AtlasContext';
import { RealmProvider } from '@/context/RealmContext';
import crypts from '@/geodata/crypts.json';
import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json';
import realms from '@/geodata/realms.json';
import type { AssetType } from '@/hooks/useAtlasMap';

export default function AtlasPage() {
  return (
    <Layout>
      <RealmProvider>
        <MapModule />
        <AtlasSidebars />
      </RealmProvider>
    </Layout>
  );
}

function AtlasSidebars() {
  const { mapContext } = useAtlasContext();
  const router = useRouter();

  const selectedAsset = mapContext.selectedAsset;

  function onClose() {
    router.push('/', undefined, { shallow: true });
  }
  return (
    <>
      <RealmSideBar
        realmId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'realm'}
        onClose={onClose}
      />
      <LootSideBar
        lootId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'loot'}
        onClose={onClose}
      />
      <CryptSideBar
        cryptId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'crypt'}
        onClose={onClose}
      />
      <GASideBar
        gaId={selectedAsset?.id as string}
        isOpen={selectedAsset?.type === 'ga'}
        onClose={onClose}
      />
    </>
  );
}

function MapModule() {
  const { travelContext, mapContext } = useAtlasContext();
  const ItemViewLevel = 5;
  const selectedId = mapContext.selectedAsset?.id ?? '0';

  const createScatterPlot = useCallback(
    (assetType: AssetType, data: any[]) =>
      new ScatterplotLayer({
        id: `${assetType}-layer`,
        data,
        stroked: true,
        filled: true,
        extruded: true,
        pickable: true,
        opacity: 1,
        visible: mapContext.viewState.zoom < ItemViewLevel ? false : true,
        getPosition: (d: any) => d.coordinates,
        getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 100),
        getElevation: 10000,
        lineWidthMinPixels: 1,
        getFillColor: [0, 0, 0, 0],
        updateTriggers: {
          getRadius: parseInt(selectedId),
          getVisible: mapContext.viewState,
        },
        onClick: (info: any) => {
          mapContext.navigateToAsset(info.object.id, assetType);
        },
      }),
    [mapContext.viewState]
  );

  const arcsLayer = useMemo(() => {
    return new ArcLayer({
      id: 'arc',
      data: travelContext.travelArcs,
      getSourcePosition: (d: any) => d.source,
      getTargetPosition: (d: any) => d.target,
      getSourceColor: [255, 255, 204],
      getTargetColor: [255, 255, 204],
      getWidth: 2,
    });
  }, [travelContext.travelArcs]);

  const layers = useMemo(() => {
    return [
      createScatterPlot('crypt', crypts.features),
      createScatterPlot('realm', (realms as any).features),
      createScatterPlot('loot', loot_bags.features),
      createScatterPlot('ga', ga_bags.features),
      arcsLayer,
    ];
  }, [arcsLayer, mapContext.viewState]);

  return (
    <DeckGL
      getCursor={({ isHovering }) => {
        return isHovering ? 'pointer' : 'grabbing';
      }}
      pickingRadius={25}
      viewState={mapContext.viewState}
      controller={true}
      onViewStateChange={(e) => mapContext.setViewState(e.viewState)}
      layers={layers}
    >
      {!mapContext.isMapLoaded ? (
        <div className="fixed z-50 flex justify-center w-screen h-screen bg-gray-1100">
          {' '}
          <h1 className="self-center">loading Atlas...</h1>{' '}
        </div>
      ) : (
        ''
      )}
      <Map
        // projection={'globe'}
        attributionControl={false}
        onLoad={() => mapContext.setIsMapLoaded(true)}
        mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      />
    </DeckGL>
  );
}
