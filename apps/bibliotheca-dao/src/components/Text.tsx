import { Text3D } from '@react-three/drei';
import { defineArguments } from 'graphql/type/definition';
import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import lordsFont from '@/util/fontforlords.json';

/* export default function Text({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 1.5,
  color = '#000000',
  ...props
}) {
  const config = useMemo(
    () => ({
      size: 45,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    []
  );
  const mesh = useRef();
  useLayoutEffect(() => {
    const size = new THREE.Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox.getSize(size);
      mesh.current.position.x =
        hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
      mesh.current.position.y =
        vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    }
  }, [children]);
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <Text3D ref={mesh} font={lordsFont} {...config}>
        {children}
        <meshNormalMaterial color={'white'} />
      </Text3D>
    </group>
  );
}
*/
export default {};
