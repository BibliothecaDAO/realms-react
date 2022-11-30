/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IconButton } from '@bibliotheca-dao/ui-lib';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import RealmsPlaylistSidebar from '@/components/realms/RealmsPlaylistSideBar';
import { usePlayer } from '@/hooks/usePlayer';

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
    <div className="absolute bottom-0 z-50">
      <div className="relative">
        <div className="relative bottom-0 z-30 flex h-10 w-72">
          <div className="relative w-12 h-10 p-2 bg-black border-t border-r border-yellow-800 rounded-tr-full">
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
          {/* <div className="flex justify-center w-12 h-10 p-2 bg-black border-t border-r border-yellow-800 rounded-t-full paper">
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
          </div> */}
        </div>
        {/* <RealmsPlaylistSidebar
          currentRealmId={1}
          isOpen={showPlaylists}
          onClose={() => setShowPlaylists(false)}
        /> */}
      </div>
    </div>
  );
};
