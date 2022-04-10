import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { findResourceName } from '@/util/resources';
import type { RealmProps } from '../../types';

type Row = {
  resource: ReactElement;
  baseOutput: number;
  // totalOutput: number;
  level: number;
  build: ReactElement;
};

export function RealmResources(props: RealmProps): ReactElement {
  const mappedRowData: Row[] = props.realm.resourceIds.map((re) => {
    return {
      resource: (
        <span className="flex">
          <ResourceIcon
            resource={findResourceName(re)?.trait.replace(' ', '') || ''}
            size="md"
            className="mr-4"
          />
          <span className="self-center uppercase font-semibold tracking-widest">
            {findResourceName(re)?.trait || ''}
          </span>
        </span>
      ),
      baseOutput: 100,
      // totalOutput: 122,
      level: 1,
      build: (
        <Button disabled variant="secondary" size="xs">
          Upgrade [soon]
        </Button>
      ),
    };
  });

  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
    // { Header: 'Total Output', id: 3, accessor: 'totalOutput' },
    { Header: 'level', id: 4, accessor: 'level' },
    { Header: 'Build', id: 5, accessor: 'build' },
  ];
  const tableOptions = { is_striped: true };
  return (
    <div>
      <Table columns={columns} data={mappedRowData} options={tableOptions} />
      <Button className="mt-3 ml-2" disabled variant="primary">
        harvest [coming soon]
      </Button>
    </div>
  );
}
