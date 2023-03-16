import {
  MapControls,
  Stars,
  useGLTF,
  PerspectiveCamera,
  OrbitControls,
  Stage,
} from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// const DynamicPlanet = dynamic(() => import('./Planet'), {
//   ssr: false,
// });

// const ThreeGeo = dynamic(() => import('./Continents'), {
//   ssr: false,
// });

const RealmsGeo = dynamic(() => import('./Realms'), {
  ssr: false,
});

const Tower = dynamic(() => import('./gltf/Medieval_castle_with_village'), {
  ssr: false,
});

const Bastion = dynamic(() => import('./gltf/Bastion_exportTest2'), {
  ssr: false,
});

export const ThreeCanvas = () => {
  // const { nodes, materials } = useGLTF('./gltf/starter-scene.glb');
  return (
    <Canvas
    // orthographic
    // gl={{ antialias: false, alpha: false }}
    // camera={{ position: [4, 0, -12], fov: 35 }}
    // camera={{
    //   fov: 45,
    //   position: [0, 0, 300],
    //   near: 10,
    //   far: 1000,
    // }}
    // frameloop="demand"
    // onCreated={({ gl }) => {
    //   gl.setClearColor('black');
    // }}
    >
      <Suspense fallback={null}>
        <Stage shadows="accumulative">
          <Bastion />
        </Stage>
      </Suspense>
      {/* <ambientLight /> */}

      <OrbitControls
        // enableZoom={true}
        minZoom={20}
        maxZoom={30}
        enablePan={false}
        position={[0, 0, 0]}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        makeDefault
      />
      <PerspectiveCamera makeDefault position={[-30, 100, 120]} fov={35} />

      {/* <Stars saturation={0} fade speed={1} /> */}
    </Canvas>
  );
};
