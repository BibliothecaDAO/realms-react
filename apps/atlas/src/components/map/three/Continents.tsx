/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

const coast = require('@/geodata/coastline.geojson');
const land = require('@/geodata/landmass.geojson');
const ocean = require('@/geodata/ocean.geojson');

export default function Continents() {
  return (
    <Fragment>
      {land ? (
        <Fragment>
          {land.features.map(({ geometry, properties }, index) => {
            const g = new GeoJsonGeometry(geometry, 200);
            return (
              <lineSegments key={index} geometry={g}>
                <meshToonMaterial
                  attach="material"
                  // color={properties.order_idx === 1 ? 'hotpink' : 'blue'}
                />
              </lineSegments>
            );
          })}
        </Fragment>
      ) : null}
      {land ? (
        <Fragment>
          {coast.features.map(({ geometry, properties }, index) => {
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
      {land ? (
        <Fragment>
          {ocean.features.map(({ geometry, properties }, index) => {
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
