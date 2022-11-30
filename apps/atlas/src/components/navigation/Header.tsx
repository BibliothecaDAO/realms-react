/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
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
import { ResourceSwapSideBar } from '@/components/bank/ResourceSwapSideBar';
import { TransactionCartSideBar } from '@/components/ui/transactions/TransactionCartSideBar';
import { useResourcesContext } from '@/context/ResourcesContext';
import { usePlayer } from '@/hooks/usePlayer';
import NetworkConnectButton from '@/shared/NetworkConnectButton';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | '';

export function Header() {
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
    <div className="top-0 left-0 z-40 justify-end hidden border-b-4 card border-white/20 bg-gray-1100/95 sm:flex bg-snake">
      <div className="flex justify-end w-full px-4 py-4 ml-auto mr-auto space-x-4">
        <div className="self-center mr-auto">
          <Link href={'/'}>
            <span className="flex">
              {' '}
              <Ouroboros className="self-center h-10 ml-2 mr-4 fill-yellow-600 " />
              <div className="self-center text-3xl font-lords">Eternum</div>
              {/* <BibliothecaDAO className="self-center h-5 ml-2 mr-auto stroke-white fill-white" /> */}
            </span>
          </Link>
        </div>

        <div className="flex items-center px-4 mr-4 border card">
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

        <NetworkConnectButton />

        {address && (
          <Button
            className="font-display"
            onClick={onLordsNavClick}
            variant="primary"
          >
            <Lords className="w-6 fill-current" />{' '}
            <span className="pl-4">
              {(+formatEther(lordsBalance)).toLocaleString()}
            </span>
          </Button>
        )}
        {address && <TransactionNavItem onClick={onTransactionNavClick} />}
      </div>

      <ResourceSwapSideBar
        isOpen={selectedSideBar === 'bank'}
        onClose={onLordsNavClick}
      />
      <TransactionCartSideBar
        isOpen={selectedSideBar === 'transaction'}
        onClose={onTransactionNavClick}
      />
    </div>
  );
}
