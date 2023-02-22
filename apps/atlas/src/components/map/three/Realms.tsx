/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment, useCallback, useState } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

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

  const bufferGeometry = new THREE.BufferGeometry();

  const pointsMaterial = new THREE.PointsMaterial({ color: 'white' });

  const vertices: any = [];
  const colors: any = [];

  realms.features.forEach(({ geometry, _properties }, index) => {
    const g: any = new GeoJsonGeometry(geometry, 201);
    const positions = g.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      vertices.push(positions[i], positions[i + 1], positions[i + 2]);
      colors.push(0, 0, 0);
    }
  });

  bufferGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  bufferGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );

  return (
    <>
      <mesh
        // geometry={bufferGeometry}
        receiveShadow
        castShadow
        // onPointerOver={onPointHoverHandler}
        // onPointerOut={onPointOutHandler}
        // onClick={(e) => console.log(e.stopPropagation())}
        // material={pointsMaterial}
      >
        <points
          onClick={(e) => console.log(e)}
          scale={1}
          geometry={bufferGeometry}
          material={pointsMaterial}
        />
      </mesh>
    </>
  );
}
