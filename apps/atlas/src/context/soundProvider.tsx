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
  musicVolume: 100,
  onMusicVolumeChange: () => {},
  effectsVolume: 100,
  onEffectsVolumeChange: () => {},
};

const SoundContext = createContext<{
  isSoundActive: boolean;
  toggleSound: () => void;
  playCombat: () => void;
  stopCombat: () => void;
  musicVolume: number;
  onMusicVolumeChange: (value) => void;
  effectsVolume: number;
  onEffectsVolumeChange: (value) => void;
}>(defaultSoundContext);

export const SoundProvider = (props: SoundProviderProps) => {
  const [isSoundActive, setSound] = useState(false);
  const [musicVolume, setMusicVolume] = useState<number>(100);
  const [effectsVolume, setEffectsVolume] = useState<number>(100);

  const toggleSound = () => {
    const newValue = !isSoundActive;
    setSound(newValue);
  };

  const onMusicVolumeChange = (value: number[]) => {
    setMusicVolume(value[0]);
  };
  const onEffectsVolumeChange = (value: number) => {
    setEffectsVolume(value[0]);
  };
  const [playBackground, { stop }] = useSoundLib('/music/realms_cimbalom.mp3', {
    soundEnabled: isSoundActive,
    volume: musicVolume * 0.003,
    loop: true,
  });
  const [playCombat, { stop: stopCombat }] = useSoundLib(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      soundEnabled: isSoundActive,
      volume: musicVolume * 0.03,
      loop: true,
    }
  );

  useMemo(() => {
    if (!isSoundActive) {
      stop();
    } else {
      playBackground();
    }
  }, [isSoundActive, playBackground, stop]);

  return (
    <SoundContext.Provider
      value={{
        toggleSound,
        isSoundActive,
        playCombat,
        stopCombat,
        musicVolume,
        onMusicVolumeChange,
        effectsVolume,
        onEffectsVolumeChange,
      }}
    >
      {props.children}
    </SoundContext.Provider>
  );
};

export function useSoundContext() {
  return useContext(SoundContext);
}
