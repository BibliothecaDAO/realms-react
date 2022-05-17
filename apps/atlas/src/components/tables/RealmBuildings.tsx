import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import build from 'next/dist/build';
import type { ReactElement } from 'react';
import { buildings } from '@/util/buildings';
type Row = {
  building: string;
  requirements: string;
  built: number;
  buildAction: ReactElement;
};

const defaultData: Row[] = buildings.map((building) => {
  return {
    building: building.name,
    requirements: building.limit,
    built: 3,
    buildAction: (
      <Button variant="primary" type="button">
        Build
      </Button>
    ),
  };
});

export function RealmBuildings(): ReactElement {
  const columns = [
    { Header: 'Building', id: 1, accessor: 'building' },
    { Header: 'Requirements', id: 2, accessor: 'requirements' },
    { Header: 'Built', id: 3, accessor: 'built' },
    { Header: 'Build', id: 3, accessor: 'buildAction' },
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
