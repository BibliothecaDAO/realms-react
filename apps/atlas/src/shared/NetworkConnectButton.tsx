import { Button } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import ArgentX from '@bibliotheca-dao/ui-lib/icons/argentX.svg';
import Braavos from '@bibliotheca-dao/ui-lib/icons/braavos.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { Popover, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

import { useAccount, useConnectors } from '@starknet-react/core';
import { ConnectKitButton } from 'connectkit';
import { useEffect } from 'react';
import { removeHexPrefix } from 'starknet/dist/utils/encode';
import { shortenAddressWidth } from '@/util/formatters';

const NetworkConnectButton = () => {
  const { connect, available, refresh, disconnect } = useConnectors();
  const { address, status, connector } = useAccount();

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
        <Popover.Panel className="absolute right-0 w-64 p-6 my-2 rounded-md z-100 bg-gray-1000">
          <>
            <h3>Game Networks</h3>
            <hr />
            <div className="flex justify-between my-2 text-sm ">
              <p className="font-semibold tracking-widest uppercase">
                <StarkNet className="inline-block w-4 mr-2" />
                StarkNet
              </p>
              <Tooltip
                placement="right"
                className="ml-5 "
                tooltipText={
                  <div className="p-2 ml-4 text-white border rounded bg-slate-400/60">
                    <p className="text-xs normal-case">
                      Connect to the StarkNet L2 network to play the Realms:
                      Eternum game
                    </p>
                  </div>
                }
              >
                <QuestionMarkCircleIcon className="w-5 h-5 ml-4 " />
              </Tooltip>
            </div>
            {status === 'connected' && address && connector ? (
              <Button
                variant="outline"
                className="w-full text-xs normal-case "
                onClick={disconnect}
              >
                {connector.id() == 'argentX' ? (
                  <ArgentX className="inline-block w-4 mr-4" />
                ) : (
                  <Braavos className="inline-block w-4 mr-4" />
                )}
                {shortenAddressWidth(address, 4)}X
              </Button>
            ) : (
              <div className="flex flex-col space-y-1">
                {available &&
                  available.map((connector) => (
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      key={connector.id()}
                      onClick={() => connect(connector)}
                    >
                      {connector.id() == 'argentX' ? (
                        <ArgentX className="inline-block w-4 mr-4" />
                      ) : (
                        <Braavos className="inline-block w-4 mr-4" />
                      )}
                      {connector.id() !== 'Disconnected'
                        ? connector.name()
                        : 'Wallet'}
                    </Button>
                  ))}
              </div>
            )}

            {/* {status === 'connected' ? (
            <p className="text-red-300">Error: {error.message}</p>
          ) : null} */}

            <hr className="my-4" />
            <div className="flex justify-between my-2 text-sm ">
              <p className="font-semibold tracking-widest uppercase">
                <Ethereum className="inline-block w-3 mr-2" />
                Ethereum
              </p>
              <Tooltip
                placement="right"
                tooltipText={
                  <div className="p-2 ml-4 text-white border rounded bg-slate-400/60">
                    <p className="text-xs">
                      Connect an Ethereum Wallet to bridge and check balances
                      across rollups.
                    </p>
                  </div>
                }
              >
                <QuestionMarkCircleIcon className="w-5 h-5 ml-4 " />
              </Tooltip>
            </div>
            <ConnectKitButton.Custom>
              {({ show, isConnected, truncatedAddress, ensName }) => {
                return (
                  <>
                    <Button
                      variant="outline"
                      className="w-full text-sm normal-case "
                      onClick={show}
                    >
                      <Ethereum className="w-3 mr-4" />{' '}
                      {isConnected ? (
                        ensName ?? truncatedAddress
                      ) : (
                        <span className="uppercase">Connect Wallet</span>
                      )}
                    </Button>
                  </>
                );
              }}
            </ConnectKitButton.Custom>
          </>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NetworkConnectButton;
