import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
  IconButton,
} from '@bibliotheca-dao/ui-lib';

import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther, parseEther } from '@ethersproject/units';
import { Switch } from '@headlessui/react';
import { useStarknetCall, useStarknet } from '@starknet-react/core';

import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { useState, useMemo, useReducer, useEffect } from 'react';
import type { ReactElement } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import type { Resource } from '@/context/ResourcesContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useNexusContract,
  useSplitterContract,
  useLordsContract,
  useResources1155Contract,
  useExchangeContract,
  ModuleAddr,
} from '@/hooks/settling/stark-contracts';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useStakeLords } from '@/hooks/useNexus';
import type { ResourceQty, LpQty } from '@/hooks/useSwapResources';

type ResourceRowProps = {
  buy?: boolean;
};

const displayRate = (rate: string) => {
  return (+formatEther(rate)).toFixed(4);
};

const calculateLords = (rate: string, qty: number) => {
  return +formatEther(rate) * qty;
};

const LordsInput = (props: ResourceRowProps): ReactElement => {
  const [time, setTime] = useState<NodeJS.Timeout | null>(null);
  const { account } = useStarknet();
  const { contract: exchangeContract } = useExchangeContract();
  const { contract: lordsContract } = useLordsContract();
  const { contract: nexusContract } = useNexusContract();

  const { stakeLords, loading: loadingStakeLords } = useStakeLords();

  const ownerAddressInt = toBN(account);

  const splitterAddressInt = toBN(ModuleAddr.Splitter as string).toString();
  const nexusAddressInt = toBN(ModuleAddr.Nexus as string).toString();

  const [balances, setBalances] = useState({
    splitter: '0',
    nexus: '0',
  });

  const {
    data: splitterBalanceValues,
    refresh: updateSplitterBalanceValuesValues,
    loading: loadingSplitter,
  } = useStarknetCall({
    contract: lordsContract,
    method: 'balanceOf',
    args: [splitterAddressInt],
  });

  const {
    data: nexusBalanceValues,
    refresh: updateNexusBalanceValues,
    loading: loadingNexus,
  } = useStarknetCall({
    contract: lordsContract,
    method: 'balanceOf',
    args: [nexusAddressInt],
  });

  const {
    data: userStLordsBalanceValues,
    refresh: updateUserStLordsBalanceValues,
    loading: loadingUserBalances,
  } = useStarknetCall({
    contract: nexusContract,
    method: 'balanceOf',
    args: [nexusAddressInt],
  });

  useEffect(() => {
    if (
      !splitterBalanceValues ||
      !splitterBalanceValues[0] ||
      !nexusBalanceValues ||
      !nexusBalanceValues[0]
    ) {
      return;
    }

    setBalances({
      splitter: uint256ToBN(splitterBalanceValues[0]).toString(10),
      nexus: uint256ToBN(nexusBalanceValues[0]).toString(10),
    });
  }, [splitterBalanceValues, nexusBalanceValues]);

  const handleValueChange = (newValue: ValueType | null) => {
    if (newValue === null) return;
    if (time) {
      clearTimeout(time);
    }
    const timerId: NodeJS.Timeout | null = null;
    // timerId = setTimeout(() => {
    //   props.onQtyChange(
    //     props.resource.resourceId,
    //     parseInt(newValue as string)
    //   ); /* updatePercentByValue(newValue); */
    // }, 300);
    setTime(timerId);
  };

  function onStakeLords() {
    if (!account) {
      return;
    }
    stakeLords(parseEther(String(2000)), account);
  }

  return (
    <div className="flex p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.2)] bg-gray-900/70">
      <div className="sm:w-1/2">
        <div className="flex flex-wrap mt-4">
          <div className="flex flex-wrap justify-between w-full space-x-2">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-40">
              stake lords
            </span>
            <InputNumber
              value={0}
              inputSize="md"
              colorScheme="transparent"
              className="w-20 text-xl font-semibold text-left sm:text-3xl"
              min={0}
              max={1000000}
              stringMode // to support high precision decimals
              onChange={handleValueChange}
            />{' '}
            <div
              className={`flex self-end justify-end uppercase sm:text-lg opacity-70  ${
                props.buy ? 'text-red-200' : 'text-green-200'
              }`}
            >
              {/* <LordsIcon className="self-center w-3 h-3 fill-current sm:w-5 sm:h-5" /> */}
            </div>
          </div>
          <div className="w-full pt-2 uppercase border-t border-white/30">
            nx-LORDS : {(+formatEther(balances.nexus)).toLocaleString()}
            <br />
            Nexus balance : {(+formatEther(balances.nexus)).toLocaleString()}
            <br />
            {/* Splitter : {(+formatEther(balances.splitter)).toLocaleString()} */}
          </div>
          <button onClick={onStakeLords}>stake</button>
        </div>
      </div>
    </div>
  );
};

export function Nexus(): ReactElement {
  const [tradeType, toggleTradeType] = useReducer((state: 'buy' | 'sell') => {
    return state === 'sell' ? 'buy' : 'sell';
  }, 'buy');

  const isBuy = tradeType === 'buy';
  const isSell = tradeType === 'sell';

  const {
    availableResourceIds,
    lordsBalance,
    selectedSwapResourcesWithBalance,
    getResourceById,
    addSelectedSwapResources,
    removeSelectedSwapResource,
    updateSelectedSwapResourceQty,
    updateSelectedSwapResource,
  } = useResourcesContext();
  const { approveLords, isApproved: isLordsApprovedForExchange } =
    useApproveLordsForExchange();
  const { approveResources, isApproved: isResourcesApprovedForExchange } =
    useApproveResourcesForExchange();

  const [slippage, setSlippage] = useState(0.5);

  const calculatedTotalInLords = useMemo(() => {
    return selectedSwapResourcesWithBalance.reduce((acc, resource) => {
      return acc + calculateLords(resource.rate, resource.qty);
    }, 0);
  }, [selectedSwapResourcesWithBalance]);

  const calculatedSlippage = useMemo(() => {
    return calculatedTotalInLords * slippage;
  }, [calculatedTotalInLords, slippage]);

  const isBuyButtonDisabled = useMemo(() => {
    if (isSell) {
      return false;
    }
    const balance = parseFloat(formatEther(lordsBalance));
    return (
      !isLordsApprovedForExchange ||
      balance === 0 ||
      balance < calculatedTotalInLords
    );
  }, [
    tradeType,
    isLordsApprovedForExchange,
    isResourcesApprovedForExchange,
    lordsBalance,
    calculatedTotalInLords,
  ]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex mx-auto mb-8 text-sm tracking-widest">
        <div
          className={`px-4 uppercase ${tradeType === 'buy' && 'font-semibold'}`}
        >
          Stake Lords
        </div>
        <Switch
          checked={isBuy}
          onChange={toggleTradeType}
          className={`${
            isBuy ? 'bg-green-600/40' : 'bg-blue-600/40'
          } relative inline-flex h-6 w-11 items-center rounded-full shadow-inner`}
        >
          <span className="sr-only">Buy/Sell</span>
          <span
            className={`${
              isSell ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
        <div className={`px-4 uppercase ${isSell && 'font-semibold'}`}>
          Remove Lords
        </div>
      </div>
      <div>
        <div className="relative">
          <LordsInput />
        </div>
      </div>
      <div className="flex justify-end w-full pt-4">
        <div className="flex flex-col justify-end w-full">
          <div className="flex flex-col py-4 rounded ">
            <div className="flex justify-end text-2xl font-semibold">
              <span>
                <span className="mr-6 text-xs tracking-widest uppercase opacity-80">
                  Your total in LORDS:
                </span>
                {calculatedTotalInLords.toLocaleString()}
              </span>
            </div>
            <div>
              <div className="flex justify-end text-md">
                <span className="self-center mr-6 text-xs font-semibold tracking-widest uppercase opacity-80">
                  your lords Balance:
                </span>
                {(+formatEther(lordsBalance)).toLocaleString()}{' '}
              </div>
            </div>
          </div>

          {/* <Button
            className="w-full"
            variant="primary"
            onClick={onTradeClicked}
            disabled={isBuyButtonDisabled || isSellButtonDisabled}
          >
            {isTransactionInProgress ? 'Pending...' : isBuy ? 'add' : 'remove'}
          </Button> */}
        </div>
      </div>
    </div>
  );
}
