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
    zIndex: artBackground ? 10 : 0,
    opacity: artBackground ? 1 : 0,
    config: { duration: 600 },
    immediate: (key) => key === 'zIndex',
  });

  return (
    <animated.div
      className={`absolute top-0 z-20 w-full h-full bg-center bg-cover bg-${artBackground}`}
      style={opacityAnimation}
    ></animated.div>
  );
};
