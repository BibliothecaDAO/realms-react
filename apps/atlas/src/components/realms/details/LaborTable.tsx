import {
  OrderIcon,
  Button,
  ResourceIcon,
  Tabs,
  Table,
} from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import Image from 'next/image';
import type { ReactElement } from 'react';

import { useSpring, animated } from 'react-spring';
import {
  BASE_LABOR_UNITS,
  BASE_RESOURCES_PER_CYCLE,
} from '@/constants/buildings';
import type { Realm, RealmFragmentFragment } from '@/generated/graphql';
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

  const { create } = useLabor(realm as Realm);

  const { gameConstants } = useGameConstants();

  const defaultData = resources?.map((resource) => {
    const costs = gameConstants?.laborAndToolCosts.find(
      (a) => a.resourceId === resource.resourceId
    )?.costs;
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
            last_harvest={resource.labor?.lastUpdate}
            labor_balance={resource.labor?.balance}
          />

          <Button variant="outline" size="sm">
            Harvest
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
              Buy Tools and Labor (12)
            </Button>
          </Tooltip>
        </div>
      ),
      vault: <Number end={resource.labor?.vaultBalance} />,
    };
  });

  return (
    <div className="py-8 text-2xl">
      <Table data={defaultData} columns={columns} {...tableOptions} />
    </div>
  );
};
