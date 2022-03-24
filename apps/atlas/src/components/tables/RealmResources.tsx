import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';

type Row = {
  resource: ReactElement;
  baseOutput: number;
  totalOutput: number;
  level: number;
  build: ReactElement;
};

const defaultData: Row[] = [
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Wood" />
        Wood
      </span>
    ),
    baseOutput: 100,
    totalOutput: 122,
    level: 1,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Coal" />
        Coal
      </span>
    ),
    baseOutput: 105,
    totalOutput: 100,
    level: 2,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Copper" />
        Copper
      </span>
    ),
    baseOutput: 100,
    totalOutput: 142,
    level: 1,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Mithral" />
        Mithral
      </span>
    ),
    baseOutput: 110,
    totalOutput: 108,
    level: 3,
    build: <Button size="xs">Upgrade</Button>,
  },
];

export function RealmResources(): ReactElement {
  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
    { Header: 'Total Output', id: 3, accessor: 'totalOutput' },
    { Header: 'Lvl', id: 4, accessor: 'level' },
    { Header: 'Build', id: 5, accessor: 'build' },
  ];
  const tableOptions = { is_striped: true };
  return (
    <div className="p-2">
      <Table columns={columns} data={defaultData} options={tableOptions} />
    </div>
  );
}
