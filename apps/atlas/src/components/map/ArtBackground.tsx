import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { useUIContext } from '@/hooks/useUIContext';

export const ArtBackground = () => {
  const { artBackground } = useUIContext();

  const opacityAnimation = useSpring({
    zIndex: artBackground ? 10 : 0,
    opacity: artBackground ? 1 : 0,
    config: { duration: 600 },
    immediate: (key) => key === 'zIndex',
  });

  return (
    <animated.div
      className="absolute top-0 w-full w-screen h-screen bg-white bg-center bg-cover bg-hero "
      style={opacityAnimation}
    ></animated.div>
  );
};
