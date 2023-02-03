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

  return (
    <Fragment>
      {realms ? (
        <Fragment>
          {realms.features.map(({ geometry, properties }, index) => {
            const g = new GeoJsonGeometry(geometry, 200);
            return (
              <mesh
                key={index}
                geometry={g}
                onPointerOver={onPointHoverHandler}
                onPointerOut={onPointOutHandler}
              >
                <points scale={1} geometry={g}>
                  <pointsMaterial attach="material" color={'black'} />
                </points>
              </mesh>
            );
          })}
        </Fragment>
      ) : null}
    </Fragment>
  );
}
