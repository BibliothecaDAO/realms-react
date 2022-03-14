/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import useSoundLib from 'use-sound';

import booleanStorage from '../services/booleanStorage';

const defaultSoundContext = {
  isSoundActive: false,
  toggleSound: () => {},
  playShield: () => {},
};

const SoundContext = createContext<{
  isSoundActive: boolean;
  toggleSound: () => void;
  playShield: () => void;
}>(defaultSoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider = (props: SoundProviderProps) => {
  return (
    <SoundContext.Provider value={useSound()}>
      {props.children}
    </SoundContext.Provider>
  );
};

const localStorageKey = 'SOUND_SETTING_IS_ON';

const initialValue =
  booleanStorage.getItem(localStorageKey, { defaultValue: true }) || false;
// const SoundSettingContext = createContext({isSoundActive: false, toggleSound: () => { }});

export function useSound() {
  const [isSoundActive, setSound] = useState(initialValue);

  const toggleSound = useCallback(() => {
    const newValue = !isSoundActive;
    setSound(newValue);
    booleanStorage.setItem(localStorageKey, newValue);
  }, [isSoundActive]);

  const [playBackground, { stop }] = useSoundLib('/Honor_Bound.mp3', {
    soundEnabled: isSoundActive,
    volume: 0.3,
    loop: true,
  });

  const [playShield, options] = useSoundLib('/shield.mp3', {
    soundEnabled: !isSoundActive,
    volume: 1,
  });

  useEffect(() => {
    if (!isSoundActive) {
      stop();
    } else {
      // playBackground()
    }
  }, [isSoundActive, playBackground, stop]);

  // return [isSoundActive || configs.forcePlay ? playSound() : () => {}, options];
  return { isSoundActive, toggleSound, playShield };
}

export function useSoundContext() {
  return useContext(SoundContext);
}
