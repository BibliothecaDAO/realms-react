import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import type { ReactElement } from 'react';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { shortenAddress } from '@/util/formatters';

interface RealmHistoryProps {
  realmId: number;
}

export function RealmHistory({ realmId }: RealmHistoryProps): ReactElement {
  const columns = [
    { Header: 'Event', id: 1, accessor: 'event' },
    { Header: 'action', id: 2, accessor: 'action' },
    // { Header: 'Outcome', id: 3, accessor: 'outcome' },
  ];

  const { data: historyData } = useGetRealmHistoryQuery({
    variables: { filter: { realmId: { equals: realmId } } },
  });

  function genRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success ? (
          <span className="">
            💰 Raid Successful <br></br> on {event.data?.defendRealmId}
          </span>
        ) : (
          `😞 Unsuccessful Raid`
        );
      case 'realm_combat_defend':
        return event.data?.success ? (
          <span className="">
            💪 Defended Raid from {event.data?.defendRealmId}
          </span>
        ) : (
          <span className="">
            🔥 We have been Pillaged! {event.data?.defendRealmId}
          </span>
        );
      case 'realm_building_built':
        return `🏗️ Built ${event.data?.buildingName}`;
      case 'realm_resource_upgraded':
        return `🏗️ Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`;
      case 'realm_mint':
        return `Minted`;
      case 'realm_settle':
        return '🏘️ Settled';
      case 'realm_unsettle':
        return '🏚️ Unsettled';
      default:
        return '';
    }
  }

  function genRealmAction(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return event.data?.success ? (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Pillage again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.defendRealmId}
          >
            Try again
          </Button>
        );
      case 'realm_combat_defend':
        return event.data?.success ? (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.attackRealmId}
          >
            Try again
          </Button>
        ) : (
          <Button
            size="xs"
            variant="primary"
            href={'/ream/' + event.data?.attackRealmId}
          >
            ⚔️ Retaliate
          </Button>
        );
      case 'realm_building_built':
        return `Built ${event.data?.buildingName}`;
      case 'realm_resource_upgraded':
        return `Upgraded ${event.data?.resourceName} to Level ${event.data?.level}`;
      case 'realm_mint':
        return 'Ser, welcome';
      case 'realm_settle':
        return 'Ser, welcome';
      case 'realm_unsettle':
        return 'Unsettled';
      default:
        return '';
    }
  }

  const realmEventData = (historyData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      console.log(realmEvent);
      return {
        event: genRealmEvent(realmEvent),
        action: genRealmAction(realmEvent),
        // lord: shortenAddress(realmEvent.realmOwner ?? ''),
        // outcome: (
        //   <div>
        //     <p>-2 Catapults</p>
        //     <p>+63 Coal, +8 Dragonhide</p>
        //   </div>
        // ),
      };
    })
    .filter((row) => row.event !== '');

  const tableOptions = { is_striped: true, search: false };
  return (
    <div className="flex w-full p-2">
      <Table columns={columns} data={realmEventData} options={tableOptions} />
    </div>
  );
}
