import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
  IconButton,
} from '@bibliotheca-dao/ui-lib';

import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther, parseEther } from '@ethersproject/units';
import { Switch } from '@headlessui/react';
import { useStarknetCall } from '@starknet-react/core';

import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { useState, useMemo, useReducer, useEffect } from 'react';
import type { ReactElement } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import type { Resource } from '@/context/ResourcesContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useLordsContract,
  useResources1155Contract,
  useExchangeContract,
} from '@/hooks/settling/stark-contracts';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useAddLiquidity, useRemoveLiquidity } from '@/hooks/useSwapResources';
import type { ResourceQty, LpQty } from '@/hooks/useSwapResources';

type ResourceRowProps = {
  resource: Resource & ResourceQty;
  availableResources: Resource[];
  isRemoveLp?: boolean;
  onResourceChange: (resourceId: number, newResourceId: number) => void;
  onQtyChange: (resourceId: number, qty: number) => void;
};

const displayRate = (rate: string) => {
  return (+formatEther(rate)).toFixed(4);
};

const calculateLords = (rate: string, qty: number) => {
  return +formatEther(rate) * qty;
};

const ResourceRow = (props: ResourceRowProps): ReactElement => {
  const { contract: exchangeContract } = useExchangeContract();

  const [time, setTime] = useState<NodeJS.Timeout | null>(null);
  const [currencyAndTokenBalance, setCurrencyAndTokenBalance] = useState({
    currency: '0',
    token: '0',
  });

  const {
    data: currencyAndTokenValues,
    refresh: updateCurrencyAndTokenValues,
    loading,
  } = useStarknetCall({
    contract: exchangeContract,
    method: 'get_owed_currency_tokens',
    args: [
      [bnToUint256(toBN(props.resource.resourceId))],
      [bnToUint256(toBN(props.resource.lp))],
    ],
  });

  useEffect(() => {
    if (!currencyAndTokenValues || !currencyAndTokenValues[0]) {
      return;
    }

    setCurrencyAndTokenBalance({
      currency: uint256ToBN(currencyAndTokenValues[0][0]).toString(10),
      token: uint256ToBN(currencyAndTokenValues[1][0]).toString(10),
    });
  }, [currencyAndTokenValues]);

  const handleValueChange = (newValue: ValueType | null) => {
    if (newValue === null) return;
    if (time) {
      clearTimeout(time);
    }
    let timerId: NodeJS.Timeout | null = null;
    timerId = setTimeout(() => {
      props.onQtyChange(
        props.resource.resourceId,
        parseInt(newValue as string)
      );
    }, 100);
    setTime(timerId);
  };

  const handleSelectChange = (newValue: number) => {
    props.onResourceChange(props.resource.resourceId, newValue);
  };

  return (
    <div className="flex p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.2)] bg-gray-900/70">
      <div className="sm:w-1/2">
        <Select
          optionIcons={true}
          value={props.resource?.resourceId}
          onChange={handleSelectChange}
        >
          <Select.Button
            label={props.resource?.resourceName ?? ''}
            variant={props.resource?.resourceName ? 'default' : 'placeholder'}
            icon={<ChevronRight className="w-5 h-5 transform -rotate-90" />}
            labelIcon={
              <ResourceIcon
                size="sm"
                resource={props.resource?.resourceName ?? ''}
              />
            }
          />
          <Select.Options>
            {props.availableResources.map((resource, idx) => (
              <Select.Option
                key={idx}
                value={resource.resourceId}
                label={resource.resourceName}
                selectedIcon={<ChevronRight />}
                icon={
                  <ResourceIcon
                    size="sm"
                    resource={resource?.resourceName ?? ''}
                  />
                }
              />
            ))}
          </Select.Options>
        </Select>
        <div className="flex flex-wrap mt-4">
          {/* <div className="self-center w-full text-sm font-semibold tracking-widest uppercase opacity-50">

          </div> */}
          <div className="flex justify-between space-x-2">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-40">
              {props.isRemoveLp ? 'remove' : 'add'}
            </span>
            <InputNumber
              value={props.resource.qty}
              inputSize="md"
              colorScheme="transparent"
              className="w-24 text-3xl font-semibold text-left"
              min={0}
              max={1000000}
              stringMode // to support high precision decimals
              onChange={handleValueChange}
            />{' '}
            <div className="flex self-end justify-end text-lg opacity-70">
              <span className="self-center mr-1 font-semibold">
                ~
                {calculateLords(
                  props.resource.rate,
                  props.resource.qty
                ).toFixed(2)}
              </span>{' '}
              {/* <LordsIcon className="self-center w-5 h-5" /> */}
            </div>
          </div>
          <div className="w-full pt-2 text-sm font-semibold tracking-widest uppercase border-t opacity-75 border-white/20">
            lp-{props.resource.resourceName}:{' '}
            {loading
              ? 'loading...'
              : (+formatEther(props.resource.lp)).toLocaleString()}{' '}
            <br />
            <span className="opacity-60">
              {' '}
              <span className="flex">
                -LORDS
                <Lords className="w-3 mr-1" />:{' '}
                {loading
                  ? 'loading...'
                  : (+formatEther(
                      currencyAndTokenBalance.currency
                    )).toLocaleString()}{' '}
              </span>
              <br />-{props.resource.resourceName}:{' '}
              {loading
                ? 'loading...'
                : (+formatEther(
                    currencyAndTokenBalance.token
                  )).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap self-end justify-end w-1/2 text-sm font-semibold tracking-widest text-right uppercase opacity-80">
        <div className="w-full">1 = {displayRate(props.resource.rate)} </div>
        <div className="w-full">
          {(+formatEther(props.resource.amount)).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export function LpMerchant(): ReactElement {
  const [tradeType, toggleTradeType] = useReducer((state: 'buy' | 'sell') => {
    return state === 'sell' ? 'buy' : 'sell';
  }, 'buy');

  const isBuy = tradeType === 'buy';
  const isSell = tradeType === 'sell';

  const { addLiquidity, loading: isAddLiquidityTransactionInProgress } =
    useAddLiquidity();

  const { removeLiquidity, loading: isRemoveLiquidityTransactionInProgress } =
    useRemoveLiquidity();

  const isTransactionInProgress =
    isAddLiquidityTransactionInProgress ||
    isRemoveLiquidityTransactionInProgress;

  const {
    availableResourceIds,
    selectedSwapResourcesWithBalance,
    getResourceById,
    lordsBalance,
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

  const deadline = () => {
    const maxDate = new Date();
    maxDate.setMinutes(maxDate.getMinutes() + 30);
    return Math.floor(maxDate.getTime() / 1000);
  };

  // get token ids
  const tokenIds = selectedSwapResourcesWithBalance.map(
    (resource) => resource.resourceId
  );

  function onAddLiquidityClick() {
    // TODO: check lords balance

    if (calculatedTotalInLords === 0 || isTransactionInProgress) return;

    const tokenAmounts = selectedSwapResourcesWithBalance.map((resource) =>
      parseEther(String(resource.qty))
    );

    // tokens * lords_price * (1 + slippage)
    const currencyAmounts = selectedSwapResourcesWithBalance.map((resource) =>
      parseEther(
        String(
          resource.qty * (parseInt(resource.rate) / 10 ** 18) * (1 + slippage)
        )
      )
    );

    addLiquidity(currencyAmounts, tokenIds, tokenAmounts, deadline());
  }

  function onRemoveLiquidityClick() {
    // TODO: check resource balances

    if (calculatedTotalInLords === 0 || isTransactionInProgress) return;

    const tokenAmounts = selectedSwapResourcesWithBalance.map((resource) => {
      // TODO: using 0 until the real rate is cached in indexer
      // const amount = String(
      //   resource.qty *
      //     (parseInt(resource.rate) / 10 ** 18) *
      //     (1 - slippage) *
      //     1000
      // );

      return parseEther('0');
    });

    // tokens * lords_price * (1 + slippage) / 1000
    const currencyAmounts = selectedSwapResourcesWithBalance.map((resource) => {
      // TODO: using 0 until the real rate is cached in indexer
      // const amount = String(
      //   resource.qty * (parseInt(resource.rate) / 10 ** 18) * (1 - slippage)
      // );
      return parseEther('0');
    });

    // we pass in the exact LP amount, currency and token amounts are computed via slippage
    const lpAmounts = selectedSwapResourcesWithBalance.map((resource) =>
      parseEther(String(resource.qty))
    );

    removeLiquidity(
      currencyAmounts,
      tokenIds,
      tokenAmounts,
      lpAmounts,
      deadline()
    );
  }

  function onTradeClicked() {
    if (isBuy) {
      onAddLiquidityClick();
    } else {
      onRemoveLiquidityClick();
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex mx-auto mb-8 text-sm tracking-widest">
        <div
          className={`px-4 uppercase ${tradeType === 'buy' && 'font-semibold'}`}
        >
          add LP
        </div>
        <Switch
          checked={isBuy}
          onChange={toggleTradeType}
          className={`${
            isBuy ? 'bg-green-600/40' : 'bg-blue-600/40'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              isSell ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
        <div className={`px-4 uppercase ${isSell && 'font-semibold'}`}>
          remove LP
        </div>
      </div>
      <div>
        {selectedSwapResourcesWithBalance.map((resource) => (
          <div className="relative" key={resource.resourceId}>
            <ResourceRow
              key={resource.resourceId}
              resource={resource}
              isRemoveLp={isSell}
              availableResources={availableResourceIds.map(
                (resourceId) => getResourceById(resourceId) as Resource
              )}
              onResourceChange={updateSelectedSwapResource}
              onQtyChange={updateSelectedSwapResourceQty}
            />
            <Button
              className="absolute top-3 right-3 border-white/20 "
              size="xs"
              variant="outline"
              onClick={() => removeSelectedSwapResource(resource.resourceId)}
            >
              x
            </Button>
          </div>
        ))}
        <div className="flex w-full">
          <Button
            aria-label="Add Row"
            size="xs"
            variant="primary"
            className="mx-auto"
            onClick={() => addSelectedSwapResources()}
          >
            add +
          </Button>
        </div>
      </div>

      <div className="flex justify-end w-full pt-4">
        <div className="flex flex-col justify-end w-full">
          <div className="flex flex-col py-4 rounded ">
            <div className="flex justify-end text-2xl font-semibold">
              <span className="flex">
                <span className="flex items-center mr-6 text-xs tracking-widest uppercase opacity-80">
                  {isBuy
                    ? [
                        'Total lords',
                        <Lords key={1} className="w-3 mr-2" />,
                        ' to spend:',
                      ]
                    : [
                        'Total lords',
                        <Lords key={1} className="w-3 mr-2" />,
                        ' received:',
                      ]}
                </span>
                {calculatedTotalInLords.toLocaleString()}
              </span>
            </div>
            <div>
              <div className="flex justify-end text-md">
                <span className="flex self-center mr-6 text-xs font-semibold tracking-widest uppercase opacity-80">
                  your lords <Lords className="w-3 mr-2" /> Balance:
                </span>
                {(+formatEther(lordsBalance)).toLocaleString()}{' '}
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            variant="primary"
            onClick={onTradeClicked}
            loading={isTransactionInProgress}
            disabled={isTransactionInProgress}
          >
            {isBuy ? 'add liquidity' : 'remove liquidity'}
          </Button>
        </div>
      </div>
    </div>
  );
}
