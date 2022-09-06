import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
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
      className={`${parseFloat(x) < 0 ? 'text-red-200' : 'text-green-200/80'}`}
    >
      24hr {x} %
    </span>
  );
};

interface BankPanel {
  onOpenSwap?: () => void;
}

export function BankPanel({ onOpenSwap }: BankPanel): ReactElement {
  const { balance, availableResourceIds, addSelectedSwapResources } =
    useResourcesContext();

  const defaultData: Row[] = balance?.map((resource) => {
    return {
      resource: (
        <div>
          <div className="flex sm:text-xl">
            <ResourceIcon
              className="self-center w-4"
              resource={resource?.resourceName?.replace(' ', '') || ''}
              size="md"
            />
            <div className="flex pt-2 ml-3 sm:flex-col md:ml-4 sm:w-2/3 md:mt-0">
              <span className="self-center w-full tracking-widest uppercase text-stone-200">
                {resource?.resourceName}
                <span className="block w-full tracking-widest uppercase sm:flex sm:text-sm text-stone-400">
                  {(+formatEther(resource.amount)).toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      ),
      rate: (
        <span className="text-sm sm:text-lg">
          <span className="flex">
            {(+formatEther(resource.rate)).toFixed(4)}
            <span className="hidden ml-1.5 uppercase text-stone-500 sm:block">
              $LORDS
            </span>
            <Lords className="w-4 ml-3 text-white opacity-50" />
          </span>
          <span className="w-full text-xs sm:text-sm">
            {RateChange(resource.percentChange)}
          </span>
        </span>
      ),

      lp_balance: (
        <span className="text-xs uppercase sm:text-lg">
          {(+formatEther(resource.lp)).toLocaleString()} <br />
          {/* <span className="text-xs sm:text-sm text-stone-500">
            LORDS: {(+formatEther(resource.currencyAmount)).toLocaleString()}
            <br />
            Token: {(+formatEther(resource.tokenAmount)).toLocaleString()}
          </span> */}
        </span>
      ),
      action: (
        <Button
          variant="primary"
          size="xs"
          onClick={() => {
            addSelectedSwapResources(resource.resourceId);
          }}
          disabled={!availableResourceIds.includes(resource.resourceId)}
        >
          Add <span className="hidden sm:block">+</span>
        </Button>
      ),
    };
  });
  const columns = [
    { Header: 'Resource', id: 1, accessor: 'resource' },
    // { Header: 'Balance', id: 2, accessor: 'balance' },
    // { Header: 'Output', id: 3, accessor: 'output' },
    { Header: 'Price', id: 5, accessor: 'rate' },
    // { Header: 'Change', id: 4, accessor: 'change' },

    { Header: 'Your LP', id: 6, accessor: 'lp_balance' },
    { Header: 'Action', id: 7, accessor: 'action' },
  ];
  const tableOptions = { is_striped: true };

  return (
    <BasePanel open={true} style="lg:w-7/12">
      <div className="flex justify-between">
        <div className="w-full p-10 pt-20 bg-black/90">
          <h2 className="w-full">The Resource Emporium</h2>
          <p className="mt-4 sm:text-xl opacity-70">
            Trade your resources with the merchant. You can also provide
            liquidity to the merchant.
          </p>
          {/* <h4 className="p-2 my-4 text-center rounded shadow-inner bg-white/20">
            Your Lords Balance: {(+formatEther(lordsBalance)).toFixed(2)}
          </h4> */}
          <div className="flex">
            <Button
              variant="secondary"
              size="xs"
              className="ml-auto"
              onClick={() => {
                if (onOpenSwap) onOpenSwap();
              }}
            >
              <ChevronRight />
            </Button>
          </div>
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
