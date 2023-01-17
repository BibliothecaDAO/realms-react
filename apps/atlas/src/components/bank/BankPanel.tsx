import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { Switch } from '@headlessui/react';
import { TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { AreaSeries, buildChartTheme, XYChart } from '@visx/xychart';
import Image from 'next/image';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { BasePanel } from '@/components/ui/panel/BasePanel';
import { resources } from '@/constants/resources';
import { useBankContext } from '@/context/BankContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import { formatToken } from './BankGetters';

type Row = {
  resource: ReactElement;
  lp_balance: ReactElement;
  // output: number;
  chart: ReactElement;
  rate: ReactElement;
  action: ReactElement;
};

export const RateChange = ({ change }) => {
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
    bankResources,
    availableResourceIds,
    addSelectedSwapResources,
    historicPrices,
    getResourceById,
  } = useBankContext();

  const { balance, getBalanceById } = useUserBalancesContext();

  const [marketViewType, toggleMarketView] = useReducer(
    (state: 'cards' | 'table') => {
      return state === 'table' ? 'cards' : 'table';
    },
    'table'
  );

  const isTableView = marketViewType === 'table';

  const defaultData: Row[] = resources?.map((resource) => {
    const bankResource = getResourceById(resource.id);
    const balance = getBalanceById(resource.id);

    return {
      resource: (
        <div>
          <div className="flex sm:text-xl">
            <img
              alt={resource?.trait}
              src={'/resources/' + resource.id.toString() + '.jpg'}
              className="w-24 h-24 border rounded border-yellow-900/30"
            />

            <div className="flex py-4 ml-3 sm:flex-col md:ml-4 sm:w-2/3 md:mt-0">
              <span className="self-center w-full">
                <span className="flex text-base whitespace-nowrap">
                  <ResourceIcon
                    className="self-center w-4 mr-2"
                    resource={resource?.trait?.replace(' ', '') || ''}
                    size="xs"
                  />
                  {resource?.trait}
                </span>

                <span className="block w-full tracking-widest text-gray-700 uppercase sm:flex">
                  {(+formatEther(balance?.amount || 0)).toLocaleString()}
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
              {formatToken(bankResource?.amount)}

              <Lords className="w-4 ml-1 text-white opacity-50" />
            </span>
            <span className="w-full text-xs sm:text-sm">
              {RateChange({ change: bankResource?.percentChange24Hr as any })}
            </span>
          </span>
        </div>
      ),
      chart: (
        <div className="flex justify-center">
          <XYChart
            theme={
              parseFloat(
                (bankResource?.percentChange24Hr || 0 * 100).toFixed(2)
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
        <span className="text-lg uppercase">
          {formatToken(bankResource?.lp)}
          <br />
          <hr className="opacity-20" />
          <span className="text-base opacity-40 hover:opacity-100">
            <span className="flex justify-center">
              <Lords className="self-center mr-2 md:w-4 fill-frame-primary" />
              {formatToken(bankResource?.currencyReserve)}
            </span>

            {formatToken(bankResource?.tokenReserve)}
          </span>
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
    { Header: 'Resource', id: 1, accessor: 'resource', size: 225 },
    { Header: 'Price', id: 5, accessor: 'rate' },
    { Header: '7d Chart', id: 8, accessor: 'chart' },

    { Header: 'Your LP', id: 6, accessor: 'lp_balance' },
    { Header: 'Action', id: 7, accessor: 'action', size: 75 },
  ];
  const tableOptions = { is_striped: false };

  const boxData: Row[] = resources?.map((resource) => {
    const bankResource = getResourceById(resource.id);
    const balance = getBalanceById(resource.id);
    return {
      resource: (
        <div className="flex px-1 py-2 sm:text-xl">
          <img
            alt={resource?.trait}
            src={'/resources/' + resource.id.toString() + '.jpg'}
            className="w-24 h-24 border rounded border-yellow-900/30"
          />

          <div className="flex p-2 ml-1">
            <span className="self-center">
              <span className="flex">
                {' '}
                <ResourceIcon
                  className="self-center w-4 mr-2"
                  resource={resource?.trait?.replace(' ', '') || ''}
                  size="xs"
                />
                {resource?.trait}
              </span>

              <span className="block w-full text-lg tracking-widest uppercase sm:flex text-stone-400/70">
                {(+formatEther(balance?.amount || 0)).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      ),
      rate: (
        <div className="flex justify-center px-1 my-2">
          <span className="flex flex-col text-sm sm:text-lg">
            <span className="flex">
              {(+formatEther(bankResource?.amount || 0)).toFixed(4)}
              <Lords className="w-4 ml-1 text-white opacity-50" />
            </span>
          </span>
        </div>
      ),
      chart: (
        <div className="relative flex justify-center">
          <span className="absolute bottom-0 left-0 self-center w-full p-1 text-xs sm:text-sm">
            {RateChange({ change: bankResource?.percentChange24Hr as any })}
          </span>
          <span className="absolute bottom-0 right-0 flex p-1">
            {(+formatEther(bankResource?.amount || 0)).toFixed(4)}
            <Lords className="w-4 ml-1 text-white" />
          </span>
          <XYChart
            theme={
              parseFloat(
                (bankResource?.percentChange24Hr || 0 * 100).toFixed(2)
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
        <span className="text-xs uppercase">
          <span className="text-xs sm:text-sm text-stone-500">
            LORDS:{' '}
            {(+formatEther(
              bankResource?.currencyReserve || 0
            )).toLocaleString()}
            <br />
            Token:{' '}
            {(+formatEther(bankResource?.tokenReserve || 0)).toLocaleString()}
          </span>
        </span>
      ),
      action: (
        <div className="flex justify-center w-full">
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
    <div className="flex flex-col mb-8 rounded-3xl">
      <div className="flex justify-center mb-4">
        <Squares2X2Icon className="w-6 h-6 text-white" />
        <Switch
          checked={isTableView}
          onChange={toggleMarketView}
          className={`relative inline-flex h-6 w-11 mx-2 items-center rounded shadow-inne border border-yellow-700`}
        >
          <span className="sr-only">Table/Cards</span>
          <span
            className={`${
              isTableView ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded bg-white transition-all duration-300`}
          />
        </Switch>
        <TableCellsIcon className="w-6 h-6 text-white" />
      </div>
      {isTableView ? (
        <div className="relative overflow-x-auto">
          {balance && (
            <Table
              columns={columns}
              data={defaultData}
              options={tableOptions}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {balance &&
            boxData.map((data, index) => {
              return (
                <div
                  className="p-2 border rounded border-yellow-600/20"
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
      )}
    </div>
  );
}
