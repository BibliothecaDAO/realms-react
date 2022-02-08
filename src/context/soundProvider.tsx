import {
  createContext, useContext, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import useSoundLib from 'use-sound';

import booleanStorage from '../services/booleanStorage';

const defaultSoundContext = {
  isSoundActive: true,
  toggleSound: () => { },
};

const SoundContext = createContext<{
  isSoundActive: boolean;
  toggleSound: () => void;
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

const initialValue = booleanStorage.getItem(localStorageKey, { defaultValue: true });
//const SoundSettingContext = createContext({isSoundActive: false, toggleSound: () => { }});

export function useSound() {
  const [isSoundActive, setSound] = useState(initialValue);

  const toggleSound = useCallback(() => {
    const newValue = !isSoundActive;
    setSound(newValue);
    booleanStorage.setItem(localStorageKey, newValue);
  }, [isSoundActive]);


  const [playShield, options] = useSoundLib('/shield.mp3', { soundEnabled: isSoundActive });

  const playSound = () => {
    
  }

  //return [isSoundActive || configs.forcePlay ? playSound() : () => {}, options];
  return {isSoundActive, toggleSound, playShield}
}


export function useSoundContext() {
  return useContext(SoundContext);
}
