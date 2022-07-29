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
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { useState, useMemo, useReducer } from 'react';
import type { ReactElement } from 'react';
import type { Resource } from '@/context/ResourcesContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useBuyResources, useSellResources } from '@/hooks/useSwapResources';
import type { ResourceQty } from '@/hooks/useSwapResources';

type ResourceRowProps = {
  resource: Resource & ResourceQty;
  availableResources: Resource[];
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
  const [time, setTime] = useState<NodeJS.Timeout | null>(null);

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
      ); /* updatePercentByValue(newValue); */
    }, 300);
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
            icon={
              <ChevronRight className="w-5 h-5 text-white transform -rotate-90" />
            }
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
        <div className="flex mt-4">
          <div className="flex justify-between space-x-2">
            <InputNumber
              value={props.resource.qty}
              inputSize="md"
              colorScheme="transparent"
              className="w-20 text-xl font-semibold text-left sm:text-3xl"
              min={0}
              max={1000000}
              stringMode // to support high precision decimals
              onChange={handleValueChange}
            />{' '}
            <div className="flex self-end justify-end sm:text-lg opacity-70">
              <span className="self-center mr-1 font-semibold">
                ~{' '}
                {calculateLords(
                  props.resource.rate,
                  props.resource.qty
                ).toFixed(2)}
              </span>{' '}
              <LordsIcon className="self-center w-3 h-3 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap self-end justify-end w-1/2 text-xs font-semibold tracking-widest text-right uppercase sm:text-sm opacity-80">
        <div className="w-full">
          bal:{' '}
          {(+formatEther(props.resource.amount)).toFixed(2).toLocaleString()}
        </div>
        <div className="w-full">1 = {displayRate(props.resource.rate)}</div>
      </div>
    </div>
  );
};

export function SwapResources(): ReactElement {
  const [tradeType, toggleTradeType] = useReducer((state: 'buy' | 'sell') => {
    return state === 'sell' ? 'buy' : 'sell';
  }, 'buy');

  const isBuy = tradeType === 'buy';
  const isSell = tradeType === 'sell';

  const { buyTokens, loading: isBuyTransactionInProgress } = useBuyResources();
  const { sellTokens, loading: isSellTransactionInProgress } =
    useSellResources();

  const isTransactionInProgress =
    isBuyTransactionInProgress || isSellTransactionInProgress;

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

  const isSellButtonDisabled = useMemo(() => {
    if (isBuy) {
      return false;
    }

    return (
      !isResourcesApprovedForExchange ||
      selectedSwapResourcesWithBalance.filter(
        (resource) => resource.qty > parseFloat(formatEther(resource.amount))
      ).length !== 0
    );
  }, [
    tradeType,
    isResourcesApprovedForExchange,
    selectedSwapResourcesWithBalance,
  ]);

  const deadline = () => {
    const maxDate = new Date();
    maxDate.setMinutes(maxDate.getMinutes() + 30);
    return Math.floor(maxDate.getTime() / 1000);
  };

  // get token ids
  const tokenIds = selectedSwapResourcesWithBalance.map(
    (resource) => resource.resourceId
  );

  const tokenAmounts = selectedSwapResourcesWithBalance.map((resource) =>
    parseEther(String(resource.qty))
  );

  // TODO: Set actual slippage when indexer caches rates
  function onBuyTokensClick() {
    if (isBuyButtonDisabled) return;
    // const maxAmount = parseEther(
    //   String(calculatedTotalInLords + calculatedSlippage)
    // );
    const maxAmount = parseEther(String('0'));
    buyTokens(maxAmount, tokenIds, tokenAmounts, deadline());
  }

  // TODO: Set actual slippage when indexer caches rates
  function onSellTokensClick() {
    if (isSellButtonDisabled) return;
    // const minAmount = parseEther(
    //   String(calculatedTotalInLords - calculatedSlippage)
    // );
    const minAmount = parseEther(String('0'));
    sellTokens(minAmount, tokenIds, tokenAmounts, deadline());
  }

  function onTradeClicked() {
    if (isBuy) {
      onBuyTokensClick();
    } else {
      onSellTokensClick();
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex mx-auto mb-8 text-sm tracking-widest">
        <div
          className={`px-4 uppercase ${tradeType === 'buy' && 'font-semibold'}`}
        >
          Buy Resources
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
          Sell Resources
        </div>
      </div>
      <div>
        {selectedSwapResourcesWithBalance.map((resource) => (
          <div className="relative" key={resource.resourceId}>
            <ResourceRow
              key={resource.resourceId}
              resource={resource}
              availableResources={availableResourceIds.map(
                (resourceId) => getResourceById(resourceId) as Resource
              )}
              onResourceChange={updateSelectedSwapResource}
              onQtyChange={updateSelectedSwapResourceQty}
            />
            <IconButton
              className="absolute top-3 right-3 hover:bg-red-900"
              icon={<Danger className="w-3 h-3" />}
              aria-label="Remove Row"
              size="xs"
              onClick={() => removeSelectedSwapResource(resource.resourceId)}
            />
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

          <Button
            className="w-full"
            variant="primary"
            onClick={onTradeClicked}
            disabled={isBuyButtonDisabled || isSellButtonDisabled}
          >
            {isTransactionInProgress
              ? 'Pending...'
              : isBuy
              ? 'buy resources'
              : 'sell resources'}
          </Button>
        </div>
      </div>
    </div>
  );
}
