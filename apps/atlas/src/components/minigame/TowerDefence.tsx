import { OrbitControls, Cloud, Stars, Sky, Html } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import type BN from 'bn.js';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import React, { useRef, useState, useMemo, Suspense } from 'react';
import type * as THREE from 'three';
import { Vector3 } from 'three';
import type { GameStatus } from '@/types/index';
import { Shield } from './three/Shield';
import {
  ShieldVitalityDisplay,
  ShieldVitalityDisplayClassnames,
} from './TowerShieldVitality';
const Tower = dynamic(() => import('@/components/minigame/three/DivineCity'), {
  ssr: false,
});

export interface TowerProps {
  gameStatus?: GameStatus;
  gameIdx?: number;
  health?: BN;
  shield?: BN;
}

const origin: { position?: Vector3 } = {
  position: new Vector3(0, 0, 0),
};

function TowerDefence(props: TowerProps) {
  const [rotate, setRotate] = useState(true);
  const tower = useRef<THREE.Group>(null!);
  const shield = useRef<THREE.Mesh>(null!);

  const h = useMemo<number>(() => {
    return props.health?.toNumber() || 0;
  }, [props.health]);
  return (
    <div className="absolute top-0 w-full h-screen z-1">
      <Canvas linear shadows camera={{ position: [3, 4, 10] }}>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[100, 100, 100]} />
          <directionalLight args={[0xf4e99b, 10]} />
          <group
            ref={shield}
            position={[0, 0, 0]}
            onPointerOver={() => {
              setRotate(false);
            }}
            onPointerOut={() => {
              setRotate(true);
            }}
          >
            {h > 0 ? <Shield jsx={origin} health={h} /> : ''}
          </group>
          <OrbitControls
            autoRotate={true}
            enablePan={false}
            minZoom={90}
            maxZoom={80}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minPolarAngle={0}
          />
          <Cloud position={[-4, -2, -25]} speed={0.8} opacity={1} />
          <group ref={tower}>
            <Tower
              position={[0, 1, 0]}
              onPointerOver={() => {
                setRotate(false);
              }}
              receiveShadow
              onPointerOut={() => {
                setRotate(true);
              }}
            />
            {props.gameStatus == 'active' ? (
              <Html
                position={[-4.5, -0.3, 2]}
                className={classNames('w-56', ShieldVitalityDisplayClassnames)}
                occlude={[tower, shield]}
                zIndexRange={[4, 0]}
              >
                <ShieldVitalityDisplay
                  health={props.health}
                  shield={props.shield}
                />
              </Html>
            ) : null}
          </group>
        </Suspense>

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <Sky
          azimuth={0.3}
          turbidity={2}
          rayleigh={0.3}
          inclination={0.8}
          distance={1000}
        />
      </Canvas>
    </div>
  );
}

// Wrap in React.memo so the same valued props
// don't cause a re-render
export default React.memo(TowerDefence);
