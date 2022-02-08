import * as THREE from "three";
import ReactDOM from "react-dom";
import React, { useRef, useState, useCallback, MouseEventHandler } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture, Cloud, Sky } from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../public/svg/volume-up-solid.svg"
import VolumeMuteIcon from "../public/svg/volume-mute-solid.svg"

const Tower = dynamic(() => import("~/components/Model"), {
  ssr: false,
});

interface ObjectProps {
  jsx: JSX.IntrinsicElements["mesh"];
  health: Number;
  onClick?: MouseEventHandler;
}
function Box(props: ObjectProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { playShield } = useSound();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  let [time, setTime] = useState(1.0);
  const render = (clock) => {
    const delta = clock.getDelta();
    setTime((time += delta * 5));
  };
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  useFrame(({ clock }) => render(clock));

  const KnotShaderMaterial = {
    uniforms: {
      time: { value: time * 40 },
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
      color += sin( position.x * cos( 2.0 / 15.0 ) * 10.0 ) + cos( position.y * cos( time / 15.0 ) * 100.0 * time );
      color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 * time);
      color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 * time);
      color *= sin( time / 10.0 ) * 0.5;

      gl_FragColor = vec4( vec3( color, color * time, sin( color + time / 1.0 ) * 0.25 ), 0.1 );

    }
    `,
  };

  return (
    <mesh
      {...props.jsx}
      receiveShadow
      ref={mesh}
      scale={2.69}
      position={[0, 1, 0]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => {
        setHover(true);
        playShield();
      }}
      onPointerOut={(event) => {
        setHover(false);
        stop();
      }}
    >
      <sphereBufferGeometry />
      {/* <meshStandardMaterial
        color={`rgb(${props.health},${props.health},${props.health})`}
        opacity={0.5}
        transparent
      /> */}
      <shaderMaterial
        opacity={0.2}
        attach="material"
        transparent={true}
        args={[KnotShaderMaterial]}
      />
    </mesh>
  );
}

function Scene() {
  const [health, setHealth] = useState(100);
  const { isSoundActive, toggleSound } = useSound();

  const handleClick = useCallback(() => {
    toggleSound();
    console.log(isSoundActive)
  }, [toggleSound, isSoundActive]);

  const targetObject = new THREE.Object3D();
  targetObject.position.set(20, 0, 0);

  return (
    <div className="h-screen bg-gradient-to-b from-sky-400 to-sky-200">
      <div className="top-10 right-10 bg-black h-auto w-96 absolute z-10 rounded-xl p-6 ">
        <h1>Give Energy to the Shield - {health}</h1>
        <button
          onClick={() => setHealth(health + 10)}
          className="bg-white px-4 rounded py-2 text-black mt-4"
        >
          Health Tower
        </button>
        <h1 className="mt-8">Double Click the Shield to attack</h1>
      </div>
      <Canvas linear shadows camera={{ position: [3, 2, -3] }}>
        <Suspense fallback={null}>
          <ambientLight
            color={0x404040}
            intensity={2}
          />
          <Cloud position={[-4, -2, -25]} speed={0.2} opacity={1} />
          <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, -2, 25]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, 10]} speed={0.2} opacity={0.75} />
          {/* <pointLight position={[100, 100, 100]} /> */}
          <directionalLight
            color={0xF4E99B}
            intensity={5}
            position={[-10, 13, 0]}
            castShadow
          />
          <Box
            jsx={{
              position: [0, 0, 0],
              onDoubleClick: () => setHealth(health - 10),
            }}
            health={health}
          />
          <OrbitControls autoRotate />
          <Tower />
        </Suspense>
        <Sky
          azimuth={0.2}
          turbidity={2.3}
          rayleigh={0.165}
          inclination={0.7}
          distance={1000}
        />
      </Canvas>
      <button className="mute-btn absolute bottom-1 right-1 " onClick={handleClick}>

        {!isSoundActive ? (
          <VolumeMuteIcon className="2-8 h-8" />
        ) : (
          <VolumeIcon className="2-8 h-8" />
        )}
      </button>
    </div>
  );
}

export default Scene;
