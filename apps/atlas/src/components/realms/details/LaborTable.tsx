import {
  OrderIcon,
  Button,
  ResourceIcon,
  Tabs,
  Table,
} from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Image from 'next/image';
import { ReactElement, useEffect } from 'react';

import { useSpring, animated } from 'react-spring';
import {
  BASE_LABOR_UNITS,
  BASE_RESOURCES_PER_CYCLE,
} from '@/constants/buildings';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import useLabor from '@/hooks/settling/useLabor';
import { CostBlock } from '../RealmsGetters';
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
  { Header: 'Resource', id: 'select', accessor: 'resource' },
  { Header: 'Generated', id: 2, accessor: 'generated' },
  { Header: 'Tools & Labor', id: 5, accessor: 'build' },
  { Header: 'Vault', id: 5, accessor: 'vault' },
];

const tableOptions = { is_striped: true };

type Prop = {
  realm: RealmFragmentFragment;
};

export const LaborTable = (props: Prop) => {
  const { realm } = props;
  const resources = realm.resources;

  const { create, harvest } = useLabor(realm as Realm);

  const { gameConstants } = useGameConstants();

  const { getTotalLordsCost } = useMarketRate();

  const getLaborUnitsGenerated = (time): number => {
    return time / 1000 / BASE_LABOR_UNITS;
  };

  const now = new Date().getTime();

  const getLaborGenerated = ({ last_harvest, labor_balance }): number[] => {
    const lastHarvest = new Date(last_harvest);

    let labor;

    if (labor_balance > now) {
      labor = (now - lastHarvest.getTime()) / 1000;
    } else {
      labor = (labor_balance - lastHarvest.getTime()) / 1000;
    }

    const generated_labor = Math.floor(labor / BASE_LABOR_UNITS) * 0.7;

    const labor_remaining = labor % BASE_LABOR_UNITS;

    const vault = Math.floor(generated_labor * 0.3);

    return [generated_labor, labor_remaining / BASE_LABOR_UNITS, vault];
  };

  const defaultData = resources?.map((resource) => {
    const costs = gameConstants?.laborAndToolCosts.find(
      (a) => a.resourceId === resource.resourceId
    )?.costs;

    const generation = getLaborGenerated({
      last_harvest: resource.labor?.lastUpdate,
      labor_balance: resource.labor?.balance,
    });

    return {
      resource: (
        <span className="flex">
          <Image
            src={'/resources/' + resource.resourceId + '.jpg'}
            alt="map"
            width={80}
            height={80}
            className="border-4 rounded-2xl border-yellow-800/40"
          />
          <span className="self-center ml-3">{resource.resourceName}</span>
        </span>
      ),
      generated: (
        <span className="flex justify-center space-x-4">
          <LaborValues
            labor_generated={generation[0]}
            part_labor={generation[1]}
            vault={generation[2]}
          />

          <Button
            onClick={() =>
              harvest({
                resourceId: resource.resourceId,
              })
            }
            disabled={generation[0] == 0 || generation[0] == null}
            variant="outline"
            size="sm"
          >
            {generation[0] == 0 || generation[0] == undefined
              ? 'Generating'
              : `Generated ${generation[0] || 0}`}
          </Button>
        </span>
      ),
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
                <div className="p-2">
                  <Lords className="self-center md:w-4 lg:w-6" />{' '}
                  {getTotalLordsCost({
                    costs: costs,
                    qty: 1,
                  }).toFixed(2)}
                </div>
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
      vault: (
        <div>
          <Number
            end={getLaborUnitsGenerated(resource.labor?.vaultBalance) || 0}
          />
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
