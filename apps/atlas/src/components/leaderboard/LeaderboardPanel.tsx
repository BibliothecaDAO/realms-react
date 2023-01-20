import { Table, Button, Card } from '@bibliotheca-dao/ui-lib';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { relicsOwnedByRealm } from '@/components/realms/RealmsGetters';
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
  realm?: string;
  // balance: string;
  // output: number;
  // change: ReactElement;
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

  const { data: goblinSuccessData, loading: loadingData } =
    useGroupByRealmHistoryQuery({
      variables: {
        by: [
          RealmHistoryScalarFieldEnum.RealmOwner,
          RealmHistoryScalarFieldEnum.RealmId,
          RealmHistoryScalarFieldEnum.RealmName,
        ],
        where: {
          eventType: { equals: 'realm_combat_attack' },
          AND: [
            {
              data: { path: ['success'], equals: true },
            },
            {
              data: { path: ['defendRealmId'], equals: 0 },
            },
          ],
        },
        orderBy: { _count: { realmId: SortOrder.Desc } },
        isOwner: false,
        take: 10,
      },
    });
  const defaultRelicData: Row[] = (relicData?.realms ?? []).map((realm) => {
    return {
      realm: (realm?.name && realm?.name + ' #' + realm?.realmId) || '0',

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
  /*
  const defaultGoblinData: Row[] = (
    goblinSuccessData?.groupByRealmHistory ?? []
  ).map((realm) => {
    return {
      realm: realm?.realmId || 0,
      goblinTowns: realm?._count?._all || 0,
      action: (
        <Button
          variant="primary"
          size="xs"
          onClick={() => {
            router.push(`/?asset=realm${realm?.realmId}`, undefined, {
              shallow: true,
            });
          }}
        >
          View
        </Button>
      ),
    };
  }); */

  const sections = [
    {
      name: 'relicsHeld',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
        { Header: 'Relics Held', id: 6, accessor: 'relics' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Action', id: 7, accessor: 'action', size: 50 },
      ],
      defaultData: defaultRelicData,
    },
    {
      name: 'farmsHarvested',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Farms Harvested', id: 6, accessor: 'farms' },
        { Header: 'Action', id: 7, accessor: 'action', size: 50 },
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
        { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Resources Harvested', id: 6, accessor: 'resources' },
        { Header: 'Action', id: 7, accessor: 'action', size: 50 },
      ],
      defaultData: [
        {
          realm: 1,
          owner: '0x0000',
          goblinTowns: '12',
          action: <div>view all</div>,
          onChange: () => null,
        },
      ],
    },
    /* {
      name: 'goblinTownsDestroyed',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm', size: 50 },
        { Header: 'Goblin Towns', id: 6, accessor: 'goblinTowns' },
        { Header: 'Action', id: 7, accessor: 'action', size: 50 },
      ],
      defaultData: defaultGoblinData,
    }, */
  ];

  const tableOptions = { is_striped: true };

  return (
    <div className="relative flex flex-col h-screen pt-20 pb-20 pl-20 pr-8">
      <div className="flex-col h-full pb-4 overflow-auto border-4 border-yellow-800/60 bg-gradient-to-r from-gray-900 to-gray-1000 rounded-2xl">
        <div className="p-4 md:p-10">
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
    </div>
  );
}
