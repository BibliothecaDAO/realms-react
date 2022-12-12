/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
import EternumIcon from '@bibliotheca-dao/ui-lib/icons/eternum_icon.svg';
import TopLeftFrameGold from '@bibliotheca-dao/ui-lib/icons/frame/top-left_gold.svg';
import TopLeftFrame from '@bibliotheca-dao/ui-lib/icons/frame/top-left_no-ink.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import { ResourceSwapSideBar } from '@/components/bank/ResourceSwapSideBar';
import { EmpireSideBar } from '@/components/empire/EmpireSideBar';
import NetworkConnectButton from '@/components/ui/NetworkConnectButton';
import { useBankContext } from '@/context/BankContext';
import { useUIContext } from '@/context/UIContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { OnboardingSidebar } from '../onboarding/OnboardingSidebar';

export const TopLeftNav = () => {
  const { lordsBalance } = useUserBalancesContext();
  const { pathname } = useRouter();
  const { address } = useAccount();
  const {
    empireSidebar,
    toggleEmpire,
    tradeSidebar,
    toggleTrade,
    closeAll,
    onboarding,
    toggleOnboarding,
  } = useUIContext();

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
        <div className="absolute z-50 w-48 h-8 top-1 lg:w-64 lg:h-10 md:pl-16 lg:pl-24 md:text-xs lg:text-lg shadow-red-900 text-gray-1000">
          {address && (
            <Button
              className="flex px-2 py-1 "
              onClick={onLordsNavClick}
              variant="unstyled"
            >
              <Lords className="self-center stroke-current md:w-4 lg:w-6" />{' '}
              <span className="self-center md:pl-2 lg:pl-4">
                {(+formatEther(lordsBalance)).toLocaleString()}
              </span>
            </Button>
          )}
        </div>
        <TopLeftFrameGold className="absolute w-[14rem] pointer-events-none stroke-yellow-900" />
        <TopLeftFrame className="absolute pointer-events-none w-72" />

        <div className="absolute z-50 left-2 top-2 jr-empire">
          <Button
            onClick={toggleEmpire}
            variant="unstyled"
            className="rounded-full group md:w-12 md:h-12 lg:w-16 lg:h-16"
          >
            <div className="absolute top-0 left-0 md:top-[4.75rem] md:left-[4.75rem] lg:top-[0.8rem] lg:left-[0.8rem] z-50">
              <EternumIcon className="transition-all duration-300 fill-yellow-700 md:h-6 md:w-6 lg:w-9 lg:h-9 group-hover:fill-yellow-800" />
            </div>
          </Button>
        </div>
        {/* <div className="absolute z-50 left-[15rem] top-2">
          <Button
            onClick={toggleOnboarding}
            variant="unstyled"
            className="rounded-full group md:w-12 md:h-12 lg:w-16 lg:h-16"
          >
            <div className="absolute top-0 left-0 md:top-[4.75rem] md:left-[4.75rem] lg:top-[0.8rem] lg:left-[0.8rem] z-50">
              <EternumIcon className="transition-all duration-300 fill-yellow-700 md:h-6 md:w-6 lg:w-9 lg:h-9 group-hover:fill-yellow-800" />
            </div>
          </Button>
        </div> */}
      </div>

      <EmpireSideBar isOpen={empireSidebar} onClose={toggleEmpire} />
      <ResourceSwapSideBar isOpen={tradeSidebar} onClose={onLordsNavClick} />
      {/* <OnboardingSidebar isOpen={onboarding} onClose={toggleOnboarding} /> */}
    </div>
  );
};
