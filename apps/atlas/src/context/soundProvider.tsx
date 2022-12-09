/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState, useMemo } from 'react';
import useSoundLib from 'use-sound';

interface SoundProviderProps {
  children: React.ReactNode;
}

const defaultSoundContext = {
  isSoundActive: false,
  toggleSound: () => {},
  playCombat: () => {},
  stopCombat: () => {},
};

const SoundContext = createContext<{
  isSoundActive: boolean;
  toggleSound: () => void;
  playCombat: () => void;
  stopCombat: () => void;
}>(defaultSoundContext);

export const SoundProvider = (props: SoundProviderProps) => {
  const [isSoundActive, setSound] = useState(false);

  const toggleSound = () => {
    const newValue = !isSoundActive;
    setSound(newValue);
  };

  const [playBackground, { stop }] = useSoundLib('/music/realms_cimbalom.mp3', {
    soundEnabled: isSoundActive,
    volume: 0.3,
    loop: true,
  });

  const [playCombat, { stop: stopCombat }] = useSoundLib(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      soundEnabled: isSoundActive,
      volume: 0.3,
      loop: true,
    }
  );

  useMemo(() => {
    if (!isSoundActive) {
      stop();
    } else {
      playBackground();
    }
  }, [isSoundActive]);

  return (
    <SoundContext.Provider
      value={{ toggleSound, isSoundActive, playCombat, stopCombat }}
    >
      {props.children}
    </SoundContext.Provider>
  );
};

export function useSoundContext() {
  return useContext(SoundContext);
}
