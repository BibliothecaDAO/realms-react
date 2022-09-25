import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
  IconButton,
} from '@bibliotheca-dao/ui-lib';

import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import CloseX from '@bibliotheca-dao/ui-lib/icons/close.svg';
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
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { useBuyResources, useSellResources } from '@/hooks/useSwapResources';
import type { ResourceQty } from '@/hooks/useSwapResources';
import { MarketSelect } from '@/shared/Market/MarketSelect';
import type { ResourceCost } from '@/types/index';

type ResourceRowProps = {
  resource: Resource & ResourceQty;
  availableResources: Resource[];
  onResourceChange: (resourceId: number, newResourceId: number) => void;
  onQtyChange: (resourceId: number, qty: number) => void;
  buy?: boolean;
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
            icon={<ChevronRight className="w-5 h-5 transform -rotate-90 " />}
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
          <div className="flex flex-wrap justify-between space-x-2 ">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-40">
              swap
            </span>
            <InputNumber
              value={props.resource.qty}
              inputSize="md"
              colorScheme="transparent"
              className="text-xl font-semibold w-36 sm:text-3xl"
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
              <span
                className={`self-center mr-1   ${
                  props.buy ? 'text-red-200' : 'text-green-200'
                }`}
              >
                {props.buy ? '-' : '+'}
                {calculateLords(
                  props.resource.rate,
                  props.resource.qty
                ).toLocaleString()}{' '}
                Lords
              </span>{' '}
              <LordsIcon className="self-center w-3 h-3 fill-current sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="w-full pt-2 text-xs font-semibold tracking-widest uppercase border-t sm:text-sm opacity-60 border-white/20">
            balance: {(+formatEther(props.resource.amount)).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap self-end justify-end w-1/2 text-xs font-semibold tracking-widest text-right uppercase sm:text-sm opacity-80">
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

  const { gameConstants } = useGameConstants();

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
    batchAddResources,
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
    const maxAmount = parseEther(
      String(calculatedTotalInLords + calculatedSlippage)
    );
    // const maxAmount = parseEther(String('0'));
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
      <div className="w-full my-4">
        <h5>quick add building cost</h5>
        {gameConstants?.buildingCosts
          ?.filter((b) => b.resources.length)
          .map((a, i) => {
            return (
              <Button
                key={i}
                onClick={() => batchAddResources(a.resources)}
                size="xs"
                variant="outline"
              >
                {a.buildingName}
              </Button>
            );
          })}
        <h5 className="mt-2">quick add troop cost</h5>
        {gameConstants?.battalionCosts?.map((a, i) => {
          return (
            <Button
              key={i}
              onClick={() => batchAddResources(a.resources)}
              size="xs"
              variant="outline"
            >
              {a.battalionName}
            </Button>
          );
        })}
        {/* <MarketSelect update={onClickCostRecipe} cost={buildingCosts} /> */}
      </div>

      <div className="flex mx-auto mb-8 text-sm tracking-widest">
        <div
          className={`px-4 uppercase self-center ${
            tradeType === 'buy' && 'font-semibold'
          }`}
        >
          Buy
        </div>
        <Switch
          checked={isBuy}
          onChange={toggleTradeType}
          className={`${
            isBuy ? 'bg-green-600/40' : 'bg-blue-600/40'
          } relative inline-flex h-6 w-11 items-center rounded shadow-inner`}
        >
          <span className="sr-only">Buy/Sell</span>
          <span
            className={`${
              isSell ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded bg-white transition-all duration-300`}
          />
        </Switch>
        <div
          className={`px-4 uppercase self-center ${isSell && 'font-semibold'}`}
        >
          Sell
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
              buy={isBuy}
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
            variant="outline"
            className="mx-auto"
            onClick={() => addSelectedSwapResources()}
          >
            add resource
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
                        'Total cost of resources in LORDS',
                        <LordsIcon key={1} className="w-3 mr-2" />,
                      ]
                    : [
                        'Approximate lords',
                        <LordsIcon key={1} className="w-3 mr-2" />,
                        ' received',
                      ]}
                </span>
                {calculatedTotalInLords.toLocaleString()}
              </span>
            </div>
            <div>
              <div className="flex justify-end text-md">
                <span className="flex self-center mr-6 text-xs font-semibold tracking-widest uppercase opacity-80">
                  Your current LORDS <LordsIcon className="w-3 mr-2" /> balance
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
            {isBuy ? 'buy resources' : 'sell resources'}
          </Button>
        </div>
      </div>
    </div>
  );
}
