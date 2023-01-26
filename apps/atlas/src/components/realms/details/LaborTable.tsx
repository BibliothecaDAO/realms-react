import { Button, ResourceIcon, Table } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import Image from 'next/image';
import { number } from 'starknet';
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

const columns = [
  { Header: 'Tools & Labor', id: 1, accessor: 'build' },
  { Header: 'Costs', id: 2, accessor: 'costs' },
  { Header: 'Resource', id: 3, accessor: 'resource' },
  { Header: 'Generated', id: 4, accessor: 'generated' },
  { Header: 'Vault', id: 5, accessor: 'vault' },
];

const tableOptions = { is_striped: true };

type Prop = {
  realm: RealmFragmentFragment;
};

export const LaborTable = (props: Prop) => {
  const { realm } = props;
  const resources = realm.resources;

  console.log(realm);

  const { getBalanceById } = useUserBalancesContext();

  const { create, harvest, create_food, harvest_food } = useLabor();

  const { gameConstants } = useGameConstants();

  const {
    getTotalLordsCost,
    getLordsCostForResourceAmount,
    getCurrentMarketById,
  } = useMarketRate();

  const defaultData = resources?.map((resource) => {
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

    const isFood =
      resource.resourceId === ResourcesIds.Fish ||
      resource.resourceId === ResourcesIds.Wheat;

    return {
      build: (
        <div className="flex justify-center">
          <Tooltip
            placement="top"
            className="flex"
            tooltipText={
              <div className="flex p-1 text-sm rounded bg-gray-1000 whitespace-nowrap">
                {costs?.map((cost, index) => {
                  return (
                    <CostBlock
                      key={index}
                      resourceName={cost.resourceName}
                      amount={cost.amount / 12}
                      id={cost.resourceId}
                      qty={12}
                    />
                  );
                })}
              </div>
            }
          >
            {!isFood ? (
              <Button
                onClick={() =>
                  create({
                    realmId: realm.realmId,
                    resourceId: resource.resourceId,
                    laborUnits: 12,
                    costs: costs,
                  })
                }
                variant="outline"
                size="sm"
              >
                Buy Tools (12hrs)
              </Button>
            ) : (
              <Button
                onClick={() =>
                  create_food({
                    realmId: realm.realmId,
                    resourceId: resource.resourceId,
                    laborUnits: 12,
                    qtyBuilt: 5,
                    costs: costs,
                  })
                }
                variant="outline"
                size="sm"
              >
                Build
              </Button>
            )}
          </Tooltip>
        </div>
      ),
      costs: (
        <div className="text-base text-left capitalize">
          <div className="px-1">
            <span className="mr-2">
              {(+formatEther(
                currentMarketPriceForResource?.amount || '0'
              )).toFixed(2)}{' '}
            </span>

            <RateChange
              change={currentMarketPriceForResource?.percentChange24Hr}
            />
          </div>
          <CostsRow
            title={'Gross Margin'}
            value={<span>{(laborProfitMargin * 100).toFixed(4)}% </span>}
            tooltipText={
              <span>
                <span>
                  Cost in $LORDS: <br />
                  {totalLordsCostOfLabor.toFixed(4)}
                </span>{' '}
                <br />
                <hr />
                <span>
                  Revenue in <br />
                  $LORDS: <br />
                  {lordsReturnFromLabor.toFixed(4)}
                </span>
                <br />
                <hr />
                <span>
                  Gross profit:
                  <br /> {laborProfit.toFixed(4)}
                </span>
              </span>
            }
          />
        </div>
      ),
      resource: (
        <span className="flex">
          <span className="flex text-base whitespace-nowrap">
            <ResourceIcon
              className="self-center"
              resource={resource?.resourceName?.replace(' ', '') || ''}
              size="md"
            />
          </span>
          <span className="self-center ml-3 text-xl text-left">
            {resource.resourceName} <br />
            <span className="text-base text-gray-600">
              {(+formatEther(
                getBalanceById(resource.resourceId)?.amount || '0'
              )).toFixed(2)}
            </span>
          </span>
        </span>
      ),
      generated: (
        <span className="flex flex-col space-x-4">
          <LaborValues
            labor_generated={generation[0]}
            part_labor={generation[1]}
            vault={generation[2]}
            remaining={getUnproducedLabor(resource.labor?.balance)}
          />
          <HarvestButton
            realmId={realm.realmId}
            resourceId={resource.resourceId}
            generation={generation[0]}
          />
        </span>
      ),

      vault: (
        <div className="text-2xl">
          {(
            getLaborUnitsGenerated(resource.labor?.vaultBalance) *
              BASE_RESOURCES_PER_CYCLE || 0
          ).toFixed()}
          <span className="text-gray-600">
            / {BASE_RESOURCES_PER_CYCLE * 12 * VAULT_LENGTH}
          </span>
          <br />
          <span className="flex justify-center mx-auto text-lg">
            <Lords className="self-center mr-2 md:w-4 lg:w-5 fill-frame-primary" />
            {valueAtMarketprice.toFixed(2)}
          </span>
        </div>
      ),
    };
  });

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
      build: (
        <div className="flex justify-center">
          <Tooltip
            placement="top"
            className="flex"
            tooltipText={
              <div className="flex p-1 text-sm rounded bg-gray-1000 whitespace-nowrap">
                {costs?.map((cost, index) => {
                  return (
                    <CostBlock
                      key={index}
                      resourceName={cost.resourceName}
                      amount={cost.amount / 12}
                      id={cost.resourceId}
                      qty={12}
                    />
                  );
                })}
              </div>
            }
          >
            {!isFood ? (
              <Button
                onClick={() =>
                  create({
                    realmId: realm.realmId,
                    resourceId: resource.resourceId,
                    laborUnits: 12,
                    costs: costs,
                  })
                }
                variant="outline"
                size="sm"
              >
                Buy Tools (12hrs)
              </Button>
            ) : (
              <Button
                onClick={() =>
                  create_food({
                    realmId: realm.realmId,
                    resourceId: resource.resourceId,
                    laborUnits: 12,
                    qtyBuilt: 5,
                    costs: costs,
                  })
                }
                variant="outline"
                size="sm"
              >
                Build
              </Button>
            )}
          </Tooltip>
        </div>
      ),
      costs: (
        <div className="text-base text-left capitalize">
          <div className="px-1">
            <span className="mr-2">
              {(+formatEther(
                currentMarketPriceForResource?.amount || '0'
              )).toFixed(2)}{' '}
            </span>

            <RateChange
              change={currentMarketPriceForResource?.percentChange24Hr}
            />
          </div>
          <CostsRow
            title={'Gross Margin'}
            value={<span>{(laborProfitMargin * 100).toFixed(4)}% </span>}
            tooltipText={
              <span>
                <span>
                  Cost in $LORDS: <br />
                  {totalLordsCostOfLabor.toFixed(4)}
                </span>{' '}
                <br />
                <hr />
                <span>
                  Revenue in <br />
                  $LORDS: <br />
                  {lordsReturnFromLabor.toFixed(4)}
                </span>
                <br />
                <hr />
                <span>
                  Gross profit:
                  <br /> {laborProfit.toFixed(4)}
                </span>
              </span>
            }
          />
        </div>
      ),
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
              <div className="mt-3 text-base ">
                <span className="text-gray-600">Margin:</span>{' '}
                {(laborProfitMargin * 100).toFixed(1)}%
              </div>
              <div className="">
                <span className="mr-2 text-base">
                  {(+formatEther(
                    currentMarketPriceForResource?.amount || '0'
                  )).toFixed(2)}{' '}
                </span>

                <RateChange
                  change={currentMarketPriceForResource?.percentChange24Hr}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
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
                <div className="self-center mr-3 text-lg">
                  <span className="text-gray-600 ">Produced</span>{' '}
                  {convertToK(generation[0] * productionAmount)}
                </div>
                <div>
                  <HarvestButton
                    realmId={realm.realmId}
                    resourceId={resource.resourceId}
                    generation={generation[0]}
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
                    <Lords className="self-center mr-2 md:w-4 lg:w-5 fill-frame-primary" />
                    {valueAtMarketprice.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="flex justify-between px-2 pt-1">
                  10 /{' '}
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
      generated: (
        <span className="flex flex-col space-x-4">
          <LaborValues
            labor_generated={generation[0]}
            part_labor={generation[1]}
            vault={generation[2]}
            remaining={getUnproducedLabor(resource.labor?.balance)}
          />
          <HarvestButton
            realmId={realm.realmId}
            resourceId={resource.resourceId}
            generation={generation[0]}
          />
        </span>
      ),
    };
  });

  return (
    <div className="flex flex-wrap mb-6 text-sm">
      {/* <Table data={defaultData} columns={columns} {...tableOptions} /> */}

      {newTable?.map((data, index) => {
        return (
          <div
            key={index}
            className="w-1/2 p-4 my-1 border rounded border-white/10"
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
