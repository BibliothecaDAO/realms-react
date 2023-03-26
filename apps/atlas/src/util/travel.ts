/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Geodesy representation conversion functions                        (c) Chris Veness 2002-2020  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong.html                                                    */
/* www.movable-type.co.uk/scripts/js/geodesy/geodesy-library.html#dms                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* eslint-disable @typescript-eslint/naming-convention */

function toRadians(num: number) {
  return (num * Math.PI) / 180;
}

function toDegrees(num: number) {
  return (num * 180) / Math.PI;
}

export type Point = {
  latitude: number;
  longitude: number;
};

export function intermediatePointTo(
  origin: Point,
  dest: Point,
  fraction: number
) {
  const φ1 = toRadians(origin.latitude),
    λ1 = toRadians(origin.longitude);
  const φ2 = toRadians(dest.latitude),
    λ2 = toRadians(dest.longitude);

  // distance between points
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const A = Math.sin((1 - fraction) * δ) / Math.sin(δ);
  const B = Math.sin(fraction * δ) / Math.sin(δ);

  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ3 = Math.atan2(y, x);

  const latitude = toDegrees(φ3);
  const longitude = toDegrees(λ3);

  return { latitude, longitude };
}

export function getDeckGLTripLayerPath(
  origin: Point = { latitude: 0, longitude: 0 },
  destination: Point,
  startTime: number,
  endTime: number,
  numberOfPoints: number
) {
  const percentComplete = (Date.now() - startTime) / (endTime - startTime);
  const endPoint = intermediatePointTo(origin, destination, 1);

  const points: { coordinates: number[]; timestamp: number }[] = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const point = intermediatePointTo(origin, endPoint, i / numberOfPoints);
    points.push({
      coordinates: [point.longitude, point.latitude],
      timestamp: i,
    });
  }
  return {
    path: points.map((point) => point.coordinates),
    timestamps: points.map((point) => point.timestamp),
  };
}
