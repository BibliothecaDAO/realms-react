import { Table, Button, ResourceIcon, Switch } from '@bibliotheca-dao/ui-lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useGetRealmsQuery,
  SortOrder,
  RealmHistoryScalarFieldEnum,
  useGroupByRealmHistoryQuery,
} from '@/generated/graphql';
import { relicsOwnedByRealm } from '@/shared/Getters/Realm';
import { shortenAddressWidth } from '@/util/formatters';
import { BasePanel } from './BasePanel';
import { RaidSuccess } from './Leaderboard/RaidSuccess';

type Row = {
  realm?: number;
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

interface BankPanel {
  onOpenSwap?: () => void;
}

export function LeaderboardPanel(): ReactElement {
  const router = useRouter();

  const { data: relicData } = useGetRealmsQuery({
    variables: {
      orderBy: { relicsOwned: { _count: SortOrder.Desc } },
      take: 10,
    },
  });

  const { data: goblinSuccessData, loading: loadingData } =
    useGroupByRealmHistoryQuery({
      variables: {
        by: RealmHistoryScalarFieldEnum.RealmId,
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
      realm: realm?.realmId || 0,
      owner: shortenAddressWidth(realm?.settledOwner || '', 6),
      relics: relicsOwnedByRealm(realm) || 0,
      action: (
        <Button
          variant="primary"
          size="xs"
          onClick={() => {
            router.push(`/realm/${realm?.realmId}`, undefined, {
              shallow: true,
            });
          }}
        >
          View Realm
        </Button>
      ),
    };
  });
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
            router.push(`/realm/${realm?.realmId}`, undefined, {
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
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Relics Held', id: 6, accessor: 'relics' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: defaultRelicData,
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
          onChange: () => null,
        },
      ],
    },
    {
      name: 'goblinTownsDestroyed',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Goblin Towns', id: 6, accessor: 'goblinTowns' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: defaultGoblinData,
    },
  ];

  const tableOptions = { is_striped: true };

  return (
    <BasePanel open={true} style="lg:w-7/12">
      <div className="p-4 md:p-10">
        <div className="w-full pb-10 bg-black/90">
          <h2 className="w-full">The Leaderboard</h2>
        </div>
        <div className="relative">
          <RaidSuccess />
          {sections.map((section, index) => (
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
