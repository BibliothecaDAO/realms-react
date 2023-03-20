/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import EternumIcon from '@bibliotheca-dao/ui-lib/icons/eternum_icon.svg';
import TopLeftFrameGold from '@bibliotheca-dao/ui-lib/icons/frame/top-left_gold.svg';
import TopLeftFrame from '@bibliotheca-dao/ui-lib/icons/frame/top-left_no-ink.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { Transition } from '@headlessui/react';
import { useAccount } from '@starknet-react/core';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { number } from 'starknet';
import {
  vaultValueAtMarketprice,
  calculateLords,
  getResourceCostInLords,
} from '@/components/bank/BankGetters';
import { resources } from '@/constants/resources';
import { framePrimary, frameSecondary } from '@/constants/ui';
import { useUIContext } from '@/context/UIContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { convertToK } from '../realms/RealmsGetters';

export const TopLeftNav = () => {
  const { lordsBalance } = useUserBalancesContext();
  const { pathname } = useRouter();
  const { address } = useAccount();
  const { toggleEmpire, toggleTrade } = useUIContext();
  const [isBalanceHovered, setIsBalanceHovered] = useState(false);

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    toggleTrade();
  }

  const { getBalanceById } = useUserBalancesContext();
  const {
    getTotalLordsCost,
    getLordsCostForResourceAmount,
    getCurrentMarketById,
  } = useMarketRate();

  const resourcesList = resources?.map((resource) => {
    const currentMarketPriceForResource = getCurrentMarketById({
      resourceId: resource.id,
    });
    const balance = getBalanceById(resource.id);

    const marketPrice = getResourceCostInLords(
      balance?.amount || '0',
      currentMarketPriceForResource?.sellAmount || '0'
    );

    return (
      <div
        key={resource.id}
        className="flex flex-wrap items-center w-full text-sm"
      >
        <div className="mr-2">
          <ResourceIcon size="xs" resource={resource.trait} />
        </div>
        <div>
          <span className="opacity-80"> {resource?.trait}</span>

          <div
            className={
              'block w-full tracking-widest uppercase ' +
              ((balance?.amount || 0) > 0
                ? 'text-green-700 shadow-green-100 drop-shadow-lg font-semibold'
                : 'text-red-200')
            }
          >
            {convertToK(+formatEther(balance?.amount || 0))} <br />
          </div>
          <span className="text-gray-600">
            {(+formatEther(marketPrice || 0)).toLocaleString()}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="absolute z-30 ">
      <div className="relative">
        <div className="absolute z-20 w-48 h-8 pl-16 text-sm top-0.5 lg:top-[3px] lg:w-96 lg:h-10 lg:pl-24 lg:text-lg shadow-red-900 text-gray-1000">
          {address && (
            <Tooltip
              placement="right"
              tooltipText={
                <Transition
                  show={isBalanceHovered}
                  enter="transition ease-in-out duration-500"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <div className="right-0 p-2 -ml-32 rounded bg-yellow-scroll z-100">
                    <div className="p-4 text-white rounded-xl bg-gradient-to-r from-gray-900 to-gray-1000">
                      <div className="text-center">Available Resources</div>
                      <div className="grid grid-cols-3 gap-3 mt-4 whitespace-nowrap w-[500px]">
                        {resourcesList}
                      </div>
                    </div>
                  </div>
                </Transition>
              }
            >
              <Button
                className="flex items-center px-2 py-1"
                onClick={onLordsNavClick}
                variant="unstyled"
                onMouseEnter={() => setIsBalanceHovered(true)}
                onMouseLeave={() => setIsBalanceHovered(false)}
              >
                <Lords className="self-center md:w-4 lg:w-5 fill-frame-secondary" />{' '}
                <span className="self-center md:pl-2 lg:pl-2 text-frame-secondary ">
                  {(+formatEther(lordsBalance)).toLocaleString()}
                </span>
              </Button>
            </Tooltip>
          )}
        </div>
        <TopLeftFrameGold
          className={`absolute w-[10rem] lg:w-[14rem] pointer-events-none fill-frame-secondary stroke-frame-secondary`}
        />
        <TopLeftFrame
          className={`absolute w-[13rem] pointer-events-none lg:w-72 fill-${framePrimary} `}
        />

        <div className="absolute z-20 left-2 top-2 jr-empire paper">
          <Button
            onClick={toggleEmpire}
            variant="unstyled"
            className="w-10 h-10 rounded-full lg:w-16 lg:h-16 group"
          >
            <div className="absolute top-[0.33rem] left-[0.33rem] lg:top-[0.7rem] lg:left-[0.7rem] z-20 rounded-full p-1">
              <EternumIcon className="w-6 h-6 transition-all duration-300 shadow-inner drop-shadow-lg fill-frame-secondary lg:w-9 lg:h-9 group-hover:fill-frame-secondary" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
