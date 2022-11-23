/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';

import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import { EmpireSideBar } from '@/components/sidebars/EmpireSideBar';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useUIContext } from '@/context/UIContext';
import NetworkConnectButton from '@/shared/NetworkConnectButton';
import { ResourceSwapSideBar } from '../sidebars/ResourceSwapSideBar';

export const TopLeftNav = () => {
  const { lordsBalance } = useResourcesContext();
  const { pathname } = useRouter();
  const { address } = useAccount();
  const { empireSidebar, toggleEmpire, tradeSidebar, toggleTrade } =
    useUIContext();

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    toggleTrade();
  }

  return (
    <div className="absolute z-50">
      <div className="relative">
        <div className="w-48 lg:w-64 h-8 lg:h-10 md:pl-16 lg:pl-28 absolute top-0 bg-white border-b border-r border-yellow-800 rounded-br-full shadow-md  bg-black md:text-xs lg:text-lg">
          {address && (
            <Button
              className="flex py-2 px-2 "
              onClick={onLordsNavClick}
              variant="unstyled"
            >
              <Lords className="md:w-4 lg:w-6 fill-current" />{' '}
              <span className="md:pl-2 lg:pl-4">
                {(+formatEther(lordsBalance)).toLocaleString()}
              </span>
            </Button>
          )}
        </div>
        <div className="absolute z-50 md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24">
          <Button
            onClick={toggleEmpire}
            variant="unstyled"
            className=" rounded-r-full rounded-b-full md:w-32 md:h-32 lg:w-48 lg:h-48 shadow-lg border-yellow-800 border shadow-red-100/20 hover:bg-gray-1000 bg-black"
          >
            <div className="absolute top-0 left-0 md:top-[4.75rem] md:left-[4.75rem] lg:top-28 lg:left-28 z-50">
              <Crown className="md:h-6 md:w-6 lg:w-9 lg:h-9 fill-current" />
            </div>
          </Button>
        </div>
        {/* {address && <TransactionNavItem onClick={onTransactionNavClick} />} */}
      </div>
      <div className="pl-48 lg:pl-64">
        <NetworkConnectButton />
      </div>
      <EmpireSideBar isOpen={empireSidebar} onClose={toggleEmpire} />
      <ResourceSwapSideBar isOpen={tradeSidebar} onClose={onLordsNavClick} />
    </div>
  );
};
