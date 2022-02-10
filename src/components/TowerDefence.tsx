import * as THREE from "three";
import React, { useRef, useState, useCallback, MouseEventHandler } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture, Cloud, Stars, Sky, Html, Text, Billboard } from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../../public/svg/volume-up-solid.svg"
import VolumeMuteIcon from "../../public/svg/volume-mute-solid.svg"
import { ElementToken } from "~/constants";

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
  const render = (clock: any) => {
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

function TowerDefence() {
  const [health, setHealth] = useState(100);
  const [rotate, setRotate] = useState(true);

  const { isSoundActive, toggleSound } = useSound();
  const tower = useRef<THREE.Group>(null!);
  const shield = useRef<THREE.Mesh>(null!);

  const [shieldValue] = useState<
    Record<ElementToken, string> | undefined
  >();
  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  return (
    <div className="h-screen bg-gradient-to-b from-sky-400 to-sky-200 z-1">
      {/* <div className="top-10 right-10 bg-black h-auto w-96 absolute z-10 rounded-xl p-6 ">
        <h1>Give Energy to the sheild - {health}</h1>
        <button
          onClick={() => setHealth(health + 10)}
          className="bg-white px-4 rounded py-2 text-black mt-4"
        >
          Health Tower
        </button>
        <h1 className="mt-8">Double Click the Sheild to attack</h1>
      </div> */}
      <Canvas linear shadows camera={{ position: [3, 4, 10] }}>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[100, 100, 100]} />
          <directionalLight args={[0xF4E99B, 10]} />
          <group ref={shield}>

            <Box
              jsx={{
                position: [0, 0, 0],
                onDoubleClick: () => setHealth(health - 10),
              }}
              health={health}
            />
          </group>

          <OrbitControls autoRotate={rotate} />
          <Cloud position={[-4, -2, -25]} speed={0.2} opacity={1} />
          {/* Hide until opacity over tower issue solved
           <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, -2, 25]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, 10]} speed={0.2} opacity={0.75} /> */}
          <group ref={tower}>
            {!rotate ? (
              <Text color={''} fillOpacity={0}
                strokeWidth={'2.5%'}
                strokeColor="#9333ea"
                maxWidth={4}
                anchorX="left" anchorY="top" position={[-1.5, 4.75, 0]} fontSize={0.4}>
                THE DIVINE CITY
              </Text>
            ) : (null)}
            <Tower
              onPointerOver={(event) => {
                setRotate(false);
              }}
              receiveShadow
              onPointerOut={(event) => {
                setRotate(true);
              }}
            />
            <Html position={[-4.5, -0.5, 2]}
              className="text-lg px-4 py-2 bg-white/30 w-44 rounded-xl text-gray-700"
              occlude={[tower, shield]}
            >

              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l to-red-300 from-yellow-300">Fortress</p>
              <p>Vitality: {health?.toFixed(2)} </p>
              <p>Dark Shield: {shieldValue ? shieldValue[ElementToken.Dark].toString() : "-"}</p>
              <p>Light Shield: {shieldValue ? shieldValue[ElementToken.Light].toString() : "-"}</p>
            </Html>
          </group>
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <Sky
          azimuth={0.2}
          turbidity={10}
          rayleigh={0.5}
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
    </div >
  );
}

export default TowerDefence;
