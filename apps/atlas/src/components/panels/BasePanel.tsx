import { animated, useSpring } from '@react-spring/web';

type Props = {
  children: React.ReactNode;
  open: boolean;
  style?: string;
};

export const BasePanel = (props: Props) => {
  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    transform: props.open ? `translateY(0)` : `translateY(5%)`,
    delay: 150,
  });

  return (
    <animated.div
      className={`absolute top-0 w-full h-full bg-center bg-cover ${
        props.open ? 'z-30' : ''
      }`}
      style={animation}
    >
      <div
        className={`h-full overflow-y-scroll w-full relative top-0 rounded-r-2xl bg-gray-1100/90 ${props.style}`}
      >
        {props.children}
      </div>
    </animated.div>
  );
};
