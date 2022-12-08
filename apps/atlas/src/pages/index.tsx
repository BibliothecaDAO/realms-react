/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { TripsLayer } from '@deck.gl/geo-layers';
import { ScatterplotLayer, ArcLayer, IconLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { Popover, Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from 'react-map-gl';
import { CryptSideBar } from '@/components/crypts/CryptsSideBar';
import { GASideBar } from '@/components/ga/GASideBar';
import Layout from '@/components/Layout';
const ChatComponent = dynamic(() => import('@/components/ui/Chat'), {
  ssr: false,
});
import { LootSideBar } from '@/components/loot/LootSideBar';
import { RealmSideBar } from '@/components/realms/RealmsSideBar';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { Annotation } from '@/components/ui/Icons';
import { resources } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { RealmProvider, useRealmContext } from '@/context/RealmContext';
import { useUIContext } from '@/context/UIContext';
import { useGetTravelsQuery } from '@/generated/graphql';
import crypts from '@/geodata/crypts.json';
/* import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json'; */
import realms from '@/geodata/realms_resources.json';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import type { AssetType } from '@/hooks/useAtlasMap';
import { getDeckGLTripLayerPath } from '@/util/travel';
import type { Point } from '@/util/travel';

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

  const selectedAsset = mapContext.selectedAsset;

  const { assetSidebar, closeAsset } = useUIContext();

  return (
    <>
      <RealmSideBar
        realmId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'realm'}
        onClose={closeAsset}
      />
      <LootSideBar
        lootId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'loot'}
        onClose={closeAsset}
      />
      <CryptSideBar
        cryptId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'crypt'}
        onClose={closeAsset}
      />
      <GASideBar
        gaId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'ga'}
        onClose={closeAsset}
      />
    </>
  );
}

function useTravelTripsLayer() {
  const [variables, setVariables] = useState({
    where: { destinationArrivalTime: { gt: Date.now() } },
  });
  const { data: travels } = useGetTravelsQuery({ variables });
  useEffect(() => {
    const timer = setInterval(() => {
      setVariables({ where: { destinationArrivalTime: { gt: Date.now() } } });
    }, 30 * 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // Increase length to slow down
  const loopLength = 500;
  const animationSpeed = 1;
  const [time, setTime] = useState(0);
  const [animation] = useState<any>({});
  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const travelData = useMemo(() => {
    return travels?.payload
      ? travels?.payload
          .filter((travel) => travel.endTime > travel.startTime)
          .map((travel) =>
            getDeckGLTripLayerPath(
              travel.locationRealm as Point,
              travel.destinationRealm as Point,
              travel.startTime,
              travel.endTime,
              loopLength
            )
          )
      : [];
  }, [travels]);

  const tripsLayer = new TripsLayer({
    id: 'trips',
    data: travelData,
    getPath: (d: any) => d.path,
    getTimestamps: (d: any) => d.timestamps,
    getColor: [220, 20, 60],
    opacity: 1,
    widthMinPixels: 4,
    fadeTrail: true,
    trailLength: 400,
    currentTime: time,
  });
  return { tripsLayer };
}

function MapModule() {
  const { userRealms, userData } = useUsersRealms();
  const { travelContext, mapContext } = useAtlasContext();
  const { state, actions } = useRealmContext();

  const ItemViewLevel = 5;
  const selectedId = mapContext.selectedAsset?.id ?? '0';
  const { tripsLayer } = useTravelTripsLayer();

  const userRealmsFormatted = userRealms?.realms.map((a) => {
    return {
      coordinates: [a.longitude, a.latitude],
      id: a.realmId,
    };
  });

  const userArmiesFormatted = userData?.attackingArmies
    ?.filter((a) => a.armyId !== 0 || a.destinationRealmId !== 0)
    ?.map((a) => {
      return {
        coordinates: realms.features.find((b) => b.id === a.destinationRealmId)
          ?.xy,
        id: a.destinationRealmId,
      };
    });

  const userRealmIds = userRealms?.realms.map((a) => {
    return a.realmId;
  });

  const resourcesToString = (a) => {
    return resources.find((r) => r.trait === a)?.id ?? 0;
  };

  const selectedResourcesFiltered = realms.features.filter((d) =>
    d.resources.find((c) =>
      state.selectedResources.includes(resourcesToString(c))
    )
  );

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
        getPosition: (d: any) => d.xy,
        getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 100),
        getElevation: 10000,
        lineWidthMinPixels: 2,
        getFillColor: [0, 0, 0, 0],
        updateTriggers: {
          getRadius: parseInt(selectedId),
          getVisible: mapContext.viewState,
        },
        onClick: (info: any) => {
          mapContext.navigateToAsset(info.object.id, assetType);
        },
      }),
    [mapContext, selectedId, actions]
  );

  const ownRealms = new IconLayer({
    id: 'own-realms',
    data: userRealmsFormatted,
    getIcon: (d) => ({
      url: '/real_icon-fill.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    pickable: true,
    sizeScale: 5,
    getPosition: (d: any) => d.coordinates,
    getSize: (d) => 10,
    onClick: (info: any) => {
      mapContext.navigateToAsset(info.object.id, 'realm');
    },
  });

  const selectedResources = new IconLayer({
    id: 'selected-resources',
    data: selectedResourcesFiltered,
    getIcon: (d) => ({
      url: 'https://cdn-icons-png.flaticon.com/512/6491/6491529.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    sizeScale: 5,
    getPosition: (d: any) => d.xy,
    getSize: (d) => 10,
  });

  const filteredUserRealmsFromMain = realms.features.filter(
    (d) => !userRealmIds?.includes(d.id)
  );

  const sRealms = new IconLayer({
    id: 'srealms',
    data: filteredUserRealmsFromMain,
    getIcon: (d: any) => ({
      url:
        d.id === parseInt(selectedId)
          ? '/real_icon-fill.png'
          : '/real_icon-line.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    sizeUnits: 'pixels',
    pickable: true,
    visible: mapContext.viewState.zoom < ItemViewLevel ? false : true,
    sizeScale: 50,
    sizeMinPixels: 6,
    getPosition: (d: any) => d.xy,

    onClick: (info: any) => {
      mapContext.navigateToAsset(info.object.id, 'realm');
    },
  });

  const armies = new IconLayer({
    id: 'army',
    data: userArmiesFormatted,
    getIcon: (d: any) => ({
      url: 'https://cdn-icons-png.flaticon.com/512/3612/3612777.png',
      width: 128,
      height: 128,
      anchorY: d.id === parseInt(selectedId) ? 200 : 100,
    }),
    sizeUnits: 'pixels',
    pickable: true,
    visible: true,
    sizeScale: 50,
    sizeMinPixels: 6,
    getPosition: (d: any) => d.coordinates,

    onClick: (info: any) => {
      mapContext.navigateToAsset(info.object.id, 'realm');
    },
  });

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
    const assets = [
      // createScatterPlot('crypt', crypts.features),
      // createScatterPlot('realm', (realms as any).features),
      // createScatterPlot('loot', loot_bags.features),
      // createScatterPlot('ga', ga_bags.features),
      // new ScenegraphLayer({
      //   id: 'scenegraph-layer',
      //   data: (realms as any).features,
      //   pickable: true,
      //   scenegraph: 'public/castle.glb',
      //   getPosition: (d: any) => d.xy,
      //   getOrientation: (d) => [0, Math.random() * 180, 90],
      //   _animations: {
      //     '*': { speed: 5 },
      //   },
      //   sizeScale: 5000,
      //   _lighting: 'pbr',
      // }),
    ];

    return [
      ...assets,
      arcsLayer,
      ownRealms,
      selectedResources,
      sRealms,
      armies,
    ];
  }, [
    arcsLayer,
    createScatterPlot,
    ownRealms,
    sRealms,
    selectedResources,
    selectedId,
    armies,
  ]);

  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();

  return (
    <>
      <div className="absolute z-20 top-5 right-32">
        <SearchFilter
          placeholder="Search by Realm Id"
          onSubmit={(value) => {
            actions.updateSearchIdFilter(parseInt(value) ? value : '');
            navigateToAsset(parseInt(value), 'realm');
          }}
          defaultValue={state.searchIdFilter + ''}
        />
      </div>
      <DeckGL
        getCursor={({ isHovering }) => {
          return isHovering ? 'pointer' : 'grabbing';
        }}
        pickingRadius={25}
        viewState={mapContext.viewState}
        controller={true}
        onViewStateChange={(e) => mapContext.setViewState(e.viewState)}
        layers={[...layers, tripsLayer]}
      >
        {!mapContext.isMapLoaded ? (
          <div className="fixed z-50 flex flex-wrap justify-center w-screen h-screen bg-gray-1000">
            {' '}
            <h1 className="self-center duration-100 animate-pulse">
              <Ouroboros className="block w-20 mx-auto fill-current" />
              loading Atlas...
            </h1>{' '}
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
          // renderWorldCopies={false}
        />
      </DeckGL>
      <Popover className="absolute z-30 bottom-10 right-20">
        <Popover.Button as="div">
          <Button
            size="lg"
            className="absolute bottom-0 w-12 h-12 p-0 rounded-full"
            variant="outline"
          >
            <Annotation className="inline-block w-6 h-6 mr-1" />
          </Button>
        </Popover.Button>

        <Transition
          enter="transition duration-350 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-350 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel
            className="absolute w-full md:w-96 -left-96 bottom-16"
            static
          >
            <ChatComponent channelName="desiege-chat" />
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
}
