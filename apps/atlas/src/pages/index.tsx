import { FlyToInterpolator } from '@deck.gl/core';
import { ScatterplotLayer, IconLayer, PolygonLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import React, { useState, useCallback } from 'react';
import { Map } from 'react-map-gl';
import Layout from '@/components/Layout';
import { CryptsSideBar } from '@/components/map/CryptsSideBar';
import { EmpireSideBar } from '@/components/map/EmpireSideBar';
import { FlyTo } from '@/components/map/FlyTo';
import { GASideBar } from '@/components/map/GASideBar';
import { LootSideBar } from '@/components/map/LootSideBar';
import { MenuSideBar } from '@/components/map/MenuSideBar';
import { RealmSideBar } from '@/components/map/RealmsSideBar';
import { ResourceSideBar } from '@/components/map/ResourceSideBar';
import { TheOrdersSideBar } from '@/components/map/TheOrdersSideBar';
import { Header } from '@/components/navigation/header';

import crypts from '@/geodata/crypts_all.json';
import ga_bags from '@/geodata/ga_bags.json';
import loot_bags from '@/geodata/loot_bags.json';
import order_highlights from '@/geodata/order_highlights.json';
import realms from '@/geodata/realms.json';
import { useUIContext } from '@/hooks/useUIContext';

function App() {
  const { closeOrdersMenu, toggleOpenSidebar } = useUIContext();
  const [resource, setResource] = useState<Array<string>>([]);
  const [value, setValue] = useState<number>(1);

  const [assetSelect, setAssetSelect] = useState<string>('A');

  // const filteredContinents = () => {
  //   let c = order_highlights.features.filter(
  //     (a) => a.properties.order_idx === 9
  //   );
  //   console.log(c);
  //   return c;
  // };
  // const continent_layer = new PolygonLayer({
  //   id: "polygon-layer",
  //   data: filteredContinents(),
  //   stroked: true,
  //   filled: true,
  //   lineWidthMinPixels: 1,
  //   extruded: true,
  //   getPolygon: (d: any) => d.geometry.coordinates,
  //   getElevation: 1000,
  //   getFillColor: (d: any) => d.color,
  //   getLineColor: [141, 121, 91],
  //   getLineWidth: 4,
  //   onClick: (info: any) => {
  //     console.log(info.object.properties.order_idx);
  //     // setValue(info.object.properties.order_idx);
  //     // if (!mapMenu) {
  //     //   toggleMapMenu();
  //     // }
  //   },
  // });

  const filteredData = () => {
    return (realms as any).features.filter((a: any) =>
      a.properties.resources.some((b: any) => resource.includes(b))
    );
  };

  const addToFilter = (value: any) => {
    const idx = resource.indexOf(value);
    if (idx === -1) {
      return setResource((oldArray) => [value, ...oldArray]);
    } else {
      const temp = [...resource];
      temp.splice(idx, 1);
      return setResource(temp);
    }
  };

  const crypts_layer = new ScatterplotLayer({
    id: 'crypts-layer',
    data: crypts.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) => (d.properties.tokenId === value ? 4000 : 100),
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0, 0],
    updateTriggers: {
      getRadius: value,
    },
    onClick: (info: any) => {
      setValue(info.object.properties.tokenId);
      toggleOpenSidebar('crypts');
    },
  });

  const realms_layer = new ScatterplotLayer({
    id: 'realms-layer',
    data: (realms as any).features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) => (d.properties.realm_idx === value ? 4000 : 1),
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0, 0],
    updateTriggers: {
      getRadius: value,
    },
    onClick: (info: any) => {
      setValue(info.object.properties.realm_idx);
      toggleOpenSidebar('realms');
    },
  });

  const loot_bag_layer = new ScatterplotLayer({
    id: 'loot-layer',
    data: loot_bags.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [255, 0, 0, 0],
    updateTriggers: {
      getRadius: value,
    },
    onClick: (info: any) => {
      setValue(info.object.properties.bag_id);
      toggleOpenSidebar('loot');
    },
  });

  const ga_bag_layer = new ScatterplotLayer({
    id: 'ga-layer',
    data: ga_bags.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 1,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 255, 0, 0],
    updateTriggers: {
      getRadius: value,
    },
    onClick: (info: any) => {
      setValue(info.object.properties.ga_id);
      toggleOpenSidebar('GA');
    },
  });

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };

  const resource_layer = new IconLayer({
    id: 'icon-layer',
    data: filteredData(),
    pickable: false,
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping: ICON_MAPPING,
    getIcon: (d) => 'marker',
    sizeScale: 5,
    getPosition: (d: any) => d.geometry.coordinates,
    getSize: (d) => 5,
    getColor: (d: any) => [255, 255, 255],
  });

  const [initialViewState, setInitialViewState] = useState({
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

  const goToId = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (id: any, type?: string) => {
      closeOrdersMenu();

      let asset;
      if (type === 'A') {
        asset = (realms as any).features.filter(
          (a: any) => a.properties.realm_idx === parseInt(id)
        );
        toggleOpenSidebar('realms');
      } else if (type === 'B') {
        asset = crypts.features.filter(
          (a: any) => a.properties.tokenId === parseInt(id)
        );
        toggleOpenSidebar('crypts');
      } else if (type === 'C') {
        asset = loot_bags.features.filter(
          (a: any) => a.properties.bag_id === parseInt(id)
        );
        toggleOpenSidebar('loot');
      } else {
        asset = ga_bags.features.filter(
          (a: any) => a.properties.ga_id === id.toString()
        );
        toggleOpenSidebar('GA');
      }
      console.log(asset);
      setValue(id);

      if (asset[0]) {
        setInitialViewState({
          longitude: asset[0].geometry.coordinates[0],
          latitude: asset[0].geometry.coordinates[1],
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
      }
    },
    [closeOrdersMenu, toggleOpenSidebar]
  );

  const onChange = (event: any) => {
    if (parseInt(event.target.value) < 1) {
      setValue(1);
    } else if (parseInt(event.target.value) > parseInt(event.target.max)) {
      setValue(event.target.max);
    } else {
      setValue(parseInt(event.target.value));
    }
  };

  const onSelectChange = (event: any) => {
    setAssetSelect(event);
  };

  return (
    <Layout>
      <div className="relative flex h-full overflow-hidden sm:h-screen">
        <Header />
        <RealmSideBar id={value} />
        <TheOrdersSideBar onClick={goToId} />
        <EmpireSideBar onClick={goToId} />
        <ResourceSideBar onClick={addToFilter} resource={resource} />
        <CryptsSideBar id={value} />
        <LootSideBar id={value} />
        <GASideBar id={value} />
        <FlyTo
          onChange={onChange}
          onClick={goToId}
          onSelectChange={onSelectChange}
          value={value}
          select={assetSelect}
        />
        <MenuSideBar />
        <div className="relative w-full">
          <DeckGL
            getCursor={({ isHovering }) => {
              return isHovering ? 'pointer' : 'grabbing';
            }}
            pickingRadius={25}
            initialViewState={initialViewState}
            controller={true}
            layers={[
              realms_layer,
              resource_layer,
              crypts_layer,
              loot_bag_layer,
              ga_bag_layer,
            ]}
          >
            <Map
              attributionControl={false}
              mapStyle="mapbox://styles/ponderingdemocritus/ckzjumbjo000914ogvsqzcjd2/draft"
              mapboxAccessToken={
                'pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A'
              }
            />
          </DeckGL>
        </div>
      </div>
    </Layout>
  );
}

export default App;
