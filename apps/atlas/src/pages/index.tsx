/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlyToInterpolator } from '@deck.gl/core';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { Map } from 'react-map-gl';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { FlyTo } from '@/components/map/FlyTo';
import { Header } from '@/components/navigation/header';
import { MenuSideBar } from '@/components/sidebars/MenuSideBar';
import crypts from '@/geodata/crypts_all.json';
import ga_bags from '@/geodata/ga_bags.json';
import loot_bags from '@/geodata/loot_bags.json';
import realms from '@/geodata/realms.json';
import type { PanelType } from '@/hooks/useAtlasContext';
import { useAtlasContext, AtlasProvider } from '@/hooks/useAtlasContext';

// import order_highlights from '@/geodata/order_highlights.json';
import type { RealmFeatures } from '@/types/index';

export default function Base({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <AtlasProvider>
      <Layout>
        <div className="relative flex h-full overflow-hidden sm:h-screen">
          <MenuSideBar />
          <div className="relative flex flex-col w-full">
            <Header />

            <AtlasMain>{children}</AtlasMain>
          </div>
        </div>
      </Layout>
    </AtlasProvider>
  );
}

function AtlasMain({ children }: { children: ReactElement | ReactElement[] }) {
  const { togglePanelType, selectedPanel } = useAtlasContext();
  const { pathname } = useRouter();
  useEffect(() => {
    const panel = pathname.split('/')[1];
    if (panel && selectedPanel !== panel) togglePanelType(panel as PanelType);
    else if (!panel && !selectedPanel) togglePanelType(selectedPanel);
  }, [pathname]);
  return (
    <div className="relative w-full h-full">
      {children}
      <ArtBackground />
      <FlyTo />
      <MapModule />
    </div>
  );
}

function MapModule() {
  const ItemViewLevel = 5;
  const { openDetails, selectedId, coordinates } = useAtlasContext();
  const [resource] = useState<Array<string>>([]);

  const filteredData = () => {
    return realms.features.filter((a: RealmFeatures) =>
      a.properties.resources.some((b: string) => resource.includes(b))
    );
  };

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
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) =>
      d.properties.tokenId === parseInt(selectedId) ? 4000 : 100,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('crypt', info.object.properties.tokenId);
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
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) =>
      d.properties.realm_idx === parseInt(selectedId) ? 4000 : 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('realm', info.object.properties.realm_idx);
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
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [255, 0, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('loot', info.object.properties.bag_id);
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
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 255, 0, 0],
    updateTriggers: {
      getRadius: parseInt(selectedId),
      getVisible: viewState,
    },
    onClick: (info: any) => {
      openDetails('ga', info.object.properties.ga_id);
    },
  });

  const iconMapping = {
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
    getPosition: (d: any) => d.geometry.coordinates,
    getSize: () => 5,
    getColor: () => [255, 255, 255],
  });

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
  const [loaded, setLoaded] = useState<boolean>();

  return (
    <DeckGL
      getCursor={({ isHovering }) => {
        return isHovering ? 'pointer' : 'grabbing';
      }}
      pickingRadius={25}
      viewState={viewState}
      controller={true}
      onLoad={() => setLoaded(true)}
      onViewStateChange={(e) => setViewState(e.viewState)}
      layers={[
        realmsLayer,
        resourceLayer,
        cryptsLayer,
        lootBagLayer,
        gaBagLayer,
      ]}
    >
      {loaded ? (
        <Map
          attributionControl={false}
          mapStyle="mapbox://styles/ponderingdemocritus/ckzjumbjo000914ogvsqzcjd2/draft"
          mapboxAccessToken={
            'pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A'
          }
        />
      ) : (
        <div className={'w-full h-full flex justify-center'}>
          <h1 className={'self-center'}>Loading Atlas...</h1>
        </div>
      )}
    </DeckGL>
  );
}
