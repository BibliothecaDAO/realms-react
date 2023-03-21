import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import seedrandom from 'seedrandom';
import { useBastionContext } from '@/context/BastionContext';

// @dev coordinates of defender and attacker are list of positions
// @dev when choosing a location for the soldier, first the position is chosen at random in the list of position.
// @dev Then starting from that position, another position is chosen at random in the radius minDistance/maxDistance
const defenderCoordinates = {
  1: [
    [13, 41, -115],
    [-13, 41, -115],
  ],
  2: [
    [115, 41, 13],
    [115, 41, -13],
  ],
  3: [
    [13, 41, 115],
    [-13, 41, 115],
  ],
  4: [
    [-115, 41, 13],
    [-115, 41, -13],
  ],
  5: [[0, 47, 0]],
};

const attackerCoordinates = {
  1: [[0, 17, -165]],
  2: [[165, 17, 0]],
  3: [[0, 17, 165]],
  4: [[-165, 17, 0]],
  5: [
    [-37, 47, 0],
    [37, 47, 0],
    [0, 47, -37],
    [0, 47, 37],
  ],
};

const armiesAreas = {
  1: {
    attacker: {
      positions: attackerCoordinates[1],
      rotation: [0, 0, 0],
      maxDistance: 20,
      minDistance: 0,
    },
    defender: {
      positions: defenderCoordinates[1],
      rotation: [0, 0, 0],
      maxDistance: 5,
      minDistance: 0,
    },
  },
  2: {
    attacker: {
      positions: attackerCoordinates[2],
      rotation: [0, -Math.PI / 2, 0],
      maxDistance: 20,
      minDistance: 0,
    },
    defender: {
      positions: defenderCoordinates[2],
      rotation: [0, -Math.PI / 2, 0],
      maxDistance: 5,
      minDistance: 0,
    },
  },
  3: {
    attacker: {
      positions: attackerCoordinates[3],
      rotation: [0, Math.PI, 0],
      maxDistance: 20,
      minDistance: 0,
    },
    defender: {
      positions: defenderCoordinates[3],
      rotation: [0, Math.PI, 0],
      maxDistance: 5,
      minDistance: 0,
    },
  },
  4: {
    attacker: {
      positions: attackerCoordinates[4],
      rotation: [0, Math.PI / 2, 0],
      maxDistance: 20,
      minDistance: 1,
    },
    defender: {
      positions: defenderCoordinates[4],
      rotation: [0, Math.PI / 2, 0],
      maxDistance: 5,
      minDistance: 0,
    },
  },
  5: {
    attacker: {
      positions: attackerCoordinates[5],
      rotation: [0, Math.PI / 2, 0],
      maxDistance: 8,
      minDistance: 0,
    },
    defender: {
      positions: defenderCoordinates[5],
      rotation: [0, Math.PI / 2, 0],
      maxDistance: 8,
      minDistance: 0,
    },
  },
};

export function KnightSoldier(props) {
  const { scene } = useGLTF('models/unit.glb');
  const copiedScene = useMemo(() => scene.clone(), [scene]);
  // TODOBASTIONS: need to cast shadow on the bastion
  return <primitive object={copiedScene} {...props} />;
}

export const KnightSoldiers = () => {
  const {
    bastionContext: { bastion },
  } = useBastionContext();

  const armies: JSX.Element[] = [];
  if (bastion) {
    bastion.locations.forEach((location, index) => {
      if (armiesAreas[index]) {
        location.armies.forEach((army, index) => {
          const role =
            army.orderId == location.defendingOrderId ? 'defender' : 'attacker';
          armies.push(
            <KnightSoldier
              scale={1}
              rotation={armiesAreas[location.locationId][role].rotation}
              key={
                army.realmId.toString() +
                army.armyId.toString() +
                index.toString() +
                location.locationId.toString()
              }
              position={randomPointAroundPosition(
                army.realmId + army.armyId,
                armiesAreas[location.locationId][role].positions,
                armiesAreas[location.locationId][role].minDistance,
                armiesAreas[location.locationId][role].maxDistance
              )}
            ></KnightSoldier>
          );
          // }
        });
      }
    });
  }
  return <group>{armies}</group>;
};

// @dev The random point for the army is chosen using a seed so that it stays the same every time.
function randomPointAroundPosition(
  seed: number,
  positions: [x: number, y: number, z: number][],
  minRadius: number,
  maxRadius: number
): [x: number, y: number, z: number] {
  // Create a seeded random number generator
  const rng = seedrandom(seed.toString());

  let position: [x: number, y: number, z: number];
  if (positions.length > 0) {
    const index = seed % positions.length;
    position = positions[index];
  } else {
    position = positions[0];
  }

  // Generate a random angle between 0 and 2π using the seeded random number generator
  const angle = rng() * Math.PI * 2;

  // Generate a random distance between the minimum and maximum radii using the seeded random number generator
  const distance = minRadius + rng() * (maxRadius - minRadius);

  // Calculate the X and Z coordinates of the point based on the angle and distance
  const x = position[0] + distance * Math.cos(angle);
  const z = position[2] + distance * Math.sin(angle);

  // Return the random point with the Y coordinate equal to the original position's Y coordinate
  return [x, position[1], z];
}
