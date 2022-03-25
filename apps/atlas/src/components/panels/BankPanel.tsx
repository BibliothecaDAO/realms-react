import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useGetRealmQuery } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { BasePanel } from './BasePanel';

type Row = {
  resource: string;
  balance: number;
  output: number;
  change: number;
  rate: number;
  action: ReactElement;
};

const defaultData: Row[] = [
  {
    resource: 'Wood',
    balance: 1322,
    output: 100,
    change: 0.08,
    rate: 0.234,
    action: <Button>Trade</Button>,
  },
  {
    resource: 'Stone',
    balance: 1322,
    output: 100,
    change: 0.08,
    rate: 0.234,
    action: <Button>Trade</Button>,
  },
  {
    resource: 'Coal',
    balance: 1322,
    output: 100,
    change: 0.08,
    rate: 0.234,
    action: <Button>Trade</Button>,
  },
  {
    resource: 'Ironwood',
    balance: 1322,
    output: 100,
    change: 0.08,
    rate: 0.234,
    action: <Button>Trade</Button>,
  },
  {
    resource: 'Heartwood',
    balance: 1322,
    output: 100,
    change: 0.08,
    rate: 0.234,
    action: <Button>Trade</Button>,
  },
];

export function BankPanel(): ReactElement {
  const { togglePanelType, selectedPanel } = useUIContext();

  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    { Header: 'Balance', id: 2, accessor: 'balance' },
    { Header: 'Output', id: 3, accessor: 'output' },
    { Header: 'Change', id: 4, accessor: 'change' },
    { Header: 'Rate', id: 5, accessor: 'rate' },
    { Header: 'Action', id: 6, accessor: 'action' },
  ];
  const tableOptions = { is_striped: true };
  const { data } = useGetRealmQuery({
    variables: {
      id: 1, // value for 'id'
    },
  });
  return (
    <BasePanel open={selectedPanel === 'bank'}>
      <div className="flex justify-between">
        <h1 className="tex">Iron Bank</h1>
        <button
          className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={() => togglePanelType('bank')}
        >
          CLOSE
        </button>
      </div>
      <div className="p-2">
        {data && (
          <Table columns={columns} data={defaultData} options={tableOptions} />
        )}
      </div>
      );
    </BasePanel>
  );
}
