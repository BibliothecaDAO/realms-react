/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IconButton } from '@bibliotheca-dao/ui-lib';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import RealmsPlaylistSidebar from '../sidebars/RealmsPlaylistSideBar';

export const BottomLeftNav = () => {
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

  const [showPlaylists, setShowPlaylists] = useState(false);

  return (
    <div className="absolute z-40 bottom-0">
      <div className="relative">
        <div className="w-72 flex h-10 bottom-0 z-30 relative">
          <div className="w-12 h-10 p-2 border-t border-r rounded-tr-full bg-black paper border-yellow-800 relative">
            {' '}
            <IconButton
              aria-label="Bank"
              variant="unstyled"
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
                  <VolumeOn className="w-5" />
                ) : (
                  <VolumeOff className="w-5" />
                )
              }
              size="md"
            />
          </div>
          <div className="w-12 h-10 p-2 border-t border-r rounded-t-full bg-black paper border-yellow-800 flex justify-center">
            <IconButton
              aria-label="Bank"
              variant="unstyled"
              texture={false}
              onClick={() => {
                setShowPlaylists(!showPlaylists);
              }}
              icon={<RectangleStackIcon className={'w-5 h-5'} />}
              size="md"
            />
          </div>
        </div>
        <RealmsPlaylistSidebar
          currentRealmId={1}
          isOpen={showPlaylists}
          onClose={() => setShowPlaylists(false)}
        />
      </div>
    </div>
  );
};
