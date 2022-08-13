/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import BibliothecaDAO from '@bibliotheca-dao/ui-lib/icons/BibliothecaDAO.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import PlayBack from '@bibliotheca-dao/ui-lib/icons/player/play-back.svg';
import PlayForward from '@bibliotheca-dao/ui-lib/icons/player/play-forward.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { formatEther } from '@ethersproject/units';
import Link from 'next/link';
import { useState } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { usePlayer } from '@/hooks/usePlayer';
import NetworkConnectButton from '@/shared/NetworkConnectButton';
import TransactionNavItem from './TransactionNavItem';

export function Header() {
  const { lordsBalance } = useResourcesContext();
  const [soundOn, setSoundOn] = useState(false);
  const { togglePanelType } = useAtlasContext();

  const [player, currentTrack] = usePlayer([
    {
      title: 'Order of Enlightenment',
      artist: 'Casey',
      src: '/music/pads.mp3',
    },
    // {
    //   title: 'The Minstrels - Order of Enlightenment',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-enlightenment.mp3',
    // },
    // {
    //   title: 'The Minstrels - Order of Power',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-power.mp3',
    // },
    // {
    //   title: 'The Minstrels - Order of Anger',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-anger.mp3',
    // },
    // {
    //   title: 'The Minstrels - Order of Protection',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-protection.mp3',
    // },
    // {
    //   title: 'The Minstrels - Order of Rage',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-rage.mp3',
    // },
    // {
    //   title: 'The Minstrels - Order of Brilliance',
    //   album: 'The 16 Orders',
    //   artist: 'The Minstrels',
    //   src: '/music/minstrels/minstrels-brilliance.mp3',
    // },
    // {
    //   title: 'I walk with ghosts',
    //   artist: 'Scott Buckley',
    //   src: '/music/scott-buckley-i-walk-with-ghosts.mp3',
    // },
  ]);

  return (
    <div className="top-0 left-0 z-40 justify-end hidden shadow-2xl bg-gray-1000 sm:flex">
      <div className="flex justify-end w-full px-4 py-4 ml-auto mr-auto space-x-4">
        <div className="self-center mr-auto">
          <Link href={'/'}>
            <span className="flex">
              {' '}
              <BibliothecaBook className="self-center h-5 ml-2 mr-4 stroke-white fill-white " />
              <div className="self-center text-3xl font-lords">
                Realms: Eternum
              </div>
              {/* <BibliothecaDAO className="self-center h-5 ml-2 mr-auto stroke-white fill-white" /> */}
            </span>
          </Link>
        </div>

        <div className="flex items-center mr-4">
          <div className="mr-4 text-xs">{currentTrack}</div>
          <div className="flex self-center">
            <IconButton
              aria-label="Bank"
              variant="unstyled"
              className="fill-current"
              texture={false}
              onClick={() => {
                if (soundOn) {
                  player.prev();
                }
              }}
              icon={<PlayBack className="mr-3" />}
              size="lg"
            />
            <IconButton
              aria-label="Bank"
              variant="unstyled"
              className="fill-current"
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
              size="lg"
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
              size="lg"
            />
          </div>
        </div>

        <NetworkConnectButton />

        <span>
          <Button onClick={() => togglePanelType('bank')} variant="outline">
            <Lords className="w-6" />{' '}
            <span className="pl-4">
              {(+formatEther(lordsBalance)).toLocaleString()}
            </span>
          </Button>
        </span>
        <TransactionNavItem />
      </div>
    </div>
  );
}
