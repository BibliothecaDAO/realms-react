/* eslint-disable @typescript-eslint/no-empty-function */
import ListPlayer from 'listplayer';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { usePlayer } from '@/hooks/usePlayer';

import booleanStorage from '../services/booleanStorage';

const defaultSoundContext = {
  isSoundActive: false,
  toggleSound: () => {},
  currentTrackName: 'Cimbalom',
};

const SoundContext = createContext<{
  isSoundActive: boolean;
  toggleSound: () => void;
  currentTrackName: string;
}>(defaultSoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
}

export const MusicProvider = (props: SoundProviderProps) => {
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
  const player = useRef<ListPlayer>();
  const [isSoundActive, setSound] = useState(initialValue);

  const [currentTrackName, setCurrentTrackName] = useState('');

  useEffect(() => {
    player.current = new ListPlayer({
      tracks: [
        {
          title: 'Cimbalom',
          artist: 'Casey',
          src: '/music/realms_cimbalom.mp3',
        },
        {
          title: 'Bansura',
          artist: 'Casey',
          src: '/music/realms_bansura.mp3',
        },
      ],
      loopTracks: true,
      progressThroughTracks: true,
    });
    player.current.on('play', () => {
      setCurrentTrackName(player.current.currentTrack.title);
    });
  }, [player]);

  const toggleSound = () => {
    const newValue = !isSoundActive;
    setSound(newValue);
    // booleanStorage.setItem(localStorageKey, newValue);
  };

  // const isSSR = typeof window === 'undefined';

  useEffect(() => {
    if (!isSoundActive) {
      player.current.pause();
    } else {
      player.current.play();
    }
  }, [isSoundActive, player]);

  return { isSoundActive, toggleSound, currentTrackName };
}

export function useSoundContext() {
  return useContext(SoundContext);
}
