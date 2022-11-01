'use client';
import { animated, useSpring } from '@react-spring/web';

export type BackgroundOptions =
  | 'hero'
  | 'realm'
  | 'bank'
  | 'crypt'
  | 'lore'
  | 'warRoom'
  | undefined;

type ArtBackgroundProps = {
  background?: BackgroundOptions;
};

export const ArtBackground = (props: ArtBackgroundProps) => {
  const artBackground = props.background ?? 'hero';
  const opacityAnimation = useSpring({
    opacity: artBackground ? 1 : 0,
    config: { duration: 600 },
    immediate: (key) => key === 'zIndex',
  });

  return (
    <animated.div
      className={`absolute top-0 w-full h-full bg-center bg-cover bg-${artBackground}`}
      style={opacityAnimation}
    ></animated.div>
  );
};
