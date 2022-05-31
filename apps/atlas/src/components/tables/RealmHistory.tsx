import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useGetRealmEventsQuery } from '@/generated/graphql';
import { shortenAddress } from '@/util/formatters';

type Row = {
  action: string;
  lord: string;
  outcome: ReactElement;
};

const defaultData: Row[] = [
  {
    action: 'Defended Raid from 0x...1OaF',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Catapults</p>
        <p>-63 Wood, -28 Gold</p>
      </div>
    ),
  },
  {
    action: 'Attacked 0x...1OaF',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Catapults</p>
        <p>+63 Coal, +8 Dragonhide</p>
      </div>
    ),
  },
  {
    action: 'Defended Raid from 0x...Sq1dDy',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>-2 Watchmen</p>
        <p>-63 Wood, -28 Gold</p>
      </div>
    ),
  },
  {
    action: 'Finished Building 2 Castles',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>+10 Defence</p>
        <p>-12 Happiness</p>
      </div>
    ),
  },
  {
    action: 'Trained Units',
    lord: '0x....r3dB3aRd',
    outcome: (
      <div>
        <p>+2 Catapults</p>
        <p>+15 Arbalests</p>
      </div>
    ),
  },
];

interface RealmHistoryProps {
  realmId: number;
}

export function RealmHistory({ realmId }: RealmHistoryProps): ReactElement {
  const columns = [
    { Header: 'Action', id: 1, accessor: 'action' },
    { Header: 'Lord', id: 2, accessor: 'lord' },
    // { Header: 'Outcome', id: 3, accessor: 'outcome' },
  ];

  const { data: realmEventsData } = useGetRealmEventsQuery({
    variables: { filter: { realmId: { equals: realmId } } },
  });

  function genRealmEventAction(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success
          ? `Attacked ${shortenAddress(event.data?.defendRealmOwner)}`
          : `Unsuccessful Raid on ${shortenAddress(
              event.data?.defendRealmOwner
            )}`;
      case 'realm_combat_defend':
        return event.data?.success
          ? `Defended Raid from  ${shortenAddress(
              event.data?.attackRealmOwner
            )}`
          : `Realm Pillaged by  ${event.data?.attackRealmOwner}`;
      case 'realm_building_built':
        return `Built ${event.data?.buildingName}`;
      case 'realm_resource_upgraded':
        return `Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`;
      case 'realm_mint':
        return `Minted`;
      case 'realm_settle':
        return 'Settled';
      case 'realm_unsettle':
        return 'Unsettled';
      default:
        return '';
    }
  }

  const realmEventData = (realmEventsData?.getRealmEvents ?? [])
    .map((realmEvent) => {
      return {
        action: genRealmEventAction(realmEvent),
        lord: shortenAddress(realmEvent.realmOwner ?? ''),
        // outcome: (
        //   <div>
        //     <p>-2 Catapults</p>
        //     <p>+63 Coal, +8 Dragonhide</p>
        //   </div>
        // ),
      };
    })
    .filter((row) => row.action !== '');

  const tableOptions = { is_striped: true, search: false };
  return (
    <div className="flex w-full p-2">
      <Table columns={columns} data={realmEventData} options={tableOptions} />
    </div>
  );
}
