import { PerspectiveCamera, OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

const RealmsGeo = dynamic(() => import('./Continents'), {
  ssr: false,
});

export const MapCanvas = () => {
  // const { nodes, materials } = useGLTF('./gltf/starter-scene.glb');
  const controls: any = useRef<any>();
  const camera: any = useRef<any>();

  return (
    <div className="h-full bg-yellow-scroll">
      <Canvas>
        <Suspense fallback={null}>
          <Stage shadows="accumulative">
            <RealmsGeo />
          </Stage>
        </Suspense>

        <PerspectiveCamera
          ref={camera}
          makeDefault
          position={[0, 0, 1]}
          fov={90}
          zoom={1.3}
        />
        <OrbitControls
          ref={controls}
          enabled={true}
          maxDistance={200}
          minDistance={10}
          enablePan={true}
          enableRotate={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
          }}
          touches={{
            ONE: THREE.TOUCH.DOLLY_PAN,
            TWO: THREE.TOUCH.ROTATE,
          }}
          dampingFactor={0.2}
          onChange={(a) => {
            // WIP: panning boundaries
            if (!a?.target?.target || !camera?.current?.position) return;
            const targetVector = a?.target?.target;
            const distance = camera.current.position.distanceTo(targetVector);
            console.log('distance', distance);
            const minPan = new THREE.Vector3(
              -50 * (200 / distance),
              -50 * (200 / distance),
              1
            );
            const maxPan = new THREE.Vector3(
              50 * (200 / distance),
              50 * (200 / distance),
              1
            );
            const _v = new THREE.Vector3();
            _v.copy(targetVector);
            targetVector.clamp(minPan, maxPan);
            _v.sub(targetVector);
            camera.current.position.sub(_v);
            camera.current.rotation.set(0, 0, 0);
          }}
        />
      </Canvas>
    </div>
  );
};
