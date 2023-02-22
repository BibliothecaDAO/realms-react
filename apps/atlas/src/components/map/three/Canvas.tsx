import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

const DynamicPlanet = dynamic(() => import('./Planet'), {
  ssr: false,
});

const ThreeGeo = dynamic(() => import('./Continents'), {
  ssr: false,
});

const RealmsGeo = dynamic(() => import('./Realms'), {
  ssr: false,
});

export const ThreeCanvas = () => {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false }}
      camera={{
        fov: 45,
        position: [0, 0, 300],
        near: 10,
        far: 1000,
      }}
      frameloop="demand"
      onCreated={({ gl }) => {
        gl.setClearColor('black');
      }}
    >
      <OrbitControls makeDefault />
      <DynamicPlanet />
      <RealmsGeo />
      <ThreeGeo />

      <ambientLight />
      {/* <Stars saturation={0} fade speed={1} /> */}
    </Canvas>
  );
};
