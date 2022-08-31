/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FlyToInterpolator,
  MapView,
  _GlobeView as GlobeView,
} from '@deck.gl/core';
import { ScatterplotLayer, IconLayer, ArcLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { UserAgent } from '@quentin-sommer/react-useragent';
import type { UserAgentProps } from '@quentin-sommer/react-useragent/dist/UserAgent';
import { scaleQuantile } from 'd3-scale';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo } from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import Layout from '@/components/Layout';
import { ArtBackground } from '@/components/map/ArtBackground';
import { FlyTo } from '@/components/map/FlyTo';
import { BaseModal } from '@/components/modals/BaseModal';
import { Header } from '@/components/navigation/header';
import { AccountPanel } from '@/components/panels/AccountPanel';
import { BankPanel } from '@/components/panels/BankPanel';
import { CryptsPanel } from '@/components/panels/CryptsPanel';
import { GaPanel } from '@/components/panels/GaPanel';
import { LootPanel } from '@/components/panels/LootPanel';
import { LorePanel } from '@/components/panels/LorePanel';
import { NoticeBoard } from '@/components/panels/NoticeBoard';
import { RaidResultsPanel } from '@/components/panels/RaidResultsPanel';
import { RealmDetailsPanel } from '@/components/panels/RealmDetailsPanel';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { TradePanel } from '@/components/panels/TradePanel';
import { BridgeRealmsSideBar } from '@/components/sidebars/BridgeRealmsSideBar';
import { CryptsSideBar } from '@/components/sidebars/CryptsSideBar';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { MenuSideBar } from '@/components/sidebars/MenuSideBar';
import { MilitarySideBar } from '@/components/sidebars/MilitarySideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { TransactionCartSideBar } from '@/components/sidebars/TransactionCartSideBar';
import { CryptProvider } from '@/context/CryptContext';
import { GaProvider } from '@/context/GaContext';
import { LootProvider } from '@/context/LootContext';
import { LoreProvider } from '@/context/LoreContext';
import { RealmProvider } from '@/context/RealmContext';
import { ResourceProvider } from '@/context/ResourcesContext';
import crypts from '@/geodata/crypts.json';
import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json';
import realms from '@/geodata/realms.json';
import { useAtlasContext, AtlasProvider } from '@/hooks/useAtlasContext';
// import order_highlights from '@/geodata/order_highlights.json';
import type { RealmFeatures } from '@/types/index';
import data from './test.json';

export default function AtlasPage() {
  return (
    <AtlasProvider>
      <Layout>
        <div className="relative flex h-full overflow-hidden sm:h-screen">
          <MenuSideBar />
          <div className="relative flex flex-col w-full">
            <ResourceProvider>
              <Header />

              <AtlasMain />
            </ResourceProvider>
          </div>
        </div>
      </Layout>
    </AtlasProvider>
  );
}

function AtlasMain() {
  return (
    <div className="relative w-full h-full">
      <UserAgent>
        {(ua: UserAgentProps) => (
          <>
            <ArtBackground />
            <AccountModule />
            <LootModule />
            <GaModule />
            <RealmsModule />
            <CryptModule />
            <BankPanel />
            <NoticeBoard />
            <ResourceSwapSideBar />
            <TradePanel />
            <LoreModule />
            {/* <FlyTo /> */}
            {/* Hide the map on mobile devices */}
            {!ua.mobile ? (
              <MapModule />
            ) : (
              <div className="object-cover object-right w-full h-full bg-center bg-fill bg-warRoom" />
            )}
            <BaseModal />
            <TransactionCartSideBar />
            <MilitarySideBar />
            <div id="sidebar-root">
              {/* Render children here using the AtlasSideBar component */}
            </div>
          </>
        )}
      </UserAgent>
    </div>
  );
}

function RealmsModule() {
  const { query } = useRouter();
  const segments = query?.segment ?? [];
  const realmId = segments[1] ? Number(segments[1]) : 0;
  return (
    <RealmProvider>
      {realmId > 0 &&
        (segments[2] === 'combat' ? (
          <RaidResultsPanel key={realmId} defendId={realmId} tx={segments[3]} />
        ) : (
          <RealmDetailsPanel key={realmId} realmId={realmId} />
        ))}
      {realmId === 0 && (
        <>
          <RealmsPanel />
          {/* <LorePanel /> */}
          <RealmSideBar />
          <BridgeRealmsSideBar />
          <SettleRealmsSideBar />
        </>
      )}
    </RealmProvider>
  );
}

function GaModule() {
  return (
    <GaProvider>
      <GaPanel />
      <GASideBar />
    </GaProvider>
  );
}

function CryptModule() {
  return (
    <CryptProvider>
      <CryptsPanel />
      <CryptsSideBar />
    </CryptProvider>
  );
}

function BankModule() {
  return (
    <ResourceProvider>
      <BankPanel />
      <ResourceSwapSideBar />
    </ResourceProvider>
  );
}

function LootModule() {
  return (
    <LootProvider>
      <LootPanel />
      <LootSideBar />
    </LootProvider>
  );
}

function AccountModule() {
  return <AccountPanel />;
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

  const minimapView = new MapView({
    id: 'minimap',
    x: 20,
    y: 20,
    width: '20%',
    height: '20%',
    clear: true,
  });

  const minimapBackgroundStyle = {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    background: '#fefeff',
    boxShadow: '0 0 8px 2px rgba(0,0,0,0.15)',
  };

  const s = [
    {
      inbound: 72633,
      outbound: 74735,
      from: {
        name: '19th St. Oakland (19TH)',
        coordinates: [28.7471, -18.92],
      },
      to: {
        name: '12th St. Oakland City Center (12TH)',
        coordinates: [114.0133, 0.5246],
      },
    },
  ];

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

  const inFlowColors = [
    [255, 255, 204],
    [199, 233, 180],
    [127, 205, 187],
    [65, 182, 196],
    [29, 145, 192],
    [34, 94, 168],
    [12, 44, 132],
  ];

  const outFlowColors = [
    [255, 255, 178],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [177, 0, 38],
  ];

  function calculateArcs(data, selectedCounty) {
    if (!data || !data.length) {
      return null;
    }
    if (!selectedCounty) {
      selectedCounty = data.find(
        (f) => f.properties.name === 'Los Angeles, CA'
      );
    }
    const { flows, centroid } = selectedCounty.properties;

    const arcs = Object.keys(flows).map((toId) => {
      const f = data[toId];
      return {
        source: centroid,
        target: f.properties.centroid,
        value: flows[toId],
      };
    });

    const scale = scaleQuantile()
      .domain(arcs.map((a) => Math.abs(a.value)))
      .range(inFlowColors.map((c, i) => i));

    arcs.forEach((a: any) => {
      a.gain = Math.sign(a.value);
      a.quantile = scale(Math.abs(a.value));
    });

    return arcs;
  }

  const arcs = useMemo(
    () => calculateArcs(data, 'Los Angeles, CA'),
    [data, 'Los Angeles, CA']
  );

  const layers = [
    // new ArcLayer({
    //   id: 'arc',
    //   data: arcs,
    //   getSourcePosition: (d: any) => d.source,
    //   getTargetPosition: (d: any) => d.target,
    //   getWidth: 100,
    // }),
    new ScatterplotLayer({
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
    }),
    new ScatterplotLayer({
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
    }),
    new ScatterplotLayer({
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
    }),
    new ScatterplotLayer({
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
    }),
  ];

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
      pitch: 0,
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
      views={new GlobeView()}
      pickingRadius={25}
      viewState={viewState}
      controller={true}
      // onLoad={() => setLoaded(true)}
      onViewStateChange={(e) => setViewState(e.viewState)}
      layers={layers}
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
        projection={'globe'}
        attributionControl={false}
        onLoad={() => setLoaded(true)}
        mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
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
