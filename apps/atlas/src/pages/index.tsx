/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { ScatterplotLayer, ArcLayer, IconLayer } from '@deck.gl/layers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import DeckGL from '@deck.gl/react';
import { Popover, Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import Map from 'react-map-gl';
import { SearchFilter } from '@/components/filters/SearchFilter';
import Layout from '@/components/Layout';
const ChatComponent = dynamic(
  () => import('@/components/minigame/realtime/Chat'),
  { ssr: false }
);
import { CryptSideBar } from '@/components/sidebars/CryptsSideBar';
import { GASideBar } from '@/components/sidebars/GASideBar';
import { LootSideBar } from '@/components/sidebars/LootSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';
import { resources } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import { RealmProvider, useRealmContext } from '@/context/RealmContext';
import RealmsResources from '@/geodata/continents';
import crypts from '@/geodata/crypts.json';
/* import ga_bags from '@/geodata/ga.json';
import loot_bags from '@/geodata/loot.json'; */
import realms from '@/geodata/realms.json';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import type { AssetType } from '@/hooks/useAtlasMap';
import { Annotation } from '@/shared/Icons';

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
  const { userRealms } = useUsersRealms();
  const { travelContext, mapContext } = useAtlasContext();
  const { state, actions } = useRealmContext();

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
          actions.updateSearchIdFilter(
            parseInt(info.object.id) ? info.object.id : ''
          );
        },
      }),
    [mapContext, selectedId]
  );

  const userRealmsFormatted = userRealms?.realms.map((a) => {
    return {
      coordinates: [a.longitude, a.latitude],
      id: a.realmId,
    };
  });

  const ownRealms = new IconLayer({
    id: 'own-realms',
    data: userRealmsFormatted,
    getIcon: (d) => ({
      url: 'https://cdn-icons-png.flaticon.com/512/8983/8983174.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    sizeScale: 5,
    getPosition: (d: any) => d.coordinates,
    getSize: (d) => 10,
  });

  const resourcesToString = (a) => {
    return resources.find((r) => r.trait === a)?.id ?? 0;
  };

  const selectedResourcesFiltered = RealmsResources.filter((d) =>
    d.resource.find((c) =>
      state.selectedResources.includes(resourcesToString(c))
    )
  );

  const selectedResources = new IconLayer({
    id: 'selected-resources',
    data: selectedResourcesFiltered,
    getIcon: (d) => ({
      url: 'https://cdn-icons-png.flaticon.com/512/3275/3275748.png',
      width: 128,
      height: 128,
      anchorY: 100,
    }),
    sizeScale: 5,
    getPosition: (d: any) => d.coordinates,
    getSize: (d) => 10,
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
      createScatterPlot('crypt', crypts.features),
      createScatterPlot('realm', (realms as any).features),
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

    return [...assets, arcsLayer, ownRealms, selectedResources];
  }, [arcsLayer, createScatterPlot, ownRealms]);

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
        layers={layers}
      >
        {!mapContext.isMapLoaded ? (
          <div className="fixed z-50 flex flex-wrap justify-center w-screen h-screen bg-gray-1100">
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

export const HoverCard = ({ name }) => {
  return <div>{name}</div>;
};
