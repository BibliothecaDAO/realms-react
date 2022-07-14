import { Sky, Environment } from '@react-three/drei';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Text from '@/components/Text';

/* function Jumbo() {
  const ref = useRef();
  useFrame(
    ({ clock }) =>
      (ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z =
          Math.sin(clock.getElapsedTime()) * 0.2)
  );
  return (
    <group ref={ref}>
      <Text hAlign="right" position={[-15, 7.5, 0]} children="Bibliotheca" />
      <Text hAlign="right" position={[0, 0, 0]} children="DAO" />
    </group>
  );
}

function MobiusStrip() {
  const count = 256;
  const radius = 1.1;

  const mesh = useRef();

  const strips = [{ a: 0 }];
  for (let i = 0; i < count; i++) {
    const newStrip = {
      a: (Math.PI / count) * 2 * i,
    };
    strips.push(newStrip);
    /*o.lookAt(scene.position); */
/* }
  return (
    <scene name="Mobius">
      <mesh
        ref={mesh}
        scale={[0.03, 0.3, 0.001]}
        name="Object_0"
        position={(Math.cos(1), Math.sin(2 * 5) / 30, Math.sin(3))}
        rotation={[1 / 2, 0, 0]}
        castShadow={true}
      >
        <boxGeometry />
        <meshPhongMaterial
          color={new THREE.Color(`hsl(${(1 * 360) / Math.PI},55%,55%)`)}
        />
      </mesh>
      ;
    </scene>
  );
}

export default function MobiusModel() {
  return (
    <Canvas camera={{ position: [0, 0, 35] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <Suspense fallback={null}>
        <MobiusStrip />
      </Suspense>
    </Canvas>
  );
} */
export default {};
