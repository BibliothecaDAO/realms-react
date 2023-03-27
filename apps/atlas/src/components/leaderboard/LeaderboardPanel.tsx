import { Table, Button, Card, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import {
  getRealmOrderById,
  relicsOwnedByRealm,
} from '@/components/realms/RealmsGetters';
import { useUIContext } from '@/context/UIContext';
import {
  useGetRealmsQuery,
  SortOrder,
  RealmHistoryScalarFieldEnum,
  useGroupByRealmHistoryQuery,
} from '@/generated/graphql';
import { shortenAddressWidth } from '@/util/formatters';
import { BasePanel } from '../ui/panel/BasePanel';
import { RaidSuccess } from './RaidSuccess';

type Row = {
  realm?: ReactElement;
  owner?: string | undefined;
  successfulRaid?: number;
  goblinTowns?: number;
  relics?: number;
  action: ReactElement;
  onChange?: (checked: boolean) => void;
};

export function LeaderboardPanel(): ReactElement {
  const router = useRouter();
  const { closeAll } = useUIContext();

  const { data: relicData } = useGetRealmsQuery({
    variables: {
      orderBy: { relicsOwned: { _count: SortOrder.Desc } },
      take: 10,
    },
  });

  const defaultRelicData: Row[] = (relicData?.realms ?? []).map((realm) => {
    return {
      realm: (
        <span className="flex">
          <OrderIcon
            className="self-center mx-2"
            size="xs"
            order={getRealmOrderById(realm?.realmId) || ''}
          />
          {(realm?.name && realm?.name + ' #' + realm?.realmId) || '0'}
        </span>
      ),

      owner: shortenAddressWidth(realm?.settledOwner || '', 6),
      relics: relicsOwnedByRealm(realm) || 0,
      action: (
        <Button
          variant="primary"
          size="xs"
          onClick={() => {
            closeAll();
            router.push(`/?asset=realm${realm?.realmId}`, undefined, {
              shallow: true,
            });
          }}
        >
          View Realm
        </Button>
      ),
    };
  });

  const sections = [
    {
      name: 'relicsHeld',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Relics Held', id: 6, accessor: 'relics', size: 150 },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Action', id: 7, accessor: 'action', size: 50 },
      ],
      defaultData: defaultRelicData,
    },
    // {
    //   name: 'farmsHarvested',
    //   columns: [
    //     { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
    //     { Header: 'Current Owner', id: 5, accessor: 'owner' },
    //     { Header: 'Farms Harvested', id: 6, accessor: 'farms' },
    //     { Header: 'Action', id: 7, accessor: 'action', size: 50 },
    //   ],
    //   defaultData: [
    //     {
    //       realm: 1,
    //       owner: '0x0000',
    //       goblinTowns: '12',
    //       action: <div>view all</div>,
    //     },
    //   ],
    // },
    // {
    //   name: 'resourcesHarvested',
    //   columns: [
    //     { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
    //     { Header: 'Current Owner', id: 5, accessor: 'owner' },
    //     { Header: 'Resources Harvested', id: 6, accessor: 'resources' },
    //     { Header: 'Action', id: 7, accessor: 'action', size: 50 },
    //   ],
    //   defaultData: [
    //     {
    //       realm: 1,
    //       owner: '0x0000',
    //       goblinTowns: '12',
    //       action: <div>view all</div>,
    //       onChange: () => null,
    //     },
    //   ],
    // },
  ];

  const tableOptions = { is_striped: true };

  return (
    <div className="relative flex flex-col flex-1">
      <div className="p-4 lg:p-10">
        <div className="w-full pb-10">
          <h1 className="w-full text-center">The Lords Leaderboard</h1>
        </div>
        <div className="relative">
          <RaidSuccess />
          {sections.map((section, index) => (
            <Card key={section.name} className="mb-8">
              <h3 className="pt-2 pl-4 text-3xl capitalize">
                {section.name.replace(/([A-Z])/g, ' $1')}
              </h3>
              <Table
                columns={section.columns}
                data={section.defaultData}
                options={tableOptions}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
