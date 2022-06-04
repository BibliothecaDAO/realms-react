/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import BibliothecaDAO from '@bibliotheca-dao/ui-lib/icons/BibliothecaDAO.svg';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown-color.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { useStarknet } from '@starknet-react/core';
import Link from 'next/link';
import { useState } from 'react';
import useSound from 'use-sound';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { shortenAddress } from '@/util/formatters';
import { useWalletContext } from '../../hooks/useWalletContext';
export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const { account, connect, connectors } = useStarknet();
  const { selectedPanel, toggleMenuType } = useAtlasContext();
  const [soundOn, setSoundOn] = useState(false);
  const [play, { stop }] = useSound(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      volume: 1,
      loop: true,
    }
  );
  return (
    <div className="top-0 left-0 z-40 justify-end hidden shadow-2xl bg-stone-500 sm:flex">
      <div className="flex justify-end w-full px-4 py-4 ml-auto mr-auto space-x-4">
        <div className="self-center mr-auto">
          <Link href={'/'}>
            <span className="flex">
              {' '}
              <BibliothecaBook className="h-8 ml-2 mr-4 stroke-white fill-white" />
              <BibliothecaDAO className="self-center h-8 ml-2 mr-auto stroke-white fill-white" />
            </span>
          </Link>
        </div>

        <div className="self-center mt-2">
          <IconButton
            aria-label="Bank"
            variant="unstyled"
            className="fill-current"
            texture={false}
            onClick={() => {
              if (soundOn) {
                stop();
              } else {
                play();
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
        </div>

        <span>
          <Button variant="primary" onClick={connectWallet}>
            <Lords className="w-6" /> <span className="px-4">{balance}</span>
          </Button>
        </span>
        <span>
          <Link href={selectedPanel === 'account' ? '' : '/account'}>
            <Button
              variant="primary"
              // onClick={() => togglePanelType('account')}
              className="py-1"
            >
              <Crown className="w-8 mr-4" />
              <Ethereum
                className={`w-4 mx-4 ${!isConnected ? 'filter grayscale' : ''}`}
              />
              <StarkNet
                className={`w-5 mr-2 ${!account ? 'filter grayscale' : ''}`}
              />
            </Button>
          </Link>
        </span>
        <span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toggleMenuType('transactionCart')}
          >
            tx
          </Button>
        </span>
      </div>
    </div>
  );
}
