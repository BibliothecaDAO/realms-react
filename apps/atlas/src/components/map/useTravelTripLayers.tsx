import { TripsLayer } from '@deck.gl/geo-layers';
import { useEffect, useMemo, useState } from 'react';
import { useGetTravelsQuery } from '@/generated/graphql';
import { getDeckGLTripLayerPath } from '@/util/travel';
import type { Point } from '@/util/travel';

export function useTravelTripsLayer() {
  const [variables, setVariables] = useState({
    where: { destinationArrivalTime: { gt: Date.now() } },
  });
  const { data: travels } = useGetTravelsQuery({ variables });

  useEffect(() => {
    const timer = setInterval(() => {
      setVariables({ where: { destinationArrivalTime: { gt: Date.now() } } });
    }, 30 * 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // Increase length to slow down
  const loopLength = 1000;
  const animationSpeed = 1;
  const [time, setTime] = useState(0);
  const [animation] = useState<any>({});
  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const travelData = useMemo(() => {
    return travels?.payload
      ? travels?.payload
          .filter(
            (travel) =>
              travel.endTime > travel.startTime &&
              // TODO: fix null realm when bastions but need to find better way
              travel.originRealm &&
              travel.destinationRealm
          )
          .map((travel) =>
            getDeckGLTripLayerPath(
              travel.locationRealm as Point,
              travel.destinationRealm as Point,
              travel.startTime,
              travel.endTime,
              loopLength
            )
          )
      : [];
  }, [travels]);

  const tripsLayer = new TripsLayer({
    id: 'trips',
    data: travelData,
    getPath: (d: any) => d.path,
    getTimestamps: (d: any) => d.timestamps,
    getColor: [200, 20, 60],
    opacity: 0.8,
    widthMinPixels: 5,
    fadeTrail: true,
    trailLength: 1000,
    currentTime: time,
    pickable: true,
    onHover: (info: any) => {
      console.log(info);
    },
  });
  return { tripsLayer };
}
