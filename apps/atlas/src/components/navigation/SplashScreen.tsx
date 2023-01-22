import { Button } from '@bibliotheca-dao/ui-lib';
import Ouroboros from '@bibliotheca-dao/ui-lib/icons/ouroboros.svg';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { useSoundContext } from '@/context/soundProvider';
import useScreenOrientation from '@/hooks/useScreenOrientation';
import NetworkConnectButton from '../ui/NetworkConnectButton';

export const SplashScreen = ({ children }) => {
  const { toggleFullScreen, orientation } = useScreenOrientation();
  const [loading, setLoading] = useState(true);
  const { address, status, connector } = useAccount();

  const { toggleSound } = useSoundContext();

  return (
    <>
      {loading && (
        <div className="absolute left-0 flex items-center justify-center w-full h-screen bg-cover z-100 bg-gray-1000 bg-realmBackground vignette-inset">
          <div className="relative flex flex-col w-full px-10 text-center lg:w-1/3">
            <Ouroboros className="self-center w-full h-32 ml-2 mr-4 fill-frame-primary " />
            <h1 className="mb-8">Eternum</h1>
            {address && status === 'connected' ? (
              <div className="flex w-full gap-4">
                <Button
                  className="sm:w-1/2"
                  variant="primary"
                  onClick={() => {
                    setLoading(false);
                    toggleSound();
                  }}
                >
                  Launch
                </Button>
                <Button
                  className="sm:w-1/2"
                  variant="primary"
                  onClick={() => {
                    toggleFullScreen();
                    setLoading(false);
                    toggleSound();
                  }}
                >
                  Launch Fullscreen
                </Button>
              </div>
            ) : (
              <div className="rounded bg-gray-1000">
                <NetworkConnectButton />
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </>
  );
};
