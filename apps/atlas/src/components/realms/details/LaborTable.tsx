import {
  OrderIcon,
  Button,
  ResourceIcon,
  Tabs,
  Table,
} from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import Image from 'next/image';
import { ReactElement, useEffect } from 'react';

import { useSpring, animated } from 'react-spring';
import { number } from 'starknet';
import {
  BASE_LABOR_UNITS,
  BASE_RESOURCES_PER_CYCLE,
  BASE_RESOURCES_PER_DAY,
  VAULT_LENGTH,
} from '@/constants/buildings';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
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

function Number({ end, start = 0 }) {
  const { number } = useSpring({
    number: end,
    from: { number: start },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((x) => x.toFixed(0))}</animated.div>;
}

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

  const { create, harvest } = useLabor(realm as Realm);

  const { gameConstants } = useGameConstants();

  const { getTotalLordsCost, getLordsCostForResourceAmount } = useMarketRate();

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

    const laborProfit = lordsReturnFromLabor - totalLordsCostOfLabor;

    const laborProfitMargin = 1 - totalLordsCostOfLabor / lordsReturnFromLabor;

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
                {/* <div className="p-2">
                  <Lords className="self-center mx-auto md:w-4 lg:w-6" />
                  cost: {totalLordsCostOfLabor.toFixed(2)} <br />
                  return: {lordsReturnFromLabor.toFixed(2)} <br />
                  profit: {laborProfit.toFixed(2)} <br />
                  {laborProfitMargin.toFixed(2)}%
                </div> */}
              </div>
            }
          >
            <Button
              onClick={() =>
                create({
                  resourceId: resource.resourceId,
                  laborUnits: 12,
                  costs: costs,
                })
              }
              variant="outline"
              size="sm"
            >
              Buy Tools and Labor (12hrs)
            </Button>
          </Tooltip>
        </div>
      ),
      costs: (
        <div className="text-base text-left capitalize">
          {/* <Lords className="self-center mx-auto md:w-4 lg:w-6" /> */}
          <span className="text-gray-600"> Cogs: </span>
          <span>{totalLordsCostOfLabor.toFixed(2)}</span>
          <br />
          <span className="text-gray-600"> Profit: </span>{' '}
          {lordsReturnFromLabor.toFixed(2)} <br />
          <span className="text-gray-600"> Gross: </span>{' '}
          {laborProfit.toFixed(2)} <br />
          <span className="text-gray-600"> Margin: </span>{' '}
          {laborProfitMargin.toFixed(2)}%
        </div>
      ),
      resource: (
        <span className="flex">
          <Image
            src={'/resources/' + resource.resourceId + '.jpg'}
            alt="map"
            width={100}
            height={100}
            className="border-4 rounded-2xl border-yellow-800/40"
          />
          <span className="self-center ml-3 text-left">
            {resource.resourceName} <br />
            <span className="text-gray-600">
              {(+formatEther(
                getBalanceById(resource.resourceId)?.amount || '0'
              )).toFixed(2)}
            </span>
          </span>
        </span>
      ),
      generated: (
        <span className="flex space-x-4">
          <LaborValues
            labor_generated={generation[0]}
            part_labor={generation[1]}
            vault={generation[2]}
            remaining={getUnproducedLabor(resource.labor?.balance)}
          />

          <Button
            onClick={() =>
              harvest({
                resourceId: resource.resourceId,
              })
            }
            disabled={generation[0] == 0 || isNaN(generation[0])}
            variant="outline"
            size="sm"
          >
            {generation[0] == 0 || isNaN(generation[0]) ? 'nothing' : `Harvest`}
          </Button>
        </span>
      ),

      vault: (
        <div>
          <Number
            end={
              getLaborUnitsGenerated(resource.labor?.vaultBalance) *
                BASE_RESOURCES_PER_CYCLE || 0
            }
          />{' '}
          <span className="text-gray-600">
            / {BASE_RESOURCES_PER_CYCLE * 12 * VAULT_LENGTH}
          </span>
        </div>
      ),
    };
  });

  return (
    <div className="py-8 text-2xl">
      <Table data={defaultData} columns={columns} {...tableOptions} />
    </div>
  );
};
