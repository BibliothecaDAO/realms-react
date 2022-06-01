import { Button, IconButton } from '@bibliotheca-dao/ui-lib';
import Ethereum from '@bibliotheca-dao/ui-lib/icons/eth.svg';
import { Menu, Transition, Popover } from '@headlessui/react';
import { Fragment } from 'react';
import { useWalletContext } from '@/hooks/useWalletContext';

const NetworkConnectDropdown = () => {
  const { connectWallet, isConnected, disconnectWallet, displayName, balance } =
    useWalletContext();
  return (
    <Popover className="relative">
      <Popover.Button as="div">
        <Button>{isConnected ? displayName : 'Connect'}</Button>{' '}
      </Popover.Button>
      <Popover.Panel className="absolute right-0 z-10">
        {isConnected && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        )}
        {!isConnected && (
          <Button variant="primary" className="w-full" onClick={connectWallet}>
            <Ethereum className="w-4 mr-4" /> Connect
          </Button>
        )}
      </Popover.Panel>
    </Popover>
    // <Menu as="div" className="relative inline-block text-left">
    //   <Menu.Button as="button">Connect</Menu.Button>
    //   <Transition
    //     as={Fragment}
    //     enter="transition ease-out duration-100"
    //     enterFrom="transform opacity-0 scale-95"
    //     enterTo="transform opacity-100 scale-100"
    //     leave="transition ease-in duration-75"
    //     leaveFrom="transform opacity-100 scale-100"
    //     leaveTo="transform opacity-0 scale-95"
    //   >
    //     <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    //     <Menu.Item as="div">
    // {isConnected && (
    //     <Button variant="secondary" className='w-full' onClick={disconnectWallet}>
    //     <Ethereum className="w-4 mx-4" /> {displayName} [ disconnect
    //     ]
    //     </Button>
    // )}
    // {!isConnected && (
    //     <Button variant="primary" className='w-full' onClick={connectWallet}>
    //     <Ethereum className="w-4 mr-4" /> Connect
    //     </Button>
    // )}
    //     </Menu.Item>
    //     </Menu.Items>
    //   </Transition>
    // </Menu>
  );
};

export default NetworkConnectDropdown;
