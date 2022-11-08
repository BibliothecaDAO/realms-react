import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { AreaSeries, buildChartTheme, XYChart } from '@visx/xychart';
import type { ReactElement } from 'react';
import { BasePanel } from '@/app/components/ui/BasePanel';
import { resources } from '@/constants/resources';
import { useResourcesContext } from '@/context/ResourcesContext';

type Row = {
  resource: ReactElement;
  lp_balance: ReactElement;
  // output: number;
  chart: ReactElement;
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

const accessors = {
  xAccessor: (d) => d.date,
  yAccessor: (d) => d.amount,
};

const redChartTheme = buildChartTheme({
  colors: ['#ff0000'],
  backgroundColor: 'transparent',
  tickLength: 0,
  gridColor: 'transparent',
  gridColorDark: 'transparent',
});

const greenChartTheme = buildChartTheme({
  colors: ['#00ff00'],
  backgroundColor: 'transparent',
  tickLength: 0,
  gridColor: 'transparent',
  gridColorDark: 'transparent',
});

export function BankPanel({ onOpenSwap }: BankPanel): ReactElement {
  const {
    balance,
    availableResourceIds,
    addSelectedSwapResources,
    historicPrices,
  } = useResourcesContext();

  const defaultData: Row[] = resources?.map((resource) => {
    const resourceBalance = balance.find(
      (reBalance) => reBalance.resourceId == resource.id
    );
    return {
      resource: (
        <div>
          <div className="flex sm:text-xl">
            <ResourceIcon
              className="self-center w-4"
              resource={resource?.trait?.replace(' ', '') || ''}
              size="md"
            />
            <div className="flex py-4 ml-3 sm:flex-col md:ml-4 sm:w-2/3 md:mt-0 font-display">
              <span className="self-center w-full tracking-widest uppercase text-stone-200">
                {resource?.trait}
                <span className="block w-full tracking-widest uppercase sm:flex text-stone-400">
                  {(+formatEther(
                    resourceBalance?.amount || 0
                  )).toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      ),
      rate: (
        <div className="flex justify-center">
          <span className="text-sm sm:text-lg">
            <span className="flex">
              {(+formatEther(resourceBalance?.rate || 0)).toFixed(4)}
              <Lords className="w-4 ml-1 text-white opacity-50" />
            </span>
            <span className="w-full text-xs sm:text-sm">
              {RateChange(resourceBalance?.percentChange || 0)}
            </span>
          </span>
        </div>
      ),
      chart: (
        <div className="flex justify-center">
          <XYChart
            theme={
              parseFloat(
                (resourceBalance?.percentChange || 0 * 100).toFixed(2)
              ) >= 0
                ? greenChartTheme
                : redChartTheme
            }
            margin={{ top: 10, left: 10, bottom: 10, right: 10 }}
            height={50}
            width={120}
            xScale={{ type: 'band' }}
            yScale={{ type: 'linear' }}
          >
            <AreaSeries
              dataKey="resourceChart"
              data={
                historicPrices && historicPrices[resource.id]
                  ? historicPrices[resource.id]
                  : []
              }
              xAccessor={accessors.xAccessor}
              yAccessor={accessors.yAccessor}
              fillOpacity={0.15}
            />
          </XYChart>
        </div>
      ),
      lp_balance: (
        <span className="text-xs uppercase sm:text-lg">
          {(+formatEther(resourceBalance?.lp || 0)).toLocaleString()} <br />
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
            addSelectedSwapResources(resource.id);
          }}
          disabled={!availableResourceIds.includes(resource.id)}
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
    { Header: '7d Chart', id: 8, accessor: 'chart' },
    // { Header: 'Change', id: 4, accessor: 'change' },

    { Header: 'Your LP', id: 6, accessor: 'lp_balance' },
    { Header: 'Action', id: 7, accessor: 'action' },
  ];
  const tableOptions = { is_striped: false };

  const boxData: Row[] = resources?.map((resource) => {
    const resourceBalance = balance.find(
      (reBalance) => reBalance.resourceId == resource.id
    );
    return {
      resource: (
        <div className="flex sm:text-xl py-2 px-1">
          <ResourceIcon
            className="self-center w-4"
            resource={resource?.trait?.replace(' ', '') || ''}
            size="md"
          />
          <div className="flex p-2 ml-1">
            <span className="self-center">
              {resource?.trait}
              <span className="block w-full tracking-widest uppercase sm:flex text-stone-400/70  text-lg">
                {(+formatEther(resourceBalance?.amount || 0)).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      ),
      rate: (
        <div className="flex justify-center my-2 px-1">
          <span className="text-sm sm:text-lg flex flex-col">
            <span className="flex">
              {(+formatEther(resourceBalance?.rate || 0)).toFixed(4)}
              <Lords className="w-4 ml-1 text-white opacity-50" />
            </span>
          </span>
        </div>
      ),
      chart: (
        <div className="flex justify-center relative">
          <span className="w-full text-xs sm:text-sm self-center absolute bottom-0 left-0 p-1">
            {RateChange(resourceBalance?.percentChange || 0)}
          </span>
          <span className="flex  absolute bottom-0 right-0 p-1">
            {(+formatEther(resourceBalance?.rate || 0)).toFixed(4)}
            <Lords className="w-4 ml-1 text-white" />
          </span>
          <XYChart
            theme={
              parseFloat(
                (resourceBalance?.percentChange || 0 * 100).toFixed(2)
              ) >= 0
                ? greenChartTheme
                : redChartTheme
            }
            margin={{ top: 2, left: 2, bottom: 2, right: 2 }}
            height={50}
            width={250}
            xScale={{ type: 'band' }}
            yScale={{ type: 'linear' }}
          >
            <AreaSeries
              dataKey="resourceChart"
              data={
                historicPrices && historicPrices[resource.id]
                  ? historicPrices[resource.id]
                  : []
              }
              xAccessor={accessors.xAccessor}
              yAccessor={accessors.yAccessor}
              fillOpacity={0.1}
            />
          </XYChart>
        </div>
      ),
      lp_balance: (
        <span className="text-xs uppercase sm:text-lg">
          {(+formatEther(resourceBalance?.lp || 0)).toLocaleString()} <br />
          {/* <span className="text-xs sm:text-sm text-stone-500">
            LORDS: {(+formatEther(resource.currencyAmount)).toLocaleString()}
            <br />
            Token: {(+formatEther(resource.tokenAmount)).toLocaleString()}
          </span> */}
        </span>
      ),
      action: (
        <div className="w-full flex justify-center">
          <Button
            variant="primary"
            size="xs"
            onClick={() => {
              addSelectedSwapResources(resource.id);
            }}
            disabled={!availableResourceIds.includes(resource.id)}
          >
            {availableResourceIds.includes(resource.id) ? '+' : '-'}{' '}
          </Button>
        </div>
      ),
    };
  });

  return (
    <BasePanel open={true} style="lg:w-7/12 p-10">
      <div className="flex justify-between">
        <div className="w-full p-10 pt-10 bg-black/90">
          {/* <h2 className="w-full">Resource Emporium</h2>
          <p className="mt-4 sm:text-2xl">
            Trade your resources with the merchant. You can also provide
            liquidity to the merchant.
          </p> */}
          {/* <div className="flex">
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
          </div> */}
        </div>
      </div>
      {/* <div className="relative overflow-x-auto">
        {balance && (
          <Table columns={columns} data={defaultData} options={tableOptions} />
        )}
      </div> */}
      <div className="grid grid-cols-3 gap-2">
        {balance &&
          boxData.map((data, index) => {
            return (
              <div
                className="p-2 card border border-yellow-600/20 rounded bg-black"
                key={index}
              >
                <div className="flex justify-between">
                  {data.resource}
                  <div>
                    {/* {data.rate} */}

                    {data.action}
                  </div>
                </div>

                {data.chart}
                {/* {data.lp_balance} */}
              </div>
            );
          })}
      </div>
    </BasePanel>
  );
}
