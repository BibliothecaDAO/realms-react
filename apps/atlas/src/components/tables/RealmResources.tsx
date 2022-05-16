import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import useResources from '@/hooks/settling/useResources';
import { findResourceName } from '@/util/resources';

import type { RealmsCardProps } from '../../types';
type Row = {
  resource: ReactElement;
  baseOutput: number;
  claimableResources: number;
  // totalOutput: number;
  level: number;
  build: ReactElement;
};

export function RealmResources(props: RealmsCardProps): ReactElement {
  const { availableResources, claim, upgrade } = useResources({
    token_id: props.realm.realmId,
  });
  // TODO - update live output
  const totalOutput = 120;
  const mappedRowData: Row[] = (props.realm.resources as any).map(
    (re, index) => {
      return {
        resource: (
          <span className="flex">
            <ResourceIcon
              resource={re.type.replace(' ', '') || ''}
              size="md"
              className="mr-4"
            />
            <span className="self-center font-semibold tracking-widest uppercase">
              {re.type || ''}
            </span>
          </span>
        ),
        baseOutput: 100,
        claimableResources: availableResources.daysAccrued * 120,
        // totalOutput: 122,
        level: re.level,
        build: (
          <Button
            variant="secondary"
            onClick={() => upgrade(parseInt(re))}
            size="xs"
          >
            Upgrade
          </Button>
        ),
      };
    }
  );

  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
    { Header: 'Claimable Resources', id: 3, accessor: 'claimableResources' },
    // { Header: 'Total Output', id: 3, accessor: 'totalOutput' },
    { Header: 'level', id: 4, accessor: 'level' },
    { Header: 'Build', id: 5, accessor: 'build' },
  ];
  const tableOptions = { is_striped: true };
  return (
    <div>
      <Table columns={columns} data={mappedRowData} options={tableOptions} />
      <Button className="mt-3 ml-2" variant="primary" onClick={() => claim()}>
        Harvest Resources
      </Button>
    </div>
  );
}
