import { Button } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import ArgentX from '@bibliotheca-dao/ui-lib/icons/argentX.svg';
import Braavos from '@bibliotheca-dao/ui-lib/icons/braavos.svg';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import Guildly from '@bibliotheca-dao/ui-lib/icons/guildly.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet_icon.svg';
import { Popover, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAccount, useConnectors } from '@starknet-react/core';
import { ConnectKitButton } from 'connectkit';
import { useEffect } from 'react';
import { encode } from 'starknet';
import { useUIContext } from '@/context/UIContext';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { shortenAddressWidth } from '@/util/formatters';

const NetworkConnectButton = () => {
  const { connect, available, refresh, disconnect } = useConnectors();
  const { address, status, connector } = useAccount();
  const { toggleAccountSettings } = useUIContext();
  const { starknetId } = useStarkNetId(address || '');

  const getConnectorLogo = (connector) => {
    switch (connector) {
      case 'argentX':
        return <ArgentX className="inline-block w-4 mr-4" />;
      case 'braavos':
        return <Braavos className="inline-block w-4 mr-4" />;
      case 'guildly':
        return <Guildly className="inline-block w-5 mr-4" />;
    }
  };

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh, address]);

  return (
    <>
      {!address ? (
        <Popover className="relative">
          <Popover.Button
            className={
              'px-4 py-1 text-frame-secondary lg:py-2 hover:bg-white/30 transition-all duration-200 rounded-md'
            }
            as="div"
          >
            <StarkNet
              className={
                'inline-block w-4 mr-2 -ml-2 fill-frame-secondary pb-1'
              }
            />{' '}
            {starknetId ?? starknetId}
            {!starknetId && address
              ? encode.removeHexPrefix(shortenAddressWidth(address, 4))
              : ''}
            {!address && 'Connect'}
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
                <h4>Game Networks</h4>

                <div className="flex justify-between my-2 text-sm ">
                  <span className="flex uppercase ">
                    <StarkNet className="inline-block w-4 mr-2 fill-current" />
                    StarkNet
                  </span>
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
                  <span className="flex uppercase">
                    <Ethereum className="inline-block w-3 mr-2" />
                    Ethereum
                  </span>
                  <Tooltip
                    placement="auto-start"
                    tooltipText={
                      <div className="p-2 ml-4 text-white border rounded bg-slate-600/90">
                        <p className="text-xs">
                          Connect an Ethereum Wallet to bridge and check
                          balances across rollups.
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
      ) : (
        <Button
          variant="unstyled"
          className="px-4 py-1 text-frame-secondary lg:py-2 hover:bg-white/30 transition-all duration-200 rounded-md"
          onClick={toggleAccountSettings}
        >
          {' '}
          {starknetId ?? starknetId}
          {!starknetId && address
            ? encode.removeHexPrefix(shortenAddressWidth(address, 4))
            : ''}
        </Button>
      )}
    </>
  );
};

export default NetworkConnectButton;
