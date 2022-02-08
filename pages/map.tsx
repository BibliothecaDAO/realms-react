import React, { useState, useCallback, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, PolygonLayer, TextLayer } from "@deck.gl/layers";
import { realms_data, contour_data } from "~/continents";
import { resources } from "~/resources";
import {
  FlyToInterpolator,
  PointLight,
  LightingEffect,
  _GlobeView as GlobeView,
} from "@deck.gl/core";
import { FillStyleExtension } from "@deck.gl/extensions";
import { StaticMap } from "react-map-gl";
import { SideBar } from "~/components/navigation/sidebar";
import { Header } from "~/components/navigation/header";
import Layout from "~/components/Layout";
import { Realm as RealmCard } from "~/components/realms/Realm";
import { useQuery } from "@apollo/client";

import { Data } from "~/types";
import { useUiState } from "~/hooks/useUiState";
import { getRealmQuery } from "~/hooks/graphql/queries";
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
  getPolygon: (d) => d.contour,
  getElevation: 1000,
  getFillColor: (d) => d.color,
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
  const [resource, setResource] = useState<Array<String>>([]);
  const [realmInformation, setRealmInformation] = useState<boolean>(false);
  const filteredData = () => {
    return realms_data.filter((a) =>
      a.resource.some((b) => resource.includes(b))
    );
  };

  const addToFilter = (value) => {
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
    getPosition: (d) => d.coordinates,
    getText: (d) => d.name.toString(),
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
    getPosition: (d) => d.coordinates,
    getRadius: 30000,
    getElevation: 10000,
    lineWidthMinPixels: 1,
    getFillColor: [141, 121, 91],
    onClick: (info, event) => setRealmInformation(true),
  });

  const layers = [realms_layer];

  const list = resources.map((res, index) => (
    <button
      key={index}
      className={`border-off-200  p-1 w-1/2 h-12 mb-2 rounded-xl border-4 border-double text-off-200 hover:bg-white ${resource.includes(res.trait) ? "bg-white" : "bg-black"
        } `}
      onClick={() => addToFilter(res.trait)}
    >
      {res.trait}
    </button>
  ));

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

  const [value, setValue] = useState('1');
  const onChange = (event) => {
    if (parseInt(event.target.value) < 1) {
      setValue("1");
    }
    else if (parseInt(event.target.value) > 8000) {
      setValue("8000");
    }
    else {
      setValue(event.target.value);
    }
  };

  // const mapOutput = () =>{
  //   const geojson = contour_data.map((a)=>{
  //     return {
  //       "type": "Feature",
  //       "properties": {},
  //       "geometry": {
  //           "type": "LineString",
  //           "coordinates": a.contour
  //       }
  //     }
  //   })
  //   const fin = {
  //     "type": "FeatureCollection",
  //     "features": [...geojson]
  //   }
  //   console.log(fin)
  // }
  // const sun = new PointLight({
  //   color: [128, 128, 0],
  //   intensity: 100.0,
  //   position: [0, 0, 200]
  // });
  // const lightingEffect = new LightingEffect({sun});

  const { loading, error, data } = useQuery<Data>(getRealmQuery, {
    variables: { id: value },
  });
  const { ui, setUi } = useUiState()
  return (
    <Layout>
      <div>
        <div className="absolute top-0 right-0 bg-white rounded p-4 h-auto w-auto z-10 shadow-2xl bg-black border-double border-4 border-off-200 text-white">
          <RealmCard data={data} loading={loading} />
        </div>
        <div
          className={`h-screen w-72 bg-black z-20 absolute p-4 top-14 shadow-2xl border-r-4 border-double border-off-200 overflow-auto`}
        >
          <h2 className="text-off-100 py-4">Search By Id</h2>
          <div className=" mb-2 flex w-full">
            <input
              placeholder="Type Id"
              type={"number"}
              className="text-black p-2 rounded-l border-double border-4"
              value={value}
              onChange={onChange}
            />
            <button
              className="px-2 bg-off-200 text-off-100 rounded-r w-full"
              onClick={() => goToId(parseInt(value))}
            >
              Fly
            </button>
          </div>
          <h2 className="text-off-100 py-4">Toggle Resources</h2>
          <div className="flex flex-wrap">{list}</div>
        </div>
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          // effects= {[lightingEffect]}
          layers={layers}
          getTooltip={({ object }) =>
            object && {
              html: `<div class=" w-60 text-center"> <img class="w-96" src="https://d23fdhqc1jb9no.cloudfront.net/_Realms/${object.name}.svg"/> <h1 class="text-xl p-2">Realm Id: ${object.name}</h1><div><h2></h2></div></div>  
      
      `,
              style: {
                backgroundColor: "#fff",
                fontSize: "0.8em",
              },
            }
          }

        >
          <StaticMap
            mapStyle="mapbox://styles/ponderingdemocritus/ckz12qufp000515r172nb8rod"
            mapboxApiAccessToken={'pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A'} />
        </DeckGL>
      </div>
    </Layout>
  );
}

export default App;
