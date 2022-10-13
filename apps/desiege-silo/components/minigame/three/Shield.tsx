/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import type * as THREE from 'three';
import { useBattleContext } from '@/hooks/desiege/useBattleContext';

export function Shield(props) {
  const mesh = useRef<THREE.ShaderMaterial>(null);

  const battle = useBattleContext();

  const KnotShaderMaterial = {
    uniforms: {
      time: { value: 0 },
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

  useFrame(({ clock }) => {
    if (mesh.current && battle.isLightShielding) {
      mesh.current.uniforms.time.value = clock.oldTime * 0.001;
    }
  });

  return (
    <mesh {...props.jsx} receiveShadow scale={2.3} position={[0, 1.3, 0]}>
      <sphereBufferGeometry />
      <shaderMaterial
        ref={mesh}
        visible={props.health > 0 || battle.isLightShielding}
        attach="material"
        transparent={true}
        args={[KnotShaderMaterial]}
      />
    </mesh>
  );
}
