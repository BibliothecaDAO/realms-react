import {
  Table,
  Button,
  ResourceIcon,
  Card,
  CardBody,
} from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import type { ReactElement } from 'react';
import { useGetRealmHistoryQuery } from '@/generated/graphql';
import { shortenAddress } from '@/util/formatters';
import { findResourceName } from '@/util/resources';

interface RealmCombatHistoryProps {
  realmId: number;
}

export function RealmCombatHistory({
  realmId,
}: RealmCombatHistoryProps): ReactElement {
  const { data: historyData, loading: loadingData } = useGetRealmHistoryQuery({
    variables: {
      filter: {
        realmId: { equals: realmId },
        eventType: { in: ['realm_combat_attack', 'realm_combat_defend'] },
      },
    },
  });
  const successClass = 'bg-green-200/20';
  const negativeClass = 'bg-red-200/20';

  const resourcePillaged = (resources: any) => {
    return (
      <div className="my-4">
        {resources.map((resource, index) => {
          const info = findResourceName(resource.resourceId);
          return (
            <div className="flex justify-between my-1 text-white" key={index}>
              <div className="flex">
                <ResourceIcon
                  size="xs"
                  className="self-center"
                  resource={info?.trait?.replace('_', '') as string}
                />{' '}
                <span className="self-center ml-4 font-semibold uppercase tracking-veryWide">
                  {info?.trait}
                </span>
              </div>

              <span className="self-center ml-4 font-semibold uppercase tracking-veryWide">
                {(+formatEther(resource.amount)).toFixed()} units
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  function genRealmEvent(event) {
    switch (event.eventType) {
      case 'realm_combat_attack':
        return {
          event: event.data?.success ? (
            <span className="">
              💰 Raid successful on Realm {event.data?.defendRealmId}
            </span>
          ) : (
            `😞 Unsuccessful Raid`
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data?.pillagedResources),
          action: (
            <Button
              size="xs"
              variant="primary"
              href={
                '/realm/' +
                event.data?.defendRealmId +
                '/combat/' +
                event.transactionHash
              }
            >
              See Raid Details
            </Button>
          ),
        };
      case 'realm_combat_defend':
        return {
          event: event.data?.success ? (
            <span className="">
              💪 Defended raid from {event.data?.defendRealmId}
            </span>
          ) : (
            <span className="">
              🔥 Pillaged by Realm {event.data?.attackRealmId}
            </span>
          ),
          class: event.data?.success ? successClass : negativeClass,
          resources: resourcePillaged(event.data?.pillagedResources),
          action: (
            <Button
              size="xs"
              variant="primary"
              href={'/realm/' + realmId + '/combat/' + event.transactionHash}
            >
              See Raid Details
            </Button>
          ),
        };

      default:
        return {
          event: '',
          class: '',
          action: '',
        };
    }
  }

  const realmEventData = (historyData?.getRealmHistory ?? [])
    .map((realmEvent) => {
      console.log(historyData?.getRealmHistory);
      return {
        event: genRealmEvent(realmEvent),
        timestamp: realmEvent.timestamp,
      };
    })
    .filter((row) => row.event.event !== '');

  const tableOptions = { is_striped: true, search: false };
  return (
    <div className="flex flex-wrap w-full p-2 space-y-2">
      {realmEventData.map((a, index) => {
        return (
          <Card
            key={index}
            className={`w-full ${loadingData ?? 'animate-pulse'}`}
          >
            <CardBody className={`flex ${a.event.class} `}>
              <span className="py-1 mb-1 text-xs font-semibold text-white">
                {new Date(a.timestamp).toLocaleTimeString('en-US')}{' '}
                {new Date(a.timestamp).toLocaleDateString('en-US')}
              </span>
              <h5 className="text-white">{a.event.event}</h5>
              {a.event?.resources && a.event.resources}
              <div className="mt-4">{a.event.action}</div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
