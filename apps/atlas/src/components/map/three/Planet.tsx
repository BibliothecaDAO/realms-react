/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

import CustomLayer from './shaders/customLayer';

import fragmentShader from './shaders/fragmentShader';
import vertexShader from './shaders/vertexShader';

extend({ CustomLayer });

const sphere = new THREE.SphereGeometry(133, 100, 100);
const phong = new THREE.MeshPhongMaterial({
  color: 'blue',
  transparent: false,
  opacity: 1,
});

export default function Planet() {
  const materialRef = useRef<any>();

  useFrame((state) => {
    const { clock } = state;
    materialRef.current.time = clock.getElapsedTime();
  });

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={1.5}
      geometry={sphere}
    >
      <LayerMaterial lighting="lambert">
        {/* First layer is our own custom layer that's based of the FBM shader */}
        {/* 
          Notice how we can use *any* uniforms as prop here 👇
          You can tweak the colors by adding a colorA or colorB prop!
        */}
        <customLayer ref={materialRef} time={0.0} lacunarity={2.3} />
        {/* Second layer is a depth based gradient that we "add" on top of our custom layer */}
        <Depth colorA="blue" colorB="aqua" alpha={0.1} mode="add" />
        {/* Third Layer is a Fresnel shading effect that we add on */}
        <Fresnel color="#FEB3D9" mode="add" />
      </LayerMaterial>
    </mesh>
  );
}
