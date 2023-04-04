/* eslint-disable react/display-name */
/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stage, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useBastionStateContext } from '@/context/BastionContext';
import { KnightSoldiers } from './BastionArmies';
import { BastionModel } from './BastionModel';

export const BastionThreejs = () => {
  const { bastion } = useBastionStateContext();

  if (bastion) {
    return (
      <Canvas
        camera={{ position: [18, 20, 300], far: 5000 }}
        // mouse events on first element only so that not multiple elements get highlighted together when hovered
        onCreated={(state) => {
          state.setEvents({
            filter: (intersections) => {
              return intersections.length > 0
                ? [intersections[0]]
                : intersections;
            },
          });
        }}
      >
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <Stage
          intensity={0.2}
          environment={'dawn'}
          adjustCamera={false}
          shadows="accumulative"
        >
          <BastionModel></BastionModel>
          {/* <CycleRaycast
            onChanged={(objects, cycle) => console.log({ objects, cycle })}
          /> */}
          <KnightSoldiers></KnightSoldiers>
        </Stage>
        <OrbitControls
          minDistance={300}
          maxDistance={600}
          minPolarAngle={0}
          maxPolarAngle={1}
        />
      </Canvas>
    );
  }
};
