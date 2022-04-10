/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import VolumeOff from '@bibliotheca-dao/ui-lib/icons/volume-mute-solid.svg';
import VolumeOn from '@bibliotheca-dao/ui-lib/icons/volume-up-solid.svg';
import { useStarknet } from '@starknet-react/core';
import { useState } from 'react';
import useSound from 'use-sound';
import { shortenAddress } from '@/util/formatters';
import { useWalletContext } from '../../hooks/useWalletContext';
export function Header() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const starknet = useStarknet();

  const [soundOn, setSoundOn] = useState(false);
  const [play, { stop }] = useSound(
    '/music/scott-buckley-i-walk-with-ghosts.mp3',
    {
      volume: 1,
    }
  );
  return (
    <div className="top-0 left-0 z-40 hidden bg-gray-800 sm:flex justify-end shadow-inner">
      <div className="ml-auto flex px-4 py-4 mr-auto space-x-4 w-full justify-end">
        {/* <span>
          <Button variant="primary" onClick={connectWallet}>
            claim Resources
          </Button>
        </span> */}
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
          {isConnected && (
            <Button variant="secondary" onClick={disconnectWallet}>
              <Ethereum className="w-4 mx-4" /> {displayName} [ disconnect ]
            </Button>
          )}
          {!isConnected && (
            <Button variant="primary" onClick={connectWallet}>
              <Ethereum className="w-4 mr-4" /> Connect
            </Button>
          )}
        </span>
        <span>
          {starknet?.account ? (
            <Button variant="secondary" onClick={starknet.connectBrowserWallet}>
              <StarkNet className="w-5 mr-2" />
              {shortenAddress(starknet?.account)}
            </Button>
          ) : (
            <Button variant="primary" onClick={starknet.connectBrowserWallet}>
              <StarkNet className="w-5 mr-2" />
              Connect to StarkNet
            </Button>
          )}
        </span>
      </div>
    </div>
  );
}
