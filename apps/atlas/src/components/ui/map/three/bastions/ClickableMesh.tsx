import { Billboard, useCursor } from '@react-three/drei';
import { LayerMaterial, Depth } from 'lamina';
import { useState, Children, cloneElement } from 'react';
import type { MeshStandardMaterial } from 'three';
import {
  AddEquation,
  Color,
  CustomBlending,
  DstAlphaFactor,
  SrcAlphaFactor,
} from 'three';

export const Glow = ({
  color,
  geometry,
  position,
  scale = 0.5,
  near = -2,
  far = 1.4,
}) => (
  <Billboard>
    <mesh geometry={geometry} position={position}>
      {/* <circleGeometry args={[2 * scale, 16]} /> */}
      <boxBufferGeometry args={[2 * scale, 16]} geometry={geometry} />
      <LayerMaterial
        transparent
        depthWrite={false}
        blending={CustomBlending}
        blendEquation={AddEquation}
        blendSrc={SrcAlphaFactor}
        blendDst={DstAlphaFactor}
      >
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="normal"
          near={near * scale}
          far={far * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={0.5}
          mode="add"
          near={-40 * scale}
          far={far * 1.2 * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="add"
          near={-15 * scale}
          far={far * 0.7 * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="add"
          near={-10 * scale}
          far={far * 0.68 * scale}
          origin={[0, 0, 0]}
        />
      </LayerMaterial>
    </mesh>
  </Billboard>
);

export const cloneMaterialWithBlueTint = (material: MeshStandardMaterial) => {
  const tintedMaterial = material.clone();
  tintedMaterial.emissive = new Color('#0a2357');
  tintedMaterial.emissiveIntensity = 10;

  return tintedMaterial;
};

export const ClickableMesh = ({ children }) => {
  const [hoveredLocation, setHoveredLocation] = useState<boolean>(false);
  return (
    <group
      onPointerEnter={() => setHoveredLocation(true)}
      onPointerLeave={() => {
        setHoveredLocation(false);
      }}
    >
      {Children.map(children, (child) => {
        return cloneElement(child, {
          material: hoveredLocation
            ? child.props.glowMaterial
            : child.props.material,
        });
      })}
    </group>
  );
};
