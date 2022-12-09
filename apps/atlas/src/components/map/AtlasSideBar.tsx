import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { animated, useSpring } from 'react-spring';

type Prop = {
  isOpen: boolean;
  children: React.ReactNode[] | React.ReactNode;
  containerClassName?: string;
  container?: HTMLElement;
  position?: 'left' | 'right';
};

const AtlasSidebar: React.FC<Prop> = (props: Prop) => {
  const { isOpen } = props;

  const animation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen
      ? 'translateX(0)'
      : props.position == 'left'
      ? 'translateX(-100%)'
      : 'translateX(100%)',
  });

  // Must wait until DOM is ready or might receive
  // Error: Target container is not a DOM element.
  const [domReady, setDomReady] = useState(false);
  useEffect(() => {
    setDomReady(true);
  }, []);

  if (!domReady) {
    return null;
  }

  return ReactDOM.createPortal(
    <animated.div
      className={clsx(
        'absolute top-0 shadow-xl shadow-yellow-800 bottom-0 bg-gray-1000 overflow-y-scroll border-white/30 z-30 rounded-3xl border-8 border-double border-gray-900 ',
        props.containerClassName ? props.containerClassName : 'w-full md:w-1/2',
        props.position == 'left' ? 'left-0' : 'right-0'
      )}
      style={animation}
    >
      {props.children}
    </animated.div>,
    props.container || document.getElementById('sidebar-root')!,
    'sidebar-root'
  );
};

export default AtlasSidebar;
