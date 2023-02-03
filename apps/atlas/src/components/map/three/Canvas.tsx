import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

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
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000');
      }}
    >
      <OrbitControls makeDefault />
      <DynamicPlanet />
      {/* <ThreeGeo /> */}
      <RealmsGeo />

      <ambientLight />
    </Canvas>
  );
};
