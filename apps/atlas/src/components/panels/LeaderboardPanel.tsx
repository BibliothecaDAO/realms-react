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

export function LeaderboardPanel(): ReactElement {
  const { balance, availableResourceIds, addSelectedSwapResources } =
    useResourcesContext();

  const sections = [
    {
      name: 'successfulRaids',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Succesful Raids', id: 6, accessor: 'successfulRaid' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
        },
      ],
    },
    {
      name: 'relicsHeld',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Relics Held', id: 6, accessor: 'relics' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
        },
      ],
    },
    {
      name: 'farmsHarvested',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Farms Harvested', id: 6, accessor: 'farms' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
        },
      ],
    },
    {
      name: 'resourcesHarvested',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Resources Harvested', id: 6, accessor: 'resources' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
        },
      ],
    },
    {
      name: 'goblinTownsDestroyed',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Goblin Towns', id: 6, accessor: 'goblinTowns' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
        },
      ],
    },
  ];

  const tableOptions = { is_striped: true };

  return (
    <BasePanel open={true} style="lg:w-7/12">
      <div className="p-10">
        <div className="w-full pb-10 bg-black/90">
          <h2 className="w-full">The Leaderboard</h2>
        </div>

        <div className="relative">
          {sections.map((section) => (
            <div
              key={section.name}
              className="p-4 mb-10 border-4 border-double cursor-pointer rounded-2xl border-white/30 shadow-black"
            >
              <h3 className="text-3xl capitalize">
                {section.name.replace(/([A-Z])/g, ' $1')}
              </h3>
              <Table
                columns={section.columns}
                data={section.defaultData}
                options={tableOptions}
              />
            </div>
          ))}
        </div>
      </div>
    </BasePanel>
  );
}
