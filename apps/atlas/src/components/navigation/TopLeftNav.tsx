/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import Crown from '@bibliotheca-dao/ui-lib/icons/crown.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';

import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import { ResourceSwapSideBar } from '@/components/bank/ResourceSwapSideBar';
import { EmpireSideBar } from '@/components/empire/EmpireSideBar';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useUIContext } from '@/context/UIContext';
import NetworkConnectButton from '@/shared/NetworkConnectButton';

export const TopLeftNav = () => {
  const { lordsBalance } = useResourcesContext();
  const { pathname } = useRouter();
  const { address } = useAccount();
  const { empireSidebar, toggleEmpire, tradeSidebar, toggleTrade, closeAll } =
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
        <div className="absolute top-0 w-48 h-8 bg-black border-b border-r border-yellow-900 rounded-br-full shadow-sm lg:w-64 lg:h-10 md:pl-16 lg:pl-28 md:text-xs lg:text-lg shadow-red-900">
          {address && (
            <Button
              className="flex px-2 py-1 "
              onClick={onLordsNavClick}
              variant="unstyled"
            >
              <Lords className="self-center fill-current md:w-4 lg:w-6" />{' '}
              <span className="self-center md:pl-2 lg:pl-4">
                {(+formatEther(lordsBalance)).toLocaleString()}
              </span>
            </Button>
          )}
        </div>
        <div className="absolute z-50 md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24">
          <Button
            onClick={toggleEmpire}
            variant="unstyled"
            className="bg-black border border-yellow-800 rounded-b-full rounded-r-full shadow-lg md:w-32 md:h-32 lg:w-48 lg:h-48 shadow-red-100/20 hover:bg-gray-900 "
          >
            <div className="absolute top-0 left-0 md:top-[4.75rem] md:left-[4.75rem] lg:top-[7.4rem] lg:left-28 z-50">
              <Crown className="fill-current md:h-6 md:w-6 lg:w-9 lg:h-9" />
            </div>
          </Button>
        </div>
        {/* {address && <TransactionNavItem onClick={onTransactionNavClick} />} */}
      </div>
      <div className="pl-48 bg-black border-b border-r border-yellow-900 rounded-br-3xl lg:pl-64">
        <NetworkConnectButton />
      </div>
      <EmpireSideBar isOpen={empireSidebar} onClose={toggleEmpire} />
      <ResourceSwapSideBar isOpen={tradeSidebar} onClose={onLordsNavClick} />
    </div>
  );
};
