import { useFrame } from '@react-three/fiber';
import React, { useRef, useState, useMemo, Suspense } from 'react';
import type { MouseEventHandler } from 'react';
import type * as THREE from 'three';

interface ObjectProps {
  jsx: JSX.IntrinsicElements['mesh'];
  health: number;
  onClick?: MouseEventHandler;
}

export function Shield(props: ObjectProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const [time, setTime] = useState(1.0);
  // const render = (clock: any) => {
  //   const delta = clock.getDelta();
  //   setTime((time += delta * 5));
  // };
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  // useFrame(({ clock }) => render(clock));

  const KnotShaderMaterial = {
    uniforms: {
      time: { value: time * 5 },
    },
    vertexShader: `
    varying vec2 vUv;

    void main()
    {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }
    `,
    fragmentShader: `
			uniform float time;

			varying vec2 vUv;

			void main( void ) {

				vec2 position = vUv;

				float color = 0.0;
				color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
				color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
				color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
				color *= sin( time / 10.0 ) * 0.5;

				gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 0.1 );

			}
    `,
  };

  return (
    <mesh
      {...props.jsx}
      receiveShadow
      ref={mesh}
      scale={2.3}
      position={[0, 3, 0]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => {
        setHover(true);
        // playShield();
      }}
      onPointerOut={(event) => {
        setHover(false);
        // stop();
      }}
    >
      <sphereBufferGeometry />
      <shaderMaterial
        opacity={1}
        attach="material"
        transparent={true}
        args={[KnotShaderMaterial]}
      />
    </mesh>
  );
}
