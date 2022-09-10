import { Table, Button, ResourceIcon, Switch } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useGroupByRealmHistoryQuery,
  useGetRealmsQuery,
  RealmHistoryScalarFieldEnum,
  SortOrder,
} from '@/generated/graphql';
import { relicsOwnedByRealm } from '@/shared/Getters/Realm';
import { BasePanel } from './BasePanel';

type Row = {
  realm: number;
  // balance: string;
  // output: number;
  // change: ReactElement;
  owner: string;
  successfulRaid?: number;
  relics?: number;
  action: ReactElement;
};

interface BankPanel {
  onOpenSwap?: () => void;
}

export function LeaderboardPanel(): ReactElement {
  const router = useRouter();

  const [raidSuccessOwnerToggle, setRaidSuccessOwnerToggle] = useState(false);
  const { data: raidSuccessData, loading: loadingData } =
    useGroupByRealmHistoryQuery({
      variables: {
        by: RealmHistoryScalarFieldEnum.RealmId,
        where: {
          eventType: { equals: 'realm_combat_attack' },
          data: { path: ['success'], equals: true },
        },
        orderBy: { _count: { realmId: SortOrder.Desc } },
      },
    });
  const { data: relicData } = useGetRealmsQuery({
    variables: {
      orderBy: { relicsOwned: { _count: SortOrder.Desc } },
      take: 10,
    },
  });
  const defaultRaidData: Row[] = (
    raidSuccessData?.groupByRealmHistory ?? []
  ).map((realm) => {
    return {
      realm: realm?.realmId || 0,
      owner: '0x00test',
      successfulRaid: realm?._count?._all || 0,
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
  const defaultRelicData: Row[] = (relicData?.realms ?? []).map((realm) => {
    return {
      realm: realm?.realmId || 0,
      owner: realm?.ownerL2 || 'unknown',
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
  const sections = [
    {
      name: 'successfulRaids',
      columns: [
        { Header: 'Realm', id: 1, accessor: 'realm' },
        { Header: 'Current Owner', id: 5, accessor: 'owner' },
        { Header: 'Succesful Raids', id: 6, accessor: 'successfulRaid' },
        { Header: 'Action', id: 7, accessor: 'action' },
      ],
      defaultData: defaultRaidData,
    },
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
          {sections.map((section, index) => (
            <div
              key={section.name}
              className="p-4 mb-10 border-4 border-double cursor-pointer rounded-2xl border-white/30 shadow-black"
            >
              <h3 className="text-3xl capitalize">
                {section.name.replace(/([A-Z])/g, ' $1')}
              </h3>
              {index === 0 && (
                <div className="flex mx-auto mb-8 text-sm tracking-widest">
                  <div
                    className={`px-4 uppercase self-center ${
                      raidSuccessOwnerToggle && 'font-semibold'
                    }`}
                  >
                    Realm
                  </div>
                  <Switch
                    checked={raidSuccessOwnerToggle}
                    onChange={setRaidSuccessOwnerToggle}
                  ></Switch>
                  <div
                    className={`px-4 uppercase self-center ${
                      !raidSuccessOwnerToggle && 'font-semibold'
                    }`}
                  >
                    Adventurer
                  </div>
                </div>
              )}
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
