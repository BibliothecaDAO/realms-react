/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import PlayBack from '@bibliotheca-dao/ui-lib/icons/player/play-back.svg';
import PlayForward from '@bibliotheca-dao/ui-lib/icons/player/play-forward.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import { useResourcesContext } from '@/context/ResourcesContext';
import { usePlayer } from '@/hooks/usePlayer';
import NetworkConnectButton from '@/shared/NetworkConnectButton';
import { ResourceSwapSideBar } from '../sidebars/ResourceSwapSideBar';
import { TransactionCartSideBar } from '../sidebars/TransactionCartSideBar';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | '';

export const BottomLeftNav = () => {
  const { lordsBalance } = useResourcesContext();
  const [soundOn, setSoundOn] = useState(false);
  const { pathname } = useRouter();
  const { address } = useAccount();
  const { address: l1Address } = useL1Account();

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

  const [selectedSideBar, setSelectedSideBar] =
    useState<HeaderSidePanelType>('');

  function onTransactionNavClick() {
    setSelectedSideBar(selectedSideBar === 'transaction' ? '' : 'transaction');
  }

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    setSelectedSideBar(selectedSideBar === 'bank' ? '' : 'bank');
  }

  return (
    <div className="absolute z-40 bottom-0">
      <div className="relative">
        <div className="w-56 h-10 bottom-0 z-30 border-t border-r rounded-tr-full shadow-xl bg-black paper border-yellow-800 relative"></div>
        {/* <div className=" border-yellow-800 absolute rounded-r-full -ml-24 -bottom-24 w-48 h-48 shadow-2xl z-20 border bottom-0 bg-black paper"></div> */}
        <div className="flex bottom-2 left-4 z-40 absolute">
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
        </div>
      </div>
    </div>
  );
};
