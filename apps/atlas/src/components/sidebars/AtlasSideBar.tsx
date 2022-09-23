import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { animated, useSpring } from 'react-spring';

type Prop = {
  isOpen: boolean;
  children: React.ReactNode[] | React.ReactNode;
  containerClassName?: string;
  container?: HTMLElement;
};

const AtlasSidebar: React.FC<Prop> = (props: Prop) => {
  const { isOpen } = props;

  const animation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
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
        'absolute top-0 shadow-xl shadow-yellow-800 bottom-0 right-0 p-5 bg-gray-1100 border-l-4 border-t-4 border-b-4 overflow-y-scroll z-30 border-white/30 card',
        props.containerClassName ? props.containerClassName : 'w-full md:w-1/2'
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
