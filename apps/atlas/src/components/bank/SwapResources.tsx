import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
} from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther, parseEther } from '@ethersproject/units';
import { Switch, Popover, Transition } from '@headlessui/react';
import type { ValueType } from '@rc-component/mini-decimal';
import { useState, useMemo, useReducer, useEffect } from 'react';
import type { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { battalionIdToString } from '@/constants/army';
import { buildingIdToString } from '@/constants/globals';
import type { ResourceQty } from '@/context/BankContext';
import { useBankContext } from '@/context/BankContext';
import type { Resource } from '@/context/UserBalancesContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { ExchangeRate } from '@/hooks/market/useMarketRate';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import { useBuyResources, useSellResources } from '@/hooks/useSwapResources';
import {
  calculateLords,
  convertBalance,
  deadline,
  displayRate,
  getIsBalanceSufficient,
} from './BankGetters';

type ResourceRowProps = {
  resource: ExchangeRate & ResourceQty;
  balance?: Resource;
  availableResources: ExchangeRate[];
  onResourceChange: (resourceId: number, newResourceId: number) => void;
  onQtyChange: (resourceId: number, qty: number) => void;
  buy?: boolean;
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
        parseFloat(newValue as string)
      ); /* updatePercentByValue(newValue); */
    }, 300);
    setTime(timerId);
  };
  const handleSelectChange = (newValue: number) => {
    props.onResourceChange(props.resource.resourceId, newValue);
  };

  const realRate = useMemo(() => {
    return props.buy ? props.resource.buyAmount : props.resource.sellAmount;
  }, [props.resource.buyAmount, props.resource.sellAmount, props.buy]);

  return (
    <div className="flex p-3 mb-4 rounded-md bg-white/5">
      <div className="sm:w-1/2">
        <Select
          optionIcons={true}
          value={props.resource?.resourceId}
          onChange={handleSelectChange}
        >
          <Select.Button
            label={props.resource?.tokenName ?? ''}
            variant={props.resource?.tokenName ? 'default' : 'placeholder'}
            icon={<ChevronRight className="w-5 h-5 transform -rotate-90 " />}
            labelIcon={
              <ResourceIcon
                size="xs"
                resource={props.resource?.tokenName ?? ''}
              />
            }
          />
          <Select.Options>
            {props.availableResources.map((resource, idx) => (
              <Select.Option
                key={idx}
                value={resource.tokenId}
                label={resource.tokenName}
                selectedIcon={<ChevronRight />}
                icon={
                  <ResourceIcon
                    size="xs"
                    resource={resource?.tokenName ?? ''}
                  />
                }
              />
            ))}
          </Select.Options>
        </Select>
        <div className="flex flex-wrap mt-4">
          <div className="flex flex-wrap justify-between w-full space-x-2">
            <span className="text-xs uppercase opacity-40">swap</span>
            <InputNumber
              value={props.resource.qty}
              inputSize="md"
              colorScheme="transparent"
              className="text-xl w-36 sm:text-3xl"
              min={0}
              max={10000000}
              stringMode // to support high precision decimals
              onChange={handleValueChange}
            />{' '}
            <div
              className={`flex self-end justify-end uppercase sm:text-lg opacity-70  ${
                props.buy ? 'text-red-200' : 'text-green-200'
              }`}
            >
              <span
                className={`self-center ml-auto   ${
                  props.buy ? 'text-red-200' : 'text-green-200'
                }`}
              >
                {props.buy ? '-' : '+'}
                {calculateLords(
                  realRate,
                  props.resource.qty
                ).toLocaleString()}{' '}
              </span>{' '}
              <LordsIcon className="self-center w-3 h-3 fill-current sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="w-full pt-2 border-t text-body opacity-60 border-white/20">
            <button
              onClick={() => {
                props.onQtyChange(
                  props.resource.resourceId,
                  +formatEther(props.balance?.amount || 0)
                );
              }}
              className="underline cursor-pointer decoration-dotted"
            >
              {(+formatEther(props.balance?.amount || 0)).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap self-end justify-end w-1/2 text-xs text-right uppercase sm:text-sm opacity-80">
        <div className="flex justify-end w-full">
          1 = {displayRate(realRate)} <LordsIcon className="w-3" />
        </div>
      </div>
    </div>
  );
};

export function SwapResources(): ReactElement {
  const { gameConstants } = useGameConstants();

  const { getBalanceById, lordsBalance } = useUserBalancesContext();

  const { buyTokens, loading: isBuyTransactionInProgress } = useBuyResources();
  const { sellTokens, loading: isSellTransactionInProgress } =
    useSellResources();

  const {
    tokenIds,
    tokenAmounts,
    availableResourceIds,
    selectedSwapResourcesWithBalance,
    getResourceById,
    addSelectedSwapResources,
    removeSelectedSwapResource,
    removeAllSelectedSwapResources,
    updateSelectedSwapResourceQty,
    updateSelectedSwapResource,
    batchAddResources,
    isBuy,
    isBuyAvailable,
    isSellAvailable,
    setIsBuy,
    calculatedPriceInLords,
    calculatedSlippage,
    calculatedTotalInLords,
    maxBuyAmount,
    minSellAmount,
  } = useBankContext();

  // get token ids

  // TODO: Set actual slippage when indexer caches rates
  function onBuyTokensClick() {
    if (!isBuyAvailable()) return;
    buyTokens(maxBuyAmount, tokenIds, tokenAmounts, deadline());
    removeAllSelectedSwapResources();
  }

  // TODO: Set actual slippage when indexer caches rates
  function onSellTokensClick() {
    if (!isSellAvailable()) return;
    sellTokens(minSellAmount, tokenIds, tokenAmounts, deadline());
    removeAllSelectedSwapResources();
  }

  function onTradeClicked() {
    if (isBuy) {
      onBuyTokensClick();
    } else {
      onSellTokensClick();
    }
  }

  const calculatedPriceImpact = useMemo(() => {
    // TODO: Set actual slippage when view will be implemented
    return isBuy ? 1 : -1;
  }, [selectedSwapResourcesWithBalance, calculatedPriceInLords, isBuy]);

  const [buildingsQty, setBuildingsQty] = useState({});

  const [battalionQty, setBattalionQty] = useState({});

  useEffect(() => {
    gameConstants?.battalionCosts.forEach((battalion) => {
      setBattalionQty((prev) => ({
        ...prev,
        [battalion.battalionId]: 1,
      }));
    });
    gameConstants?.buildingCosts.forEach((building) => {
      setBuildingsQty((prev) => ({
        ...prev,
        [building.buildingId]: 1,
      }));
    });
  }, [gameConstants]);

  const isTransactionInProgress =
    isBuyTransactionInProgress || isSellTransactionInProgress;

  const emptyTransaction = selectedSwapResourcesWithBalance.length < 1;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full mb-4">
        <div className="flex">
          <Popover className="relative z-50 mr-4">
            <Popover.Button as="div">
              <Button size="xs" variant="outline">
                buildings
              </Button>
            </Popover.Button>

            <Transition
              enter="transition duration-350 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-350 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel
                className="absolute z-100 mt-2 w-[280px] ml-2 m-auto border-4  border-white/20 rounded"
                static
              >
                <div className="flex flex-col gap-4 p-4 pb-8 font-medium rounded shadow-sm bg-gray-1000">
                  Add resources required for (Max 1000):
                  {gameConstants?.buildingCosts
                    ?.filter((b) => b.resources.length)
                    .map((a, i) => {
                      return (
                        <div key={i} className="flex items-center">
                          <Popover.Button as="div">
                            <Button
                              onClick={() => {
                                batchAddResources(
                                  a.resources.map((r) => ({
                                    resourceId: r.resourceId,
                                    resourceName: r.resourceName,
                                    amount:
                                      r.amount * buildingsQty[a.buildingId],
                                  }))
                                );
                              }}
                              size="xs"
                              variant="outline"
                            >
                              Add
                            </Button>
                          </Popover.Button>
                          <InputNumber
                            value={buildingsQty[a.buildingId]}
                            inputSize="sm"
                            colorScheme="transparent"
                            className="w-12 mx-2 bg-white border rounded border-white/40"
                            min={1}
                            max={1000}
                            stringMode
                            onChange={(value) => {
                              if (value) {
                                setBuildingsQty((current) => {
                                  return {
                                    ...current,
                                    [a.buildingId]: value.toString(),
                                  };
                                });
                              }
                            }}
                          />
                          <div>{buildingIdToString(a.buildingId)}</div>
                        </div>
                      );
                    })}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <Popover className="relative z-50">
            <Popover.Button as="div">
              <Button size="xs" variant="outline">
                troops
              </Button>
            </Popover.Button>

            <Transition
              enter="transition duration-350 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-350 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel
                className="absolute z-100 mt-2 w-[280px] ml-2 m-auto border-4  border-white/20 rounded"
                static
              >
                <div className="flex flex-col gap-4 p-4 pb-8 font-medium rounded shadow-sm bg-gray-1000">
                  Add resources required for (Max 1000):
                  {gameConstants?.battalionCosts?.map((a, i) => {
                    return (
                      <div key={i} className="flex items-center">
                        <Popover.Button as="div">
                          <Button
                            onClick={() => {
                              batchAddResources(
                                a.resources.map((r) => ({
                                  resourceId: r.resourceId,
                                  resourceName: r.resourceName,
                                  amount:
                                    r.amount * battalionQty[a.battalionId],
                                }))
                              );
                            }}
                            size="xs"
                            variant="outline"
                          >
                            Add
                          </Button>
                        </Popover.Button>
                        <InputNumber
                          value={battalionQty[a.battalionId]}
                          inputSize="sm"
                          colorScheme="transparent"
                          className="w-12 mx-2 bg-white border rounded border-white/40"
                          min={1}
                          max={1000}
                          stringMode
                          onChange={(value) => {
                            if (value) {
                              setBattalionQty((current) => {
                                return {
                                  ...current,
                                  [a.battalionId]: value.toString(),
                                };
                              });
                            }
                          }}
                        />
                        <div>{battalionIdToString(a.battalionId)}</div>
                      </div>
                    );
                  })}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <div className="flex ml-auto text-sm ">
            <div className={`px-4 uppercase self-center`}>Buy</div>
            <Switch
              checked={isBuy}
              onChange={() => setIsBuy(!isBuy)}
              className={`relative inline-flex h-6 w-11 items-center rounded shadow-inner ${
                isBuy ? 'bg-green-800' : 'bg-red-700'
              }`}
            >
              <span className="sr-only">Buy/Sell</span>
              <span
                className={`${
                  !isBuy ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded bg-white transition-all duration-300`}
              />
            </Switch>
            <div className={`px-4 uppercase self-center`}>Sell</div>
          </div>
        </div>
      </div>

      <div>
        {selectedSwapResourcesWithBalance.map((resource) => {
          const balance = getBalanceById(resource.resourceId);

          return (
            <div className="relative" key={resource.resourceId}>
              <ResourceRow
                key={resource.resourceId}
                resource={resource}
                balance={balance}
                availableResources={availableResourceIds.map(
                  (resourceId) => getResourceById(resourceId) as ExchangeRate
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
                <Close viewBox="0 0 24 24" className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 flex justify-end px-6 pt-4 pb-5 -mx-6 rounded-md backdrop-blur-xl">
        <div className="flex flex-col justify-end w-full">
          <div className="relative flex w-full">
            <Button
              aria-label="Add Row"
              size="xs"
              variant="outline"
              className="absolute transform -translate-x-1/2 left-1/2"
              onClick={() => addSelectedSwapResources()}
            >
              add resource
            </Button>
            <Button
              aria-label="Clear All"
              size="xs"
              variant="outline"
              className="ml-auto"
              onClick={() => removeAllSelectedSwapResources()}
            >
              clear
            </Button>
          </div>
          <div className="flex items-center py-4 rounded ">
            <div className="flex">
              <span className="flex self-center mr-2 text-gray-600">
                Balance:
              </span>
              <LordsIcon className="w-3 mr-1 fill-white" />
              {(+formatEther(lordsBalance)).toLocaleString()}{' '}
            </div>

            <div className="flex flex-col items-center ml-auto">
              <div className="flex whitespace-nowrap">
                <span className="flex items-center mr-2 text-gray-600">
                  {isBuy ? 'Total cost:' : 'To receive:'}
                </span>
                <div className="flex">
                  {' ~'}
                  <LordsIcon className="w-3 mr-1 fill-white" />
                  {calculatedTotalInLords.toLocaleString()}{' '}
                </div>
              </div>

              <div className="flex text-sm">
                <span className="flex self-center mr-2 text-gray-600">
                  Price impact:
                </span>
                <span
                  className={
                    calculatedPriceImpact < 0
                      ? 'text-red-200'
                      : 'text-green-200'
                  }
                >
                  {calculatedPriceImpact}%
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            variant="primary"
            onClick={onTradeClicked}
            loading={isTransactionInProgress && !emptyTransaction}
            disabled={isTransactionInProgress || emptyTransaction}
          >
            {isBuy ? 'buy resources' : 'sell resources'}
          </Button>
        </div>
      </div>
    </div>
  );
}
