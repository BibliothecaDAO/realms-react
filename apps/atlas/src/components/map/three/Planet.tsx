import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { Fragment, useRef, useState } from 'react';
import * as THREE from 'three';
import { GeoJsonGeometry } from 'three-geojson-geometry';

import order_highlights from '@/geodata/order_highlights.json';

// export const Planet = () => {
//   const materialRef = useRef<any>();

//   //   useFrame((state) => {
//   //     const { clock } = state;
//   //     materialRef.current.time = clock.getElapsedTime();
//   //   });

//   return (
//     <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.5}>
//       {/* <ThreeGeo /> */}
//       <ambientLight />
//       {/* <pointLight position={[10, 10, 10]} /> */}
//       <icosahedronGeometry args={[2, 11]} />
//       <LayerMaterial lighting="lambert">
//         {/* First layer is our own custom layer that's based of the FBM shader */}
//         {/*
//             Notice how we can use *any* uniforms as prop here 👇
//             You can tweak the colors by adding a colorA or colorB prop!
//           */}
//         {/* <customLayer ref={materialRef} time={0.0} lacunarity={2.3} /> */}
//         {/* Second layer is a depth based gradient that we "add" on top of our custom layer*/}
//         {/* <Depth colorA="blue" colorB="aqua" alpha={0.2} mode="add" /> */}
//         {/* Third Layer is a Fresnel shading effect that we add on*/}
//         {/* <Fresnel color="#fffsd" mode="add" /> */}
//       </LayerMaterial>
//     </mesh>
//   );
// };

// export default function ThreeGeo() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [geoJson, setGeoJson] = useState(null);

//   return (
//     <Fragment>
//       {!isLoading ? (
//         <Fragment>
//           {order_highlights.features.map(({ geometry }, index) => {
//             return (
//               <lineSegments
//                 key={index}
//                 geometry={new GeoJsonGeometry(geometry, 100)}
//               >
//                 <lineBasicMaterial color="#464646" />
//               </lineSegments>
//             );
//           })}
//         </Fragment>
//       ) : null}
//     </Fragment>
//   );
// }
