/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment, useCallback, useState } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';
// import { Layout } from './hex/Hex.js';
import realms_resources from '../../../geodata/realms_resources.json';
// import HexagonPillar from './hex/oito/geometry/HexagonPillar.js';

const realms = require('@/geodata/realm_resources_geo.geojson');

export default function Continents() {
  const [hovered, set] = useState(false);

  const onPointHoverHandler = useCallback((e) => {
    console.log(e);
    e.stopPropagation();
    set(true);
  }, []);

  const onPointOutHandler = useCallback((e) => {
    e.stopPropagation();
    set(false);
  }, []);

  // // loop to 10000
  // // const coordinates = [];
  // for (let x = 0; x < 1000; x++) {
  //   for (let y = 0; y < 1000; y++) {
  //     // coordinates.push([x, y]);
  //     vertices.push(x, y, 0);
  //   }
  // }

  // // realms_resources.features.forEach((feature, index) => {
  // //   // const g: any = new GeoJsonGeometry(geometry, 201);
  // //   // const positions = g.attributes.position.array;
  // //   // for (let i = 0; i < geometry.length; i += 3) {
  // //   vertices.push(feature.xy[0], feature.xy[1], 0);
  // //   // colors.push(0, 0, 0);
  // //   // }
  // // });

  // bufferGeometry.setAttribute(
  //   'position',
  //   new THREE.Float32BufferAttribute(vertices, 3)
  // );
  // bufferGeometry.setAttribute(
  //   'color',
  //   new THREE.Float32BufferAttribute(colors, 3)
  // );

  return (
    <>
      <mesh position={[1, 2, 3]}>
        {/* <mesh geometry={geo} material={mat}></mesh> */}
      </mesh>
    </>
  );
}
