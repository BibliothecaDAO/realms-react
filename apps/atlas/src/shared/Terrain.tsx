import { Plane, OrbitControls, Sky } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';

const Terrain = () => {
  const height = useLoader(THREE.TextureLoader, '/height_3197.png');
  const normals = useLoader(THREE.TextureLoader, '/NormalMap.png');
  const colors = useLoader(THREE.TextureLoader, '/color_3197.png');

  return (
    <group>
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        args={[64, 64, 1024, 1024]}
      >
        <meshStandardMaterial
          attach="material"
          color="white"
          map={colors}
          metalness={0.3}
          normalMap={normals}
          displacementMap={height}
        />
      </Plane>
    </group>
  );
};

export default function TerrainLayer() {
  return (
    <Canvas className="rounded-xl">
      <fog attach="fog" args={['white', 0, 80]} />
      <OrbitControls autoRotate />
      <pointLight intensity={2} position={[1, 20, 6]} />
      <Sky sunPosition={[2, 5, 1]} />
      <Suspense fallback={null}>
        <Terrain />
      </Suspense>
    </Canvas>
  );
}
