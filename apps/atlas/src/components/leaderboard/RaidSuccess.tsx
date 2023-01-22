import {
  Table,
  Button,
  Switch,
  Card,
  OrderIcon,
} from '@bibliotheca-dao/ui-lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { useUIContext } from '@/context/UIContext';
import {
  useGroupByRealmHistoryQuery,
  useGroupByRealmHistoryLazyQuery,
  RealmHistoryScalarFieldEnum,
  SortOrder,
} from '@/generated/graphql';
import { shortenAddressWidth } from '@/util/formatters';
import { getRealmOrderById } from '../realms/RealmsGetters';

type Row = {
  realm?: ReactElement;
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
  const { closeAll } = useUIContext();
  const { data: raidSuccessData, loading: loadingData } =
    useGroupByRealmHistoryQuery({
      variables: {
        by: [
          RealmHistoryScalarFieldEnum.RealmId,
          RealmHistoryScalarFieldEnum.RealmOwner,
          RealmHistoryScalarFieldEnum.RealmName,
        ],
        where: {
          eventType: { equals: 'realm_combat_attack' },
          data: { path: ['success'], equals: true },
          realmName: { not: { equals: '' } },
        },
        orderBy: { _count: { realmId: SortOrder.Desc } },
        isOwner: true,
        take: 10,
      },
    });
  const [fetchAdventurerRaidSuccess, { loading, data: adventurerSuccessData }] =
    useGroupByRealmHistoryLazyQuery({
      variables: {
        by: [
          RealmHistoryScalarFieldEnum.RealmOwner,
          RealmHistoryScalarFieldEnum.RealmId,
          RealmHistoryScalarFieldEnum.RealmName,
        ],
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
      realm: (
        <span className="flex">
          <OrderIcon
            className="self-center mx-2"
            size="xs"
            order={getRealmOrderById(realm?.realmId) || ''}
          />
          {(realm.realmName && realm?.realmName + ' #' + realm?.realmId) || '0'}
        </span>
      ),
      successfulRaid: realm?._count?._all || 0,
      owner: shortenAddressWidth(realm.realmOwner || '', 6),
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
            router.push(`/?asset=realm${realm?.realmOwner}`, undefined, {
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
            size: 50,
          },
          { Header: 'Succesful Raids', id: 2, accessor: 'successfulRaid' },
          { Header: 'Current Owner', id: 3, accessor: 'owner' },
          { Header: 'Action', id: 4, accessor: 'action', size: 50 },
        ]
      : [
          {
            Header: 'Adventurer',
            id: 1,
            accessor: 'owner',
          },
          { Header: 'Succesful Raids', id: 6, accessor: 'successfulRaid' },
          { Header: 'Action', id: 7, accessor: 'action', size: 50 },
        ],
    onChange: () => {
      setRaidSuccessOwnerToggle(!raidSuccessOwnerToggle);
      fetchAdventurerRaidSuccess();
    },
  };
  const tableOptions = { is_striped: true };

  return (
    <>
      <Card className="mb-8">
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
      </Card>
    </>
  );
};
