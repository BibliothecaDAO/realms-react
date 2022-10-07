import { Button } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { Popover, Transition } from '@headlessui/react';
import { useAccount, useConnectors } from '@starknet-react/core';
import { useEffect } from 'react';
import { removeHexPrefix } from 'starknet/dist/utils/encode';
import { useWalletContext } from '@/hooks/useWalletContext';
import { shortenAddressWidth } from '@/util/formatters';
const NetworkConnectButton = () => {
  const { connectWallet, isConnected, displayName, balance } =
    useWalletContext();

  const { connect, available, refresh, disconnect } = useConnectors();
  const { address, status } = useAccount();

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <Popover className="relative">
      <Popover.Button as="div">
        <Button variant="primary" className="font-display">
          {' '}
          <StarkNet className={'inline-block w-4 mr-2 -ml-2'} />{' '}
          {address
            ? removeHexPrefix(shortenAddressWidth(address, 4))
            : 'Connect'}
        </Button>{' '}
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute right-0 w-64 p-6 mt-2 rounded-md z-100 bg-gray-1000">
          <>
            <h3>Game Networks</h3>
            <hr />
            {status === 'connected' && address ? (
              <>
                <p>StarkNet</p>

                <StarkNet className="inline-block w-4 mr-2" />
                {shortenAddressWidth(address, 6)}
                <Button
                  onClick={disconnect}
                  size="xs"
                  variant="unstyled"
                  className="ml-6"
                >
                  X
                </Button>
              </>
            ) : (
              <div className="mt-3">
                <p className="font-semibold tracking-widest uppercase">
                  StarkNet
                </p>
                <div className="flex flex-col space-y-1">
                  {available &&
                    available.map((connector) => (
                      <Button
                        variant="primary"
                        className="w-full text-xs"
                        key={connector.id()}
                        onClick={() => connect(connector)}
                      >
                        <StarkNet className="inline-block w-4 mr-2" /> Connect{' '}
                        {connector.id() !== 'Disconnected'
                          ? connector.id()
                          : 'Wallet'}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* {status === 'connected' ? (
            <p className="text-red-300">Error: {error.message}</p>
          ) : null} */}

            <hr className="my-4" />
            {isConnected && (
              <>
                {displayName ? (
                  <>
                    <p>Ethereum</p>

                    <Ethereum className="inline-block w-4 mr-2" />
                    {displayName}
                  </>
                ) : null}
              </>
            )}
            {!isConnected && (
              <>
                <Button
                  variant="primary"
                  className="w-full text-xs"
                  onClick={connectWallet}
                >
                  <Ethereum className="w-4 mr-4" /> Connect Ethereum
                </Button>
                <p className="mt-2 text-xs">
                  Connect an Ethereum Wallet to bridge and check balances across
                  rollups.
                </p>
              </>
            )}
          </>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NetworkConnectButton;
