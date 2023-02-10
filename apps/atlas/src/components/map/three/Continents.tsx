/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import fragmentShader from './shaders/fragmentShader';
import vertexShader from './shaders/vertexShader';
import { geoPlaneGeometry, geoContourGeomtry } from './utils';

const coast = require('@/geodata/coastline.geojson');
const land = require('@/geodata/landmass.geojson');
const ocean = require('@/geodata/ocean.geojson');

const tri = require('@/geodata/tri.json');

export default function Continents() {
  const radius = 200;
  const thickness = 0.01;
  const dimension = 3;

  const geo = Object.entries(tri).reduce((geoLayer, [name, tri]) => {
    const plane = new THREE.Mesh(
      geoPlaneGeometry(tri, radius, thickness, dimension),
      new THREE.MeshToonMaterial({
        color: 'white',
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide,
      })
    );
    plane.userData.type = 'plane';

    const contour = new THREE.LineSegments(
      geoContourGeomtry(tri, radius, thickness, dimension),
      new THREE.LineBasicMaterial({
        color: '#013220',
        depthTest: true,
        opacity: 0.2,
        transparent: false,
        linewidth: 1,
      })
    );
    contour.userData.type = 'border';

    const obj = new THREE.Object3D();
    obj.name = name;
    obj.add(plane);
    obj.add(contour);

    geoLayer.add(obj);

    return geoLayer;
  }, new THREE.Object3D());

  return (
    <mesh>
      <primitive object={geo} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>

    // <mesh
    //   // geometry={bufferGeometry}
    //   receiveShadow
    //   castShadow
    //   // onPointerOver={onPointHoverHandler}
    //   // onPointerOut={onPointOutHandler}
    //   // onClick={(e) => console.log(e.stopPropagation())}
    //   // material={pointsMaterial}
    // >
    //   <mesh
    //     onClick={(e) => console.log(e)}
    //     scale={1}
    //     geometry={bufferGeometry}
    //     material={pointsMaterial}
    //   />
    // </mesh>
    // <Fragment>
    //   {land ? (
    //     <Fragment>
    //       {land.features.map(({ geometry, properties }, index) => {
    //         const g = new GeoJsonGeometry(geometry, 200);
    //         return (
    //           <mesh key={index} geometry={g}>
    //             <meshToonMaterial
    //               attach="material"
    //               // color={properties.order_idx === 1 ? 'hotpink' : 'blue'}
    //             />
    //           </mesh>
    //         );
    //       })}
    //     </Fragment>
    //   ) : null}
    // </Fragment>
  );
}
