import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Planet } from './Planet';

export const ThreeCanvas = () => {
  return (
    <Canvas>
      {/* <Planet /> */}
      <OrbitControls makeDefault />
    </Canvas>
  );
};
