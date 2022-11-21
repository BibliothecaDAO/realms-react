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
import { EmpireSideBar } from '@/components/sidebars/EmpireSideBar';
import { useResourcesContext } from '@/context/ResourcesContext';
import { usePlayer } from '@/hooks/usePlayer';
import NetworkConnectButton from '@/shared/NetworkConnectButton';
import { ResourceSwapSideBar } from '../sidebars/ResourceSwapSideBar';
import { TransactionCartSideBar } from '../sidebars/TransactionCartSideBar';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | 'empire' | '';

export const TopLeftNav = () => {
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
  function onEmpireClick() {
    setSelectedSideBar(selectedSideBar === 'empire' ? '' : 'empire');
  }

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    setSelectedSideBar(selectedSideBar === 'bank' ? '' : 'bank');
  }

  return (
    <div className="absolute z-40">
      <div className="relative">
        <div className="w-48 lg:w-64 h-8 lg:h-10 md:pl-16 lg:pl-28 absolute top-0 bg-white border-b border-r border-yellow-800 rounded-br-full shadow-md  bg-black md:text-xs lg:text-lg">
          {address && (
            <Button
              className="flex py-2 px-2 "
              onClick={onLordsNavClick}
              variant="unstyled"
            >
              <Lords className="md:w-4 lg:w-6 fill-current" />{' '}
              <span className="md:pl-2 lg:pl-4">
                {(+formatEther(lordsBalance)).toLocaleString()}
              </span>
            </Button>
          )}
        </div>
        <div className="absolute z-50 md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24">
          <Button
            onClick={onEmpireClick}
            variant="unstyled"
            className=" rounded-r-full rounded-b-full md:w-32 md:h-32 lg:w-48 lg:h-48 shadow-2xl border-yellow-800 border shadow-yellow-200 hover:bg-gray-1000 paper bg-black"
          >
            <div className="absolute top-0 left-0 md:top-[4.75rem] md:left-[4.75rem] lg:top-28 lg:left-28 z-50">
              <Crown className="md:h-6 md:w-6 lg:w-9 lg:h-9 fill-current" />
            </div>
          </Button>
        </div>
        {/* {address && <TransactionNavItem onClick={onTransactionNavClick} />} */}
      </div>
      <div className="pl-48 lg:pl-64">
        <NetworkConnectButton />
      </div>
      <EmpireSideBar
        isOpen={selectedSideBar === 'empire'}
        onClose={onEmpireClick}
      />
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
