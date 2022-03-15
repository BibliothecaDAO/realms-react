import { animated, useTransition } from '@react-spring/web';
import { useState } from 'react';
import { useUIContext } from '@/hooks/useUIContext';

export const ArtBackground = () => {
  const { artBackground } = useUIContext();

  const transitions = useTransition(artBackground, {
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div
          className="absolute top-0 z-40 w-full w-screen h-screen bg-center bg-cover bg-hero"
          style={styles}
        ></animated.div>
      )
  );
};
