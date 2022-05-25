import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGetRealmQuery } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { resources, findResourceName } from '@/util/resources';
import { BasePanel } from './BasePanel';

type Row = {
  resource: ReactElement;
  balance: string;
  output: number;
  change: number;
  rate: number;
  action: ReactElement;
};

export function BankPanel(): ReactElement {
  const { togglePanelType, selectedPanel } = useUIContext();
  const { balance, updateBalance } = useResourcesContext();
  const defaultData: Row[] = balance?.map((resource) => {
    const resourceModel = findResourceName(resource.resourceId);
    return {
      resource: (
        <div className="flex mb-4 mr-4 text-xl">
          <ResourceIcon
            resource={resourceModel?.trait.replace(' ', '') || ''}
            size="md"
          />

          <span className="self-center ml-4">{resourceModel?.trait}</span>
        </div>
      ),
      balance: formatEther(resource.amount),
      output: 0,
      change: 0.08,
      rate: 0,
      action: <Button>Trade</Button>,
    };
  });
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
        <div className="sm:hidden"></div>
        <h1 className="tex">Iron Bank</h1>
        <button
          className="mb-8 transition-all rounded "
          onClick={() => togglePanelType('bank')}
        >
          <Close />
        </button>
      </div>

      <div className="relative overflow-x-auto">
        {data && (
          <Table columns={columns} data={defaultData} options={tableOptions} />
        )}
      </div>
    </BasePanel>
  );
}
