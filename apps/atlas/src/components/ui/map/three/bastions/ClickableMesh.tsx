import { useState, Children, cloneElement } from 'react';
import type { MeshStandardMaterial } from 'three';
import { Color } from 'three';

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
            ? child.props.userData.glowMaterial
            : child.props.material,
        });
      })}
    </group>
  );
};
