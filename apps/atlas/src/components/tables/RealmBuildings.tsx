import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';

type Row = {
  building: string;
  requirements: string;
  build: ReactElement;
};

const defaultData: Row[] = [
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number"></input>,
  },
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number"></input>,
  },
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number"></input>,
  },
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number"></input>,
  },
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number"></input>,
  },
  {
    building: 'Castle',
    requirements: '1 Region',
    build: <input type="number" placeholder="Enter Qty"></input>,
  },
];

export function RealmBuildings(): ReactElement {
  const columns = [
    { Header: 'Building', id: 1, accessor: 'building' },
    { Header: 'Requirements', id: 2, accessor: 'requirements' },
    { Header: 'Build', id: 3, accessor: 'build' },
  ];
  const tableOptions = { is_striped: true };
  return (
    <div className="p-2">
      <Table columns={columns} data={defaultData} options={tableOptions} />
      <div className="flex justify-end w-full pt-4">
        <Button variant="primary">Build All</Button>
      </div>
    </div>
  );
}
