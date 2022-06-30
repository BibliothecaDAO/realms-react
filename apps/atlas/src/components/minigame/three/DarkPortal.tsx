import {
  Torus,
  MeshWobbleMaterial,
  Circle,
  MeshReflectorMaterial,
  SpotLight,
} from '@react-three/drei';
import { useBattleContext } from '@/hooks/desiege/useBattleContext';

const DarkPortal = () => {
  const battle = useBattleContext();

  return (
    <>
      <Torus
        args={[1, 0.1, 8, 60]}
        position={[0, 5, -1.5]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <MeshWobbleMaterial
          attach="material"
          color="#003"
          factor={0.18} // Strength, 0 disables the effect (default=1)
          speed={3} // Speed (default=1)
        />
      </Torus>
      <Circle
        args={[1, 30, undefined, Math.PI * 2]}
        position={[0, 5, -1.5]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <MeshReflectorMaterial
          roughness={0.5}
          mirror={0.8}
          metalness={0.5}
          color="pink"
        />
      </Circle>
      <SpotLight
        opacity={battle.isDarkAttacking ? 1 : 0}
        penumbra={5}
        position={[0, 5, -1.5]}
        distance={5}
        color={'#033'}
        angle={0.25}
        attenuation={25}
        anglePower={6}
      />
    </>
  );
};

export default DarkPortal;
