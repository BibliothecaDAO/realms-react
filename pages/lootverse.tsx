import React, { useState, useCallback, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import {
  ScatterplotLayer,
  PolygonLayer,
  TextLayer,
  IconLayer,
} from "@deck.gl/layers";
import { realms_data, contour_data } from "~/continents";
import { resources } from "~/resources";
import {
  FlyToInterpolator,
  PointLight,
  LightingEffect,
  // _GlobeView as GlobeView,
} from "@deck.gl/core";
import { FillStyleExtension } from "@deck.gl/extensions";
import { StaticMap } from "react-map-gl";
import { Header } from "~/components/navigation/header";
import Layout from "~/components/Layout";
import { Realm as RealmCard } from "~/components/realms/Realm";
import { ResourceSideBar } from "~/components/map/ResourceSideBar";
import { useQuery } from "@apollo/client";

import { Data } from "~/types";
import { getRealmQuery } from "~/hooks/graphql/queries";
import { useUIContext } from "~/hooks/useUIContext";

import Menu from "../public/svg/menu.svg";
// const arc_pairs = [];
// for (const x of Array(15).keys()) {
//   for (const j of Array(20).keys()) {
//     arc_pairs.push({
//       from: realms_data[j],s
//       to: realms_data[500 * (x + 1)],
//     });
//   }
// }
const patterns = ["hatch-cross"];
const continent_layer = new PolygonLayer({
  id: "polygon-layer",
  data: contour_data,
  stroked: true,
  filled: true,
  lineWidthMinPixels: 1,
  extruded: true,
  getPolygon: (d: any) => d.contour,
  getElevation: 1000,
  getFillColor: (d: any) => d.color,
  getLineColor: [141, 121, 91],
  getLineWidth: 4,
  // fillPatternMask: true,
  fillPatternAtlas:
    "https://i.ibb.co/zbSjNXX/topographic-map-seamless-pattern-73378-589.png",

  getFillPattern: {
    x: 0,
    y: 0,
    width: 626,
    height: 626,
    mask: true,
  },
  getFillPatternScale: 500,
  getFillPatternOffset: [0, 0],

  // Define extensions
  extensions: [new FillStyleExtension({ pattern: true })],
});

function App() {
  const { mapMenu, toggleMapMenu } = useUIContext();
  const [resource, setResource] = useState<Array<String>>([]);
  const [realmInformation, setRealmInformation] = useState<boolean>(false);
  const filteredData = () => {
    return realms_data.filter((a) =>
      a.resource.some((b) => resource.includes(b))
    );
  };

  const addToFilter = (value: any) => {
    const idx = resource.indexOf(value);
    console.log(idx);
    if (idx === -1) {
      return setResource((oldArray) => [value, ...oldArray]);
    } else {
      const temp = [...resource];
      temp.splice(idx, 1);
      return setResource(temp);
    }
  };
  const textLayer = new TextLayer({
    id: "text-layer",
    data: filteredData(),
    getPosition: (d: any) => d.coordinates,
    getText: (d: any) => d.name.toString(),
    getSize: 20,
    getColor: [0, 0, 0, 255],
    getAngle: 0,
    sizeMaxPixels: 50,
    sizeScale: 2,
    getTextAnchor: "middle",
    fontFamily: "Monaco, monospace",
    getAlignmentBaseline: "center",
    parameters: { depthTest: false },
  });
  const realms_layer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data: filteredData(),
    stroked: true,
    filled: true,
    extruded: true,
    pickable: true,
    opacity: 1,
    getPosition: (d: any) => d.coordinates,
    getRadius: 3000,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [141, 121, 91],
    onClick: (info, event) => setRealmInformation(true),
  });
  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };
  const layer = new IconLayer({
    id: "icon-layer",
    data: filteredData(),
    pickable: true,
    // iconAtlas and iconMapping are required
    // getIcon: return a string
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",

    sizeScale: 5,
    getPosition: (d: any) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d: any) => [255, 255, 255],
  });
  const layers = [layer];

  const [initialViewState, setInitialViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 4,
    pitch: 55,
    bearing: 0,
  });

  const goToId = useCallback((id) => {
    let realm = realms_data.filter((a) => a.name === id);
    setInitialViewState({
      longitude: realm[0].coordinates[0],
      latitude: realm[0].coordinates[1],
      zoom: 10,
      pitch: 0,
      bearing: 0,
      // @ts-ignore: Unreachable code error
      transitionDuration: 8000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, []);

  const [value, setValue] = useState("1");
  const onChange = (event: any) => {
    if (parseInt(event.target.value) < 1) {
      setValue("1");
    } else if (parseInt(event.target.value) > 8000) {
      setValue("8000");
    } else {
      setValue(event.target.value);
    }
  };

  const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: value },
  });

  const list = resources.map((res, index) => (
    <button
      key={index}
      className={` p-1 h-12 mb-2 px-4 rounded-xl text-off-200 mr-2 hover:bg-white/90 transition-all duration-300   ${
        resource.includes(res.trait)
          ? "backdrop-blur-md bg-white/90"
          : "backdrop-blur-md bg-white/30"
      } `}
      onClick={() => addToFilter(res.trait)}
    >
      {res.trait}
    </button>
  ));

  return (
    <Layout>
      <div>
        <h1 className="text-6xl top-0 absolute z-10 w-full text-center pt-8">
          Lootverse
        </h1>
        <ResourceSideBar />
        <button
          className="absolute top-10 left-10 bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70"
          onClick={toggleMapMenu}
        >
          <Menu />
        </button>
        <div
          className={`h-screen w-1/2 z-20 absolute p-6 bottom-0 overflow-auto backdrop-blur-md bg-off-200/20 rounded-r-2xl transform duration-300 transition-all  ${
            mapMenu ? "" : "-translate-x-full"
          }`}
        >
          <button
            className="p-4 bg-white/20 transition-all p-4 z-10 rounded hover:bg-white/70"
            onClick={toggleMapMenu}
          >
            <Menu />
          </button>
          <h3 className="mt-4 mb-2">Search For a Realm</h3>
          <div className=" mb-2 flex">
            <input
              placeholder="Type Id"
              type={"number"}
              className="text-black px-4 py-2 rounded-l-xl w-2/3"
              value={value}
              onChange={onChange}
              min="1"
              max="8000"
            />
            <button
              className="p-1 px-4 rounded-r-xl text-off-200 mr-2 bg-white/20 transition-all duration-300 rounded-r-xl w-1/3"
              onClick={() => goToId(parseInt(value))}
            >
              Fly
            </button>
          </div>

          <div className="rounded-xl p-4 h-auto  z-10 shadow-2xl bg-black  text-white">
            <RealmCard data={data!} loading={loading} />
          </div>
          <h3 className="mt-8">Filter Resources</h3>
          <div className="flex flex-wrap mb-8">{list}</div>
        </div>
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          // effects= {[lightingEffect]}
          layers={layers}
          getTooltip={({ object }) =>
            object && {
              // @ts-ignore: name not exist on D
              html: `<div class=" w-96 text-center"> <img class="w-96" src="https://d23fdhqc1jb9no.cloudfront.net/_Renders/${object.name}.jpg"/> <h1 class="text-xl p-2">Realm Id: ${object.name}</h1><div><h2>${object.name}</h2></div></div>  
      `,
              style: {
                backgroundColor: "black",
                fontSize: "0.8em",
                borderRadius: "10px",
              },
            }
          }
        >
          <StaticMap
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
