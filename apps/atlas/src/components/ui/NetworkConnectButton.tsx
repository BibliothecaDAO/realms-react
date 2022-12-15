import { Button } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import ArgentX from '@bibliotheca-dao/ui-lib/icons/argentX.svg';
import Braavos from '@bibliotheca-dao/ui-lib/icons/braavos.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Guildly from '@bibliotheca-dao/ui-lib/icons/guildly.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { Popover, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAccount, useConnectors } from '@starknet-react/core';
import { ConnectKitButton } from 'connectkit';
import { useEffect } from 'react';
import { removeHexPrefix } from 'starknet/dist/utils/encode';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { shortenAddressWidth } from '@/util/formatters';

const NetworkConnectButton = () => {
  const { connect, available, refresh, disconnect } = useConnectors();
  const { address, status, connector } = useAccount();

  const { starknetId } = useStarkNetId(address || '');

  const getConnectorLogo = (connector) => {
    switch (connector) {
      case 'argentX':
        return <ArgentX className="inline-block w-4 mr-4" />;
        break;
      case 'braavos':
        return <Braavos className="inline-block w-4 mr-4" />;
        break;
      case 'guildly':
        return <Guildly className="inline-block w-5 mr-4" />;
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh, address]);

  return (
    <Popover className="relative">
      <Popover.Button as="div">
        <div className="px-4 py-1 text-black lg:py-2">
          {' '}
          <StarkNet className={'inline-block w-4 mr-2 -ml-2'} />{' '}
          {starknetId ?? starknetId}
          {!starknetId && address
            ? removeHexPrefix(shortenAddressWidth(address, 4))
            : ''}
          {!address && 'Connect'}
        </div>{' '}
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute left-0 w-64 p-6 my-2 -mt-64 rounded-md shadow-xl z-100 bg-gray-1000">
          <>
            <h3>Game Networks</h3>
            <hr />
            <div className="flex justify-between my-2 text-sm ">
              <p className="font-semibold tracking-widest uppercase">
                <StarkNet className="inline-block w-4 mr-2" />
                StarkNet
              </p>
              <Tooltip
                placement="auto-start"
                className="ml-5 "
                tooltipText={
                  <div className="p-2 ml-4 text-white border rounded bg-slate-600/90">
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
                size="xs"
              >
                {getConnectorLogo(connector.id())}
                {shortenAddressWidth(address, 4)}X
              </Button>
            ) : (
              <div className="flex flex-col space-y-1">
                {available.length
                  ? available.map((connector) => (
                      <Button
                        variant="outline"
                        className="w-full text-sm"
                        key={connector.id()}
                        onClick={() => connect(connector)}
                      >
                        {getConnectorLogo(connector.id())}

                        {connector.id() !== 'Disconnected'
                          ? connector.name()
                          : 'Wallet'}
                      </Button>
                    ))
                  : 'L2 wallet not available (Download ArgentX)'}
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
                placement="auto-start"
                tooltipText={
                  <div className="p-2 ml-4 text-white border rounded bg-slate-600/90">
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
