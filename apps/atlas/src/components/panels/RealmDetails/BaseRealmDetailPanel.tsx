import { animated, useSpring } from '@react-spring/web';

type Props = {
  children: React.ReactNode;
  open: boolean;
  style?: string;
};

export const BaseRealmDetailPanel = (props: Props) => {
  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    transform: props.open ? `translateY(0)` : `translateY(5%)`,
    delay: 75,
  });

  return (
    <animated.div
      className={`absolute ${props.open ? 'z-10' : ''}`}
      style={animation}
    >
      <div className={` relative px-8`}>{props.children}</div>
    </animated.div>
  );
};
