import { animated, useSpring } from '@react-spring/web';

type Props = {
  children: React.ReactNode;
  open: boolean;
  style?: string;
};

export const BasePanel = (props: Props) => {
  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    // transform: props.open ? `translateY(0)` : `translateY(5%)`,
    delay: 150,
  });

  return (
    <animated.div
      className={`absolute top-0 w-full h-full pl-12 bg-gray-1000 ${
        props.open ? 'z-10' : ''
      }`}
      style={animation}
    >
      <div
        className={`h-full overflow-y-scroll w-full relative  bg-gray-1000/90 ${props.style}`}
      >
        {props.children}
      </div>
    </animated.div>
  );
};
