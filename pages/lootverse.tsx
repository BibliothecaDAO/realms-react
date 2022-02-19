import React, { useState, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, IconLayer, PolygonLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "@deck.gl/core";
import { StaticMap } from "react-map-gl";
import Layout from "~/components/Layout";
import { ResourceSideBar } from "~/components/map/ResourceSideBar";
import { useUIContext } from "~/hooks/useUIContext";
import { Header } from "~/components/navigation/header";
import { MenuSideBar } from "~/components/map/MenuSideBar";
import { EmpireSideBar } from "~/components/map/EmpireSideBar";
import { TheOrdersSideBar } from "~/components/map/TheOrdersSideBar";

import realms from "../src/realms.json";
import order_highlights from "../src/order_highlights.json";
import { FlyTo } from "~/components/map/FlyTo";
import { RealmSideBar } from "~/components/map/RealmsSideBar";

function App() {
  const { mapMenu, toggleMapMenu, closeOrdersMenu } = useUIContext();
  const [resource, setResource] = useState<Array<String>>([]);
  const [value, setValue] = useState<number>(1);

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
    /* @ts-ignore: name not exist on D */
    return realms.features.filter((a: any) =>
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

  const realms_layer = new ScatterplotLayer({
    id: "scatterplot-layer",
    /* @ts-ignore: name not exist on D */
    data: realms.features,
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) => (d.properties.realm_idx === value ? 4000 : 100),
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [0, 0, 0],
    updateTriggers: {
      getRadius: value,
    },
    onClick: (info: any) => {
      setValue(info.object.properties.realm_idx);
      if (!mapMenu) {
        toggleMapMenu();
      }
    },
  });

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };

  const resource_layer = new IconLayer({
    id: "icon-layer",
    data: filteredData(),
    pickable: false,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",
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
  });

  const goToId = useCallback((id: any) => {
    toggleMapMenu();
    closeOrdersMenu();
    /* @ts-ignore: name not exist on D */
    let realm = realms.features.filter(
      (a: any) => a.properties.realm_idx === id
    );

    setValue(id);

    setInitialViewState({
      longitude: realm[0].geometry.coordinates[0],
      latitude: realm[0].geometry.coordinates[1],
      zoom: 8,
      pitch: 20,
      bearing: 0,

      // @ts-ignore: Unreachable code error
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, []);

  const onChange = (event: any) => {
    if (parseInt(event.target.value) < 1) {
      setValue(1);
    } else if (parseInt(event.target.value) > 8000) {
      setValue(8000);
    } else {
      setValue(parseInt(event.target.value));
    }
  };

  return (
    <Layout>
      <div className="relative overflow-hidden h-screen">
        <Header />
        <MenuSideBar />
        <RealmSideBar id={value} />
        <TheOrdersSideBar onClick={goToId} />
        <EmpireSideBar onClick={goToId} />
        <ResourceSideBar onClick={addToFilter} resource={resource} />
        <FlyTo onChange={onChange} onClick={goToId} value={value} />
        <DeckGL
          getCursor={({ isHovering }) => {
            return isHovering ? "pointer" : "grabbing";
          }}
          pickingRadius={25}
          initialViewState={initialViewState}
          controller={true}
          layers={[realms_layer, resource_layer]}
        >
          <StaticMap
            attributionControl={false}
            mapStyle="mapbox://styles/ponderingdemocritus/ckzjumbjo000914ogvsqzcjd2"
            mapboxApiAccessToken={
              "pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A"
            }
          />
        </DeckGL>
      </div>
    </Layout>
  );
}

export default App;
