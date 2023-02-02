import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';

import { vaultValueAtMarketprice } from '@/components/bank/BankGetters';
import { RateChange } from '@/components/bank/BankPanel';
import { Pulse } from '@/components/ui/Pulse';
import {
  BASE_FOOD_PRODUCTION,
  BASE_RESOURCES_PER_CYCLE,
  BASE_RESOURCES_PER_DAY,
  VAULT_LENGTH,
} from '@/constants/globals';
import { ResourcesIds } from '@/constants/resources';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import useLabor from '@/hooks/settling/useLabor';
import {
  getLaborUnitsGenerated,
  CostBlock,
  getLaborGenerated,
  getUnproducedLabor,
  getIsFood,
  convertToK,
  getTrait,
} from '../RealmsGetters';
import { BuyLabor } from './BuyLabor';
import { HarvestButton } from './HarvestButton';
import { LaborValues } from './LaborValues';

type Prop = {
  realm: RealmFragmentFragment;
};

export const LaborTable = (props: Prop) => {
  const { realm } = props;
  const resources = realm.resources;

  const { getBalanceById } = useUserBalancesContext();

  const { gameConstants } = useGameConstants();

  const {
    getTotalLordsCost,
    getLordsCostForResourceAmount,
    getCurrentMarketById,
  } = useMarketRate();

  const newTable = resources?.map((resource) => {
    const costs = gameConstants?.laborAndToolCosts.find(
      (a) => a.resourceId === resource.resourceId
    )?.costs;

    const generation = getLaborGenerated({
      last_harvest: resource.labor?.lastUpdate,
      labor_balance: resource.labor?.balance,
    });

    const totalLordsCostOfLabor = getTotalLordsCost({
      costs: costs,
      qty: 1,
    });

    const lordsReturnFromLabor = getLordsCostForResourceAmount({
      resourceId: resource.resourceId,
      qty: BASE_RESOURCES_PER_DAY,
    });

    const currentMarketPriceForResource = getCurrentMarketById({
      resourceId: resource.resourceId,
    });

    const laborProfit = lordsReturnFromLabor - totalLordsCostOfLabor;

    const laborProfitMargin = 1 - totalLordsCostOfLabor / lordsReturnFromLabor;

    const valueAtMarketprice = vaultValueAtMarketprice({
      currentPrice: currentMarketPriceForResource?.amount,
      units: getLaborUnitsGenerated(resource.labor?.vaultBalance),
    });

    const isFood = getIsFood(resource.resourceId);

    const productionAmount = isFood
      ? BASE_FOOD_PRODUCTION
      : BASE_RESOURCES_PER_CYCLE;

    const isGenerating = generation[1] > 0;

    const hasGenerated = generation[0] > 0;

    const generatingClass = isGenerating
      ? 'bg-green-900/30 border-green-200/10'
      : 'bg-red-900/30 border-red-200/10';

    const hasGeneratedClass = hasGenerated
      ? 'bg-green-900/30 border-green-200/10'
      : 'bg-red-900/30 border-red-200/10';

    return {
      resource: (
        <div>
          <div className="flex justify-between">
            <div className="pr-3">
              <div className="flex">
                <div className="self-center">
                  <ResourceIcon
                    resource={resource?.resourceName?.replace(' ', '') || ''}
                    size="md"
                  />
                </div>
                <div className="px-3 text-xl ">
                  <span className="truncate">{resource.resourceName}</span>{' '}
                  <br />
                  <span className="text-base text-gray-600">
                    {convertToK(
                      +formatEther(
                        getBalanceById(resource.resourceId)?.amount || '0'
                      ).toString()
                    )}
                  </span>
                </div>
              </div>

              <div className="p-2 mt-2 border rounded border-black/10 bg-gray-1000">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Margin:</span>{' '}
                  <span>{(laborProfitMargin * 100).toFixed(1)}%</span>
                </div>
                <hr className="my-1 opacity-20" />
                <div className="flex justify-between">
                  <span className="mr-2 text-base">
                    {(+formatEther(
                      currentMarketPriceForResource?.amount || '0'
                    )).toFixed(2)}{' '}
                  </span>
                  <div className="self-center">
                    <RateChange
                      change={currentMarketPriceForResource?.percentChange24Hr}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow space-y-2">
              <div
                className={`flex justify-between flex-grow w-full p-2 border rounded ${generatingClass}`}
              >
                <div className="flex self-center mr-3 text-lg text-gray-600 capitalize ">
                  {isGenerating ? 'producing' : 'idle'}{' '}
                  <Pulse active={isGenerating} pulse={isGenerating} />
                </div>
                <div>
                  <BuyLabor
                    realm={realm}
                    resource={resource}
                    costs={costs}
                    isFood={isFood}
                  />
                </div>
              </div>
              <div
                className={`flex justify-between flex-grow w-full p-2 border rounded  ${hasGeneratedClass}`}
              >
                <div className="flex-grow w-full">
                  <HarvestButton
                    realmId={realm.realmId}
                    resourceId={resource.resourceId}
                    generation={
                      isFood
                        ? generation[0] *
                          productionAmount *
                          (resource.labor?.qtyBuilt || 1)
                        : generation[0] * productionAmount
                    }
                  />
                </div>
              </div>
              {!isFood ? (
                <div className="flex justify-between px-2 pt-1 text-lg">
                  <div>
                    Vault:{' '}
                    {(
                      getLaborUnitsGenerated(resource.labor?.vaultBalance) *
                        productionAmount || 0
                    ).toFixed()}
                    <span className="text-gray-600">
                      / {productionAmount * 12 * VAULT_LENGTH}
                    </span>
                  </div>

                  <div className="flex text-lg">
                    <div className="flex">
                      <Lords className="self-center mr-2 md:w-4 lg:w-5 fill-frame-primary" />
                      {valueAtMarketprice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between px-2 pt-1">
                  {resource.labor?.qtyBuilt} /{' '}
                  {resource.resourceId == ResourcesIds.Fish
                    ? getTrait(realm, 'Harbor')
                    : getTrait(realm, 'River')}{' '}
                  {resource.resourceId == ResourcesIds.Fish
                    ? 'Fishing Villages'
                    : 'Farms'}{' '}
                  Producing
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-2">
            <LaborValues
              labor_generated={generation[0]}
              part_labor={generation[1]}
              vault={generation[2]}
              remaining={getUnproducedLabor(resource.labor?.balance)}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="grid grid-cols-1 gap-3 mb-6 text-sm lg:grid-cols-2 xl:grid-cols-2">
      {newTable?.map((data, index) => {
        return (
          <div
            key={index}
            className="p-2 my-1 border-2 rounded-xl border-white/10 hover:bg-gray-1000"
          >
            {data.resource}
          </div>
        );
      })}
    </div>
  );
};

export const CostsRow = ({ value, tooltipText, title }) => {
  return (
    <Tooltip
      placement="top"
      className="flex w-full"
      tooltipText={
        <div className="p-2 rounded bg-gray-1000">{tooltipText}</div>
      }
    >
      <div className="flex justify-between w-full rounded hover:bg-gray-1000">
        <span className="flex">
          <span className="mx-1 text-gray-600">{title}: </span>{' '}
        </span>
        {value}
      </div>
    </Tooltip>
  );
};
