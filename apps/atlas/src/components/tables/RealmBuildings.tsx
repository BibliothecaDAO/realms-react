import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import useBuildings from '@/hooks/settling/useBuildings';
import { buildings } from '@/util/buildings';
import type { RealmsCardProps } from '../../types';

type Row = {
  building: string;
  requirements: string;
  built: number;
  buildAction: ReactElement;
};

export function RealmBuildings(props: RealmsCardProps): ReactElement {
  const { build } = useBuildings({
    token_id: props.realm.realmId,
  });
  const columns = [
    { Header: 'Building', id: 1, accessor: 'building' },
    { Header: 'Requirements', id: 2, accessor: 'requirements' },
    { Header: 'Population', id: 3, accessor: 'population' },
    { Header: 'Culture', id: 4, accessor: 'culture' },
    { Header: 'Food', id: 4, accessor: 'food' },
    { Header: 'Built', id: 5, accessor: 'built' },
    { Header: 'Build', id: 6, accessor: 'buildAction' },
  ];
  const tableOptions = { is_striped: true };
  const realmBuildings = props.realm.buildings;

  const defaultData: Row[] = buildings.map((building) => {
    console.log(realmBuildings);
    return {
      building: building.name,
      requirements: building.limit,
      population: (
        <span>
          0 <span className="text-white/50">(+{building.population})</span>{' '}
        </span>
      ),
      culture: (
        <span>
          0 <span className="text-white/50">(+{building.culture})</span>{' '}
        </span>
      ),
      food: (
        <span>
          0 <span className="text-white/50">(+{building.food})</span>{' '}
        </span>
      ),
      built: realmBuildings?.find(
        (realmBuilding) => realmBuilding.buildingId === building.id
      )
        ? 1
        : 0,
      buildAction: (
        <Button
          onClick={() => build(building.id)}
          variant="primary"
          type="button"
          size="xs"
        >
          Build
        </Button>
      ),
    };
  });

  return (
    <div className="w-full mt-2">
      <Table columns={columns} data={defaultData} options={tableOptions} />
      <div className="flex justify-end w-full mt-4">
        <Button size="xs" variant="primary">
          Build All
        </Button>
      </div>
    </div>
  );
}
