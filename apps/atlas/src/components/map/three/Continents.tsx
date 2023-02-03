/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

const land = require('@/geodata/land.geojson');

export default function Continents() {
  return (
    <Fragment>
      {land ? (
        <Fragment>
          {land.features.map(({ geometry, properties }, index) => {
            const g = new GeoJsonGeometry(geometry, 200);
            return (
              <lineSegments key={index} geometry={g}>
                <meshBasicMaterial
                  attach="material"
                  color={properties.order_idx === 1 ? 'hotpink' : 'blue'}
                />
              </lineSegments>
            );
          })}
        </Fragment>
      ) : null}
    </Fragment>
  );
}
