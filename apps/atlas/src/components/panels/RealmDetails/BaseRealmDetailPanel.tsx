import { animated, useSpring } from '@react-spring/web';

type Props = {
  children: React.ReactNode;
  open: boolean;
  style?: string;
};

export const BaseRealmDetailPanel = (props: Props) => {
  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    transform: props.open ? `translateY(0)` : `translateY(200%)`,
    delay: 150,
  });

  return <animated.div style={animation}>{props.children}</animated.div>;
};
