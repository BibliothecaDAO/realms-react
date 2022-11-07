'use client';
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
import { usePathname } from 'next/navigation';
// import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import NetworkConnectButton from '@/components/navigation/NetworkConnectButton';
import { useResourcesContext } from '@/context/ResourcesContext';
import { usePlayer } from '@/hooks/usePlayer';
import { ResourceSwapSideBar } from '../sidebars/ResourceSwapSideBar';
import { TransactionCartSideBar } from '../sidebars/TransactionCartSideBar';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | '';

export const TopLeftNav = () => {
  // const { lordsBalance } = useResourcesContext();
  const [soundOn, setSoundOn] = useState(false);
  const pathname = usePathname();
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
    if (pathname?.slice(1).split('/')[0] === 'bank') {
      return;
    }
    setSelectedSideBar(selectedSideBar === 'bank' ? '' : 'bank');
  }

  return (
    <div className="absolute z-40">
      <div className="relative">
        <div className="absolute top-0 z-20 w-64 h-10 bg-black bg-white border-b border-r border-yellow-800 rounded-br-full shadow-md pl-28 ">
          {address && (
            <Button
              className="flex px-2 py-2 "
              onClick={onLordsNavClick}
              variant="unstyled"
            >
              <Lords className="w-6 fill-current" />{' '}
              <span className="pl-4">
                {/* TODO add back lords balance(+formatEther(lordsBalance)).toLocaleString() */}
              </span>
            </Button>
          )}
        </div>

        <div className="absolute top-0 z-40 w-48 h-48 -mt-24 -ml-24 bg-black bg-white border border-yellow-800 rounded-b-full rounded-r-full shadow-2xl paper shadow-yellow-200 hover:bg-gray-1000 "></div>
        <div className="absolute z-40 top-5 left-4">
          <Button href="/account" variant="unstyled">
            <Crown className="fill-current w-9 h-9 " />
          </Button>
          {/* {address && <TransactionNavItem onClick={onTransactionNavClick} />} */}
        </div>
      </div>
      <div className="pl-64">
        <NetworkConnectButton />
      </div>

      <TransactionCartSideBar
        isOpen={selectedSideBar === 'transaction'}
        onClose={onTransactionNavClick}
      />
      <ResourceSwapSideBar
        isOpen={selectedSideBar === 'bank'}
        onClose={onLordsNavClick}
      />
    </div>
  );
};
