import { Button, ResourceIcon, Table } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import Image from 'next/image';
import { number } from 'starknet';
import { vaultValueAtMarketprice } from '@/components/bank/BankGetters';
import { RateChange } from '@/components/bank/BankPanel';
import {
  BASE_RESOURCES_PER_CYCLE,
  BASE_RESOURCES_PER_DAY,
  VAULT_LENGTH,
} from '@/constants/globals';
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
} from '../RealmsGetters';
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

  const { getBalanceById } = useUserBalancesContext();

  const { create, harvest } = useLabor();

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
            value={<span>{(laborProfitMargin * 100).toFixed(2)}% </span>}
            tooltipText={
              <span>
                <span>
                  Cost in $LORDS: <br />
                  {totalLordsCostOfLabor.toFixed(2)}
                </span>{' '}
                <br />
                <span>
                  Revenue in $LORDS : <br />
                  {lordsReturnFromLabor.toFixed(2)}
                </span>
                <br />
                <span>
                  Gross profit:
                  <br /> {laborProfit.toFixed(2)}
                </span>
              </span>
            }
          />
          {/* <CostsRow
            title={'Cogs'}
            value={totalLordsCostOfLabor.toFixed(2)}
            tooltipText={'Cost of Labor to Produce in $LORDS'}
          />
          <CostsRow
            title={'Revenue'}
            value={lordsReturnFromLabor.toFixed(2)}
            tooltipText={
              'Your Revenue on Labor in $LORDS based on current prices'
            }
          />
          <CostsRow
            title={'Gross Profit'}
            value={laborProfit.toFixed(2)}
            tooltipText={'Gross profit'}
          /> */}
        </div>
      ),
      resource: (
        <span className="flex">
          <span className="flex text-base whitespace-nowrap">
            <ResourceIcon
              className="self-center mr-2"
              resource={resource?.resourceName?.replace(' ', '') || ''}
              size="md"
            />
          </span>
          {/* <Image
            src={'/resources/' + resource.resourceId + '.jpg'}
            alt="map"
            width={80}
            height={80}
            className="border-4 rounded-2xl border-yellow-800/40"
          /> */}
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

          <Button
            onClick={() =>
              harvest({
                realmId: realm.realmId,
                resourceId: resource.resourceId,
              })
            }
            disabled={generation[0] == 0 || isNaN(generation[0])}
            variant="outline"
            size="xs"
          >
            {generation[0] == 0 || isNaN(generation[0])
              ? 'nothing available'
              : `Harvest`}
          </Button>
        </span>
      ),

      vault: (
        <div className="text-2xl">
          {(
            getLaborUnitsGenerated(resource.labor?.vaultBalance) *
              BASE_RESOURCES_PER_CYCLE || 0
          ).toFixed()}

          {/* <Number
            end={
              getLaborUnitsGenerated(resource.labor?.vaultBalance) *
                BASE_RESOURCES_PER_CYCLE || 0
            }
          />{' '} */}
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

  return (
    <div className="py-3 text-sm">
      <Table data={defaultData} columns={columns} {...tableOptions} />
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
