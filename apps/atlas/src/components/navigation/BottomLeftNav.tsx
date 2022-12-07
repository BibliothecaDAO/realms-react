/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IconButton } from '@bibliotheca-dao/ui-lib';
import BottomLeftFrameGold from '@bibliotheca-dao/ui-lib/icons/frame/bottom-left_gold.svg';
import BottomLeftFrame from '@bibliotheca-dao/ui-lib/icons/frame/bottom-left_no-ink.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import RealmsPlaylistSidebar from '@/components/realms/RealmsPlaylistSideBar';
import { useSound } from '@/context/soundProvider';
import { usePlayer } from '@/hooks/usePlayer';
import NetworkConnectButton from '../ui/NetworkConnectButton';

export const BottomLeftNav = () => {
  // const [soundOn, setSoundOn] = useState(false);

  // const [player, currentTrack] = usePlayer([
  //   {
  //     title: 'Cimbalom',
  //     artist: 'Casey',
  //     src: '/music/realms_cimbalom.mp3',
  //   },
  //   {
  //     title: 'Bansura',
  //     artist: 'Casey',
  //     src: '/music/realms_bansura.mp3',
  //   },
  // ]);

  // const [showPlaylists, setShowPlaylists] = useState(false);

  const { toggleSound, isSoundActive } = useSound();

  return (
    <div className="absolute bottom-0 z-50">
      <div className="absolute  bottom-[5.8rem] left-6 ">
        <IconButton
          aria-label="Bank"
          variant="unstyled"
          texture={false}
          onClick={() => {
            toggleSound();
          }}
          icon={
            isSoundActive ? (
              <VolumeOn className="w-5 stroke-gray-1000 fill-gray-1000" />
            ) : (
              <VolumeOff className="w-5 stroke-gray-1000 fill-gray-1000" />
            )
          }
          size="md"
        />
      </div>
      <div className="relative">
        <div className="absolute w-16 h-16 bottom-3 left-3">
          <img
            src={'/realm-troops/vizir.png'}
            alt="map"
            className="w-16 h-16 mb-4 mr-4 rounded-full "
          />
        </div>
        <div className="pl-48 lg:pl-[5rem]">
          <NetworkConnectButton />
        </div>
        <BottomLeftFrameGold className="absolute w-[14rem] pointer-events-none stroke-yellow-900 bottom-0  mix-blend-multiply" />
        <BottomLeftFrame className="absolute bottom-0 pointer-events-none w-72 mix-blend-multiply stroke-gray-1000" />

        <div className="absolute bottom-0 left-0 w-[8.8px] h-[calc(100vh-30rem)] bg-black mb-72 pointer-events-none"></div>
        <div className="absolute bottom-0 left-3 w-[2px] h-[calc(100vh-32rem)] bg-black mb-72 pointer-events-none"></div>
        <div className="absolute bottom-0 left-[53px] w-[2.1px] h-[calc(100vh-30rem)] bg-black mb-72 pointer-events-none"></div>
      </div>
    </div>
  );
};
