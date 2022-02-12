import * as THREE from "three";
import React, { useRef, useState, useCallback, MouseEventHandler } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Cloud,
  Stars,
  Sky,
  Html,
  Text,
  Billboard,
} from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSound } from "~/context/soundProvider";
import VolumeIcon from "../../public/svg/volume-2.svg";
import VolumeMuteIcon from "../../public/svg/volume-x.svg";
import Zap from "../../public/svg/zap.svg";
import Clock from "../../public/svg/clock.svg";
import Settings from "../../public/svg/settings.svg";
import { ElementToken } from "~/constants";
import ShieldAction from "./minigame/ShieldAction";
import { TowerProps } from "~/types";
import { useUIContext } from "~/hooks/useUIContext";
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
      position={[0, 2, 0]}
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
      <shaderMaterial
        opacity={0.2}
        attach="material"
        transparent={true}
        args={[KnotShaderMaterial]}
      />
    </mesh>
  );
}

function TowerDefence(props: TowerProps) {
  const { volume, toggleVolume } = useUIContext();
  const [health, setHealth] = useState(100);
  const [rotate, setRotate] = useState(true);

  const { isSoundActive, toggleSound } = useSound();
  const tower = useRef<THREE.Group>(null!);
  const shield = useRef<THREE.Mesh>(null!);
  const [showShieldAction, setShowShieldAction] = useState(false);
  const [showShieldDetail, setShowShieldDetail] = useState(false);

  const [shieldValue] = useState<Record<ElementToken, string> | undefined>();
  const handleClick = useCallback(() => {
    toggleSound();
  }, [toggleSound]);

  return (
    <div className="h-screen z-1">
      <Canvas linear shadows camera={{ position: [3, 4, 10] }}>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[100, 100, 100]} />
          <directionalLight args={[0xf4e99b, 10]} />
          <group ref={shield} position={[0, 0, 0]}>
            <Box
              jsx={{
                position: [0, 0, 0],
                onDoubleClick: () => {
                  setHealth(health - 10);
                  setShowShieldDetail(true);
                },
              }}
              health={health}
            />
            {showShieldDetail && (
              <Html position={[-2.3, 3.5, 0]} className="w-auto">
                <button
                  className="border-red border px-4 py-2 bg-white/30 w-48 rounded-xl text-gray-700 hover:bg-white"
                  onClick={() => {
                    setShowShieldAction(true);
                  }}
                >
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-l to-red-300 from-yellow-300 ">
                    Attack Shield
                  </span>
                </button>
                {showShieldAction && (
                  <ShieldAction
                    gameStatus={props.gameStatus}
                    gameIdx={props.gameIdx}
                    currentBoostBips={props.currentBoostBips}
                  />
                )}
              </Html>
            )}
          </group>

          <OrbitControls autoRotate={rotate} />
          <Cloud position={[-4, -2, -25]} speed={0.2} opacity={1} />
          {/* Hide until opacity over tower issue solved
           <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, -2, 25]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, 10]} speed={0.2} opacity={0.75} /> */}
          <group ref={tower}>
            {!rotate ? (
              <Text
                color={""}
                fillOpacity={0}
                strokeWidth={"2.5%"}
                strokeColor="#9333ea"
                maxWidth={4}
                anchorX="left"
                anchorY="top"
                position={[-1.5, 4.75, 0]}
                fontSize={0.4}
              >
                THE DIVINE CITY
              </Text>
            ) : null}
            <Tower
              position={[0, 1, 0]}
              onPointerOver={(event) => {
                setRotate(false);
              }}
              receiveShadow
              onPointerOut={(event) => {
                setRotate(true);
              }}
            />
            <Html
              position={[-4.5, -0.3, 2]}
              className="text-lg p-6 bg-white/30 w-56 rounded-xl text-gray-700"
              occlude={[tower, shield]}
            >
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l to-red-300 from-yellow-700">
                Shield Health
              </p>
              <p className="text-4xl">{health?.toFixed(2)} </p>
              {/* <p>
                Dark Shield:{" "}
                {shieldValue ? shieldValue[ElementToken.Dark].toString() : "-"}
              </p>
              <p>
                Light Shield:{" "}
                {shieldValue ? shieldValue[ElementToken.Light].toString() : "-"}
              </p> */}
            </Html>
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
          azimuth={0.2}
          turbidity={10}
          rayleigh={0.5}
          inclination={0.7}
          distance={1000}
        />
      </Canvas>
      <div className="w-full  absolute bottom-2 ">
        <div className="w-96 h-12 rounded-2xl backdrop-blur-md bg-white/40 mx-auto flex justify-around px-4 align-middle">
          <button
            className="mute-btn  self-center hover:text-blue-700"
            onClick={handleClick}
          >
            <Clock className="w-8 " />
          </button>
          <button
            className="mute-btn  self-center hover:text-blue-700"
            onClick={handleClick}
          >
            <Settings className="w-8" />
          </button>
          <button
            className="mute-btn  self-center hover:text-blue-700"
            onClick={toggleVolume}
          >
            <Zap className="w-8" />
          </button>
          <button className="mute-btn " onClick={handleClick}>
            {!isSoundActive ? (
              <VolumeMuteIcon className="w-8 hover:text-blue-700" />
            ) : (
              <VolumeIcon className="w-8 hover:text-blue-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TowerDefence;
