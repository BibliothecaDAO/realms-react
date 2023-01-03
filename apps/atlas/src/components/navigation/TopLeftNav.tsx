/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import EternumIcon from '@bibliotheca-dao/ui-lib/icons/eternum_icon.svg';
import TopLeftFrameGold from '@bibliotheca-dao/ui-lib/icons/frame/top-left_gold.svg';
import TopLeftFrame from '@bibliotheca-dao/ui-lib/icons/frame/top-left_no-ink.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';

import { useRouter } from 'next/router';
import { useState } from 'react';
import NetworkConnectButton from '@/components/ui/NetworkConnectButton';
import { resources } from '@/constants/resources';
import { useBankContext } from '@/context/BankContext';
import { useUIContext } from '@/context/UIContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { OnboardingSidebar } from '../onboarding/OnboardingSidebar';

export const TopLeftNav = () => {
  const { lordsBalance } = useUserBalancesContext();
  const { pathname } = useRouter();
  const { address } = useAccount();
  const { toggleEmpire, toggleTrade } = useUIContext();

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    toggleTrade();
  }

  const { getResourceById } = useBankContext();

  const { balance, getBalanceById } = useUserBalancesContext();

  const resourcesList = resources?.map((resource) => {
    const bankResource = getResourceById(resource.id);
    const balance = getBalanceById(resource.id);

    return (
      <div key={resource.id} className="flex items-center text-sm">
        <ResourceIcon className="mr-2" size="xs" resource={resource.trait} />
        {resource?.trait}:
        <div
          className={
            'block w-full ml-2 tracking-widest uppercase ' +
            ((balance?.amount || 0) > 0
              ? 'text-green-600 shadow-green-100 drop-shadow-lg'
              : 'text-red-200')
          }
        >
          {(+formatEther(balance?.amount || 0)).toLocaleString()}
        </div>
      </div>
    );
  });
  return (
    <div className="absolute z-50 ">
      {/* <div className="w-full h-screen pointer-events-none z-100 bg-paperTexture bg-blend-multiply"></div> */}
      <div className="relative">
        <div className="absolute z-50 w-48 h-8 top-1 lg:w-64 lg:h-10 md:pl-16 lg:pl-24 md:text-xs lg:text-lg shadow-red-900 text-gray-1000">
          {address && (
            <Tooltip
              placement="right"
              tooltipText={
                <div className="right-0 p-4 mt-4 -ml-8 text-white border-4 rounded shadow-md rounded-2xl bg-gradient-to-r from-gray-900 to-gray-1000 border-yellow-800/60 shadow-yellow-800/60 z-100">
                  <div className="text-center">Available resources:</div>
                  <div className="grid grid-cols-2 gap-4 mt-2 whitespace-nowrap w-80">
                    {resourcesList}
                  </div>
                </div>
              }
            >
              <Button
                className="flex px-2 py-1 "
                onClick={onLordsNavClick}
                variant="unstyled"
              >
                <Lords className="self-center md:w-4 lg:w-6 fill-gray-900" />{' '}
                <span className="self-center md:pl-2 lg:pl-2 text-amber-100 ">
                  {(+formatEther(lordsBalance)).toLocaleString()}
                </span>
              </Button>
            </Tooltip>
          )}
        </div>
        <TopLeftFrameGold className="absolute w-[14rem] pointer-events-none fill-yellow-700 " />
        <TopLeftFrame className="absolute pointer-events-none w-72 fill-gray-900 " />

        <div className="absolute z-50 left-2 top-2 jr-empire paper">
          <Button
            onClick={toggleEmpire}
            variant="unstyled"
            className="rounded-full group md:w-12 md:h-12 lg:w-16 lg:h-16"
          >
            <div className="absolute top-0 left-0 md:top-[4.70rem] md:left-[4.70rem] lg:top-[0.7rem] lg:left-[0.7rem] z-50 rounded-full p-1">
              <EternumIcon className="transition-all duration-300 shadow-inner drop-shadow-lg fill-gray-900 md:h-6 md:w-6 lg:w-9 lg:h-9 group-hover:fill-yellow-800" />
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
      {/* <OnboardingSidebar isOpen={onboarding} onClose={toggleOnboarding} /> */}
    </div>
  );
};
