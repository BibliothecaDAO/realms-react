'use client';
import { Table, Button, Switch } from '@bibliotheca-dao/ui-lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  useGroupByRealmHistoryQuery,
  useGroupByRealmHistoryLazyQuery,
  RealmHistoryScalarFieldEnum,
  SortOrder,
} from '@/generated/graphql';
import { shortenAddressWidth } from '@/util/formatters';

type Row = {
  realm?: number;
  // balance: string;
  // output: number;
  // change: ReactElement;
  owner?: string | undefined;
  successfulRaid?: number;
  relics?: number;
  action: ReactElement;
  onChange?: (checked: boolean) => void;
};

export const RaidSuccess = () => {
  const router = useRouter();
  const [raidSuccessOwnerToggle, setRaidSuccessOwnerToggle] = useState(true);
  const { data: raidSuccessData, loading: loadingData } =
    useGroupByRealmHistoryQuery({
      variables: {
        by: RealmHistoryScalarFieldEnum.RealmId,
        where: {
          eventType: { equals: 'realm_combat_attack' },
          data: { path: ['success'], equals: true },
        },
        orderBy: { _count: { realmId: SortOrder.Desc } },
        isOwner: false,
        take: 10,
      },
    });
  const [fetchAdventurerRaidSuccess, { loading, data: adventurerSuccessData }] =
    useGroupByRealmHistoryLazyQuery({
      variables: {
        by: RealmHistoryScalarFieldEnum.RealmOwner,
        where: {
          eventType: { equals: 'realm_combat_attack' },
          data: { path: ['success'], equals: true },
        },
        orderBy: { _count: { realmOwner: SortOrder.Desc } },
        isOwner: true,
        take: 10,
      },
    });
  const defaultRaidData: Row[] = (
    raidSuccessData?.groupByRealmHistory ?? []
  ).map((realm) => {
    return {
      realm: realm?.realmId || 0,
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
  const adventurerRaidData: Row[] = (
    adventurerSuccessData?.groupByRealmHistory ?? []
  ).map((realm) => {
    return {
      owner: shortenAddressWidth(realm?.realmOwner || '', 6),
      successfulRaid: realm?._count?._all || 0,
      action: (
        <Button
          variant="primary"
          size="xs"
          onClick={() => {
            router.push(`/realm/${realm?.realmOwner}`, undefined, {
              shallow: true,
            });
          }}
        >
          View Realm
        </Button>
      ),
    };
  });

  const section = {
    name: 'successfulRaids',
    columns: raidSuccessOwnerToggle
      ? [
          {
            Header: 'Realm',
            id: 1,
            accessor: 'realm',
          },
          { Header: 'Succesful Raids', id: 6, accessor: 'successfulRaid' },
          { Header: 'Action', id: 7, accessor: 'action' },
        ]
      : [
          {
            Header: 'Adventurer',
            id: 1,
            accessor: 'owner',
          },
          { Header: 'Succesful Raids', id: 6, accessor: 'successfulRaid' },
          { Header: 'Action', id: 7, accessor: 'action' },
        ],
    onChange: () => {
      setRaidSuccessOwnerToggle(!raidSuccessOwnerToggle);
      fetchAdventurerRaidSuccess();
    },
  };
  const tableOptions = { is_striped: true };

  return (
    <>
      <div
        key={section.name}
        className="p-4 mb-10 border cursor-pointer card rounded-2xl border-white/30 shadow-black"
      >
        <h3 className="text-3xl capitalize">
          {section.name.replace(/([A-Z])/g, ' $1')}
        </h3>

        {/* <div className="flex mx-auto mb-8 text-sm tracking-widest">
          <div
            className={`px-4 uppercase self-center ${
              raidSuccessOwnerToggle && 'font-semibold'
            }`}
          >
            Realm
          </div>
          <Switch
            checked={raidSuccessOwnerToggle}
            onChange={() => section.onChange()}
          ></Switch>
          <div
            className={`px-4 uppercase self-center ${
              !raidSuccessOwnerToggle && 'font-semibold'
            }`}
          >
            Adventurer
          </div>
        </div> */}
        {raidSuccessOwnerToggle ? (
          <Table
            columns={section.columns}
            data={defaultRaidData}
            options={tableOptions}
          />
        ) : (
          <>
            {!loading ? (
              <Table
                columns={section.columns}
                data={adventurerRaidData}
                options={tableOptions}
              />
            ) : (
              'loading'
            )}
          </>
        )}
      </div>
    </>
  );
};
