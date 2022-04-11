import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';

type Row = {
  unit: string;
  qty: number;
  build: ReactElement;
};

const defaultData: Row[] = [
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
  {
    unit: 'Watchman',
    qty: 12,
    build: <input type="number"></input>,
  },
];

export function RealmTroops(): ReactElement {
  const columns = [
    { Header: 'Unit', id: 1, accessor: 'unit' },
    { Header: 'Qty', id: 2, accessor: 'qty' },
    { Header: 'Build', id: 3, accessor: 'build' },
  ];
  const tableOptions = { is_striped: true };
  return (
    <div className="p-2">
      <Table columns={columns} data={defaultData} options={tableOptions} />
      <div className="flex justify-end w-full pt-4">
        <Button variant="primary">Train All</Button>
      </div>
    </div>
  );
}
