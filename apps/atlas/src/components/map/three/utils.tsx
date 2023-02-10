import { Vector3, BufferAttribute, BufferGeometry } from 'three';

export function latLonToVector3(lat, lon, radius = 1, dimension = 3) {
  if (dimension === 3) {
    const phi = (lat * Math.PI) / 180;
    const theta = ((360 - lon) * Math.PI) / 180;
    return new Vector3(
      radius * Math.cos(phi) * Math.cos(theta),
      radius * Math.sin(phi),
      radius * Math.cos(phi) * Math.sin(theta)
    );
  } else {
    return new Vector3((radius * lon) / 180, (radius * lat) / 180, 0);
  }
}

export function prepare(
  { vertices: v, triangles: t, polygons },
  radius,
  thickness,
  dimension,
  genFaceSide
) {
  let triangles = [...t];
  const vertices: any = [];
  for (let i = 0; i < v.length; i += 2) {
    const lon = v[i];
    const lat = v[i + 1];
    const vec3 = latLonToVector3(lat, lon, radius, dimension);
    vertices.push(vec3);
  }
  if (thickness > 0) {
    const vecLen = vertices.length;
    vertices.forEach((v: any) => {
      let topVec: any = v.clone();
      if (dimension === 3) {
        topVec = topVec.multiplyScalar(1 + thickness);
      } else {
        topVec.z += thickness;
      }
      vertices.push(topVec);
    });

    const top = triangles.map((x) => x + vecLen);
    if (!genFaceSide.bottom) triangles = [];
    if (genFaceSide.top) triangles.push(...top);
    if (genFaceSide.side) {
      polygons.forEach((polyWithHoles) => {
        polyWithHoles.forEach((p, pIdx) => {
          for (let idx = 0; idx <= p.length - 2; idx++) {
            const a = p[idx];
            const b = p[(idx + 1) % p.length];
            if (pIdx === 0) {
              // polygon
              triangles.push(a, b, a + vecLen);
              triangles.push(b + vecLen, a + vecLen, b);
            } else {
              // hole
              triangles.push(b, a, a + vecLen);
            }
          }
        });
      });
    }
  }

  return { vertices, triangles, polygons };
}

export function geoPlaneGeometry(
  triJson,
  radius = 1,
  thickness = 0,
  dimension = 3,
  genFaceSide = { top: true, side: true, bottom: false }
) {
  const { triangles, vertices } = prepare(
    triJson,
    radius,
    thickness,
    dimension,
    genFaceSide
  );
  const g = new BufferGeometry();
  g.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array(
        vertices.reduce((arr: any, x: any) => {
          arr.push(x.x, x.y, x.z);
          return arr;
        }, [])
      ),
      3
    )
  );
  g.setIndex(triangles);
  g.computeVertexNormals();
  return g;
}

export function geoContourGeomtry(
  triJson,
  radius = 1,
  thickness = 0,
  dimension = 3,
  genFaceSide = { top: true }
) {
  const { polygons, vertices } = prepare(
    triJson,
    radius,
    thickness,
    dimension,
    genFaceSide
  );
  const vertLenHalf = vertices.length / 2;
  const segments = polygons.reduce(
    (obj, lines) => {
      lines.forEach((pts) => {
        const shift = thickness > 0 ? vertLenHalf : 0;
        pts.forEach((idx, i) => {
          obj.vertices.push(vertices[idx + shift]);
          if (i > 0) {
            obj.indices.push(obj.vertices.length - 2, obj.vertices.length - 1);
          }
        });
      });
      return obj;
    },
    { vertices: [], indices: [] }
  );
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array(
        segments.vertices.reduce((arr, x) => {
          arr.push(x.x, x.y, x.z);
          return arr;
        }, [])
      ),
      3
    )
  );
  geometry.setIndex(new BufferAttribute(new Uint16Array(segments.indices), 1));

  return geometry;
}
