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
import { GameStatus } from "~/types";
import Sword from "../../../public/svg/sword.svg";
import Shield from "../../../public/svg/shield.svg";
import Book from "../../../public/svg/book.svg";
import { EFFECT_BASE_FACTOR } from "~/util/minigameApi";
import BN from "bn.js";
import classNames from "classnames";

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

type ShieldVitalityDisplayProps = {
  shield?: BN;
  health?: BN;
  className?: string;
};

export const ShieldVitalityDisplayClassnames =
  "p-6 text-lg text-gray-700 bg-white/30 rounded-xl";

export const ShieldVitalityDisplay = (props: ShieldVitalityDisplayProps) => {
  return (
    <>
      <p
        className={classNames(
          "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l to-red-300 from-yellow-700",
          props.className
        )}
      >
        Shield
      </p>
      <p className="text-4xl">
        {props.shield
          ? (props.shield.toNumber() / EFFECT_BASE_FACTOR).toFixed(2)
          : "-"}
      </p>
      <p>
        City Vitality:{" "}
        {props.health
          ? (props.health.toNumber() / EFFECT_BASE_FACTOR).toFixed(2)
          : "-"}
      </p>
    </>
  );
};

export interface TowerProps {
  gameStatus?: GameStatus;
  gameIdx?: number;
  health?: BN;
  shield?: BN;
  currentBoostBips?: number;
  children?: React.ReactNode[] | React.ReactNode;
}

function TowerDefence(props: TowerProps) {
  const [rotate, setRotate] = useState(true);

  const { isSoundActive, toggleSound } = useSound();
  const tower = useRef<THREE.Group>(null!);
  const shield = useRef<THREE.Mesh>(null!);
  const [showShieldAction, setShowShieldAction] = useState(false);
  const [showShieldDetail, setShowShieldDetail] = useState(false);

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
          <group
            ref={shield}
            position={[0, 0, 0]}
            onPointerOver={(event) => {
              setRotate(false);
            }}
            onPointerOut={(event) => {
              setRotate(true);
            }}
          >
            <Box
              jsx={{
                position: [0, 0, 0],
              }}
              health={props.health?.toNumber() || 0}
            />
            {showShieldDetail && (
              <Html position={[0, 5, 0]}>
                <div className="flex w-auto">
                  <div className="flex w-56">
                    <button
                      className="w-12 h-12 mr-4 text-gray-700 border rounded-full bg-white/30 hover:bg-white fill-white hover:fill-blue-300"
                      onClick={() => {
                        setShowShieldAction(true);
                      }}
                    >
                      <Book className="w-8 h-8 mx-auto " />
                    </button>
                    <button
                      className="w-12 h-12 mr-4 text-gray-700 border rounded-full bg-white/30 hover:bg-white fill-white hover:fill-blue-300"
                      onClick={() => {
                        setShowShieldAction(true);
                      }}
                    >
                      <Sword className="w-8 h-8 mx-auto" />
                    </button>
                    <button
                      className="w-12 h-12 mr-4 text-gray-700 border rounded-full bg-white/30 hover:bg-white fill-white hover:fill-blue-300"
                      onClick={() => {
                        setShowShieldAction(true);
                      }}
                    >
                      <Shield className="w-8 h-8 mx-auto " />
                    </button>
                  </div>
                  {/* {showShieldAction && (
                    <ShieldAction
                      gameStatus={props.gameStatus}
                      gameIdx={props.gameIdx}
                      currentBoostBips={props.currentBoostBips}
                    />
                  )} */}
                </div>
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
            {/*!rotate ? (
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
            ) : null*/}
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
            {props.gameStatus == "active" ? (
              <Html
                position={[-4.5, -0.3, 2]}
                className={classNames("w-56", ShieldVitalityDisplayClassnames)}
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
          azimuth={0.2}
          turbidity={10}
          rayleigh={0.5}
          inclination={0.7}
          distance={1000}
        />
      </Canvas>
      {props.children ? props.children : null}
    </div>
  );
}

export default TowerDefence;
