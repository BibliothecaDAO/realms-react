/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

import order_highlights from '@/geodata/order_highlights.json';

export default function ThreeGeo() {
  const [isLoading, setIsLoading] = useState(true);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    console.log('loaded');
  }, []);
  return (
    <Fragment>
      {!isLoading ? (
        <Fragment>
          {order_highlights.features.map(({ geometry }, index) => {
            return (
              <lineSegments
                key={index}
                geometry={new GeoJsonGeometry(geometry as any, 100)}
              >
                <lineBasicMaterial color="#464646" />
              </lineSegments>
            );
          })}
        </Fragment>
      ) : null}
    </Fragment>
  );
}
