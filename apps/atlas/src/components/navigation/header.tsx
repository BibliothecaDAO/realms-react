/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
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
import { useUIContext } from '@/hooks/useUIContext';
import { shortenAddress } from '@/util/formatters';
import { useWalletContext } from '../../hooks/useWalletContext';
export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const { account, connect, connectors } = useStarknet();
  const { togglePanelType } = useUIContext();
  const [soundOn, setSoundOn] = useState(false);
  const [play, { stop }] = useSound(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      volume: 1,
      loop: true,
    }
  );
  return (
    <div className="top-0 left-0 z-40 justify-end hidden shadow-inner bg-gray-700/90 sm:flex">
      <div className="flex justify-end w-full px-4 py-4 ml-auto mr-auto space-x-4">
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
          <Button
            variant="primary"
            onClick={() => togglePanelType('account')}
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
        </span>
      </div>
    </div>
  );
}
