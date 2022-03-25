import { animated, useSpring } from '@react-spring/web';
import { useUIContext } from '@/hooks/useUIContext';

type Props = {
  children: React.ReactNode;
  open: boolean;
};

export const BasePanel = (props: Props) => {
  const { togglePanelType, selectedPanel } = useUIContext();

  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    transform: props.open ? `translateY(0)` : `translateY(-200%)`,
    delay: 200,
  });

  return (
    <animated.div
      className="absolute top-0 z-30 w-full h-screen bg-center bg-cover"
      style={animation}
    >
      <div
        className={`h-screen overflow-y-scroll w-7/12 relative top-0 p-6 rounded-r-2xl`}
      >
        {props.children}
      </div>
    </animated.div>
  );
};
