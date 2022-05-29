import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';

type Row = {
  action: string;
  lord: string;
  outcome: ReactElement;
};

const defaultData: Row[] = [
  {
    action: 'Defended Raid from 0x...1OaF',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Catapults</p>
        <p>-63 Wood, -28 Gold</p>
      </div>
    ),
  },
  {
    action: 'Attacked 0x...1OaF',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Catapults</p>
        <p>+63 Coal, +8 Dragonhide</p>
      </div>
    ),
  },
  {
    action: 'Defended Raid from 0x...Sq1dDy',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Watchmen</p>
        <p>-63 Wood, -28 Gold</p>
      </div>
    ),
  },
  {
    action: 'Finished Building 2 Castles',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>+10 Defence</p>
        <p>-12 Happiness</p>
      </div>
    ),
  },
  {
    action: 'Trained Units',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>+2 Catapults</p>
        <p>+15 Arbalests</p>
      </div>
    ),
  },
];

export function RealmHistory(): ReactElement {
  const columns = [
    { Header: 'Action', id: 1, accessor: 'action' },
    { Header: 'Lord', id: 2, accessor: 'lord' },
    { Header: 'Outcome', id: 3, accessor: 'outcome' },
  ];
  const tableOptions = { is_striped: true, search: false };
  return (
    <div className="relative p-2">
      <Table columns={columns} data={defaultData} options={tableOptions} />
    </div>
  );
}
