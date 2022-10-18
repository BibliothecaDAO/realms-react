/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import StarkNet from '@bibliotheca-dao/ui-lib/icons/starknet-logo.svg';
import { Menu, Transition, Popover } from '@headlessui/react';
import { MapIcon } from '@heroicons/react/24/outline';
import { useAccount, useConnectors } from '@starknet-react/core';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { shortenAddressWidth } from '@/util/formatters';
//import { useWalletContext } from '../../../atlas/src/hooks/useWalletContext';
export function DesiegeHeader() {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  const { connectors, connect } = useConnectors();
  const { address } = useAccount();

  const router = useRouter();

  const navItemClass =
    'font-body bg-gray-100 rounded px-3 py-2 flex items-center';
  const navItemClassBtn =
    'font-body bg-white rounded px-3 py-2 flex items-center hover:bg-gray-200';

  return (
    <div>
      <div className="absolute z-20 hidden w-full top-6 md:flex">
        <div className="px-8 ml-auto">
          <div className="flex p-2 mr-auto space-x-4 text-xl text-black rounded">
            {isConnected ? (
              <>
                <span className={navItemClass}>LORDS: {balance}</span>
                <Menu as="div" className="relative">
                  <Menu.Button className={navItemClassBtn}>
                    <Ethereum className="w-4 mr-2" />
                    {displayName}
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items>
                      <Menu.Item
                        as={'button'}
                        className={classNames(
                          navItemClassBtn,
                          'absolute left-0 w-full mt-2 top-full'
                        )}
                        onClick={disconnectWallet}
                      >
                        Disconnect
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <button className={navItemClassBtn} onClick={connectWallet}>
                Connect to Lootverse
              </button>
            )}
            {address ? (
              <span
                className={navItemClass}
                onClick={() => {
                  connect(connectors[0]);
                }}
              >
                <StarkNet className="w-5 mr-2" />
                {shortenAddressWidth(address, 4)}
              </span>
            ) : (
              <button
                className={navItemClassBtn}
                onClick={() => {
                  connect(connectors[0]);
                }}
              >
                Connect to StarkNet
              </button>
            )}
            <Popover as="div">
              <Popover.Button className={navItemClassBtn}>
                <MapIcon className="w-5 mr-2" /> Atlas
              </Popover.Button>

              <Popover.Panel
                className={classNames('absolute right-8 top-full')}
              >
                <button
                  className={navItemClassBtn}
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  Return to Atlas?
                </button>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
