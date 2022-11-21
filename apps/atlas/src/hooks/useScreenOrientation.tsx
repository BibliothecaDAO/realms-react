import { useState, useEffect } from 'react';

const getOrientation = () => window.screen?.orientation?.type;

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState<OrientationType>();

  const updateOrientation = (event) => {
    setOrientation(getOrientation());
  };

  const lockOrientation = () => {
    // (A1) GO INTO FULL SCREEN FIRST
    const de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullscreen) {
      de.webkitRequestFullscreen();
    } else if (de.msRequestFullscreen) {
      de.msRequestFullscreen();
    }

    // (A2) THEN LOCK ORIENTATION
    screen.orientation.lock('landscape').catch((e) => {
      console.log(e);
    });
  };

  useEffect(() => {
    setOrientation(getOrientation());
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return { orientation, lockOrientation };
};

export default useScreenOrientation;
