'use client';

import { IconButton } from '@bibliotheca-dao/ui-lib';
import PlayBack from '@bibliotheca-dao/ui-lib/icons/player/play-back.svg';
import PlayForward from '@bibliotheca-dao/ui-lib/icons/player/play-forward.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';

export function MusicControl() {
  const [soundOn, setSoundOn] = useState(false);
  const [player, currentTrack] = usePlayer([
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
  ]);
  return (
    <>
      <div className="mr-4 font-display">{currentTrack}</div>
      <div className="flex self-center">
        <IconButton
          aria-label="Bank"
          variant="unstyled"
          className="fill-yellow-600"
          texture={false}
          onClick={() => {
            if (soundOn) {
              player.prev();
            }
          }}
          icon={<PlayBack className="mr-3 fill-yellow-600" />}
          size="md"
        />
        <IconButton
          aria-label="Bank"
          variant="unstyled"
          className="fill-yellow-600"
          texture={false}
          onClick={() => {
            if (soundOn) {
              player.pause();
            } else {
              player.play();
            }
            setSoundOn((prev) => !prev);
          }}
          icon={
            soundOn ? (
              <VolumeOn className="w-6" />
            ) : (
              <VolumeOff className="w-6" />
            )
          }
          size="md"
        />
        <IconButton
          aria-label="Bank"
          variant="unstyled"
          className="fill-current"
          texture={false}
          onClick={() => {
            if (soundOn) {
              player.next();
            }
          }}
          icon={<PlayForward className="ml-3" />}
          size="md"
        />
      </div>
    </>
  );
}
