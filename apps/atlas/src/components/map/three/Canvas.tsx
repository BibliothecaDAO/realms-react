import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const DynamicPlanet = dynamic(() => import('./Planet'), {
  ssr: false,
});

const ThreeGeo = dynamic(() => import('./ThreeGeo'), {
  ssr: false,
});

export const ThreeCanvas = () => {
  return (
    <Canvas>
      <DynamicPlanet />
      <OrbitControls makeDefault />
      <ThreeGeo />
    </Canvas>
  );
};
