import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import { formatEther } from '@ethersproject/units';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import { useGetRealmQuery } from '@/generated/graphql';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { BasePanel } from './BasePanel';

type Row = {
  resource: ReactElement;
  // balance: string;
  // output: number;
  // change: ReactElement;
  rate: ReactElement;
  action: ReactElement;
};

export const RateChange = (change: number) => {
  const x = (change * 100).toFixed(2);
  return (
    <span
      className={`${parseInt(x) < 0 ? 'text-red-300' : 'text-green-300/80'}`}
    >
      + {x} %
    </span>
  );
};

export function BankPanel(): ReactElement {
  const { selectedPanel } = useAtlasContext();
  const {
    lordsBalance,
    balance,
    availableResourceIds,
    addSelectedSwapResources,
  } = useResourcesContext();

  const defaultData: Row[] = balance?.map((resource) => {
    return {
      resource: (
        <div className="mr-4">
          <div className="flex mb-2 text-xl">
            <ResourceIcon
              resource={resource?.resourceName?.replace(' ', '') || ''}
              size="sm"
            />
            <span className="self-center ml-4 tracking-widest uppercase">
              {resource?.resourceName}
            </span>{' '}
          </div>

          <span className="text-sm tracking-widest uppercase opacity-60">
            balance: {(+formatEther(resource.amount)).toLocaleString()}
          </span>
        </div>
      ),
      // balance: (+formatEther(resource.amount)).toLocaleString(),
      // output: 0,
      rate: (
        <span className="text-lg">
          1 = {(+formatEther(resource.rate)).toFixed(4)}{' '}
          <span className="opacity-50">$LORDS</span> <br />
          <span className="text-sm">{RateChange(resource.percentChange)}</span>
        </span>
      ),
      // change: ,

      lp_balance: (
        <span className="text-lg uppercase">
          {(+formatEther(resource.lp)).toLocaleString()} <br />
          <span className="text-sm opacity-60">
            {' '}
            LORDS: {(+formatEther(
              resource.currencyAmount
            )).toLocaleString()}{' '}
            <br />
            Token: {(+formatEther(resource.tokenAmount)).toLocaleString()}
          </span>
        </span>
      ),
      action: (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => {
            addSelectedSwapResources(resource.resourceId);
          }}
          disabled={!availableResourceIds.includes(resource.resourceId)}
        >
          Trade
        </Button>
      ),
    };
  });
  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    // { Header: 'Balance', id: 2, accessor: 'balance' },
    // { Header: 'Output', id: 3, accessor: 'output' },
    { Header: 'Rate', id: 5, accessor: 'rate' },
    // { Header: 'Change', id: 4, accessor: 'change' },

    { Header: 'Liquidity', id: 6, accessor: 'lp_balance' },
    { Header: 'Action', id: 7, accessor: 'action' },
  ];
  const tableOptions = { is_striped: true };

  return (
    <BasePanel open={selectedPanel === 'bank'} style="lg:w-7/12">
      <div className="flex justify-between">
        <div className="sm:hidden"></div>
        <div className="w-full">
          <h1 className="w-full text-center font-lords">Iron Bank</h1>
          {/* <h4 className="p-2 my-4 text-center rounded shadow-inner bg-white/20">
            Your Lords Balance: {(+formatEther(lordsBalance)).toFixed(2)}
          </h4> */}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        {balance && (
          <Table columns={columns} data={defaultData} options={tableOptions} />
        )}
      </div>
    </BasePanel>
  );
}
